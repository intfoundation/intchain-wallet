"use strict";

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

var _inherits2 = require("babel-runtime/helpers/inherits");

var _inherits3 = _interopRequireDefault(_inherits2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

Object.defineProperty(exports, "__esModule", { value: true });
var events_1 = require("events");
var rpc_1 = require("./rpc");

var ChainClient = function (_rpc_1$HostClient) {
    (0, _inherits3.default)(ChainClient, _rpc_1$HostClient);

    function ChainClient(options) {
        (0, _classCallCheck3.default)(this, ChainClient);

        var _this = (0, _possibleConstructorReturn3.default)(this, (ChainClient.__proto__ || (0, _getPrototypeOf2.default)(ChainClient)).call(this, options));

        _this.m_emitter = new events_1.EventEmitter();
        return _this;
    }

    (0, _createClass3.default)(ChainClient, [{
        key: "on",
        value: function on(event, listener) {
            this.m_emitter.on(event, listener);
            this._beginWatchTipBlock();
            return this;
        }
    }, {
        key: "once",
        value: function once(event, listener) {
            this.m_emitter.once(event, listener);
            this._beginWatchTipBlock();
            return this;
        }
    }, {
        key: "_beginWatchTipBlock",
        value: function () {
            var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2() {
                var _this2 = this;

                return _regenerator2.default.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                if (!this.m_tipBlockTimer) {
                                    _context2.next = 2;
                                    break;
                                }

                                return _context2.abrupt("return");

                            case 2:
                                this.m_tipBlockTimer = setInterval((0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
                                    var _ref3, err, block;

                                    return _regenerator2.default.wrap(function _callee$(_context) {
                                        while (1) {
                                            switch (_context.prev = _context.next) {
                                                case 0:
                                                    _context.next = 2;
                                                    return _this2.getBlock({ which: 'latest' });

                                                case 2:
                                                    _ref3 = _context.sent;
                                                    err = _ref3.err;
                                                    block = _ref3.block;

                                                    if (block) {
                                                        if (!_this2.m_tipBlock || _this2.m_tipBlock.hash !== block.hash) {
                                                            _this2.m_tipBlock = block;
                                                            _this2.m_emitter.emit('tipBlock', _this2.m_tipBlock);
                                                            if (!_this2.m_emitter.listenerCount('tipBlock')) {
                                                                clearInterval(_this2.m_tipBlockTimer);
                                                                delete _this2.m_tipBlockTimer;
                                                            }
                                                        }
                                                    }
                                                    // TODO: set block interval 

                                                case 6:
                                                case "end":
                                                    return _context.stop();
                                            }
                                        }
                                    }, _callee, _this2);
                                })), 10000);

                            case 3:
                            case "end":
                                return _context2.stop();
                        }
                    }
                }, _callee2, this);
            }));

            function _beginWatchTipBlock() {
                return _ref.apply(this, arguments);
            }

            return _beginWatchTipBlock;
        }()
    }]);
    return ChainClient;
}(rpc_1.HostClient);

exports.ChainClient = ChainClient;