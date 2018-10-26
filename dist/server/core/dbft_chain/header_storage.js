"use strict";

var _stringify = require("babel-runtime/core-js/json/stringify");

var _stringify2 = _interopRequireDefault(_stringify);

var _regenerator = require("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require("babel-runtime/helpers/asyncToGenerator");

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("babel-runtime/helpers/createClass");

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

Object.defineProperty(exports, "__esModule", { value: true });
var error_code_1 = require("../error_code");
var LRUCache_1 = require("../lib/LRUCache");
var context_1 = require("./context");
var initHeadersSql = 'CREATE TABLE IF NOT EXISTS "miners"("hash" CHAR(64) PRIMARY KEY NOT NULL UNIQUE, "miners" TEXT NOT NULL, "totalView" INTEGER NOT NULL);';
var addHeaderSql = 'INSERT INTO miners (hash, miners, totalView) values ($hash, $miners, $totalView)';
var getHeaderSql = 'SELECT miners, totalView FROM miners WHERE hash=$hash';

var DbftHeaderStorage = function () {
    function DbftHeaderStorage(options) {
        (0, _classCallCheck3.default)(this, DbftHeaderStorage);

        this.m_cache = new LRUCache_1.LRUCache(12);
        this.m_db = options.db;
        this.m_logger = options.logger;
        this.m_headerStorage = options.headerStorage;
    }

    (0, _createClass3.default)(DbftHeaderStorage, [{
        key: "init",
        value: function () {
            var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
                return _regenerator2.default.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                _context.prev = 0;
                                _context.next = 3;
                                return this.m_db.run(initHeadersSql);

                            case 3:
                                return _context.abrupt("return", error_code_1.ErrorCode.RESULT_OK);

                            case 6:
                                _context.prev = 6;
                                _context.t0 = _context["catch"](0);

                                this.m_logger.error(_context.t0);
                                return _context.abrupt("return", error_code_1.ErrorCode.RESULT_EXCEPTION);

                            case 10:
                            case "end":
                                return _context.stop();
                        }
                    }
                }, _callee, this, [[0, 6]]);
            }));

            function init() {
                return _ref.apply(this, arguments);
            }

            return init;
        }()
    }, {
        key: "uninit",
        value: function uninit() {
            // do nothing
        }
    }, {
        key: "_getHeader",
        value: function () {
            var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(hash) {
                var c, gm, miners;
                return _regenerator2.default.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                c = this.m_cache.get(hash);

                                if (!c) {
                                    _context2.next = 3;
                                    break;
                                }

                                return _context2.abrupt("return", { err: error_code_1.ErrorCode.RESULT_OK, miners: c.m });

                            case 3:
                                _context2.prev = 3;
                                _context2.next = 6;
                                return this.m_db.get(getHeaderSql, { $hash: hash });

                            case 6:
                                gm = _context2.sent;

                                if (!(!gm || !gm.miners)) {
                                    _context2.next = 10;
                                    break;
                                }

                                this.m_logger.error("getMinersSql error,election block hash=" + hash);
                                return _context2.abrupt("return", { err: error_code_1.ErrorCode.RESULT_NOT_FOUND });

                            case 10:
                                miners = JSON.parse(gm.miners);

                                this.m_cache.set(hash, { m: miners, v: gm.totalView });
                                return _context2.abrupt("return", { err: error_code_1.ErrorCode.RESULT_OK, miners: miners });

                            case 15:
                                _context2.prev = 15;
                                _context2.t0 = _context2["catch"](3);

                                this.m_logger.error(_context2.t0);
                                return _context2.abrupt("return", { err: error_code_1.ErrorCode.RESULT_EXCEPTION });

                            case 19:
                            case "end":
                                return _context2.stop();
                        }
                    }
                }, _callee2, this, [[3, 15]]);
            }));

            function _getHeader(_x) {
                return _ref2.apply(this, arguments);
            }

            return _getHeader;
        }()
    }, {
        key: "addHeader",
        value: function () {
            var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(header, storageManager) {
                var miners, gs, context, gmr, totalView, ghr;
                return _regenerator2.default.wrap(function _callee3$(_context3) {
                    while (1) {
                        switch (_context3.prev = _context3.next) {
                            case 0:
                                miners = void 0;

                                if (context_1.DbftContext.isElectionBlockNumber(this.m_globalOptions, header.number)) {
                                    _context3.next = 15;
                                    break;
                                }

                                _context3.next = 4;
                                return storageManager.getSnapshotView(header.hash);

                            case 4:
                                gs = _context3.sent;

                                if (!gs.err) {
                                    _context3.next = 7;
                                    break;
                                }

                                return _context3.abrupt("return", gs.err);

                            case 7:
                                context = new context_1.DbftContext(gs.storage, this.m_globalOptions, this.m_logger);
                                _context3.next = 10;
                                return context.getMiners();

                            case 10:
                                gmr = _context3.sent;

                                storageManager.releaseSnapshotView(header.hash);

                                if (!gmr.err) {
                                    _context3.next = 14;
                                    break;
                                }

                                return _context3.abrupt("return", gmr.err);

                            case 14:
                                miners = gmr.miners;

                            case 15:
                                totalView = 0;

                                if (!(header.number !== 0)) {
                                    _context3.next = 23;
                                    break;
                                }

                                _context3.next = 19;
                                return this._getHeader(header.preBlockHash);

                            case 19:
                                ghr = _context3.sent;

                                if (!ghr.err) {
                                    _context3.next = 22;
                                    break;
                                }

                                return _context3.abrupt("return", ghr.err);

                            case 22:
                                totalView = ghr.totalView;

                            case 23:
                                totalView += Math.pow(2, header.view);
                                _context3.prev = 24;
                                _context3.next = 27;
                                return this.m_db.run(addHeaderSql, { $hash: header.hash, $miners: (0, _stringify2.default)(miners), $totalView: totalView });

                            case 27:
                                return _context3.abrupt("return", error_code_1.ErrorCode.RESULT_OK);

                            case 30:
                                _context3.prev = 30;
                                _context3.t0 = _context3["catch"](24);

                                this.m_logger.error(_context3.t0);
                                return _context3.abrupt("return", error_code_1.ErrorCode.RESULT_EXCEPTION);

                            case 34:
                            case "end":
                                return _context3.stop();
                        }
                    }
                }, _callee3, this, [[24, 30]]);
            }));

            function addHeader(_x2, _x3) {
                return _ref3.apply(this, arguments);
            }

            return addHeader;
        }()
    }, {
        key: "getTotalView",
        value: function () {
            var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4(header) {
                return _regenerator2.default.wrap(function _callee4$(_context4) {
                    while (1) {
                        switch (_context4.prev = _context4.next) {
                            case 0:
                                return _context4.abrupt("return", this._getHeader(header.hash));

                            case 1:
                            case "end":
                                return _context4.stop();
                        }
                    }
                }, _callee4, this);
            }));

            function getTotalView(_x4) {
                return _ref4.apply(this, arguments);
            }

            return getTotalView;
        }()
    }, {
        key: "getMiners",
        value: function () {
            var _ref5 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee5(header) {
                return _regenerator2.default.wrap(function _callee5$(_context5) {
                    while (1) {
                        switch (_context5.prev = _context5.next) {
                            case 0:
                                _context5.next = 2;
                                return this._getMiners(header, false);

                            case 2:
                                return _context5.abrupt("return", _context5.sent);

                            case 3:
                            case "end":
                                return _context5.stop();
                        }
                    }
                }, _callee5, this);
            }));

            function getMiners(_x5) {
                return _ref5.apply(this, arguments);
            }

            return getMiners;
        }()
    }, {
        key: "getNextMiners",
        value: function () {
            var _ref6 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee6(header) {
                return _regenerator2.default.wrap(function _callee6$(_context6) {
                    while (1) {
                        switch (_context6.prev = _context6.next) {
                            case 0:
                                _context6.next = 2;
                                return this._getMiners(header, true);

                            case 2:
                                return _context6.abrupt("return", _context6.sent);

                            case 3:
                            case "end":
                                return _context6.stop();
                        }
                    }
                }, _callee6, this);
            }));

            function getNextMiners(_x6) {
                return _ref6.apply(this, arguments);
            }

            return getNextMiners;
        }()
    }, {
        key: "_getMiners",
        value: function () {
            var _ref7 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee7(header, bNext) {
                var en, electionHeader, hr;
                return _regenerator2.default.wrap(function _callee7$(_context7) {
                    while (1) {
                        switch (_context7.prev = _context7.next) {
                            case 0:
                                en = context_1.DbftContext.getElectionBlockNumber(this.m_globalOptions, bNext ? header.number + 1 : header.number);
                                electionHeader = void 0;

                                if (!(header.number === en)) {
                                    _context7.next = 6;
                                    break;
                                }

                                electionHeader = header;
                                _context7.next = 13;
                                break;

                            case 6:
                                _context7.next = 8;
                                return this.m_headerStorage.getHeader(header.preBlockHash, en - header.number + 1);

                            case 8:
                                hr = _context7.sent;

                                if (!hr.err) {
                                    _context7.next = 12;
                                    break;
                                }

                                this.m_logger.error("dbft get electionHeader error,number=" + header.number + ",prevblockhash=" + header.preBlockHash);
                                return _context7.abrupt("return", { err: hr.err });

                            case 12:
                                electionHeader = hr.header;

                            case 13:
                                return _context7.abrupt("return", this._getHeader(electionHeader.hash));

                            case 14:
                            case "end":
                                return _context7.stop();
                        }
                    }
                }, _callee7, this);
            }));

            function _getMiners(_x7, _x8) {
                return _ref7.apply(this, arguments);
            }

            return _getMiners;
        }()
    }, {
        key: "getDueMiner",
        value: function () {
            var _ref8 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee8(header, miners) {
                var hr, due;
                return _regenerator2.default.wrap(function _callee8$(_context8) {
                    while (1) {
                        switch (_context8.prev = _context8.next) {
                            case 0:
                                if (!(header.number === 0)) {
                                    _context8.next = 2;
                                    break;
                                }

                                return _context8.abrupt("return", { err: error_code_1.ErrorCode.RESULT_OK, miner: header.miner });

                            case 2:
                                _context8.next = 4;
                                return this.m_headerStorage.getHeader(header.preBlockHash);

                            case 4:
                                hr = _context8.sent;

                                if (!hr.err) {
                                    _context8.next = 8;
                                    break;
                                }

                                this.m_logger.error("getDueMiner failed for get pre block failed ", hr.err);
                                return _context8.abrupt("return", { err: hr.err });

                            case 8:
                                due = context_1.DbftContext.getDueNextMiner(this.m_globalOptions, hr.header, miners, header.view);
                                return _context8.abrupt("return", { err: error_code_1.ErrorCode.RESULT_OK, miner: due });

                            case 10:
                            case "end":
                                return _context8.stop();
                        }
                    }
                }, _callee8, this);
            }));

            function getDueMiner(_x9, _x10) {
                return _ref8.apply(this, arguments);
            }

            return getDueMiner;
        }()
    }]);
    return DbftHeaderStorage;
}();

exports.DbftHeaderStorage = DbftHeaderStorage;