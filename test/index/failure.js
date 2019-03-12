"use strict";

const test           = require("tape")
    , Plugin         = require("../..")
    , serverlessMock = require("../_lib/serverless-mock");

const [packagePluginMock] = serverlessMock.pluginManager.plugins;
const { getFunction } = serverlessMock.service;

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

	t.test("Error: Invalid lambda configuration", t => {
		serverlessMock.service.getFunction = () => ({});
		const onFinally = () => (serverlessMock.service.getFunction = getFunction);
		packagePluginMock
			.resolveFilePathsFunction("outer-path-lambda")
			.catch(error => {
				if (error.code !== "INVALID_LAMBDA_CONFIGURATION") throw error;
				t.equal(error.code, "INVALID_LAMBDA_CONFIGURATION");
			})
			.then(
				() => {
					onFinally();
					t.end();
				},
				error => {
					onFinally();
					throw error;
				}
			);
	});

	t.end();
});
