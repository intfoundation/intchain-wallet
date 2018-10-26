"use strict";

var _set = require("babel-runtime/core-js/set");

var _set2 = _interopRequireDefault(_set);

var _regenerator = require("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _getIterator2 = require("babel-runtime/core-js/get-iterator");

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _asyncToGenerator2 = require("babel-runtime/helpers/asyncToGenerator");

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("babel-runtime/helpers/createClass");

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

Object.defineProperty(exports, "__esModule", { value: true });
var assert = require('assert');
var error_code_1 = require("../error_code");
var value_chain_1 = require("../value_chain");

var DbftContext = function () {
    function DbftContext(storage, globalOptions, logger) {
        (0, _classCallCheck3.default)(this, DbftContext);

        this.storage = storage;
        this.globalOptions = globalOptions;
        this.logger = logger;
    }

    (0, _createClass3.default)(DbftContext, [{
        key: "init",
        value: function () {
            var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(miners) {
                var storage, dbr, kvr, kvDBFT, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, address, info, _ref2, err;

                return _regenerator2.default.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                storage = this.storage;
                                _context.next = 3;
                                return storage.getReadWritableDatabase(value_chain_1.Chain.dbSystem);

                            case 3:
                                dbr = _context.sent;

                                if (!dbr.err) {
                                    _context.next = 7;
                                    break;
                                }

                                this.logger.error("get system database failed " + dbr.err);
                                return _context.abrupt("return", { err: dbr.err });

                            case 7:
                                _context.next = 9;
                                return dbr.value.getReadWritableKeyValue(DbftContext.kvDBFT);

                            case 9:
                                kvr = _context.sent;

                                if (!kvr.err) {
                                    _context.next = 13;
                                    break;
                                }

                                this.logger.error("get dbft keyvalue failed " + dbr.err);
                                return _context.abrupt("return", { err: kvr.err });

                            case 13:
                                kvDBFT = kvr.kv;
                                _iteratorNormalCompletion = true;
                                _didIteratorError = false;
                                _iteratorError = undefined;
                                _context.prev = 17;
                                _iterator = (0, _getIterator3.default)(miners);

                            case 19:
                                if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
                                    _context.next = 31;
                                    break;
                                }

                                address = _step.value;
                                info = { height: 0 };
                                _context.next = 24;
                                return kvDBFT.hset(DbftContext.keyCandidate, address, info);

                            case 24:
                                _ref2 = _context.sent;
                                err = _ref2.err;

                                if (!err) {
                                    _context.next = 28;
                                    break;
                                }

                                return _context.abrupt("return", { err: err });

                            case 28:
                                _iteratorNormalCompletion = true;
                                _context.next = 19;
                                break;

                            case 31:
                                _context.next = 37;
                                break;

                            case 33:
                                _context.prev = 33;
                                _context.t0 = _context["catch"](17);
                                _didIteratorError = true;
                                _iteratorError = _context.t0;

                            case 37:
                                _context.prev = 37;
                                _context.prev = 38;

                                if (!_iteratorNormalCompletion && _iterator.return) {
                                    _iterator.return();
                                }

                            case 40:
                                _context.prev = 40;

                                if (!_didIteratorError) {
                                    _context.next = 43;
                                    break;
                                }

                                throw _iteratorError;

                            case 43:
                                return _context.finish(40);

                            case 44:
                                return _context.finish(37);

                            case 45:
                                return _context.abrupt("return", { err: error_code_1.ErrorCode.RESULT_OK });

                            case 46:
                            case "end":
                                return _context.stop();
                        }
                    }
                }, _callee, this, [[17, 33, 37, 45], [38,, 40, 44]]);
            }));

            function init(_x) {
                return _ref.apply(this, arguments);
            }

            return init;
        }()
    }, {
        key: "getMiners",
        value: function () {
            var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2() {
                var dbr, kvr, kvDBFT, gm;
                return _regenerator2.default.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                _context2.next = 2;
                                return this.storage.getReadableDataBase(value_chain_1.Chain.dbSystem);

                            case 2:
                                dbr = _context2.sent;

                                if (!dbr.err) {
                                    _context2.next = 6;
                                    break;
                                }

                                this.logger.error("get system database failed " + dbr.err);
                                return _context2.abrupt("return", { err: dbr.err });

                            case 6:
                                _context2.next = 8;
                                return dbr.value.getReadableKeyValue(DbftContext.kvDBFT);

                            case 8:
                                kvr = _context2.sent;

                                if (!kvr.err) {
                                    _context2.next = 12;
                                    break;
                                }

                                this.logger.error("get dbft keyvalue failed " + dbr.err);
                                return _context2.abrupt("return", { err: kvr.err });

                            case 12:
                                kvDBFT = kvr.kv;
                                _context2.next = 15;
                                return kvDBFT.get(DbftContext.keyMiners);

                            case 15:
                                gm = _context2.sent;

                                if (!gm.err) {
                                    _context2.next = 19;
                                    break;
                                }

                                this.logger.error("getMinersFromStorage failed,errcode=" + gm.err);
                                return _context2.abrupt("return", { err: gm.err });

                            case 19:
                                return _context2.abrupt("return", { err: error_code_1.ErrorCode.RESULT_OK, miners: gm.value });

                            case 20:
                            case "end":
                                return _context2.stop();
                        }
                    }
                }, _callee2, this);
            }));

            function getMiners() {
                return _ref3.apply(this, arguments);
            }

            return getMiners;
        }()
    }, {
        key: "isMiner",
        value: function () {
            var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(address) {
                var dbr, kvr, kvDBFT, gm, miners;
                return _regenerator2.default.wrap(function _callee3$(_context3) {
                    while (1) {
                        switch (_context3.prev = _context3.next) {
                            case 0:
                                _context3.next = 2;
                                return this.storage.getReadableDataBase(value_chain_1.Chain.dbSystem);

                            case 2:
                                dbr = _context3.sent;

                                if (!dbr.err) {
                                    _context3.next = 6;
                                    break;
                                }

                                this.logger.error("get system database failed " + dbr.err);
                                return _context3.abrupt("return", { err: dbr.err });

                            case 6:
                                _context3.next = 8;
                                return dbr.value.getReadableKeyValue(DbftContext.kvDBFT);

                            case 8:
                                kvr = _context3.sent;

                                if (!kvr.err) {
                                    _context3.next = 12;
                                    break;
                                }

                                this.logger.error("get dbft keyvalue failed " + dbr.err);
                                return _context3.abrupt("return", { err: kvr.err });

                            case 12:
                                kvDBFT = kvr.kv;
                                _context3.next = 15;
                                return kvDBFT.get(DbftContext.keyMiners);

                            case 15:
                                gm = _context3.sent;

                                if (!gm.err) {
                                    _context3.next = 22;
                                    break;
                                }

                                if (!(gm.err === error_code_1.ErrorCode.RESULT_NOT_FOUND)) {
                                    _context3.next = 21;
                                    break;
                                }

                                return _context3.abrupt("return", { err: error_code_1.ErrorCode.RESULT_OK, isminer: false });

                            case 21:
                                return _context3.abrupt("return", { err: gm.err });

                            case 22:
                                miners = new _set2.default(gm.value);
                                return _context3.abrupt("return", { err: error_code_1.ErrorCode.RESULT_OK, isminer: miners.has(address) });

                            case 24:
                            case "end":
                                return _context3.stop();
                        }
                    }
                }, _callee3, this);
            }));

            function isMiner(_x2) {
                return _ref4.apply(this, arguments);
            }

            return isMiner;
        }()
    }, {
        key: "registerToCandidate",
        value: function () {
            var _ref5 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4(blockheight, address) {
                var storage, dbr, kvr, kvDBFT, info, _ref6, err;

                return _regenerator2.default.wrap(function _callee4$(_context4) {
                    while (1) {
                        switch (_context4.prev = _context4.next) {
                            case 0:
                                storage = this.storage;
                                _context4.next = 3;
                                return storage.getReadWritableDatabase(value_chain_1.Chain.dbSystem);

                            case 3:
                                dbr = _context4.sent;

                                if (!dbr.err) {
                                    _context4.next = 7;
                                    break;
                                }

                                this.logger.error("get system database failed " + dbr.err);
                                return _context4.abrupt("return", dbr.err);

                            case 7:
                                _context4.next = 9;
                                return dbr.value.getReadWritableKeyValue(DbftContext.kvDBFT);

                            case 9:
                                kvr = _context4.sent;

                                if (!kvr.err) {
                                    _context4.next = 13;
                                    break;
                                }

                                this.logger.error("get dbft keyvalue failed " + dbr.err);
                                return _context4.abrupt("return", kvr.err);

                            case 13:
                                kvDBFT = kvr.kv;
                                info = { height: blockheight };
                                _context4.next = 17;
                                return kvDBFT.hset(DbftContext.keyCandidate, address, info);

                            case 17:
                                _ref6 = _context4.sent;
                                err = _ref6.err;
                                return _context4.abrupt("return", err);

                            case 20:
                            case "end":
                                return _context4.stop();
                        }
                    }
                }, _callee4, this);
            }));

            function registerToCandidate(_x3, _x4) {
                return _ref5.apply(this, arguments);
            }

            return registerToCandidate;
        }()
    }, {
        key: "unRegisterFromCandidate",
        value: function () {
            var _ref7 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee5(address) {
                var storage, dbr, kvr, kvDBFT, _ref8, err;

                return _regenerator2.default.wrap(function _callee5$(_context5) {
                    while (1) {
                        switch (_context5.prev = _context5.next) {
                            case 0:
                                storage = this.storage;
                                _context5.next = 3;
                                return storage.getReadWritableDatabase(value_chain_1.Chain.dbSystem);

                            case 3:
                                dbr = _context5.sent;

                                if (!dbr.err) {
                                    _context5.next = 7;
                                    break;
                                }

                                this.logger.error("get system database failed " + dbr.err);
                                return _context5.abrupt("return", dbr.err);

                            case 7:
                                _context5.next = 9;
                                return dbr.value.getReadWritableKeyValue(DbftContext.kvDBFT);

                            case 9:
                                kvr = _context5.sent;

                                if (!kvr.err) {
                                    _context5.next = 13;
                                    break;
                                }

                                this.logger.error("get dbft keyvalue failed " + dbr.err);
                                return _context5.abrupt("return", kvr.err);

                            case 13:
                                kvDBFT = kvr.kv;
                                _context5.next = 16;
                                return kvDBFT.hdel(DbftContext.keyCandidate, address);

                            case 16:
                                _ref8 = _context5.sent;
                                err = _ref8.err;
                                return _context5.abrupt("return", err);

                            case 19:
                            case "end":
                                return _context5.stop();
                        }
                    }
                }, _callee5, this);
            }));

            function unRegisterFromCandidate(_x5) {
                return _ref7.apply(this, arguments);
            }

            return unRegisterFromCandidate;
        }()
    }, {
        key: "updateMiners",
        value: function () {
            var _ref9 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee6(blockheight) {
                var storage, dbr, kvr, kvDBFT, ga, minWaitBlocksToMiner, miners, minValidator, maxValidator, _ref10, err;

                return _regenerator2.default.wrap(function _callee6$(_context6) {
                    while (1) {
                        switch (_context6.prev = _context6.next) {
                            case 0:
                                storage = this.storage;
                                _context6.next = 3;
                                return storage.getReadWritableDatabase(value_chain_1.Chain.dbSystem);

                            case 3:
                                dbr = _context6.sent;

                                if (!dbr.err) {
                                    _context6.next = 7;
                                    break;
                                }

                                this.logger.error("get system database failed " + dbr.err);
                                return _context6.abrupt("return", dbr.err);

                            case 7:
                                _context6.next = 9;
                                return dbr.value.getReadWritableKeyValue(DbftContext.kvDBFT);

                            case 9:
                                kvr = _context6.sent;

                                if (!kvr.err) {
                                    _context6.next = 13;
                                    break;
                                }

                                this.logger.error("get dbft keyvalue failed " + dbr.err);
                                return _context6.abrupt("return", kvr.err);

                            case 13:
                                kvDBFT = kvr.kv;
                                _context6.next = 16;
                                return kvDBFT.hgetall(DbftContext.keyCandidate);

                            case 16:
                                ga = _context6.sent;

                                if (!ga.err) {
                                    _context6.next = 20;
                                    break;
                                }

                                this.logger.error("updateCandidate failed,hgetall errcode=" + ga.err);
                                return _context6.abrupt("return", ga.err);

                            case 20:
                                minWaitBlocksToMiner = this.globalOptions.minWaitBlocksToMiner;
                                miners = [];

                                ga.value.forEach(function (v) {
                                    var info = v.value;
                                    if (blockheight - info.height >= minWaitBlocksToMiner) {
                                        miners.push(v.key);
                                    }
                                });
                                minValidator = this.globalOptions.minValidator;
                                maxValidator = this.globalOptions.maxValidator;

                                if (!(minValidator > miners.length)) {
                                    _context6.next = 28;
                                    break;
                                }

                                this.logger.error("updateCandidate failed, valid miners not enough, length " + miners.length + " minValidator " + minValidator);
                                return _context6.abrupt("return", error_code_1.ErrorCode.RESULT_NOT_ENOUGH);

                            case 28:
                                if (miners.length > maxValidator) {
                                    miners = miners.slice(maxValidator);
                                }
                                _context6.next = 31;
                                return kvDBFT.set(DbftContext.keyMiners, miners);

                            case 31:
                                _ref10 = _context6.sent;
                                err = _ref10.err;
                                return _context6.abrupt("return", err);

                            case 34:
                            case "end":
                                return _context6.stop();
                        }
                    }
                }, _callee6, this);
            }));

            function updateMiners(_x6) {
                return _ref9.apply(this, arguments);
            }

            return updateMiners;
        }()
    }], [{
        key: "getElectionBlockNumber",
        value: function getElectionBlockNumber(globalOptions, n) {
            if (n === 0) {
                return 0;
            }
            return Math.floor((n - 1) / globalOptions.reSelectionBlocks) * globalOptions.reSelectionBlocks;
        }
    }, {
        key: "isElectionBlockNumber",
        value: function isElectionBlockNumber(globalOptions, n) {
            // n=0的时候为创世块，config里面还没有值呢
            if (n === 0) {
                return true;
            }
            return n % globalOptions.reSelectionBlocks === 0;
        }
    }, {
        key: "isAgreeRateReached",
        value: function isAgreeRateReached(globalOptions, minerCount, agreeCount) {
            return agreeCount >= minerCount * globalOptions.agreeRate;
        }
    }, {
        key: "getDueNextMiner",
        value: function getDueNextMiner(globalOptions, preBlock, nextMiners, view) {
            var offset = view;
            if (!DbftContext.isElectionBlockNumber(globalOptions, preBlock.number)) {
                var idx = nextMiners.indexOf(preBlock.miner);
                assert(idx > 0);
                offset += idx;
            }
            return nextMiners[offset % nextMiners.length];
        }
    }]);
    return DbftContext;
}();

DbftContext.kvDBFT = 'dbft';
DbftContext.keyCandidate = 'candidate';
DbftContext.keyMiners = 'miner';
exports.DbftContext = DbftContext;