"use strict";

const { resolve, dirname, sep } = require("path")
    , cjsResolve                = require("cjs-module/resolve")
    , getDependencies           = require("cjs-module/get-dependencies");

const getModulePaths = (servicePath, handlerPath) => {
	const dirPaths = new Set([servicePath]);

	return getDependencies(handlerPath).then(deps => {
		for (const modulePath of deps) {
			if (!modulePath.startsWith(servicePath + sep)) {
				throw new Error(
					`${ JSON.stringify(modulePath) } is outside of service path ` +
						`${ JSON.stringify(servicePath) }`
				);
			}
			let dirPath = dirname(modulePath);
			while (!dirPaths.has(dirPath)) {
				dirPaths.add(dirPath);
				dirPath = dirname(dirPath);
			}
		}
		const servicePathLength = servicePath.length + 1;
		return deps
			.concat(Array.from(dirPaths, dirPath => resolve(dirPath, "package.json")))
			.map(modulePath => modulePath.slice(servicePathLength));
	});
};

module.exports = class LambdaReducer {
	constructor (serverless) {
		const packagePlugin = serverless.pluginManager.plugins.find(
			plugin => plugin.constructor.name === "Package"
		);

		packagePlugin.packageFunction = function (functionName) {
			const { servicePath } = serverless.config;
			const functionObject = this.serverless.service.getFunction(functionName);
			const funcPackageConfig = functionObject.package || {};

			return cjsResolve(
				"/",
				resolve(
					servicePath,
					functionObject.handler.slice(0, functionObject.handler.indexOf("."))
				)
			)(programPath =>
				getModulePaths(servicePath, programPath).then(modulePaths => {
					const exclude = ["**"];
					const include = this.getIncludes(funcPackageConfig.include).concat(modulePaths);
					const zipFileName = `${ functionName }.zip`;

					return this.zipService(exclude, include, zipFileName).then(artifactPath => {
						functionObject.artifact = artifactPath;
						return artifactPath;
					});
				})
			);
		};
	}
};
