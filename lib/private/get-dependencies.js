"use strict";

const { resolve, dirname, sep } = require("path")
    , fsp                       = require("fs").promises
    , getDependencies           = require("ncjsm/get-dependencies");

module.exports = (servicePath, programPath, options) =>
	getDependencies(programPath, { ignoreMissing: options.ignoreMissing }).then(deps => {
		deps = new Set(deps);

		const dirPaths = new Set([servicePath]);

		// Ensure to additionally take in all 'package.json' files existing in directories
		// which contain dependency modules
		// ('main' field in package.json may play role in module resolution)
		for (const modulePath of deps) {
			if (!modulePath.startsWith(servicePath + sep)) {
				throw new options.ServerlessError(
					`${ JSON.stringify(modulePath) } is outside of service path ` +
						`${ JSON.stringify(servicePath) }`,
					"MODULE_OUT_OF_REACH"
				);
			}
			let dirPath = dirname(modulePath);
			while (!dirPaths.has(dirPath)) {
				dirPaths.add(dirPath);
				dirPath = dirname(dirPath);
			}
		}
		const servicePathLength = servicePath.length + 1;
		return Promise.all(
			Array.from(dirPaths, dirPath => resolve(dirPath, "package.json")).map(filePath =>
				fsp.stat(filePath).then(
					stats => (stats.isFile() ? deps.add(filePath) : null),
					err => {
						if (err.code === "ENOENT") return null;
						throw err;
					}
				)
			)
		).then(() => Array.from(deps).map(modulePath => modulePath.slice(servicePathLength)));
	});
