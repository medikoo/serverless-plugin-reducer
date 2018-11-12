"use strict";

const { resolve, dirname, sep } = require("path")
    , globby                    = require("globby")
    , multimatch                = require("multimatch")
    , BbPromise                 = require("bluebird")
    , fs                        = BbPromise.promisifyAll(require("graceful-fs"))
    , cjsResolve                = require("cjs-module/resolve")
    , getDependencies           = require("cjs-module/get-dependencies");

const resolveLambdaModulePaths = (servicePath, functionObject) =>
	// Resolve path to main lambda program
	cjsResolve(
		servicePath, `./${ functionObject.handler.slice(0, functionObject.handler.indexOf(".")) }`
	)(programPath => {
		if (!programPath) {
			throw new Error(
				`${ JSON.stringify(functionObject.handler) } doesn't reference ` +
					"a valid Node.js module"
			);
		}
		const dirPaths = new Set([servicePath]);

		// Resolve list of all dependencies of the main lambda program
		return getDependencies(programPath).then(deps => {
			// Ensure to additionally take in all 'package.json' files existing in directories
			// which contain dependency modules
			// ('main' field in package.json may play role in module resolution)
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
			return BbPromise.all(
				Array.from(dirPaths, dirPath => resolve(dirPath, "package.json")).map(filePath =>
					fs.statAsync(filePath).then(
						stats => (stats.isFile() ? filePath : null),
						err => {
							if (err.code === "ENOENT") return null;
							throw err;
						}
					)
				)
			).then(packageJsonPaths =>
				deps
					.concat(packageJsonPaths.filter(Boolean))
					.map(modulePath => modulePath.slice(servicePathLength))
			);
		});
	});

module.exports = class ServerlessPluginReducer {
	constructor(serverless) {
		const packagePlugin = serverless.pluginManager.plugins.find(
			plugin => plugin.constructor.name === "Package"
		);

		packagePlugin.resolveFilePathsFunction = function (functionName) {
			const functionObject = this.serverless.service.getFunction(functionName);
			const funcPackageConfig = functionObject.package || {};
			const { servicePath } = serverless.config;

			if (!functionObject.handler) {
				return BbPromise.reject(
					new Error(
						`Function ${ JSON.stringify(functionName) } misses 'handler' configuration`
					)
				);
			}

			return BbPromise.all([
				// Get all lambda dependencies resolved by walking require paths
				resolveLambdaModulePaths(servicePath, functionObject),
				// Get all files mentioned specifically in 'include' option
				globby(this.getIncludes(funcPackageConfig.include), {
					cwd: this.serverless.config.servicePath,
					dot: true,
					silent: true,
					follow: true,
					nodir: true
				})
			]).then(([modulePaths, includeModulePaths]) =>
				// Apply eventual 'exclude' rules to automatically resolved dependencies
				multimatch(
					modulePaths,
					["**"].concat(
						this.getExcludes(funcPackageConfig.include).map(
							pattern =>
								pattern.charAt(0) === "!" ? pattern.slice(1) : `!${ pattern }`
						)
					)
				).concat(includeModulePaths)
			);
		};
	}
};
