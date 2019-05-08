"use strict";

const { resolve } = require("path");

const fixturesPath = resolve(__dirname, "../_fixtures");

const packagePluginMock = {
	constructor: { name: "Package" },
	getIncludes: () => [],
	getExcludes: () => []
};

module.exports = packagePluginMock.serverless = {
	config: { servicePath: fixturesPath },
	pluginManager: { plugins: [packagePluginMock] },
	service: {
		getFunction: functionName => ({ handler: `${ functionName }/index.handler` }),
		provider: { runtime: "nodejs8.10" }
	}
};
