"use strict";

var _getIterator2 = require("babel-runtime/core-js/get-iterator");

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _set = require("babel-runtime/core-js/set");

var _set2 = _interopRequireDefault(_set);

var _regenerator = require("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require("babel-runtime/helpers/asyncToGenerator");

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _toConsumableArray2 = require("babel-runtime/helpers/toConsumableArray");

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

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
var chain_1 = require("../chain");

var ValidatorsNode = function (_chain_1$BaseNode) {
    (0, _inherits3.default)(ValidatorsNode, _chain_1$BaseNode);

    function ValidatorsNode(options) {
        (0, _classCallCheck3.default)(this, ValidatorsNode);

        var _this = (0, _possibleConstructorReturn3.default)(this, (ValidatorsNode.__proto__ || (0, _getPrototypeOf2.default)(ValidatorsNode)).call(this, options));

        _this.m_validators = [];
        _this.m_minConnectionRate = options.minConnectionRate;
        return _this;
    }

    (0, _createClass3.default)(ValidatorsNode, [{
        key: "setValidators",
        value: function setValidators(validators) {
            var _m_validators;

            this.m_validators = [];
            (_m_validators = this.m_validators).push.apply(_m_validators, (0, _toConsumableArray3.default)(validators));
        }
    }, {
        key: "getValidators",
        value: function getValidators() {
            var v = this.m_validators;
            return v;
        }
    }, {
        key: "_getMinOutbound",
        value: function _getMinOutbound() {
            return Math.ceil(this.m_validators.length * this.m_minConnectionRate);
        }
    }, {
        key: "initialOutbounds",
        value: function () {
            var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
                var _this2 = this;

                return _regenerator2.default.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                this._checkConnections();
                                this.m_checkOutboundTimer = setInterval(function () {
                                    _this2._checkConnections();
                                }, 1000);
                                return _context.abrupt("return", error_code_1.ErrorCode.RESULT_OK);

                            case 3:
                            case "end":
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));

            function initialOutbounds() {
                return _ref.apply(this, arguments);
            }

            return initialOutbounds;
        }()
    }, {
        key: "uninit",
        value: function uninit() {
            if (this.m_checkOutboundTimer) {
                clearInterval(this.m_checkOutboundTimer);
                delete this.m_checkOutboundTimer;
            }
            return (0, _get3.default)(ValidatorsNode.prototype.__proto__ || (0, _getPrototypeOf2.default)(ValidatorsNode.prototype), "uninit", this).call(this);
        }
    }, {
        key: "_checkConnections",
        value: function _checkConnections() {
            var connectionCount = 0;
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = (0, _getIterator3.default)(this.m_validators), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var _v = _step.value;

                    if (this.node.getConnection(_v) || this.m_connecting.has(_v)) {
                        ++connectionCount;
                    }
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }

            var willConn = new _set2.default();
            if (connectionCount < this._getMinOutbound()) {
                var _iteratorNormalCompletion2 = true;
                var _didIteratorError2 = false;
                var _iteratorError2 = undefined;

                try {
                    for (var _iterator2 = (0, _getIterator3.default)(this.m_validators), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                        var v = _step2.value;

                        if (this._onWillConnectTo(v)) {
                            willConn.add(v);
                        }
                    }
                } catch (err) {
                    _didIteratorError2 = true;
                    _iteratorError2 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion2 && _iterator2.return) {
                            _iterator2.return();
                        }
                    } finally {
                        if (_didIteratorError2) {
                            throw _iteratorError2;
                        }
                    }
                }

                this._connectTo(willConn);
            }
        }
    }, {
        key: "broadcastToValidators",
        value: function broadcastToValidators(writer) {
            var validators = new _set2.default(this.m_validators);
            return this.m_node.broadcast(writer, { count: validators.size, filter: function filter(conn) {
                    return validators.has(conn.getRemote());
                } });
        }
    }]);
    return ValidatorsNode;
}(chain_1.BaseNode);

exports.ValidatorsNode = ValidatorsNode;