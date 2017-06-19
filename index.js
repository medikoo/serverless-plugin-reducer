"use strict";

var last            = require("es5-ext/array/#/last")
  , deferred        = require("deferred")
  , path            = require("path")
  , copy            = require("fs2/copy")
  , cjsResolve      = require("cjs-module/resolve")
  , getDependencies = require("cjs-module/get-dependencies");

var resolve = path.resolve, dirname = path.dirname;

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

		var packageRoot = handlerFullPath.replace(func.handler, "");

		// 2. Custom copy handling
		var filter = this._processExcludePatterns(func, pathDist, stage, region);

		var funcMetaPath = dirname(func._filePath);
		return deferred(
			// Copy meta: s-function.json
			copy(func._filePath, resolve(pathDist, func._filePath.slice(packageRoot.length)), {
				intermediate: true
			}),
			// Copy meta: event.json
			copy(
				resolve(funcMetaPath, "event.json"),
				resolve(pathDist, funcMetaPath.slice(packageRoot.length), "event.json"),
				{ intermediate: true, loose: true }
			),
			// Copy meta: s-templates.json
			copy(
				resolve(funcMetaPath, "s-templates.json"),
				resolve(pathDist, funcMetaPath.slice(packageRoot.length), "s-templates.json"),
				{ intermediate: true, loose: true }
			),
			// Copy handler and it's dependencies
			cjsResolve(
				"/",
				handlerFullPath.slice(0, -func.handler.slice(func.handler.indexOf(".")).length)
			)(function (programPath) {
				return getDependencies(programPath).map(function (modulePath) {
					var destPath = resolve(pathDist, modulePath.slice(packageRoot.length));
					if (!filter(modulePath, destPath)) return null;
					return copy(modulePath, destPath, { intermediate: true });
				});
			})
		);
	};
};
