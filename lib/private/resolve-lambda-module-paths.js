"use strict";

const cjsResolve                   = require("ncjsm/resolve")
    , getDependencies              = require("./get-dependencies")
    , ServerlessPluginReducerError = require("./serverless-plugin-reducer-error");

module.exports = (servicePath, functionObject, options) =>
	// Resolve path to main lambda program
	cjsResolve(
		servicePath, `./${ functionObject.handler.slice(0, functionObject.handler.indexOf(".")) }`
	).then(programPath => {
		if (!programPath) {
			throw new ServerlessPluginReducerError(
				`${ JSON.stringify(functionObject.handler) } doesn't reference ` +
					"a valid Node.js module",
				"INVALID_LAMBDA_HANDLER"
			);
		}

		// Resolve list of all dependencies of the main lambda program
		return getDependencies(servicePath, programPath, { ignoreMissing: options.ignoreMissing });
	});
