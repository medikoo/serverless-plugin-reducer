"use strict";

module.exports = class ServerlessPluginReducerError extends Error {
	constructor(message, code) {
		super(message);
		this.code = code;
	}
};
