#!/usr/bin/env node

"use strict";

var _regenerator = require("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require("babel-runtime/helpers/asyncToGenerator");

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var run = function () {
    var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(argv) {
        var command, exit;
        return _regenerator2.default.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        command = client_1.parseCommand(argv);

                        if (command) {
                            _context.next = 5;
                            break;
                        }

                        console.error("parse command error, exit.");
                        process.exit();
                        return _context.abrupt("return");

                    case 5:
                        if (command.options.has('dataDir')) {
                            client_1.initUnhandledRejection(client_1.initLogger({
                                loggerOptions: { console: true, file: { root: path.join(process.cwd(), command.options.get('dataDir')), filename: 'exception.log' } }
                            }));
                        }
                        exit = false;

                        if (!(command.command === 'peer')) {
                            _context.next = 13;
                            break;
                        }

                        _context.next = 10;
                        return client_1.host.initPeer(command.options);

                    case 10:
                        exit = !_context.sent;
                        _context.next = 27;
                        break;

                    case 13:
                        if (!(command.command === 'miner')) {
                            _context.next = 19;
                            break;
                        }

                        _context.next = 16;
                        return client_1.host.initMiner(command.options);

                    case 16:
                        exit = !_context.sent;
                        _context.next = 27;
                        break;

                    case 19:
                        if (!(command.command === 'create')) {
                            _context.next = 25;
                            break;
                        }

                        _context.next = 22;
                        return client_1.host.createGenesis(command.options);

                    case 22:
                        exit = true;
                        _context.next = 27;
                        break;

                    case 25:
                        console.error("invalid action command " + command.command);
                        exit = true;

                    case 27:
                        if (exit) {
                            process.exit();
                        }

                    case 28:
                    case "end":
                        return _context.stop();
                }
            }
        }, _callee, this);
    }));

    return function run(_x) {
        return _ref.apply(this, arguments);
    };
}();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

Object.defineProperty(exports, "__esModule", { value: true });
var process = require("process");
var path = require("path");
var client_1 = require("../client");
Error.stackTraceLimit = 1000;

exports.run = run;
if (require.main === module) {
    run(process.argv);
}