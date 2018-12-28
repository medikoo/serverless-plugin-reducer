"use strict";

const { resolve, sep } = require("path")
    , test             = require("tape")
    , Plugin           = require("../");

const fixturesPath = resolve(__dirname, "_fixtures");

const ensureOsSeparators = path => path.replace(/\//gu, sep);

test("Serverless Plugin Reducer", t => {
	const packagePluginMock = {
		constructor: { name: "Package" },
		getIncludes: () => [],
		getExcludes: () => []
	};
	const getFunction = functionName => ({ handler: `${ functionName }/index.handler` });
	const serverlessMock = {
		config: { servicePath: fixturesPath },
		pluginManager: { plugins: [packagePluginMock] },
		service: { getFunction }
	};
	packagePluginMock.serverless = serverlessMock;
	// eslint-disable-next-line no-new
	new Plugin(serverlessMock); // plugin just introduces side effects

	t.test("Regular", t => {
		packagePluginMock.resolveFilePathsFunction("some-lambda").then(result => {
			t.deepEqual(
				result.sort(),
				[
					"node_modules/some-dep/entry.js", "node_modules/some-dep/other.js",
					"node_modules/some-dep/package.json", "some-lambda/foo.js",
					"some-lambda/index.js"
				].map(ensureOsSeparators)
			);

			t.end();
		});
	});

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

	t.test("Support excludes", t => {
		packagePluginMock.getExcludes = () => ["some-lambda/foo*"];
		const onFinally = () => (packagePluginMock.getExcludes = () => []);
		packagePluginMock
			.resolveFilePathsFunction("some-lambda")
			.then(result => {
				t.deepEqual(
					result.sort(),
					[
						"node_modules/some-dep/entry.js", "node_modules/some-dep/other.js",
						"node_modules/some-dep/package.json", "some-lambda/index.js"
					].map(ensureOsSeparators)
				);
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
