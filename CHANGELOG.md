# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [3.2.4](https://github.com/medikoo/serverless-plugin-reducer/compare/v3.2.3...v3.2.4) (2020-11-02)

- Declare support for `serlverless` v2

## [3.2.3](https://github.com/medikoo/serverless-plugin-reducer/compare/v3.2.2...v3.2.3) (2019-05-13)

### Bug Fixes

- ensure proper paths resolution on windows ([b68bee1](https://github.com/medikoo/serverless-plugin-reducer/commit/b68bee1))

## [3.2.2](https://github.com/medikoo/serverless-plugin-reducer/compare/v3.2.1...v3.2.2) (2019-05-13)

### Bug Fixes

- Fix dynamically required modules resolution ([d7d827f](https://github.com/medikoo/serverless-plugin-reducer/commit/d7d827f))

## [3.2.1](https://github.com/medikoo/serverless-plugin-reducer/compare/v3.2.0...v3.2.1) (2019-05-08)

### Bug Fixes

- reduce only node.js lambdas ([924abd0](https://github.com/medikoo/serverless-plugin-reducer/commit/924abd0))

# [3.2.0](https://github.com/medikoo/serverless-plugin-reducer/compare/v3.1.3...v3.2.0) (2019-04-18)

### Features

- ignoreMissing option ([4fdece8](https://github.com/medikoo/serverless-plugin-reducer/commit/4fdece8))

## [3.1.3](https://github.com/medikoo/serverless-plugin-reducer/compare/v3.1.2...v3.1.3) (2019-03-18)

### Bug Fixes

- ensure support for SLS v1.39 ([384b839](https://github.com/medikoo/serverless-plugin-reducer/commit/384b839))

## [3.1.2](https://github.com/medikoo/serverless-plugin-reducer/compare/v3.1.1...v3.1.2) (2019-03-12)

<a name="3.1.1"></a>

## [3.1.1](https://github.com/medikoo/serverless-plugin-reducer/compare/v3.1.0...v3.1.1) (2018-12-28)

<a name="3.1.0"></a>

# [3.1.0](https://github.com/medikoo/serverless-plugin-reducer/compare/v3.0.0...v3.1.0) (2018-12-28)

### Features

- improve error handling ([460866d](https://github.com/medikoo/serverless-plugin-reducer/commit/460866d))
- rely on ServerlessPluginReducerError ([1437135](https://github.com/medikoo/serverless-plugin-reducer/commit/1437135))

<a name="3.0.0"></a>

# [3.0.0](https://github.com/medikoo/serverless-plugin-reducer/compare/v2.3.1...v3.0.0) (2017-11-29)

Rely on internal methods as introduced with Serverless v1.21

### Bug Fixes

- async function reference ([1e549ef](https://github.com/medikoo/serverless-plugin-reducer/commit/1e549ef))
- rely on stat instead of lstat ([e75151c](https://github.com/medikoo/serverless-plugin-reducer/commit/e75151c))

### Features

- improve class name ([4d3bbad](https://github.com/medikoo/serverless-plugin-reducer/commit/4d3bbad))

<a name="2.3.1"></a>

## [2.3.1](https://github.com/medikoo/serverless-plugin-reducer/compare/v2.3.0...v2.3.1) (2017-09-18)

<a name="2.3.0"></a>

# [2.3.0](https://github.com/medikoo/serverless-plugin-reducer/compare/v2.2.1...v2.3.0) (2017-08-02)

### Features

- improve error reporting for broken function configurations ([0c76ce5](https://github.com/medikoo/serverless-plugin-reducer/commit/0c76ce5))

<a name="2.2.1"></a>

## [2.2.1](https://github.com/medikoo/serverless-plugin-reducer/compare/v2.2.0...v2.2.1) (2017-07-07)

<a name="2.2.0"></a>

# [2.2.0](https://github.com/medikoo/serverless-plugin-reducer/compare/v2.1.0...v2.2.0) (2017-07-03)

### Features

- turn off SLS excludeDevDependencies step ([77a1891](https://github.com/medikoo/serverless-plugin-reducer/commit/77a1891))

<a name="2.1.0"></a>

# [2.1.0](https://github.com/medikoo/serverless-plugin-reducer/compare/v2.0.2...v2.1.0) (2017-06-28)

### Features

- improve error message ([e9b585a](https://github.com/medikoo/serverless-plugin-reducer/commit/e9b585a))
- improve handling of handler awrong path ([f07f25a](https://github.com/medikoo/serverless-plugin-reducer/commit/f07f25a))

<a name="2.0.2"></a>

## [2.0.2](https://github.com/medikoo/serverless-plugin-reducer/compare/v2.0.1...v2.0.2) (2017-06-28)

### Bug Fixes

- program path resolution ([ce53036](https://github.com/medikoo/serverless-plugin-reducer/commit/ce53036))

<a name="2.0.1"></a>

## [2.0.1](https://github.com/medikoo/serverless-plugin-reducer/compare/v2.0.0...v2.0.1) (2017-06-28)

### Bug Fixes

- eslint version ([c5b521e](https://github.com/medikoo/serverless-plugin-reducer/commit/c5b521e))

<a name="2.0.0"></a>

# [2.0.0](https://github.com/medikoo/serverless-plugin-reducer/compare/v1.1.0...v2.0.0) (2017-06-27)

### Features

- reconfigure for Serverless v1 ([4cf6ab9](https://github.com/medikoo/serverless-plugin-reducer/commit/4cf6ab9))

### BREAKING CHANGES

- Drop support for Serverless v0.5 and introduce support for Serverless v1. (v0.5 version will remain maintained at derived branch)

<a name="1.1.0"></a>

# [1.1.0](https://github.com/medikoo/serverless-plugin-reducer/compare/v1.0.0...v1.1.0) (2017-06-20)

### Bug Fixes

- crash if resolved module from outer path ([0bd00c2](https://github.com/medikoo/serverless-plugin-reducer/commit/0bd00c2))

### Features

- `include` option ([89bbfcb](https://github.com/medikoo/serverless-plugin-reducer/commit/89bbfcb))

<a name="1.0.0"></a>

# 1.0.0 (2017-06-19)

### Bug Fixes

- ensure to copy package.json files ([8b80aa5](https://github.com/medikoo/serverless-plugin-reducer/commit/8b80aa5))
