# serverless-plugin-lambda-reducer
## Reduce lambda package so it hosts only lambda dependencies
## Plugin for Serverless 0.5.x

By default Serverless 0.5.x packages whole contents of folder that covers scope of lambda function.

It raises issues in projects where we maintain many functions and want to share some modules between them.
In such case scope folder of each lambda function covers not only shared modules but all other lambdas, and whole that content is being packaged for each lambda.

This plugin ensures that aside of obligatory meta files, it's only dependencies of given lambda that are packaged and published to AWS

### Installation

	$ npm install serverless-plugin-lambda-reducer

Activate plugin in `s-project.json`

```json
{
  "plugins": [
    "serverless-plugin-lambda-reducer"
  ]
}
```
