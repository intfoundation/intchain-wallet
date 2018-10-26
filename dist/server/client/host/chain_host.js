"use strict";

var _create = require("babel-runtime/core-js/object/create");

var _create2 = _interopRequireDefault(_create);

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
var path = require("path");
var fs = require("fs-extra");
var core_1 = require("../../core");
var rpc_1 = require("./rpc");

var ChainHost = function () {
    function ChainHost() {
        (0, _classCallCheck3.default)(this, ChainHost);

        this.m_net = new _map2.default();
    }

    (0, _createClass3.default)(ChainHost, [{
        key: "initMiner",
        value: function () {
            var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(commandOptions) {
                var dataDir, logger, creator, cr, node, pr, err;
                return _regenerator2.default.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                dataDir = this._parseDataDir(commandOptions);

                                if (dataDir) {
                                    _context.next = 4;
                                    break;
                                }

                                console.error('chain_host initMiner fail _parseDataDir');
                                return _context.abrupt("return", false);

                            case 4:
                                logger = this._parseLogger(dataDir, commandOptions);
                                creator = core_1.initChainCreator({ logger: logger });
                                _context.next = 8;
                                return creator.createMinerInstance(dataDir);

                            case 8:
                                cr = _context.sent;

                                if (!cr.err) {
                                    _context.next = 12;
                                    break;
                                }

                                console.error('chain_host initMiner fail createMinerInstance');
                                return _context.abrupt("return", false);

                            case 12:
                                node = this._parseNode(commandOptions);

                                if (node) {
                                    _context.next = 16;
                                    break;
                                }

                                console.error('chain_host initMiner fail _parseNode');
                                return _context.abrupt("return", false);

                            case 16:
                                pr = cr.miner.parseInstanceOptions(node, commandOptions);

                                if (!pr.err) {
                                    _context.next = 20;
                                    break;
                                }

                                console.error('chain_host initMiner fail parseInstanceOptions');
                                return _context.abrupt("return", false);

                            case 20:
                                _context.next = 22;
                                return cr.miner.initialize(pr.value);

                            case 22:
                                err = _context.sent;

                                if (!err) {
                                    _context.next = 26;
                                    break;
                                }

                                console.error('chain_host initMiner fail initialize');
                                return _context.abrupt("return", false);

                            case 26:
                                this.m_server = new rpc_1.ChainServer(logger, cr.miner.chain, cr.miner);
                                this.m_server.init(commandOptions);
                                return _context.abrupt("return", true);

                            case 29:
                            case "end":
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));

            function initMiner(_x) {
                return _ref.apply(this, arguments);
            }

            return initMiner;
        }()
    }, {
        key: "initPeer",
        value: function () {
            var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(commandOptions) {
                var dataDir, logger, creator, cr, node, pr, err;
                return _regenerator2.default.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                dataDir = this._parseDataDir(commandOptions);

                                if (dataDir) {
                                    _context2.next = 3;
                                    break;
                                }

                                return _context2.abrupt("return", false);

                            case 3:
                                logger = this._parseLogger(dataDir, commandOptions);
                                creator = core_1.initChainCreator({ logger: logger });
                                _context2.next = 7;
                                return creator.createChainInstance(dataDir);

                            case 7:
                                cr = _context2.sent;

                                if (!cr.err) {
                                    _context2.next = 10;
                                    break;
                                }

                                return _context2.abrupt("return", false);

                            case 10:
                                node = this._parseNode(commandOptions);

                                if (node) {
                                    _context2.next = 13;
                                    break;
                                }

                                return _context2.abrupt("return", false);

                            case 13:
                                pr = cr.chain.parseInstanceOptions(node, commandOptions);

                                if (!pr.err) {
                                    _context2.next = 16;
                                    break;
                                }

                                return _context2.abrupt("return", false);

                            case 16:
                                _context2.next = 18;
                                return cr.chain.initialize(pr.value);

                            case 18:
                                err = _context2.sent;

                                if (!err) {
                                    _context2.next = 21;
                                    break;
                                }

                                return _context2.abrupt("return", false);

                            case 21:
                                this.m_server = new rpc_1.ChainServer(logger, cr.chain);
                                this.m_server.init(commandOptions);
                                return _context2.abrupt("return", true);

                            case 24:
                            case "end":
                                return _context2.stop();
                        }
                    }
                }, _callee2, this);
            }));

            function initPeer(_x2) {
                return _ref2.apply(this, arguments);
            }

            return initPeer;
        }()
    }, {
        key: "createGenesis",
        value: function () {
            var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(commandOptions) {
                var _package, dataDir, logger, creator, genesisOptions, _path, cr;

                return _regenerator2.default.wrap(function _callee3$(_context3) {
                    while (1) {
                        switch (_context3.prev = _context3.next) {
                            case 0:
                                if (commandOptions.get('package')) {
                                    _context3.next = 3;
                                    break;
                                }

                                console.error(ChainHost.CREATE_TIP);
                                return _context3.abrupt("return", false);

                            case 3:
                                _package = commandOptions.get('package');

                                if (!path.isAbsolute(_package)) {
                                    _package = path.join(process.cwd(), _package);
                                }

                                if (commandOptions.get('dataDir')) {
                                    _context3.next = 8;
                                    break;
                                }

                                console.error(ChainHost.CREATE_TIP);
                                return _context3.abrupt("return", false);

                            case 8:
                                dataDir = commandOptions.get('dataDir');

                                if (!path.isAbsolute(dataDir)) {
                                    dataDir = path.join(process.cwd(), dataDir);
                                }

                                if (fs.existsSync(dataDir)) {
                                    _context3.next = 14;
                                    break;
                                }

                                fs.ensureDirSync(dataDir);
                                _context3.next = 20;
                                break;

                            case 14:
                                if (!commandOptions.get('forceClean')) {
                                    _context3.next = 18;
                                    break;
                                }

                                fs.removeSync(dataDir);
                                _context3.next = 20;
                                break;

                            case 18:
                                console.error("dataDir already exsits");
                                return _context3.abrupt("return", false);

                            case 20:
                                logger = this._parseLogger(dataDir, commandOptions);
                                creator = core_1.initChainCreator({ logger: logger });
                                genesisOptions = void 0;

                                if (commandOptions.get('genesisConfig')) {
                                    _path = commandOptions.get('genesisConfig');

                                    if (!path.isAbsolute(_path)) {
                                        _path = path.join(process.cwd(), _path);
                                    }
                                    genesisOptions = fs.readJsonSync(_path);
                                }
                                _context3.next = 26;
                                return creator.createGenesis(_package, dataDir, genesisOptions, commandOptions.get('externalHandler'));

                            case 26:
                                cr = _context3.sent;

                                if (!cr.err) {
                                    _context3.next = 29;
                                    break;
                                }

                                return _context3.abrupt("return", false);

                            case 29:
                                return _context3.abrupt("return", true);

                            case 30:
                            case "end":
                                return _context3.stop();
                        }
                    }
                }, _callee3, this);
            }));

            function createGenesis(_x3) {
                return _ref3.apply(this, arguments);
            }

            return createGenesis;
        }()
    }, {
        key: "_parseLogger",
        value: function _parseLogger(dataDir, commandOptions) {
            var loggerOptions = (0, _create2.default)(null);
            loggerOptions.console = false;
            loggerOptions.level = 'error';
            if (commandOptions.get('loggerConsole')) {
                loggerOptions.console = true;
            }
            if (commandOptions.get('loggerLevel')) {
                loggerOptions.level = commandOptions.get('loggerLevel');
            }
            var loggerPath = path.join(dataDir, 'log');
            fs.ensureDir(loggerPath);
            loggerOptions.file = { root: loggerPath };
            return core_1.initLogger({ loggerOptions: loggerOptions });
        }
    }, {
        key: "_parseNode",
        value: function _parseNode(commandOptions) {
            if (commandOptions.get('net')) {
                var ni = this.m_net.get(commandOptions.get('net'));
                if (!ni) {
                    console.error('invalid net');
                    return undefined;
                }
                return ni(commandOptions);
            }
        }
    }, {
        key: "_parseDataDir",
        value: function _parseDataDir(commandOptions) {
            var dataDir = commandOptions.get('dataDir');
            if (!dataDir) {
                return undefined;
            }
            if (!path.isAbsolute(dataDir)) {
                dataDir = path.join(process.cwd(), dataDir);
            }
            if (commandOptions.has('forceClean')) {
                fs.removeSync(dataDir);
            }
            if (core_1.Chain.dataDirValid(dataDir)) {
                return dataDir;
            } else {
                fs.ensureDirSync(dataDir);
            }
            if (!commandOptions.get('genesis')) {
                console.error('no genesis');
                return undefined;
            }
            var _path = commandOptions.get('genesis');
            if (!path.isAbsolute(_path)) {
                _path = path.join(process.cwd(), _path);
            }
            fs.copySync(_path, dataDir);
            return dataDir;
        }
    }, {
        key: "registerNet",
        value: function registerNet(net, instance) {
            this.m_net.set(net, instance);
        }
    }]);
    return ChainHost;
}();

ChainHost.CREATE_TIP = "command: createGenesis --package [packageDir] --dataDir [dataDir] --[genesisConfig] [genesisConfig] --[externalHandler]";
exports.ChainHost = ChainHost;