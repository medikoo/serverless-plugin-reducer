"use strict";

const path = "./dynamically-required";

const foo = require(path);

module.exports.handler = () => foo;
