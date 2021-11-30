"use strict";

const cjsResolve      = require("ncjsm/resolve")
    , getDependencies = require("./get-dependencies");

module.exports = async (servicePath, functionObject, options) => {
	// Resolve path to main lambda program
	const programPath = (
		await (async () => {
			try {
				return await cjsResolve(
					servicePath,
					`./${ functionObject.handler.slice(0, functionObject.handler.indexOf(".")) }`
				);
			} catch (error) {
				throw new options.ServerlessError(
					`${ JSON.stringify(functionObject.handler) } doesn't reference ` +
						"a valid Node.js module",
					"INVALID_LAMBDA_HANDLER"
				);
			}
		})()
	).realPath;

	// Resolve list of all dependencies of the main lambda program
	return getDependencies(servicePath, programPath, options);
};
