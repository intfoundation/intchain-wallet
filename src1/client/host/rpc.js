"use strict";

var _regenerator = require("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _stringify = require("babel-runtime/core-js/json/stringify");

var _stringify2 = _interopRequireDefault(_stringify);

var _asyncToGenerator2 = require("babel-runtime/helpers/asyncToGenerator");

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("babel-runtime/helpers/createClass");

var _createClass3 = _interopRequireDefault(_createClass2);

var _promise = require("babel-runtime/core-js/promise");

var _promise2 = _interopRequireDefault(_promise);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

Object.defineProperty(exports, "__esModule", { value: true });
var rpc_server_1 = require("../lib/rpc_server");
var core_1 = require("../../core");
var util_1 = require("util");
function promisify(f) {
    var _arguments = arguments;

    return function () {
        var args = Array.prototype.slice.call(_arguments);
        return new _promise2.default(function (resolve, reject) {
            args.push(function (err, result) {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
            f.apply(null, args);
        });
    };
}

var ChainServer = function () {
    function ChainServer(logger, chain, miner) {
        (0, _classCallCheck3.default)(this, ChainServer);

        this.m_chain = chain;
        this.m_miner = miner;
        this.m_logger = logger;
    }

    (0, _createClass3.default)(ChainServer, [{
        key: "init",
        value: function init(commandOptions) {
            var host = commandOptions.get('rpchost');
            if (!host) {
                return false;
            }
            var port = commandOptions.get('rpcport');
            if (!port) {
                return false;
            }
            this.m_server = new rpc_server_1.RPCServer(host, parseInt(port, 10));
            this._initMethods();
            this.m_server.start();
            return true;
        }
    }, {
        key: "_initMethods",
        value: function _initMethods() {
            var _this = this;

            this.m_server.on('sendTransaction', function () {
                var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(params, resp) {
                    var tx, err;
                    return _regenerator2.default.wrap(function _callee$(_context) {
                        while (1) {
                            switch (_context.prev = _context.next) {
                                case 0:
                                    tx = new core_1.ValueTransaction();
                                    err = tx.decode(new core_1.BufferReader(Buffer.from(params.tx, 'hex')));

                                    if (!err) {
                                        _context.next = 7;
                                        break;
                                    }

                                    _context.next = 5;
                                    return promisify(resp.write.bind(resp)((0, _stringify2.default)(err)));

                                case 5:
                                    _context.next = 12;
                                    break;

                                case 7:
                                    _context.next = 9;
                                    return _this.m_chain.addTransaction(tx);

                                case 9:
                                    err = _context.sent;
                                    _context.next = 12;
                                    return promisify(resp.write.bind(resp)((0, _stringify2.default)(err)));

                                case 12:
                                    _context.next = 14;
                                    return promisify(resp.end.bind(resp)());

                                case 14:
                                case "end":
                                    return _context.stop();
                            }
                        }
                    }, _callee, _this);
                }));

                return function (_x, _x2) {
                    return _ref.apply(this, arguments);
                };
            }());
            this.m_server.on('getTransactionReceipt', function () {
                var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(params, resp) {
                    var cr;
                    return _regenerator2.default.wrap(function _callee2$(_context2) {
                        while (1) {
                            switch (_context2.prev = _context2.next) {
                                case 0:
                                    _context2.next = 2;
                                    return _this.m_chain.getTransactionReceipt(params.tx);

                                case 2:
                                    cr = _context2.sent;

                                    if (!cr.err) {
                                        _context2.next = 8;
                                        break;
                                    }

                                    _context2.next = 6;
                                    return promisify(resp.write.bind(resp)((0, _stringify2.default)({ err: cr.err })));

                                case 6:
                                    _context2.next = 10;
                                    break;

                                case 8:
                                    _context2.next = 10;
                                    return promisify(resp.write.bind(resp)((0, _stringify2.default)({
                                        err: core_1.ErrorCode.RESULT_OK,
                                        block: cr.block.stringify(),
                                        tx: cr.tx.stringify(),
                                        receipt: cr.receipt.stringify()
                                    })));

                                case 10:
                                    _context2.next = 12;
                                    return promisify(resp.end.bind(resp)());

                                case 12:
                                case "end":
                                    return _context2.stop();
                            }
                        }
                    }, _callee2, _this);
                }));

                return function (_x3, _x4) {
                    return _ref2.apply(this, arguments);
                };
            }());
            this.m_server.on('getNonce', function () {
                var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(params, resp) {
                    var nonce;
                    return _regenerator2.default.wrap(function _callee3$(_context3) {
                        while (1) {
                            switch (_context3.prev = _context3.next) {
                                case 0:
                                    _context3.next = 2;
                                    return _this.m_chain.getNonce(params.address);

                                case 2:
                                    nonce = _context3.sent;
                                    _context3.next = 5;
                                    return promisify(resp.write.bind(resp)((0, _stringify2.default)(nonce)));

                                case 5:
                                    _context3.next = 7;
                                    return promisify(resp.end.bind(resp)());

                                case 7:
                                case "end":
                                    return _context3.stop();
                            }
                        }
                    }, _callee3, _this);
                }));

                return function (_x5, _x6) {
                    return _ref3.apply(this, arguments);
                };
            }());
            this.m_server.on('view', function () {
                var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4(params, resp) {
                    var cr, s;
                    return _regenerator2.default.wrap(function _callee4$(_context4) {
                        while (1) {
                            switch (_context4.prev = _context4.next) {
                                case 0:
                                    _context4.next = 2;
                                    return _this.m_chain.view(util_1.isUndefined(params.from) ? 'latest' : params.from, params.method, params.params);

                                case 2:
                                    cr = _context4.sent;

                                    if (!cr.err) {
                                        _context4.next = 8;
                                        break;
                                    }

                                    _context4.next = 6;
                                    return promisify(resp.write.bind(resp)((0, _stringify2.default)({ err: cr.err })));

                                case 6:
                                    _context4.next = 12;
                                    break;

                                case 8:
                                    s = void 0;

                                    try {
                                        s = core_1.toStringifiable(cr.value, true);
                                        cr.value = s;
                                    } catch (e) {
                                        _this.m_logger.error("call view " + params + " returns " + cr.value + " isn't stringifiable");
                                        cr.err = core_1.ErrorCode.RESULT_INVALID_FORMAT;
                                        delete cr.value;
                                    }
                                    _context4.next = 12;
                                    return promisify(resp.write.bind(resp)((0, _stringify2.default)(cr)));

                                case 12:
                                    _context4.next = 14;
                                    return promisify(resp.end.bind(resp)());

                                case 14:
                                case "end":
                                    return _context4.stop();
                            }
                        }
                    }, _callee4, _this);
                }));

                return function (_x7, _x8) {
                    return _ref4.apply(this, arguments);
                };
            }());
            this.m_server.on('getBlock', function () {
                var _ref5 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee5(params, resp) {
                    var hr, l, wage, header, block, transactions, totalFee, res;
                    return _regenerator2.default.wrap(function _callee5$(_context5) {
                        while (1) {
                            switch (_context5.prev = _context5.next) {
                                case 0:
                                    _context5.next = 2;
                                    return _this.m_chain.getHeader(params.which);

                                case 2:
                                    hr = _context5.sent;
                                    l = new core_1.ValueHandler().getMinerWageListener();
                                    _context5.next = 6;
                                    return l(hr.header.number);

                                case 6:
                                    wage = _context5.sent;
                                    header = hr.header.stringify();

                                    header.reward = wage;

                                    if (!hr.err) {
                                        _context5.next = 14;
                                        break;
                                    }

                                    _context5.next = 12;
                                    return promisify(resp.write.bind(resp)((0, _stringify2.default)({ err: hr.err })));

                                case 12:
                                    _context5.next = 28;
                                    break;

                                case 14:
                                    if (!params.transactions) {
                                        _context5.next = 26;
                                        break;
                                    }

                                    _context5.next = 17;
                                    return _this.m_chain.getBlock(hr.header.hash);

                                case 17:
                                    block = _context5.sent;

                                    if (!block) {
                                        _context5.next = 24;
                                        break;
                                    }

                                    // 处理block content 中的transaction, 然后再响应请求
                                    transactions = block.content.transactions.map(function (tr) {
                                        return tr.stringify();
                                    });

                                    if (transactions && transactions.length !== 0) {
                                        totalFee = 0;

                                        transactions.forEach(function (value, index) {
                                            totalFee += value.fee;
                                        });
                                        header.fee = totalFee;
                                    } else {
                                        header.fee = 0;
                                    }
                                    res = { err: core_1.ErrorCode.RESULT_OK, block: header, transactions: transactions };
                                    _context5.next = 24;
                                    return promisify(resp.write.bind(resp)((0, _stringify2.default)(res)));

                                case 24:
                                    _context5.next = 28;
                                    break;

                                case 26:
                                    _context5.next = 28;
                                    return promisify(resp.write.bind(resp)((0, _stringify2.default)({ err: core_1.ErrorCode.RESULT_OK, block: header })));

                                case 28:
                                    _context5.next = 30;
                                    return promisify(resp.end.bind(resp))();

                                case 30:
                                case "end":
                                    return _context5.stop();
                            }
                        }
                    }, _callee5, _this);
                }));

                return function (_x9, _x10) {
                    return _ref5.apply(this, arguments);
                };
            }());
        }
    }]);
    return ChainServer;
}();

exports.ChainServer = ChainServer;