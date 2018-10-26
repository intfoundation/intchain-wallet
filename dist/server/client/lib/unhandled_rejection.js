"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var process = require("process");
function init(logger) {
    process.on('unhandledRejection', function (reason, p) {
        logger.error('Unhandled Rejection at: Promise ', p, ' reason: ', reason.stack);
        process.exit(-1);
    });
    process.on('uncaughtException', function (err) {
        logger.error('uncaught exception at: ', err.stack);
        process.exit(-1);
    });
}
exports.init = init;