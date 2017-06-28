"use strict";

var last            = require("es5-ext/array/#/last")
  , ensureArray     = require("es5-ext/array/valid-array")
  , ensureString    = require("es5-ext/object/validate-stringifiable-value")
  , startsWith      = require("es5-ext/string/#/starts-with")
  , memoize         = require("memoizee")
  , deferred        = require("deferred")
  , path            = require("path")
  , copy            = require("fs2/copy")
  , cjsResolve      = require("cjs-module/resolve")
  , getDependencies = require("cjs-module/get-dependencies");

var resolve = path.resolve, dirname = path.dirname, sep = path.sep;

module.exports = function (Serverless) {
	Serverless.classes.Runtime.prototype.copyFunction = function (func, pathDist, stage, region) {
		// 1. Copy initial logic from original:

		// Status
		Serverless.utils.sDebug(
			stage + " - " + region + " - " + func.getName() + ": Copying in dist dir " + pathDist
		);

		// Extract the root of the lambda package from the handler property
		var handlerFullPath = func
			.getRootPath(last.call(func.handler.split("/")))
			.replace(/\\/g, "/");

		// Check handler is correct
		if (!handlerFullPath.endsWith(func.handler)) {
			return Promise.reject(
				new Error(
					"This function's handler is invalid and not in the file system: " + func.handler
				)
			);
		}

		var rootPath = resolve(handlerFullPath.replace(func.handler, ""))
		  , rootPathLength = rootPath.length + 1;

		// 2. Custom copy handling
		var filter = this._processExcludePatterns(func, pathDist, stage, region)
		  , lambdaPath = dirname(func._filePath);

		var extraIncludes;
		if (func.custom.lambdaReducer && func.custom.lambdaReducer.include) {
			extraIncludes = ensureArray(func.custom.lambdaReducer.include).map(ensureString);
		}

		var copyPackageJson = memoize(
			function (dirPath) {
				var packageJsonPath = resolve(dirPath, "package.json");
				return copy(
					packageJsonPath,
					resolve(pathDist, packageJsonPath.slice(rootPathLength)),
					{
						intermediate: true,
						loose: true
					}
				);
			},
			{ primitive: true, promise: true }
		);
		var copyPackageJsonDeep = function (modulePath) {
			var dirPath = dirname(modulePath), dirs = [dirPath];
			while (dirPath !== rootPath) {
				dirPath = dirname(dirPath);
				dirs.push(dirPath);
			}
			return deferred.map(dirs, copyPackageJson);
		};

		return deferred(
			// Copy meta: s-function.json
			copy(func._filePath, resolve(pathDist, func._filePath.slice(rootPathLength)), {
				intermediate: true
			}),
			// Copy meta: event.json
			copy(
				resolve(lambdaPath, "event.json"),
				resolve(pathDist, lambdaPath.slice(rootPathLength), "event.json"),
				{ intermediate: true, loose: true }
			),
			// Copy meta: s-templates.json
			copy(
				resolve(lambdaPath, "s-templates.json"),
				resolve(pathDist, lambdaPath.slice(rootPathLength), "s-templates.json"),
				{ intermediate: true, loose: true }
			),
			// Copy handler and it's dependencies
			cjsResolve(
				rootPath,
				"./" + func.handler.slice(0, func.handler.indexOf("."))
			)(function (programPath) {
				return getDependencies(programPath).map(function (modulePath) {
					if (!startsWith.call(modulePath, rootPath + sep)) {
						throw new Error(
							JSON.stringify(modulePath) +
								" is outside of declared lambda path " +
								JSON.stringify(rootPath)
						);
					}
					var destPath = resolve(pathDist, modulePath.slice(rootPathLength));
					return deferred(
						copyPackageJsonDeep(modulePath),
						filter(modulePath, destPath) &&
							copy(modulePath, destPath, { intermediate: true })
					);
				});
			}),
			// Copy eventual extra includes
			extraIncludes &&
				deferred.map(extraIncludes, function (includePath) {
					return copy(resolve(rootPath, includePath), resolve(pathDist, includePath), {
						intermediate: true
					});
				})
		);
	};
};
