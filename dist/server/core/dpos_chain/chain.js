"use strict";

var _stringify = require("babel-runtime/core-js/json/stringify");

var _stringify2 = _interopRequireDefault(_stringify);

var _create = require("babel-runtime/core-js/object/create");

var _create2 = _interopRequireDefault(_create);

var _regenerator = require("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require("babel-runtime/helpers/asyncToGenerator");

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _getPrototypeOf = require("babel-runtime/core-js/object/get-prototype-of");

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("babel-runtime/helpers/createClass");

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require("babel-runtime/helpers/possibleConstructorReturn");

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _get2 = require("babel-runtime/helpers/get");

var _get3 = _interopRequireDefault(_get2);

var _inherits2 = require("babel-runtime/helpers/inherits");

var _inherits3 = _interopRequireDefault(_inherits2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

Object.defineProperty(exports, "__esModule", { value: true });
var error_code_1 = require("../error_code");
var value_chain_1 = require("../value_chain");
var block_1 = require("./block");
var consensus = require("./consensus");
var ValueContext = require("../value_chain/context");
var executor_1 = require("./executor");
var initMinersSql = 'CREATE TABLE IF NOT EXISTS "miners"("hash" CHAR(64) PRIMARY KEY NOT NULL UNIQUE, "miners" TEXT NOT NULL);';
var updateMinersSql = 'REPLACE INTO miners (hash, miners) values ($hash, $miners)';
var getMinersSql = 'SELECT miners FROM miners WHERE hash=$hash';

var DposChain = function (_value_chain_1$ValueC) {
    (0, _inherits3.default)(DposChain, _value_chain_1$ValueC);

    function DposChain(options) {
        (0, _classCallCheck3.default)(this, DposChain);
        return (0, _possibleConstructorReturn3.default)(this, (DposChain.__proto__ || (0, _getPrototypeOf2.default)(DposChain)).call(this, options));
    }
    // DPOS中，只广播tipheader


    (0, _createClass3.default)(DposChain, [{
        key: "initComponents",
        value: function () {
            var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(dataDir, handler, options) {
                var err, readonly;
                return _regenerator2.default.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                _context.next = 2;
                                return (0, _get3.default)(DposChain.prototype.__proto__ || (0, _getPrototypeOf2.default)(DposChain.prototype), "initComponents", this).call(this, dataDir, handler, options);

                            case 2:
                                err = _context.sent;

                                if (!err) {
                                    _context.next = 5;
                                    break;
                                }

                                return _context.abrupt("return", err);

                            case 5:
                                readonly = options && options.readonly;

                                if (readonly) {
                                    _context.next = 16;
                                    break;
                                }

                                _context.prev = 7;
                                _context.next = 10;
                                return this.m_db.run(initMinersSql);

                            case 10:
                                _context.next = 16;
                                break;

                            case 12:
                                _context.prev = 12;
                                _context.t0 = _context["catch"](7);

                                this.logger.error(_context.t0);
                                return _context.abrupt("return", error_code_1.ErrorCode.RESULT_EXCEPTION);

                            case 16:
                                return _context.abrupt("return", error_code_1.ErrorCode.RESULT_OK);

                            case 17:
                            case "end":
                                return _context.stop();
                        }
                    }
                }, _callee, this, [[7, 12]]);
            }));

            function initComponents(_x, _x2, _x3) {
                return _ref.apply(this, arguments);
            }

            return initComponents;
        }()
    }, {
        key: "newBlockExecutor",
        value: function () {
            var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee12(block, storage) {
                var _this2 = this;

                var kvBalance, ve, externalContext, dbr, de, executor;
                return _regenerator2.default.wrap(function _callee12$(_context12) {
                    while (1) {
                        switch (_context12.prev = _context12.next) {
                            case 0:
                                _context12.next = 2;
                                return storage.getKeyValue(value_chain_1.Chain.dbSystem, value_chain_1.ValueChain.kvBalance);

                            case 2:
                                kvBalance = _context12.sent.kv;
                                ve = new ValueContext.Context(kvBalance);
                                externalContext = (0, _create2.default)(null);

                                externalContext.getBalance = function () {
                                    var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(address) {
                                        return _regenerator2.default.wrap(function _callee2$(_context2) {
                                            while (1) {
                                                switch (_context2.prev = _context2.next) {
                                                    case 0:
                                                        _context2.next = 2;
                                                        return ve.getBalance(address);

                                                    case 2:
                                                        return _context2.abrupt("return", _context2.sent);

                                                    case 3:
                                                    case "end":
                                                        return _context2.stop();
                                                }
                                            }
                                        }, _callee2, _this2);
                                    }));

                                    return function (_x6) {
                                        return _ref3.apply(this, arguments);
                                    };
                                }();
                                externalContext.transferTo = function () {
                                    var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(address, amount) {
                                        return _regenerator2.default.wrap(function _callee3$(_context3) {
                                            while (1) {
                                                switch (_context3.prev = _context3.next) {
                                                    case 0:
                                                        _context3.next = 2;
                                                        return ve.transferTo(value_chain_1.ValueChain.sysAddress, address, amount);

                                                    case 2:
                                                        return _context3.abrupt("return", _context3.sent);

                                                    case 3:
                                                    case "end":
                                                        return _context3.stop();
                                                }
                                            }
                                        }, _callee3, _this2);
                                    }));

                                    return function (_x7, _x8) {
                                        return _ref4.apply(this, arguments);
                                    };
                                }();
                                _context12.next = 9;
                                return storage.getReadableDataBase(value_chain_1.Chain.dbSystem);

                            case 9:
                                dbr = _context12.sent;

                                if (!dbr.err) {
                                    _context12.next = 12;
                                    break;
                                }

                                return _context12.abrupt("return", { err: dbr.err });

                            case 12:
                                de = new consensus.Context(dbr.value, this.globalOptions, this.logger);

                                externalContext.vote = function () {
                                    var _ref5 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4(from, candiates) {
                                        var vr;
                                        return _regenerator2.default.wrap(function _callee4$(_context4) {
                                            while (1) {
                                                switch (_context4.prev = _context4.next) {
                                                    case 0:
                                                        _context4.next = 2;
                                                        return de.vote(from, candiates);

                                                    case 2:
                                                        vr = _context4.sent;

                                                        if (!vr.err) {
                                                            _context4.next = 5;
                                                            break;
                                                        }

                                                        throw new Error();

                                                    case 5:
                                                        return _context4.abrupt("return", vr.returnCode);

                                                    case 6:
                                                    case "end":
                                                        return _context4.stop();
                                                }
                                            }
                                        }, _callee4, _this2);
                                    }));

                                    return function (_x9, _x10) {
                                        return _ref5.apply(this, arguments);
                                    };
                                }();
                                externalContext.mortgage = function () {
                                    var _ref6 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee5(from, amount) {
                                        var mr;
                                        return _regenerator2.default.wrap(function _callee5$(_context5) {
                                            while (1) {
                                                switch (_context5.prev = _context5.next) {
                                                    case 0:
                                                        _context5.next = 2;
                                                        return de.mortgage(from, amount);

                                                    case 2:
                                                        mr = _context5.sent;

                                                        if (!mr.err) {
                                                            _context5.next = 5;
                                                            break;
                                                        }

                                                        throw new Error();

                                                    case 5:
                                                        return _context5.abrupt("return", mr.returnCode);

                                                    case 6:
                                                    case "end":
                                                        return _context5.stop();
                                                }
                                            }
                                        }, _callee5, _this2);
                                    }));

                                    return function (_x11, _x12) {
                                        return _ref6.apply(this, arguments);
                                    };
                                }();
                                externalContext.unmortgage = function () {
                                    var _ref7 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee6(from, amount) {
                                        var mr;
                                        return _regenerator2.default.wrap(function _callee6$(_context6) {
                                            while (1) {
                                                switch (_context6.prev = _context6.next) {
                                                    case 0:
                                                        _context6.next = 2;
                                                        return de.unmortgage(from, amount);

                                                    case 2:
                                                        mr = _context6.sent;

                                                        if (!mr.err) {
                                                            _context6.next = 5;
                                                            break;
                                                        }

                                                        throw new Error();

                                                    case 5:
                                                        return _context6.abrupt("return", mr.returnCode);

                                                    case 6:
                                                    case "end":
                                                        return _context6.stop();
                                                }
                                            }
                                        }, _callee6, _this2);
                                    }));

                                    return function (_x13, _x14) {
                                        return _ref7.apply(this, arguments);
                                    };
                                }();
                                externalContext.register = function () {
                                    var _ref8 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee7(from) {
                                        var mr;
                                        return _regenerator2.default.wrap(function _callee7$(_context7) {
                                            while (1) {
                                                switch (_context7.prev = _context7.next) {
                                                    case 0:
                                                        _context7.next = 2;
                                                        return de.registerToCandidate(from);

                                                    case 2:
                                                        mr = _context7.sent;

                                                        if (!mr.err) {
                                                            _context7.next = 5;
                                                            break;
                                                        }

                                                        throw new Error();

                                                    case 5:
                                                        return _context7.abrupt("return", mr.returnCode);

                                                    case 6:
                                                    case "end":
                                                        return _context7.stop();
                                                }
                                            }
                                        }, _callee7, _this2);
                                    }));

                                    return function (_x15) {
                                        return _ref8.apply(this, arguments);
                                    };
                                }();
                                externalContext.getVote = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee8() {
                                    var gvr;
                                    return _regenerator2.default.wrap(function _callee8$(_context8) {
                                        while (1) {
                                            switch (_context8.prev = _context8.next) {
                                                case 0:
                                                    _context8.next = 2;
                                                    return de.getVote();

                                                case 2:
                                                    gvr = _context8.sent;

                                                    if (!gvr.err) {
                                                        _context8.next = 5;
                                                        break;
                                                    }

                                                    throw new Error();

                                                case 5:
                                                    return _context8.abrupt("return", gvr.vote);

                                                case 6:
                                                case "end":
                                                    return _context8.stop();
                                            }
                                        }
                                    }, _callee8, _this2);
                                }));
                                externalContext.getStoke = function () {
                                    var _ref10 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee9(address) {
                                        var gsr;
                                        return _regenerator2.default.wrap(function _callee9$(_context9) {
                                            while (1) {
                                                switch (_context9.prev = _context9.next) {
                                                    case 0:
                                                        _context9.next = 2;
                                                        return de.getStoke(address);

                                                    case 2:
                                                        gsr = _context9.sent;

                                                        if (!gsr.err) {
                                                            _context9.next = 5;
                                                            break;
                                                        }

                                                        throw new Error();

                                                    case 5:
                                                        return _context9.abrupt("return", gsr.stoke);

                                                    case 6:
                                                    case "end":
                                                        return _context9.stop();
                                                }
                                            }
                                        }, _callee9, _this2);
                                    }));

                                    return function (_x16) {
                                        return _ref10.apply(this, arguments);
                                    };
                                }();
                                externalContext.getCandidates = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee10() {
                                    var gc;
                                    return _regenerator2.default.wrap(function _callee10$(_context10) {
                                        while (1) {
                                            switch (_context10.prev = _context10.next) {
                                                case 0:
                                                    _context10.next = 2;
                                                    return de.getCandidates();

                                                case 2:
                                                    gc = _context10.sent;

                                                    if (!gc.err) {
                                                        _context10.next = 5;
                                                        break;
                                                    }

                                                    throw Error();

                                                case 5:
                                                    return _context10.abrupt("return", gc.candidates);

                                                case 6:
                                                case "end":
                                                    return _context10.stop();
                                            }
                                        }
                                    }, _callee10, _this2);
                                }));
                                externalContext.getMiners = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee11() {
                                    var gm;
                                    return _regenerator2.default.wrap(function _callee11$(_context11) {
                                        while (1) {
                                            switch (_context11.prev = _context11.next) {
                                                case 0:
                                                    _context11.next = 2;
                                                    return de.getNextMiners();

                                                case 2:
                                                    gm = _context11.sent;

                                                    if (!gm.err) {
                                                        _context11.next = 5;
                                                        break;
                                                    }

                                                    throw Error();

                                                case 5:
                                                    return _context11.abrupt("return", gm.creators);

                                                case 6:
                                                case "end":
                                                    return _context11.stop();
                                            }
                                        }
                                    }, _callee11, _this2);
                                }));
                                executor = new executor_1.DposBlockExecutor({ logger: this.logger, block: block, storage: storage, handler: this.handler, externContext: externalContext, globalOptions: this.globalOptions });
                                return _context12.abrupt("return", { err: error_code_1.ErrorCode.RESULT_OK, executor: executor });

                            case 23:
                            case "end":
                                return _context12.stop();
                        }
                    }
                }, _callee12, this);
            }));

            function newBlockExecutor(_x4, _x5) {
                return _ref2.apply(this, arguments);
            }

            return newBlockExecutor;
        }()
    }, {
        key: "newViewExecutor",
        value: function () {
            var _ref13 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee16(header, storage, method, param) {
                var _this3 = this;

                var nvex, externalContext, dbr, de;
                return _regenerator2.default.wrap(function _callee16$(_context16) {
                    while (1) {
                        switch (_context16.prev = _context16.next) {
                            case 0:
                                _context16.next = 2;
                                return (0, _get3.default)(DposChain.prototype.__proto__ || (0, _getPrototypeOf2.default)(DposChain.prototype), "newViewExecutor", this).call(this, header, storage, method, param);

                            case 2:
                                nvex = _context16.sent;
                                externalContext = nvex.executor.externContext;
                                _context16.next = 6;
                                return storage.getReadableDataBase(value_chain_1.Chain.dbSystem);

                            case 6:
                                dbr = _context16.sent;

                                if (!dbr.err) {
                                    _context16.next = 9;
                                    break;
                                }

                                return _context16.abrupt("return", { err: dbr.err });

                            case 9:
                                de = new consensus.Context(dbr.value, this.globalOptions, this.logger);

                                externalContext.getVote = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee13() {
                                    var gvr;
                                    return _regenerator2.default.wrap(function _callee13$(_context13) {
                                        while (1) {
                                            switch (_context13.prev = _context13.next) {
                                                case 0:
                                                    _context13.next = 2;
                                                    return de.getVote();

                                                case 2:
                                                    gvr = _context13.sent;

                                                    if (!gvr.err) {
                                                        _context13.next = 5;
                                                        break;
                                                    }

                                                    throw new Error();

                                                case 5:
                                                    return _context13.abrupt("return", gvr.vote);

                                                case 6:
                                                case "end":
                                                    return _context13.stop();
                                            }
                                        }
                                    }, _callee13, _this3);
                                }));
                                externalContext.getStoke = function () {
                                    var _ref15 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee14(address) {
                                        var gsr;
                                        return _regenerator2.default.wrap(function _callee14$(_context14) {
                                            while (1) {
                                                switch (_context14.prev = _context14.next) {
                                                    case 0:
                                                        _context14.next = 2;
                                                        return de.getStoke(address);

                                                    case 2:
                                                        gsr = _context14.sent;

                                                        if (!gsr.err) {
                                                            _context14.next = 5;
                                                            break;
                                                        }

                                                        throw new Error();

                                                    case 5:
                                                        return _context14.abrupt("return", gsr.stoke);

                                                    case 6:
                                                    case "end":
                                                        return _context14.stop();
                                                }
                                            }
                                        }, _callee14, _this3);
                                    }));

                                    return function (_x21) {
                                        return _ref15.apply(this, arguments);
                                    };
                                }();
                                externalContext.getCandidates = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee15() {
                                    var gc;
                                    return _regenerator2.default.wrap(function _callee15$(_context15) {
                                        while (1) {
                                            switch (_context15.prev = _context15.next) {
                                                case 0:
                                                    _context15.next = 2;
                                                    return de.getCandidates();

                                                case 2:
                                                    gc = _context15.sent;

                                                    if (!gc.err) {
                                                        _context15.next = 5;
                                                        break;
                                                    }

                                                    throw Error();

                                                case 5:
                                                    return _context15.abrupt("return", gc.candidates);

                                                case 6:
                                                case "end":
                                                    return _context15.stop();
                                            }
                                        }
                                    }, _callee15, _this3);
                                }));
                                return _context16.abrupt("return", nvex);

                            case 14:
                            case "end":
                                return _context16.stop();
                        }
                    }
                }, _callee16, this);
            }));

            function newViewExecutor(_x17, _x18, _x19, _x20) {
                return _ref13.apply(this, arguments);
            }

            return newViewExecutor;
        }()
    }, {
        key: "_compareWork",
        value: function () {
            var _ref17 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee17(left, right) {
                var height, tir, leftIndex, rightIndex, time;
                return _regenerator2.default.wrap(function _callee17$(_context17) {
                    while (1) {
                        switch (_context17.prev = _context17.next) {
                            case 0:
                                // 更长的链优先
                                height = left.number - right.number;

                                if (!(height !== 0)) {
                                    _context17.next = 3;
                                    break;
                                }

                                return _context17.abrupt("return", { err: error_code_1.ErrorCode.RESULT_OK, result: height });

                            case 3:
                                _context17.next = 5;
                                return left.getTimeIndex(this);

                            case 5:
                                tir = _context17.sent;

                                if (!tir.err) {
                                    _context17.next = 8;
                                    break;
                                }

                                return _context17.abrupt("return", { err: tir.err });

                            case 8:
                                leftIndex = tir.index;
                                _context17.next = 11;
                                return right.getTimeIndex(this);

                            case 11:
                                tir = _context17.sent;

                                if (!tir.err) {
                                    _context17.next = 14;
                                    break;
                                }

                                return _context17.abrupt("return", { err: tir.err });

                            case 14:
                                rightIndex = tir.index;
                                time = leftIndex - rightIndex;

                                if (!(time !== 0)) {
                                    _context17.next = 18;
                                    break;
                                }

                                return _context17.abrupt("return", { err: error_code_1.ErrorCode.RESULT_OK, result: time });

                            case 18:
                                return _context17.abrupt("return", { err: error_code_1.ErrorCode.RESULT_OK, result: time });

                            case 19:
                            case "end":
                                return _context17.stop();
                        }
                    }
                }, _callee17, this);
            }));

            function _compareWork(_x22, _x23) {
                return _ref17.apply(this, arguments);
            }

            return _compareWork;
        }()
    }, {
        key: "_calcuteReqLimit",
        value: function () {
            var _ref18 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee18(fromHeader, limit) {
                var hr, reSelectionBlocks;
                return _regenerator2.default.wrap(function _callee18$(_context18) {
                    while (1) {
                        switch (_context18.prev = _context18.next) {
                            case 0:
                                _context18.next = 2;
                                return this.getHeader(fromHeader);

                            case 2:
                                hr = _context18.sent;
                                reSelectionBlocks = this.globalOptions.reSelectionBlocks;
                                return _context18.abrupt("return", reSelectionBlocks - hr.header.number % reSelectionBlocks);

                            case 5:
                            case "end":
                                return _context18.stop();
                        }
                    }
                }, _callee18, this);
            }));

            function _calcuteReqLimit(_x24, _x25) {
                return _ref18.apply(this, arguments);
            }

            return _calcuteReqLimit;
        }()
    }, {
        key: "getMiners",
        value: function () {
            var _ref19 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee19(header) {
                var en, electionHeader, hr, gm;
                return _regenerator2.default.wrap(function _callee19$(_context19) {
                    while (1) {
                        switch (_context19.prev = _context19.next) {
                            case 0:
                                en = consensus.ViewContext.getElectionBlockNumber(this.globalOptions, header.number);
                                electionHeader = void 0;

                                if (!(header.number === en)) {
                                    _context19.next = 6;
                                    break;
                                }

                                electionHeader = header;
                                _context19.next = 13;
                                break;

                            case 6:
                                _context19.next = 8;
                                return this.getHeader(header.preBlockHash, en - header.number + 1);

                            case 8:
                                hr = _context19.sent;

                                if (!hr.err) {
                                    _context19.next = 12;
                                    break;
                                }

                                this.logger.error("get electionHeader error,number=" + header.number + ",prevblockhash=" + header.preBlockHash);
                                return _context19.abrupt("return", { err: hr.err });

                            case 12:
                                electionHeader = hr.header;

                            case 13:
                                _context19.prev = 13;
                                _context19.next = 16;
                                return this.m_db.get(getMinersSql, { $hash: electionHeader.hash });

                            case 16:
                                gm = _context19.sent;

                                if (!(!gm || !gm.miners)) {
                                    _context19.next = 20;
                                    break;
                                }

                                this.logger.error("getMinersSql error,election block hash=" + electionHeader.hash + ",en=" + en + ",header.height=" + header.number);
                                return _context19.abrupt("return", { err: error_code_1.ErrorCode.RESULT_NOT_FOUND });

                            case 20:
                                return _context19.abrupt("return", { err: error_code_1.ErrorCode.RESULT_OK, header: electionHeader, creators: JSON.parse(gm.miners) });

                            case 23:
                                _context19.prev = 23;
                                _context19.t0 = _context19["catch"](13);

                                this.logger.error(_context19.t0);
                                return _context19.abrupt("return", { err: error_code_1.ErrorCode.RESULT_EXCEPTION });

                            case 27:
                            case "end":
                                return _context19.stop();
                        }
                    }
                }, _callee19, this, [[13, 23]]);
            }));

            function getMiners(_x26) {
                return _ref19.apply(this, arguments);
            }

            return getMiners;
        }()
    }, {
        key: "_onVerifiedBlock",
        value: function () {
            var _ref20 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee20(block) {
                var gs, dbr, denv, minersInfo;
                return _regenerator2.default.wrap(function _callee20$(_context20) {
                    while (1) {
                        switch (_context20.prev = _context20.next) {
                            case 0:
                                if (!(block.number !== 0 && block.number % this.globalOptions.reSelectionBlocks !== 0)) {
                                    _context20.next = 2;
                                    break;
                                }

                                return _context20.abrupt("return", error_code_1.ErrorCode.RESULT_OK);

                            case 2:
                                _context20.next = 4;
                                return this.storageManager.getSnapshotView(block.hash);

                            case 4:
                                gs = _context20.sent;

                                if (!gs.err) {
                                    _context20.next = 7;
                                    break;
                                }

                                return _context20.abrupt("return", gs.err);

                            case 7:
                                _context20.next = 9;
                                return gs.storage.getReadableDataBase(value_chain_1.Chain.dbSystem);

                            case 9:
                                dbr = _context20.sent;

                                if (!dbr.err) {
                                    _context20.next = 12;
                                    break;
                                }

                                return _context20.abrupt("return", dbr.err);

                            case 12:
                                denv = new consensus.ViewContext(dbr.value, this.globalOptions, this.m_logger);
                                _context20.next = 15;
                                return denv.getNextMiners();

                            case 15:
                                minersInfo = _context20.sent;

                                this.storageManager.releaseSnapshotView(block.hash);

                                if (!minersInfo.err) {
                                    _context20.next = 19;
                                    break;
                                }

                                return _context20.abrupt("return", minersInfo.err);

                            case 19:
                                _context20.prev = 19;
                                _context20.next = 22;
                                return this.m_db.run(updateMinersSql, { $hash: block.hash, $miners: (0, _stringify2.default)(minersInfo.creators) });

                            case 22:
                                return _context20.abrupt("return", error_code_1.ErrorCode.RESULT_OK);

                            case 25:
                                _context20.prev = 25;
                                _context20.t0 = _context20["catch"](19);

                                this.logger.error(_context20.t0);
                                return _context20.abrupt("return", error_code_1.ErrorCode.RESULT_EXCEPTION);

                            case 29:
                            case "end":
                                return _context20.stop();
                        }
                    }
                }, _callee20, this, [[19, 25]]);
            }));

            function _onVerifiedBlock(_x27) {
                return _ref20.apply(this, arguments);
            }

            return _onVerifiedBlock;
        }()
    }, {
        key: "_onCheckGlobalOptions",
        value: function _onCheckGlobalOptions(globalOptions) {
            if (!(0, _get3.default)(DposChain.prototype.__proto__ || (0, _getPrototypeOf2.default)(DposChain.prototype), "_onCheckGlobalOptions", this).call(this, globalOptions)) {
                return false;
            }
            return consensus.onCheckGlobalOptions(globalOptions);
        }
    }, {
        key: "_getBlockHeaderType",
        value: function _getBlockHeaderType() {
            return block_1.DposBlockHeader;
        }
    }, {
        key: "_onCheckTypeOptions",
        value: function _onCheckTypeOptions(typeOptions) {
            return typeOptions.consensus === 'dpos';
        }
    }, {
        key: "onCreateGenesisBlock",
        value: function () {
            var _ref21 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee21(block, storage, genesisOptions) {
                var err, gkvr, rpr, dbr, kvr, denv, ir;
                return _regenerator2.default.wrap(function _callee21$(_context21) {
                    while (1) {
                        switch (_context21.prev = _context21.next) {
                            case 0:
                                _context21.next = 2;
                                return (0, _get3.default)(DposChain.prototype.__proto__ || (0, _getPrototypeOf2.default)(DposChain.prototype), "onCreateGenesisBlock", this).call(this, block, storage, genesisOptions);

                            case 2:
                                err = _context21.sent;

                                if (!err) {
                                    _context21.next = 5;
                                    break;
                                }

                                return _context21.abrupt("return", err);

                            case 5:
                                _context21.next = 7;
                                return storage.getKeyValue(value_chain_1.Chain.dbSystem, value_chain_1.Chain.kvConfig);

                            case 7:
                                gkvr = _context21.sent;

                                if (!gkvr.err) {
                                    _context21.next = 10;
                                    break;
                                }

                                return _context21.abrupt("return", gkvr.err);

                            case 10:
                                _context21.next = 12;
                                return gkvr.kv.set('consensus', 'dpos');

                            case 12:
                                rpr = _context21.sent;

                                if (!rpr.err) {
                                    _context21.next = 15;
                                    break;
                                }

                                return _context21.abrupt("return", rpr.err);

                            case 15:
                                _context21.next = 17;
                                return storage.getReadWritableDatabase(value_chain_1.Chain.dbSystem);

                            case 17:
                                dbr = _context21.sent;

                                if (!dbr.err) {
                                    _context21.next = 20;
                                    break;
                                }

                                return _context21.abrupt("return", dbr.err);

                            case 20:
                                _context21.next = 22;
                                return dbr.value.createKeyValue(consensus.ViewContext.kvDPOS);

                            case 22:
                                kvr = _context21.sent;

                                if (!kvr.err) {
                                    _context21.next = 25;
                                    break;
                                }

                                return _context21.abrupt("return", kvr.err);

                            case 25:
                                denv = new consensus.Context(dbr.value, this.globalOptions, this.m_logger);
                                _context21.next = 28;
                                return denv.init(genesisOptions.candidates, genesisOptions.miners);

                            case 28:
                                ir = _context21.sent;

                                if (!ir.err) {
                                    _context21.next = 31;
                                    break;
                                }

                                return _context21.abrupt("return", ir.err);

                            case 31:
                                return _context21.abrupt("return", error_code_1.ErrorCode.RESULT_OK);

                            case 32:
                            case "end":
                                return _context21.stop();
                        }
                    }
                }, _callee21, this);
            }));

            function onCreateGenesisBlock(_x28, _x29, _x30) {
                return _ref21.apply(this, arguments);
            }

            return onCreateGenesisBlock;
        }()
    }, {
        key: "_broadcastDepth",
        get: function get() {
            return 0;
        }
    }]);
    return DposChain;
}(value_chain_1.ValueChain);

exports.DposChain = DposChain;