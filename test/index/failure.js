"use strict";

const test           = require("tape")
    , Plugin         = require("../..")
    , serverlessMock = require("../_lib/serverless-mock");

const [packagePluginMock] = serverlessMock.pluginManager.plugins;

test("Serverless Plugin Reducer: Failure", t => {
	// eslint-disable-next-line no-new
	new Plugin(serverlessMock); // plugin just introduces side effects

	t.test("Error: No module at path", t => {
		packagePluginMock.resolveFilePathsFunction("no-lambda").catch(error => {
			if (error.code !== "INVALID_LAMBDA_HANDLER") throw error;
			t.equal(error.code, "INVALID_LAMBDA_HANDLER");
			t.end();
		});
	});

	t.test("Error: Outer path require", t => {
		packagePluginMock.resolveFilePathsFunction("outer-path-lambda").catch(error => {
			if (error.code !== "MODULE_OUT_OF_REACH") throw error;
			t.equal(error.code, "MODULE_OUT_OF_REACH");
			t.end();
		});
	});

	t.end();
});
