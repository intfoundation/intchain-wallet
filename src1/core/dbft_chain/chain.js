"use strict";

var _regenerator = require("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _create = require("babel-runtime/core-js/object/create");

var _create2 = _interopRequireDefault(_create);

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
var util_1 = require("util");
var value_chain_1 = require("../value_chain");
var block_1 = require("./block");
var context_1 = require("./context");
var executor_1 = require("./executor");
var ValueContext = require("../value_chain/context");
var header_storage_1 = require("./header_storage");

var DbftChain = function (_value_chain_1$ValueC) {
    (0, _inherits3.default)(DbftChain, _value_chain_1$ValueC);

    function DbftChain(options) {
        (0, _classCallCheck3.default)(this, DbftChain);
        return (0, _possibleConstructorReturn3.default)(this, (DbftChain.__proto__ || (0, _getPrototypeOf2.default)(DbftChain)).call(this, options));
    }

    (0, _createClass3.default)(DbftChain, [{
        key: "newBlockExecutor",
        value: function () {
            var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee7(block, storage) {
                var _this2 = this;

                var kvBalance, ve, externalContext, context, executor;
                return _regenerator2.default.wrap(function _callee7$(_context7) {
                    while (1) {
                        switch (_context7.prev = _context7.next) {
                            case 0:
                                _context7.next = 2;
                                return storage.getKeyValue(value_chain_1.Chain.dbSystem, value_chain_1.ValueChain.kvBalance);

                            case 2:
                                kvBalance = _context7.sent.kv;
                                ve = new ValueContext.Context(kvBalance);
                                externalContext = (0, _create2.default)(null);

                                externalContext.getBalance = function () {
                                    var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(address) {
                                        return _regenerator2.default.wrap(function _callee$(_context) {
                                            while (1) {
                                                switch (_context.prev = _context.next) {
                                                    case 0:
                                                        _context.next = 2;
                                                        return ve.getBalance(address);

                                                    case 2:
                                                        return _context.abrupt("return", _context.sent);

                                                    case 3:
                                                    case "end":
                                                        return _context.stop();
                                                }
                                            }
                                        }, _callee, _this2);
                                    }));

                                    return function (_x3) {
                                        return _ref2.apply(this, arguments);
                                    };
                                }();
                                externalContext.transferTo = function () {
                                    var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(address, amount) {
                                        return _regenerator2.default.wrap(function _callee2$(_context2) {
                                            while (1) {
                                                switch (_context2.prev = _context2.next) {
                                                    case 0:
                                                        _context2.next = 2;
                                                        return ve.transferTo(value_chain_1.ValueChain.sysAddress, address, amount);

                                                    case 2:
                                                        return _context2.abrupt("return", _context2.sent);

                                                    case 3:
                                                    case "end":
                                                        return _context2.stop();
                                                }
                                            }
                                        }, _callee2, _this2);
                                    }));

                                    return function (_x4, _x5) {
                                        return _ref3.apply(this, arguments);
                                    };
                                }();
                                context = new context_1.DbftContext(storage, this.globalOptions, this.logger);

                                externalContext.register = function () {
                                    var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(address) {
                                        return _regenerator2.default.wrap(function _callee3$(_context3) {
                                            while (1) {
                                                switch (_context3.prev = _context3.next) {
                                                    case 0:
                                                        _context3.next = 2;
                                                        return context.registerToCandidate(block.number, address);

                                                    case 2:
                                                        return _context3.abrupt("return", _context3.sent);

                                                    case 3:
                                                    case "end":
                                                        return _context3.stop();
                                                }
                                            }
                                        }, _callee3, _this2);
                                    }));

                                    return function (_x6) {
                                        return _ref4.apply(this, arguments);
                                    };
                                }();
                                externalContext.unregister = function () {
                                    var _ref5 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4(address) {
                                        return _regenerator2.default.wrap(function _callee4$(_context4) {
                                            while (1) {
                                                switch (_context4.prev = _context4.next) {
                                                    case 0:
                                                        _context4.next = 2;
                                                        return context.unRegisterFromCandidate(address);

                                                    case 2:
                                                        return _context4.abrupt("return", _context4.sent);

                                                    case 3:
                                                    case "end":
                                                        return _context4.stop();
                                                }
                                            }
                                        }, _callee4, _this2);
                                    }));

                                    return function (_x7) {
                                        return _ref5.apply(this, arguments);
                                    };
                                }();
                                externalContext.getMiners = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee5() {
                                    var gm;
                                    return _regenerator2.default.wrap(function _callee5$(_context5) {
                                        while (1) {
                                            switch (_context5.prev = _context5.next) {
                                                case 0:
                                                    _context5.next = 2;
                                                    return context.getMiners();

                                                case 2:
                                                    gm = _context5.sent;

                                                    if (!gm.err) {
                                                        _context5.next = 5;
                                                        break;
                                                    }

                                                    throw Error('newBlockExecutor getMiners failed errcode ${gm.err}');

                                                case 5:
                                                    return _context5.abrupt("return", gm.miners);

                                                case 6:
                                                case "end":
                                                    return _context5.stop();
                                            }
                                        }
                                    }, _callee5, _this2);
                                }));
                                externalContext.isMiner = function () {
                                    var _ref7 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee6(address) {
                                        var im;
                                        return _regenerator2.default.wrap(function _callee6$(_context6) {
                                            while (1) {
                                                switch (_context6.prev = _context6.next) {
                                                    case 0:
                                                        _context6.next = 2;
                                                        return context.isMiner(address);

                                                    case 2:
                                                        im = _context6.sent;

                                                        if (!im.err) {
                                                            _context6.next = 5;
                                                            break;
                                                        }

                                                        throw Error('newBlockExecutor isMiner failed errcode ${gm.err}');

                                                    case 5:
                                                        return _context6.abrupt("return", im.isminer);

                                                    case 6:
                                                    case "end":
                                                        return _context6.stop();
                                                }
                                            }
                                        }, _callee6, _this2);
                                    }));

                                    return function (_x8) {
                                        return _ref7.apply(this, arguments);
                                    };
                                }();
                                executor = new executor_1.DbftBlockExecutor({ logger: this.logger, block: block, storage: storage, handler: this.handler, externContext: externalContext, globalOptions: this.globalOptions });
                                return _context7.abrupt("return", { err: error_code_1.ErrorCode.RESULT_OK, executor: executor });

                            case 14:
                            case "end":
                                return _context7.stop();
                        }
                    }
                }, _callee7, this);
            }));

            function newBlockExecutor(_x, _x2) {
                return _ref.apply(this, arguments);
            }

            return newBlockExecutor;
        }()
    }, {
        key: "newViewExecutor",
        value: function () {
            var _ref8 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee10(header, storage, method, param) {
                var _this3 = this;

                var nvex, externalContext, dbftProxy;
                return _regenerator2.default.wrap(function _callee10$(_context10) {
                    while (1) {
                        switch (_context10.prev = _context10.next) {
                            case 0:
                                _context10.next = 2;
                                return (0, _get3.default)(DbftChain.prototype.__proto__ || (0, _getPrototypeOf2.default)(DbftChain.prototype), "newViewExecutor", this).call(this, header, storage, method, param);

                            case 2:
                                nvex = _context10.sent;
                                externalContext = nvex.executor.externContext;
                                dbftProxy = new context_1.DbftContext(storage, this.globalOptions, this.logger);

                                externalContext.getMiners = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee8() {
                                    var gm;
                                    return _regenerator2.default.wrap(function _callee8$(_context8) {
                                        while (1) {
                                            switch (_context8.prev = _context8.next) {
                                                case 0:
                                                    _context8.next = 2;
                                                    return dbftProxy.getMiners();

                                                case 2:
                                                    gm = _context8.sent;

                                                    if (!gm.err) {
                                                        _context8.next = 5;
                                                        break;
                                                    }

                                                    throw Error('newBlockExecutor getMiners failed errcode ${gm.err}');

                                                case 5:
                                                    return _context8.abrupt("return", gm.miners);

                                                case 6:
                                                case "end":
                                                    return _context8.stop();
                                            }
                                        }
                                    }, _callee8, _this3);
                                }));
                                externalContext.isMiner = function () {
                                    var _ref10 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee9(address) {
                                        var im;
                                        return _regenerator2.default.wrap(function _callee9$(_context9) {
                                            while (1) {
                                                switch (_context9.prev = _context9.next) {
                                                    case 0:
                                                        _context9.next = 2;
                                                        return dbftProxy.isMiner(address);

                                                    case 2:
                                                        im = _context9.sent;

                                                        if (!im.err) {
                                                            _context9.next = 5;
                                                            break;
                                                        }

                                                        throw Error('newBlockExecutor isMiner failed errcode ${gm.err}');

                                                    case 5:
                                                        return _context9.abrupt("return", im.isminer);

                                                    case 6:
                                                    case "end":
                                                        return _context9.stop();
                                                }
                                            }
                                        }, _callee9, _this3);
                                    }));

                                    return function (_x13) {
                                        return _ref10.apply(this, arguments);
                                    };
                                }();
                                return _context10.abrupt("return", nvex);

                            case 8:
                            case "end":
                                return _context10.stop();
                        }
                    }
                }, _callee10, this);
            }));

            function newViewExecutor(_x9, _x10, _x11, _x12) {
                return _ref8.apply(this, arguments);
            }

            return newViewExecutor;
        }()
    }, {
        key: "uninitComponents",
        value: function () {
            var _ref11 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee11() {
                return _regenerator2.default.wrap(function _callee11$(_context11) {
                    while (1) {
                        switch (_context11.prev = _context11.next) {
                            case 0:
                                if (this.m_dbftHeaderStorage) {
                                    this.m_dbftHeaderStorage.uninit();
                                    delete this.m_dbftHeaderStorage;
                                }
                                _context11.next = 3;
                                return (0, _get3.default)(DbftChain.prototype.__proto__ || (0, _getPrototypeOf2.default)(DbftChain.prototype), "uninitComponents", this).call(this);

                            case 3:
                            case "end":
                                return _context11.stop();
                        }
                    }
                }, _callee11, this);
            }));

            function uninitComponents() {
                return _ref11.apply(this, arguments);
            }

            return uninitComponents;
        }()
    }, {
        key: "_getBlockHeaderType",
        value: function _getBlockHeaderType() {
            return block_1.DbftBlockHeader;
        }
    }, {
        key: "_onVerifiedBlock",
        value: function () {
            var _ref12 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee12(block) {
                return _regenerator2.default.wrap(function _callee12$(_context12) {
                    while (1) {
                        switch (_context12.prev = _context12.next) {
                            case 0:
                                return _context12.abrupt("return", this.m_dbftHeaderStorage.addHeader(block.header, this.m_storageManager));

                            case 1:
                            case "end":
                                return _context12.stop();
                        }
                    }
                }, _callee12, this);
            }));

            function _onVerifiedBlock(_x14) {
                return _ref12.apply(this, arguments);
            }

            return _onVerifiedBlock;
        }()
    }, {
        key: "_onLoadGlobalOptions",
        value: function () {
            var _ref13 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee13() {
                var err;
                return _regenerator2.default.wrap(function _callee13$(_context13) {
                    while (1) {
                        switch (_context13.prev = _context13.next) {
                            case 0:
                                this.m_dbftHeaderStorage = new header_storage_1.DbftHeaderStorage({
                                    db: this.m_db,
                                    headerStorage: this.m_headerStorage,
                                    globalOptions: this.globalOptions,
                                    logger: this.logger
                                });
                                _context13.next = 3;
                                return this.m_dbftHeaderStorage.init();

                            case 3:
                                err = _context13.sent;

                                if (err) {
                                    this.logger.error("dbft header storage init err ", err);
                                }
                                return _context13.abrupt("return", err);

                            case 6:
                            case "end":
                                return _context13.stop();
                        }
                    }
                }, _callee13, this);
            }));

            function _onLoadGlobalOptions() {
                return _ref13.apply(this, arguments);
            }

            return _onLoadGlobalOptions;
        }()
    }, {
        key: "_onCheckGlobalOptions",
        value: function _onCheckGlobalOptions(globalOptions) {
            if (!(0, _get3.default)(DbftChain.prototype.__proto__ || (0, _getPrototypeOf2.default)(DbftChain.prototype), "_onCheckGlobalOptions", this).call(this, globalOptions)) {
                return false;
            }
            if (util_1.isNullOrUndefined(globalOptions.minValidator)) {
                this.m_logger.error("globalOptions should has minValidator");
                return false;
            }
            if (util_1.isNullOrUndefined(globalOptions.maxValidator)) {
                this.m_logger.error("globalOptions should has maxValidator");
                return false;
            }
            if (util_1.isNullOrUndefined(globalOptions.reSelectionBlocks)) {
                this.m_logger.error("globalOptions should has reSelectionBlocks");
                return false;
            }
            if (util_1.isNullOrUndefined(globalOptions.blockInterval)) {
                this.m_logger.error("globalOptions should has blockInterval");
                return false;
            }
            if (util_1.isNullOrUndefined(globalOptions.minWaitBlocksToMiner)) {
                this.m_logger.error("globalOptions should has minWaitBlocksToMiner");
                return false;
            }
            if (util_1.isNullOrUndefined(globalOptions.superAdmin)) {
                this.m_logger.error("globalOptions should has superAdmin");
                return false;
            }
            if (util_1.isNullOrUndefined(globalOptions.agreeRate)) {
                this.m_logger.error("globalOptions should has superAdmin");
                return false;
            }
            if (util_1.isNullOrUndefined(globalOptions.systemAddress)) {
                this.m_logger.error("globalOptions should has systemAddress");
                return false;
            }
            return true;
        }
    }, {
        key: "_onCheckTypeOptions",
        value: function _onCheckTypeOptions(typeOptions) {
            return typeOptions.consensus === 'dbft';
        }
    }, {
        key: "onCreateGenesisBlock",
        value: function () {
            var _ref14 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee14(block, storage, genesisOptions) {
                var err, gkvr, rpr, dbr, kvr, denv, ir;
                return _regenerator2.default.wrap(function _callee14$(_context14) {
                    while (1) {
                        switch (_context14.prev = _context14.next) {
                            case 0:
                                _context14.next = 2;
                                return (0, _get3.default)(DbftChain.prototype.__proto__ || (0, _getPrototypeOf2.default)(DbftChain.prototype), "onCreateGenesisBlock", this).call(this, block, storage, genesisOptions);

                            case 2:
                                err = _context14.sent;

                                if (!err) {
                                    _context14.next = 5;
                                    break;
                                }

                                return _context14.abrupt("return", err);

                            case 5:
                                _context14.next = 7;
                                return storage.getKeyValue(value_chain_1.Chain.dbSystem, value_chain_1.Chain.kvConfig);

                            case 7:
                                gkvr = _context14.sent;

                                if (!gkvr.err) {
                                    _context14.next = 10;
                                    break;
                                }

                                return _context14.abrupt("return", gkvr.err);

                            case 10:
                                _context14.next = 12;
                                return gkvr.kv.set('consensus', 'dbft');

                            case 12:
                                rpr = _context14.sent;

                                if (!rpr.err) {
                                    _context14.next = 15;
                                    break;
                                }

                                return _context14.abrupt("return", rpr.err);

                            case 15:
                                _context14.next = 17;
                                return storage.getReadWritableDatabase(value_chain_1.Chain.dbSystem);

                            case 17:
                                dbr = _context14.sent;

                                if (!dbr.err) {
                                    _context14.next = 20;
                                    break;
                                }

                                return _context14.abrupt("return", dbr.err);

                            case 20:
                                _context14.next = 22;
                                return dbr.value.createKeyValue(context_1.DbftContext.kvDBFT);

                            case 22:
                                kvr = _context14.sent;

                                if (!kvr.err) {
                                    _context14.next = 25;
                                    break;
                                }

                                return _context14.abrupt("return", kvr.err);

                            case 25:
                                denv = new context_1.DbftContext(storage, this.globalOptions, this.m_logger);
                                _context14.next = 28;
                                return denv.init(genesisOptions.miners);

                            case 28:
                                ir = _context14.sent;

                                if (!ir.err) {
                                    _context14.next = 31;
                                    break;
                                }

                                return _context14.abrupt("return", ir.err);

                            case 31:
                                return _context14.abrupt("return", error_code_1.ErrorCode.RESULT_OK);

                            case 32:
                            case "end":
                                return _context14.stop();
                        }
                    }
                }, _callee14, this);
            }));

            function onCreateGenesisBlock(_x15, _x16, _x17) {
                return _ref14.apply(this, arguments);
            }

            return onCreateGenesisBlock;
        }()
    }, {
        key: "dbftHeaderStorage",
        get: function get() {
            return this.m_dbftHeaderStorage;
        }
    }]);
    return DbftChain;
}(value_chain_1.ValueChain);

exports.DbftChain = DbftChain;