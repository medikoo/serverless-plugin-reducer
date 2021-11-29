"use strict";

const optionalChaining             = require("es5-ext/optional-chaining")
    , { join, resolve }            = require("path")
    , globby                       = require("globby")
    , multimatch                   = require("multimatch")
    , BbPromise                    = require("bluebird")
    , getDependencies              = require("./lib/private/get-dependencies")
    , resolveLambdaModulePaths     = require("./lib/private/resolve-lambda-module-paths")
    , ServerlessPluginReducerError = require("./lib/private/serverless-plugin-reducer-error");

module.exports = class ServerlessPluginReducer {
	constructor(serverless) {
		const options = optionalChaining(serverless.service.custom, "reducer") || {};
		const packagePlugin = serverless.pluginManager.plugins.find(
			plugin => plugin.constructor.name === "Package"
		);

		const originalResolveFilePathsFunction = packagePlugin.resolveFilePathsFunction;
		packagePlugin.resolveFilePathsFunction = function (functionName) {
			const functionObject = this.serverless.service.getFunction(functionName);

			const runtime =
				functionObject.runtime || this.serverless.service.provider.runtime || "nodejs4.3";
			if (!runtime.startsWith("nodejs")) {
				originalResolveFilePathsFunction.call(this, functionName);
			}

			const funcPackageConfig = functionObject.package || {};
			const { servicePath } = serverless.config;

			if (!functionObject.handler) {
				return BbPromise.reject(
					new ServerlessPluginReducerError(
						`Function ${ JSON.stringify(functionName) } misses 'handler' configuration`,
						"INVALID_LAMBDA_CONFIGURATION"
					)
				);
			}

			const patterns = [];
			for (const excludePattern of this.getExcludes(funcPackageConfig.exclude, true)) {
				patterns.push(
					excludePattern[0] === "!" ? excludePattern.slice(1) : `!${ excludePattern }`
				);
			}
			patterns.push(
				...this.getIncludes([
					...(funcPackageConfig.include || []), ...(funcPackageConfig.patterns || [])
				])
			);

			return BbPromise.all([
				// Get all lambda dependencies resolved by walking require paths
				resolveLambdaModulePaths(servicePath, functionObject, options),
				// Get all files mentioned specifically in 'include' option
				globby(patterns, {
					cwd: this.serverless.config.servicePath,
					dot: true,
					silent: true,
					follow: true,
					nodir: true
				})
			]).then(([modulePaths, includeModulePaths]) => {
				includeModulePaths = includeModulePaths.map(path => join(path));
				modulePaths = new Set(modulePaths);
				return BbPromise.all(
					includeModulePaths.map(includeModulePath => {
						if (!includeModulePath.endsWith(".js")) return null;
						return getDependencies(
							servicePath, resolve(servicePath, includeModulePath), options
						).then(dependencies => {
							for (const dependency of dependencies) modulePaths.add(dependency);
						});
					})
				).then(() => {
					// Apply eventual 'exclude' rules to automatically resolved dependencies
					const result = new Set(
						multimatch(Array.from(modulePaths), ["**", ...patterns])
					);
					return Array.from(result);
				});
			});
		};
	}
};
