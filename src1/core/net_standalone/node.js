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
var node_1 = require("../net/node");
var error_code_1 = require("../error_code");
var connection_1 = require("./connection");

var StandaloneNode = function (_node_1$INode) {
    (0, _inherits3.default)(StandaloneNode, _node_1$INode);

    function StandaloneNode(peerid) {
        (0, _classCallCheck3.default)(this, StandaloneNode);
        return (0, _possibleConstructorReturn3.default)(this, (StandaloneNode.__proto__ || (0, _getPrototypeOf2.default)(StandaloneNode)).call(this, { peerid: peerid }));
    }

    (0, _createClass3.default)(StandaloneNode, [{
        key: "_connectTo",
        value: function () {
            var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(peerid) {
                var connType, conn;
                return _regenerator2.default.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                connType = this._nodeConnectionType();
                                conn = new connType(this);
                                return _context.abrupt("return", { err: error_code_1.ErrorCode.RESULT_OK, conn: conn });

                            case 3:
                            case "end":
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));

            function _connectTo(_x) {
                return _ref.apply(this, arguments);
            }

            return _connectTo;
        }()
    }, {
        key: "_connectionType",
        value: function _connectionType() {
            return connection_1.StandaloneConnection;
        }
    }, {
        key: "listen",
        value: function () {
            var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2() {
                return _regenerator2.default.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                return _context2.abrupt("return", error_code_1.ErrorCode.RESULT_OK);

                            case 1:
                            case "end":
                                return _context2.stop();
                        }
                    }
                }, _callee2, this);
            }));

            function listen() {
                return _ref2.apply(this, arguments);
            }

            return listen;
        }()
    }, {
        key: "randomPeers",
        value: function () {
            var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(count, excludes) {
                return _regenerator2.default.wrap(function _callee3$(_context3) {
                    while (1) {
                        switch (_context3.prev = _context3.next) {
                            case 0:
                                return _context3.abrupt("return", { err: error_code_1.ErrorCode.RESULT_SKIPPED, peers: [] });

                            case 1:
                            case "end":
                                return _context3.stop();
                        }
                    }
                }, _callee3, this);
            }));

            function randomPeers(_x2, _x3) {
                return _ref3.apply(this, arguments);
            }

            return randomPeers;
        }()
    }]);
    return StandaloneNode;
}(node_1.INode);

exports.StandaloneNode = StandaloneNode;