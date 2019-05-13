"use strict";

const { sep }        = require("path")
    , test           = require("tape")
    , Plugin         = require("../..")
    , serverlessMock = require("../_lib/serverless-mock");

const [packagePluginMock] = serverlessMock.pluginManager.plugins;

const ensureOsSeparators = path => path.replace(/\//gu, sep);

test("Serverless Plugin Reducer: Success", t => {
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

	t.test("Supports deep dynamic require", t => {
		packagePluginMock.getIncludes = () => ["dynamic-resolution/dynamically-required.js"];
		const onFinally = () => (packagePluginMock.getIncludes = () => []);
		packagePluginMock
			.resolveFilePathsFunction("dynamic-resolution")
			.then(result => {
				t.deepEqual(
					result.sort(),
					[
						"dynamic-resolution/dynamically-required.js", "dynamic-resolution/index.js",
						"dynamic-resolution/required-by-dynamically-required.js"
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
