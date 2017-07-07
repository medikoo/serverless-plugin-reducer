# serverless-plugin-reducer
## Reduce lambda package so it hosts only lambda dependencies
## Plugin for Serverless v1
### (for Serverless v0.5 version see [serverless-0.5 branch](https://github.com/medikoo/serverless-plugin-reducer/tree/serverless-0.5))

By default Serverless packages whole contents of service folder in which lambda was configured, it raises issues in projects where we maintain many functions under one service, as package for each lambda contains content of whole service.

__This plugin ensures that it is only dependencies of given lambda that are packaged and deployed to remote instance__

### Installation

	$ npm install serverless-plugin-reducer

### Configuration (within `serverless.yml`)

1. Ensure individual functions packaging by setting `individually: true` for `package` group. (See [Packaging functions separately](https://serverless.com/framework/docs/providers/aws/guide/packaging/#packaging-functions-separately) for more info)

```yaml
package:
  individually: true
```

2. Activate plugin in `serverless.yml`

```yaml
plugins:
  - serverless-plugin-reducer
```

3. If there some files that need to be included but escape automatic dependencies resolution (e.g. non Node.js module files, or modules required through dynamically resolved paths) they need to be included through `include` option as e.g.

```yaml
functions:
  hello:
    handler: handler.hello
    package:
      include:
        - non-node-js-module.txt
        - required-through-dynamic-path.js
```

See [Packaging functions separately](https://serverless.com/framework/docs/providers/aws/guide/packaging/#packaging-functions-separately) for more info.
