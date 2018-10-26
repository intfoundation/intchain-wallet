"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var winston_1 = require("winston");
var path = require("path");
var fs = require("fs-extra");

var _require = require('./log_shim'),
    LogShim = _require.LogShim;

exports.LogShim = LogShim;
function initLogger(options) {
    if (options.logger) {
        return options.logger;
    } else if (options.loggerOptions) {
        var loggerTransports = [];
        if (options.loggerOptions.console) {
            loggerTransports.push(new winston_1.transports.Console({
                level: options.loggerOptions.level ? options.loggerOptions.level : 'info',
                timestamp: true,
                handleExceptions: true,
                humanReadableUnhandledException: true
            }));
        }
        if (options.loggerOptions.file) {
            fs.ensureDirSync(options.loggerOptions.file.root);
            loggerTransports.push(new winston_1.transports.File({
                json: false,
                level: options.loggerOptions.level ? options.loggerOptions.level : 'info',
                timestamp: true,
                filename: path.join(options.loggerOptions.file.root, options.loggerOptions.file.filename || 'info.log'),
                datePattern: 'yyyy-MM-dd.',
                prepend: true,
                handleExceptions: true,
                humanReadableUnhandledException: true
            }));
        }
        var logger = new winston_1.Logger({
            level: options.loggerOptions.level || 'info',
            transports: loggerTransports
        });
        return new LogShim(logger).log;
    } else {
        var _loggerTransports = [];
        _loggerTransports.push(new winston_1.transports.Console({
            level: 'info',
            timestamp: true,
            handleExceptions: true
        }));
        var _logger = new winston_1.Logger({
            level: 'info',
            transports: _loggerTransports
        });
        return new LogShim(_logger).log;
    }
}
exports.initLogger = initLogger;