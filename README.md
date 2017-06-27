# serverless-plugin-lambda-reducer
## Reduce lambda package so it hosts only lambda dependencies
## Plugin for Serverless 0.5.x

By default Serverless 0.5.x packages whole contents of folder that covers scope of lambda function.

It raises issues in projects where we maintain many functions and want to share some functionality between them.
In such case scope folder of each lambda function covers not only shared modules but all other lambdas, and whole that content is being packaged for each lambda.

__This plugin ensures that aside of obligatory meta files it is only dependencies of given lambda that are packaged and published to AWS__

### Installation

	$ npm install serverless-plugin-lambda-reducer@1

Activate plugin in `s-project.json`

```json
{
  "plugins": [
    "serverless-plugin-lambda-reducer"
  ]
}
```

### Options

#### `include`

By default reducer takes following files
- `s-function.json`
- `event.json` (if exists)
- `s-templates.json` (if exists)
- Lambda handler and all it's dependencies (resolved by reading require chain)

If some other files needs to be included they can be pointed with `include` option passed to `s-function.json` as follows:

```json
...
  "custom": {
    "lambdaReducer": {
      "include": ["extra-file-to-include.txt", "some/dir-to-include"]
    }
  }
...
```
