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
	// eslint-disable-next-line no-new
	new Plugin(serverlessMock); // plugin just introduces side effects

	t.test("Regular", async t => {
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

	t.test("Error: No module at path", async t => {
		try {
			await packagePluginMock.resolveFilePathsFunction("no-lambda");
		} catch (error) {
			if (error.code !== "INVALID_LAMBDA_HANDLER") throw error;
			t.equal(error.code, "INVALID_LAMBDA_HANDLER");
			t.end();
		}
	});

	t.test("Error: Outer path require", async t => {
		try {
			await packagePluginMock.resolveFilePathsFunction("outer-path-lambda");
		} catch (error) {
			if (error.code !== "MODULE_OUT_OF_REACH") throw error;
			t.equal(error.code, "MODULE_OUT_OF_REACH");
			t.end();
		}
	});

	t.end();
});
