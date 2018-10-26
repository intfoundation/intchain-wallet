"use strict";

var _regenerator = require("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require("babel-runtime/helpers/asyncToGenerator");

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _map = require("babel-runtime/core-js/map");

var _map2 = _interopRequireDefault(_map);

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("babel-runtime/helpers/createClass");

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

Object.defineProperty(exports, "__esModule", { value: true });
var error_code_1 = require("./error_code");
var logger_util_1 = require("./lib/logger_util");
var path = require("path");
var fs = require("fs-extra");
var process = require("process");

var ChainCreator = function () {
    function ChainCreator(options) {
        (0, _classCallCheck3.default)(this, ChainCreator);

        this.m_instances = new _map2.default();
        this.m_logger = logger_util_1.initLogger(options);
    }

    (0, _createClass3.default)(ChainCreator, [{
        key: "registerChainType",
        value: function registerChainType(consesus, instance) {
            this.m_instances.set(consesus, instance);
        }
    }, {
        key: "_getTypeInstance",
        value: function _getTypeInstance(typeOptions) {
            var ins = this.m_instances.get(typeOptions.consensus);
            if (!ins) {
                this.m_logger.error("chain creator has no register consensus named " + typeOptions.consensus);
                return undefined;
            }
            return ins;
        }
    }, {
        key: "createGenesis",
        value: function () {
            var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(packagePath, dataDir, genesisOptions) {
                var externalHandler = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

                var configPath, _config, cmir, lcr, err;

                return _regenerator2.default.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                if (!path.isAbsolute(dataDir)) {
                                    dataDir = path.join(process.cwd(), dataDir);
                                }
                                if (!path.isAbsolute(packagePath)) {
                                    packagePath = path.join(process.cwd(), packagePath);
                                }
                                fs.ensureDirSync(dataDir);
                                if (externalHandler) {
                                    configPath = path.join(packagePath, 'config.json');

                                    try {
                                        _config = fs.readJSONSync(configPath);

                                        _config['handler'] = path.join(packagePath, _config['handler']);
                                        fs.writeJSONSync(path.join(dataDir, 'config.json'), _config, { spaces: 4, flag: 'w' });
                                    } catch (e) {
                                        this.m_logger.error("load " + configPath + " failed for", e);
                                    }
                                } else {
                                    fs.copySync(packagePath, dataDir);
                                }
                                _context.next = 6;
                                return this.createMinerInstance(dataDir);

                            case 6:
                                cmir = _context.sent;

                                if (!cmir.err) {
                                    _context.next = 9;
                                    break;
                                }

                                return _context.abrupt("return", { err: cmir.err });

                            case 9:
                                lcr = this._loadConfig(dataDir);

                                if (!lcr.err) {
                                    _context.next = 12;
                                    break;
                                }

                                return _context.abrupt("return", { err: lcr.err });

                            case 12:
                                _context.next = 14;
                                return cmir.miner.create(lcr.config.globalOptions, genesisOptions);

                            case 14:
                                err = _context.sent;

                                if (!err) {
                                    _context.next = 17;
                                    break;
                                }

                                return _context.abrupt("return", { err: err });

                            case 17:
                                return _context.abrupt("return", { err: error_code_1.ErrorCode.RESULT_OK, miner: cmir.miner });

                            case 18:
                            case "end":
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));

            function createGenesis(_x, _x2, _x3) {
                return _ref.apply(this, arguments);
            }

            return createGenesis;
        }()
    }, {
        key: "_loadConfig",
        value: function _loadConfig(dataDir) {
            var configPath = path.join(dataDir, 'config.json');
            var constConfig = void 0;
            try {
                constConfig = fs.readJsonSync(configPath);
            } catch (e) {
                this.m_logger.error("can't get config from package " + dataDir + " for " + e.message);
                return { err: error_code_1.ErrorCode.RESULT_EXCEPTION };
            }
            if (!constConfig['handler']) {
                this.m_logger.error("can't get handler from package " + dataDir + "/config.json");
                return { err: error_code_1.ErrorCode.RESULT_EXCEPTION };
            }
            var handlerPath = constConfig['handler'];
            if (!path.isAbsolute(handlerPath)) {
                handlerPath = path.join(dataDir, handlerPath);
            }
            var typeOptions = constConfig['type'];
            if (!typeOptions || !typeOptions.consensus || !typeOptions.features) {
                this.m_logger.error("invalid type from package " + dataDir);
                return { err: error_code_1.ErrorCode.RESULT_EXCEPTION };
            }
            var handler = this._loadHandler(handlerPath, typeOptions);
            if (!handler) {
                return { err: error_code_1.ErrorCode.RESULT_EXCEPTION };
            }
            var globalOptions = constConfig['global'];
            if (!globalOptions) {
                globalOptions = {};
            }
            return {
                err: error_code_1.ErrorCode.RESULT_OK,
                config: {
                    handler: handler,
                    typeOptions: typeOptions,
                    globalOptions: globalOptions
                }
            };
        }
    }, {
        key: "_loadHandler",
        value: function _loadHandler(handlerPath, typeOptions) {
            var instance = this._getTypeInstance(typeOptions);
            if (!instance) {
                return undefined;
            }
            var handler = instance.newHandler(this, typeOptions);
            try {
                // 兼容VSCode调试器和命令行环境，win32下handlerPath的盘符需要和process.cwd返回的盘符大小写一致
                // VScode环境下，cwd返回小写盘符，命令行环境下，cwd返回小写盘符
                var cwdPath = process.cwd().split(':', 2);
                if (cwdPath.length === 2) {
                    var isLower = cwdPath[0] >= 'a' && cwdPath[0] <= 'z';
                    var pathsplitter = handlerPath.split(':', 2);
                    if (pathsplitter.length === 2) {
                        pathsplitter[0] = isLower ? pathsplitter[0].toLowerCase() : pathsplitter[0].toUpperCase();
                    }
                    handlerPath = pathsplitter.join(':');
                }
                var handlerMod = require(handlerPath);
                handlerMod.registerHandler(handler);
            } catch (e) {
                console.error("handler error: " + e.message);
                return undefined;
            }
            return handler;
        }
    }, {
        key: "createMinerInstance",
        value: function () {
            var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(dataDir) {
                var lcr, instance, miner, err;
                return _regenerator2.default.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                if (!path.isAbsolute(dataDir)) {
                                    dataDir = path.join(process.cwd(), dataDir);
                                }
                                lcr = this._loadConfig(dataDir);

                                if (!lcr.err) {
                                    _context2.next = 4;
                                    break;
                                }

                                return _context2.abrupt("return", { err: lcr.err });

                            case 4:
                                instance = this._getTypeInstance(lcr.config.typeOptions);

                                if (instance) {
                                    _context2.next = 7;
                                    break;
                                }

                                return _context2.abrupt("return", { err: error_code_1.ErrorCode.RESULT_INVALID_TYPE });

                            case 7:
                                miner = instance.newMiner(this, lcr.config.typeOptions);
                                _context2.next = 10;
                                return miner.initComponents(dataDir, lcr.config.handler);

                            case 10:
                                err = _context2.sent;

                                if (!err) {
                                    _context2.next = 13;
                                    break;
                                }

                                return _context2.abrupt("return", { err: err });

                            case 13:
                                return _context2.abrupt("return", { err: error_code_1.ErrorCode.RESULT_OK, miner: miner, globalOptions: lcr.config.globalOptions });

                            case 14:
                            case "end":
                                return _context2.stop();
                        }
                    }
                }, _callee2, this);
            }));

            function createMinerInstance(_x5) {
                return _ref2.apply(this, arguments);
            }

            return createMinerInstance;
        }()
    }, {
        key: "createChainInstance",
        value: function () {
            var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(dataDir, options) {
                var lcr, instance, chain, err;
                return _regenerator2.default.wrap(function _callee3$(_context3) {
                    while (1) {
                        switch (_context3.prev = _context3.next) {
                            case 0:
                                if (!path.isAbsolute(dataDir)) {
                                    dataDir = path.join(process.cwd(), dataDir);
                                }
                                lcr = this._loadConfig(dataDir);

                                if (!lcr.err) {
                                    _context3.next = 4;
                                    break;
                                }

                                return _context3.abrupt("return", { err: lcr.err });

                            case 4:
                                instance = this._getTypeInstance(lcr.config.typeOptions);

                                if (instance) {
                                    _context3.next = 7;
                                    break;
                                }

                                return _context3.abrupt("return", { err: error_code_1.ErrorCode.RESULT_INVALID_TYPE });

                            case 7:
                                chain = instance.newChain(this, lcr.config.typeOptions);
                                _context3.next = 10;
                                return chain.initComponents(dataDir, lcr.config.handler, options);

                            case 10:
                                err = _context3.sent;

                                if (!err) {
                                    _context3.next = 13;
                                    break;
                                }

                                return _context3.abrupt("return", { err: err });

                            case 13:
                                return _context3.abrupt("return", { err: error_code_1.ErrorCode.RESULT_OK, chain: chain, globalOptions: lcr.config.globalOptions });

                            case 14:
                            case "end":
                                return _context3.stop();
                        }
                    }
                }, _callee3, this);
            }));

            function createChainInstance(_x6, _x7) {
                return _ref3.apply(this, arguments);
            }

            return createChainInstance;
        }()
    }, {
        key: "logger",
        get: function get() {
            return this.m_logger;
        }
    }]);
    return ChainCreator;
}();

exports.ChainCreator = ChainCreator;