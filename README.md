[![*nix build status][nix-build-image]][nix-build-url]
[![Windows build status][win-build-image]][win-build-url]
[![Tests coverage][cov-image]][cov-url]
![Transpilation status][transpilation-image]
[![npm version][npm-image]][npm-url]

# serverless-plugin-reducer

## Reduce Node.js lambda package so it contains only lambda dependencies

## Plugin for Serverless v1

### (for Serverless v0.5 version see [serverless-0.5 branch](https://github.com/medikoo/serverless-plugin-reducer/tree/serverless-0.5))

By default Serverless packages whole contents of service folder in which lambda was configured, it raises issues in projects where we maintain many functions under one service.

**This plugin ensures that it is only dependencies of given lambda that are packaged and deployed to remote instance**

### Installation

    $ npm install serverless-plugin-reducer

### Configuration (within `serverless.yml`)

1. Ensure individual functions packaging by setting `individually: true` for `package` group. (See [Packaging functions separately](https://serverless.com/framework/docs/providers/aws/guide/packaging/#packaging-functions-separately))

```yaml
package:
  individually: true
```

2. Activate plugin in `serverless.yml`

```yaml
plugins:
  - serverless-plugin-reducer
```

3. If there ar some files that need to be included but escape automatic dependencies resolution (e.g. non Node.js module files, or modules required through dynamically resolved paths) they need to be included through `include` option as e.g.

```yaml
functions:
  hello:
    handler: handler.hello
    package:
      include:
        - non-node-js-module.txt
        - required-through-dynamic-path.js
```

4. If for some paths module files cannot be found, by default an informative error is thrown.
   Still if the cases are safe to ignore, you may silence those errors with:

```yaml
custom:
  reducer:
    ignoreMissing: true
```

### Tests

```bash
npm test
```

[nix-build-image]: https://semaphoreci.com/api/v1/medikoo-org/serverless-plugin-reducer/branches/master/shields_badge.svg
[nix-build-url]: https://semaphoreci.com/medikoo-org/serverless-plugin-reducer
[win-build-image]: https://ci.appveyor.com/api/projects/status/rrima2im1r3pdtq0?svg=true
[win-build-url]: https://ci.appveyor.com/project/medikoo/serverless-plugin-reducer
[cov-image]: https://img.shields.io/codecov/c/github/medikoo/serverless-plugin-reducer.svg
[cov-url]: https://codecov.io/gh/medikoo/serverless-plugin-reducer
[transpilation-image]: https://img.shields.io/badge/transpilation-free-brightgreen.svg
[npm-image]: https://img.shields.io/npm/v/serverless-plugin-reducer.svg
[npm-url]: https://www.npmjs.com/package/serverless-plugin-reducer
