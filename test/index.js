"use strict";

const { resolve } = require("path")
    , test        = require("tape")
    , Plugin      = require("../");

const fixturesPath = resolve(__dirname, "_fixtures");

test("Serverless Plugin Reducer", t => {
	const packagePluginMock = {
		constructor: { name: "Package" },
		getIncludes: () => [],
		getExcludes: () => []
	};
	const serverlessMock = {
		config: { servicePath: fixturesPath },
		pluginManager: { plugins: [packagePluginMock] },
		service: { getFunction: functionName => ({ handler: `${ functionName }/index.handler` }) }
	};
	packagePluginMock.serverless = serverlessMock;

	t.test("Simple case", async t => {
		// eslint-disable-next-line no-new
		new Plugin(serverlessMock); // plugin just introduces side effects

		t.deepEqual(
			(await packagePluginMock.resolveFilePathsFunction("some-lambda")).sort(),
			[
				"node_modules/some-dep/entry.js", "node_modules/some-dep/other.js",
				"node_modules/some-dep/package.json", "some-lambda/foo.js", "some-lambda/index.js"
			],
			"Resolves only required modules"
		);

		t.end();
	});
});
