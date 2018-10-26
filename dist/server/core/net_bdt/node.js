"use strict";

var _promise = require("babel-runtime/core-js/promise");

var _promise2 = _interopRequireDefault(_promise);

var _stringify = require("babel-runtime/core-js/json/stringify");

var _stringify2 = _interopRequireDefault(_stringify);

var _toConsumableArray2 = require("babel-runtime/helpers/toConsumableArray");

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _regenerator = require("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require("babel-runtime/helpers/asyncToGenerator");

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _assign = require("babel-runtime/core-js/object/assign");

var _assign2 = _interopRequireDefault(_assign);

var _create = require("babel-runtime/core-js/object/create");

var _create2 = _interopRequireDefault(_create);

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
var net_1 = require("../net");
var connection_1 = require("./connection");
var P2P = require('../../../bdt/p2p/p2p');

var _require = require('../../../bdt/base/util.js'),
    NetHelper = _require.NetHelper,
    HashDistance = _require.HashDistance;

var BdtNode = function (_net_1$INode) {
    (0, _inherits3.default)(BdtNode, _net_1$INode);

    // 初始化传入tcp port和udp port，传入0就不监听对应协议
    // @param options { 
    //              logger.level ['off', 'all', 'debug', 'info', 'trace', 'warn']
    // }
    function BdtNode(options) {
        (0, _classCallCheck3.default)(this, BdtNode);

        // vport 只是提供给bdt connect的一个抽象，可以不用在调用时传入
        // 先定死， bdt connect 和 listen都先用这个
        var _this = (0, _possibleConstructorReturn3.default)(this, (BdtNode.__proto__ || (0, _getPrototypeOf2.default)(BdtNode)).call(this, options));

        _this.m_vport = 3000;
        _this.m_skipList = [];
        _this.m_tcpListenPort = options.tcpport;
        _this.m_udpListenPort = options.udpport;
        _this.m_host = options.host;
        _this.m_options = (0, _create2.default)(null);
        (0, _assign2.default)(_this.m_options, options);
        _this.m_skipList.push(options.peerid);
        _this.m_skipList.push(_this.m_options.snPeer.peerid);
        _this.m_bdtStack = undefined;
        return _this;
    }

    (0, _createClass3.default)(BdtNode, [{
        key: "init",
        value: function () {
            var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
                return _regenerator2.default.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                if (!this.m_bdtStack) {
                                    _context.next = 2;
                                    break;
                                }

                                return _context.abrupt("return");

                            case 2:
                                // bdt 的log控制参数
                                P2P.debug({
                                    level: this.m_options.bdtLoggerOptions.level,
                                    file_dir: this.m_options.bdtLoggerOptions.file_dir,
                                    file_name: 'bdt'
                                });
                                // 初始化 bdt
                                _context.next = 5;
                                return this.createBDTStack();

                            case 5:
                            case "end":
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));

            function init() {
                return _ref.apply(this, arguments);
            }

            return init;
        }()
    }, {
        key: "createBDTStack",
        value: function () {
            var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2() {
                var ips, addrList, bdtInitParams, _ref3, result, p2p, bdtStack;

                return _regenerator2.default.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                // let randomPort = DHTUtil.RandomGenerator.integer(65525, 2048);
                                // bdt 里0.0.0.0 只能找到公网ip, 这样会导致单机多进程或单机单进程的节点找不到对方
                                // 为了方便测试， 补充加入本机的内网192 IP
                                ips = NetHelper.getLocalIPV4().filter(function (ip) {
                                    return ip.match(/^192.168.\d+.\d+/);
                                });
                                addrList = [this.m_host].concat((0, _toConsumableArray3.default)(ips));
                                bdtInitParams = {};

                                bdtInitParams['peerid'] = this.m_peerid;
                                bdtInitParams['dhtEntry'] = [this.m_options.snPeer];
                                if (this.m_tcpListenPort !== 0) {
                                    bdtInitParams['tcp'] = {
                                        addrList: addrList,
                                        initPort: this.m_tcpListenPort,
                                        maxPortOffset: 0
                                    };
                                }
                                if (this.m_udpListenPort !== 0) {
                                    bdtInitParams['udp'] = {
                                        addrList: addrList,
                                        initPort: this.m_udpListenPort,
                                        maxPortOffset: 0
                                    };
                                }
                                _context2.next = 9;
                                return P2P.create4BDTStack(bdtInitParams);

                            case 9:
                                _ref3 = _context2.sent;
                                result = _ref3.result;
                                p2p = _ref3.p2p;
                                bdtStack = _ref3.bdtStack;

                                if (!(result !== 0)) {
                                    _context2.next = 15;
                                    break;
                                }

                                throw Error("init p2p peer error " + result + ". please check the params");

                            case 15:
                                this.m_snPeerid = this.m_options.snPeer.peerid;
                                this.m_dht = p2p.m_dht;
                                this.m_bdtStack = bdtStack;
                                // 启动p2p的时候 先把当前peer的ready设置为0， 避免在listen前被其他节点发现并连接
                                this.m_dht.updateLocalPeerAdditionalInfo('ready', 0);

                            case 19:
                            case "end":
                                return _context2.stop();
                        }
                    }
                }, _callee2, this);
            }));

            function createBDTStack() {
                return _ref2.apply(this, arguments);
            }

            return createBDTStack;
        }()
    }, {
        key: "_ready",
        value: function _ready() {
            this.m_dht.updateLocalPeerAdditionalInfo('ready', 1);
        }
        // 通过发现自身， 来找到一些peers, 然后尝试每个握手一下
        // 在测试阶段这种方法实现比较及时, 后面可能考虑用会dht中的randomPeers

    }, {
        key: "randomPeers",
        value: function () {
            var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(count, excludes) {
                var _this2 = this;

                var res, ignore0, peers, peerids, temp_peerids, i, idx, errCode;
                return _regenerator2.default.wrap(function _callee3$(_context3) {
                    while (1) {
                        switch (_context3.prev = _context3.next) {
                            case 0:
                                _context3.next = 2;
                                return this.m_dht.getRandomPeers(count, false);

                            case 2:
                                res = _context3.sent;

                                this.m_logger.info("first find " + res.peerlist.length + " peers, " + (0, _stringify2.default)(res.peerlist.map(function (value) {
                                    return value.peerid;
                                })));
                                ignore0 = !res || !res.peerlist || res.peerlist.length === 0;
                                // 过滤掉自己和种子peer

                                peers = res.peerlist.filter(function (val) {
                                    if (!val.peerid) {
                                        _this2.m_logger.debug("exclude undefined peerid, " + (0, _stringify2.default)(val));
                                        return false;
                                    }
                                    if (_this2.m_skipList.includes(val.peerid)) {
                                        _this2.m_logger.debug("exclude " + val.peerid + " from skipList");
                                        return false;
                                    }
                                    if (excludes.includes(val.peerid)) {
                                        _this2.m_logger.debug("exclude " + val.peerid + " from excludesList");
                                        return false;
                                    }
                                    var ready = val.getAdditionalInfo('ready');
                                    if (ready !== 1) {
                                        _this2.m_logger.debug("exclude " + val.peerid + " not ready");
                                        return false;
                                    }
                                    return true;
                                });
                                peerids = peers.map(function (value) {
                                    return value.peerid;
                                });

                                this.m_logger.info("find " + peerids.length + " peers after filter, count " + count + ", " + (0, _stringify2.default)(peerids));
                                // 如果peer数量比传入的count多， 需要随机截取
                                if (peerids.length > count) {
                                    temp_peerids = [];

                                    for (i = 0; i < count - 1; i++) {
                                        idx = Math.floor(Math.random() * peerids.length);

                                        temp_peerids.push(peerids[idx]);
                                        peerids.splice(idx, 1);
                                    }
                                    peerids = temp_peerids;
                                }
                                errCode = peerids.length > 0 ? error_code_1.ErrorCode.RESULT_OK : error_code_1.ErrorCode.RESULT_SKIPPED;
                                return _context3.abrupt("return", { err: errCode, peers: peerids, ignore0: ignore0 });

                            case 11:
                            case "end":
                                return _context3.stop();
                        }
                    }
                }, _callee3, this);
            }));

            function randomPeers(_x, _x2) {
                return _ref4.apply(this, arguments);
            }

            return randomPeers;
        }()
    }, {
        key: "_connectTo",
        value: function _connectTo(peerid) {
            var _this3 = this;

            var vport = this.m_vport;
            var connection = this.m_bdtStack.newConnection();
            connection.bind(null);
            return new _promise2.default(function (resolve, reject) {
                connection.connect({
                    peerid: peerid,
                    vport: vport
                });
                connection.on(P2P.Connection.EVENT.close, function () {
                    resolve({ err: error_code_1.ErrorCode.RESULT_EXCEPTION });
                });
                connection.on(P2P.Connection.EVENT.error, function (error) {
                    console.log('Connection error', peerid, error);
                    resolve({ err: error_code_1.ErrorCode.RESULT_EXCEPTION });
                });
                connection.on(P2P.Connection.EVENT.connect, function () {
                    var connNodeType = _this3._nodeConnectionType();
                    var connNode = new connNodeType(_this3, { bdt_connection: connection, remote: peerid });
                    resolve({ err: error_code_1.ErrorCode.RESULT_OK, conn: connNode });
                });
            });
        }
    }, {
        key: "_connectionType",
        value: function _connectionType() {
            return connection_1.BdtConnection;
        }
    }, {
        key: "uninit",
        value: function uninit() {
            // TODO:
            return (0, _get3.default)(BdtNode.prototype.__proto__ || (0, _getPrototypeOf2.default)(BdtNode.prototype), "uninit", this).call(this);
        }
    }, {
        key: "listen",
        value: function listen() {
            var _this4 = this;

            return new _promise2.default(function (resolve, reject) {
                var acceptor = _this4.m_bdtStack.newAcceptor({
                    vport: _this4.m_vport
                });
                acceptor.listen();
                // listen 之后 peer ready(上层chain node 已经准备好，被发现)
                _this4._ready();
                acceptor.on(P2P.Acceptor.EVENT.close, function () {
                    acceptor.close();
                });
                acceptor.on(P2P.Acceptor.EVENT.connection, function (bdt_connection) {
                    var remoteObject = bdt_connection.remote;
                    var remote = remoteObject.peerid + ":" + remoteObject.vport;
                    var connNodeType = _this4._nodeConnectionType();
                    var connNode = new connNodeType(_this4, { bdt_connection: bdt_connection, remote: remote });
                    // 调用_onInbound, 将成功的连接保存
                    _this4._onInbound(connNode);
                });
                acceptor.on('error', function () {
                    reject(error_code_1.ErrorCode.RESULT_EXCEPTION);
                });
                resolve(error_code_1.ErrorCode.RESULT_OK);
            });
        }
    }]);
    return BdtNode;
}(net_1.INode);

exports.BdtNode = BdtNode;