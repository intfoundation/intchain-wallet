#!/usr/bin/env node

"use strict";

var _regenerator = require("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require("babel-runtime/helpers/asyncToGenerator");

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var main = function () {
    var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
        var command, dataDir, chainCreator, _ref2, err, debuger, session, height, accounts, coinbase, interval, scriptPath, cvdr, sessionDir, ccsr, _scriptPath;

        return _regenerator2.default.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        command = client_1.parseCommand(process.argv);

                        if (!command || !command.command) {
                            console.log("Usage: node address.js <create | convert> {--secret {secret} | --pubkey {pubkey}}");
                            process.exit();
                        }
                        dataDir = command.options.get('dataDir');
                        chainCreator = core_1.initChainCreator({ logger: logger });

                        if (!(command.command === 'independent')) {
                            _context.next = 26;
                            break;
                        }

                        _context.next = 7;
                        return core_1.createValueDebuger(chainCreator, dataDir);

                    case 7:
                        _ref2 = _context.sent;
                        err = _ref2.err;
                        debuger = _ref2.debuger;

                        if (err) {
                            process.exit();
                        }
                        session = debuger.createIndependentSession();
                        height = parseInt(command.options.get('height'));
                        accounts = parseInt(command.options.get('accounts'));
                        coinbase = parseInt(command.options.get('coinbase'));
                        interval = parseInt(command.options.get('interval'));
                        _context.next = 18;
                        return session.init({ height: height, accounts: accounts, coinbase: coinbase, interval: interval });

                    case 18:
                        err = _context.sent;

                        if (err) {
                            process.exit();
                        }
                        scriptPath = command.options.get('script');
                        _context.next = 23;
                        return runScript(session, scriptPath);

                    case 23:
                        process.exit();
                        _context.next = 40;
                        break;

                    case 26:
                        if (!(command.command === 'chain')) {
                            _context.next = 40;
                            break;
                        }

                        _context.next = 29;
                        return core_1.createValueDebuger(chainCreator, dataDir);

                    case 29:
                        cvdr = _context.sent;

                        if (cvdr.err) {
                            process.exit();
                        }
                        sessionDir = command.options.get('sessionDir');
                        _context.next = 34;
                        return cvdr.debuger.createChainSession(sessionDir);

                    case 34:
                        ccsr = _context.sent;

                        if (ccsr.err) {
                            process.exit();
                        }
                        _scriptPath = command.options.get('script');
                        _context.next = 39;
                        return runScript(ccsr.session, _scriptPath);

                    case 39:
                        process.exit();

                    case 40:
                    case "end":
                        return _context.stop();
                }
            }
        }, _callee, this);
    }));

    return function main() {
        return _ref.apply(this, arguments);
    };
}();

var runScript = function () {
    var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(session, scriptPath) {
        var run;
        return _regenerator2.default.wrap(function _callee2$(_context2) {
            while (1) {
                switch (_context2.prev = _context2.next) {
                    case 0:
                        _context2.prev = 0;
                        run = require(path.join(process.cwd(), scriptPath)).run;
                        _context2.next = 4;
                        return run(session);

                    case 4:
                        return _context2.abrupt("return", core_1.ErrorCode.RESULT_OK);

                    case 7:
                        _context2.prev = 7;
                        _context2.t0 = _context2["catch"](0);

                        logger.error(scriptPath + " run throws exception ", _context2.t0);
                        return _context2.abrupt("return", core_1.ErrorCode.RESULT_EXCEPTION);

                    case 11:
                    case "end":
                        return _context2.stop();
                }
            }
        }, _callee2, this, [[0, 7]]);
    }));

    return function runScript(_x, _x2) {
        return _ref3.apply(this, arguments);
    };
}();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

Object.defineProperty(exports, "__esModule", { value: true });
var process = require("process");
var path = require("path");
var client_1 = require("../client");
var core_1 = require("../core");
var logger = client_1.initLogger({ loggerOptions: { console: true } });
client_1.initUnhandledRejection(logger);

if (require.main === module) {
    main();
}