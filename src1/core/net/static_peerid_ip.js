"use strict";

var _regenerator = require("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require("babel-runtime/helpers/asyncToGenerator");

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _slicedToArray2 = require("babel-runtime/helpers/slicedToArray");

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _keys = require("babel-runtime/core-js/object/keys");

var _keys2 = _interopRequireDefault(_keys);

var _getIterator2 = require("babel-runtime/core-js/get-iterator");

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _map = require("babel-runtime/core-js/map");

var _map2 = _interopRequireDefault(_map);

var _getPrototypeOf = require("babel-runtime/core-js/object/get-prototype-of");

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _toConsumableArray2 = require("babel-runtime/helpers/toConsumableArray");

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

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
var error_code_1 = require("../error_code");
function mapInstance(superClass) {
    return function (_superClass) {
        (0, _inherits3.default)(_class, _superClass);

        function _class() {
            var _ref;

            (0, _classCallCheck3.default)(this, _class);

            for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                args[_key] = arguments[_key];
            }

            var _this = (0, _possibleConstructorReturn3.default)(this, (_ref = _class.__proto__ || (0, _getPrototypeOf2.default)(_class)).call.apply(_ref, [this].concat((0, _toConsumableArray3.default)(args.slice(1)))));

            _this.m_peeridToIp = new _map2.default();
            var iph = args[0];
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = (0, _getIterator3.default)((0, _keys2.default)(iph)), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var peerid = _step.value;

                    var _iph$peerid$split = iph[peerid].split(':'),
                        _iph$peerid$split2 = (0, _slicedToArray3.default)(_iph$peerid$split, 2),
                        host = _iph$peerid$split2[0],
                        port = _iph$peerid$split2[1];

                    _this.m_peeridToIp.set(peerid, { host: host, port: parseInt(port) });
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

            return _this;
        }

        (0, _createClass3.default)(_class, [{
            key: "_peeridToIpAddress",
            value: function () {
                var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(peerid) {
                    var iph;
                    return _regenerator2.default.wrap(function _callee$(_context) {
                        while (1) {
                            switch (_context.prev = _context.next) {
                                case 0:
                                    iph = this.m_peeridToIp.get(peerid);

                                    if (iph) {
                                        _context.next = 3;
                                        break;
                                    }

                                    return _context.abrupt("return", { err: error_code_1.ErrorCode.RESULT_NOT_FOUND });

                                case 3:
                                    return _context.abrupt("return", { err: error_code_1.ErrorCode.RESULT_OK, ip: iph });

                                case 4:
                                case "end":
                                    return _context.stop();
                            }
                        }
                    }, _callee, this);
                }));

                function _peeridToIpAddress(_x) {
                    return _ref2.apply(this, arguments);
                }

                return _peeridToIpAddress;
            }()
        }]);
        return _class;
    }(superClass);
}
exports.mapInstance = mapInstance;
function splitInstance(superClass) {
    return function (_superClass2) {
        (0, _inherits3.default)(_class2, _superClass2);

        function _class2() {
            var _ref3;

            (0, _classCallCheck3.default)(this, _class2);

            for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                args[_key2] = arguments[_key2];
            }

            return (0, _possibleConstructorReturn3.default)(this, (_ref3 = _class2.__proto__ || (0, _getPrototypeOf2.default)(_class2)).call.apply(_ref3, [this].concat(args)));
        }

        (0, _createClass3.default)(_class2, [{
            key: "_peeridToIpAddress",
            value: function () {
                var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(peerid) {
                    var _peerid$split, _peerid$split2, host, port;

                    return _regenerator2.default.wrap(function _callee2$(_context2) {
                        while (1) {
                            switch (_context2.prev = _context2.next) {
                                case 0:
                                    _peerid$split = peerid.split(':'), _peerid$split2 = (0, _slicedToArray3.default)(_peerid$split, 2), host = _peerid$split2[0], port = _peerid$split2[1];
                                    return _context2.abrupt("return", { err: error_code_1.ErrorCode.RESULT_OK, ip: { host: host, port: parseInt(port) } });

                                case 2:
                                case "end":
                                    return _context2.stop();
                            }
                        }
                    }, _callee2, this);
                }));

                function _peeridToIpAddress(_x2) {
                    return _ref4.apply(this, arguments);
                }

                return _peeridToIpAddress;
            }()
        }]);
        return _class2;
    }(superClass);
}
exports.splitInstance = splitInstance;