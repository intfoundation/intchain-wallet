"use strict";

var _regenerator = require("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _getIterator2 = require("babel-runtime/core-js/get-iterator");

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _set = require("babel-runtime/core-js/set");

var _set2 = _interopRequireDefault(_set);

var _asyncToGenerator2 = require("babel-runtime/helpers/asyncToGenerator");

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

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
function instance(superClass) {
    return function (_superClass) {
        (0, _inherits3.default)(_class, _superClass);

        function _class() {
            var _ref;

            (0, _classCallCheck3.default)(this, _class);

            for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                args[_key] = arguments[_key];
            }

            var _this = (0, _possibleConstructorReturn3.default)(this, (_ref = _class.__proto__ || (0, _getPrototypeOf2.default)(_class)).call.apply(_ref, [this].concat((0, _toConsumableArray3.default)(args.slice(1)))));

            _this.m_staticPeers = args[0].slice(0);
            return _this;
        }

        (0, _createClass3.default)(_class, [{
            key: "randomPeers",
            value: function () {
                var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(count, excludes) {
                    var doubleCount, ex, inc, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, peerid, start, peers;

                    return _regenerator2.default.wrap(function _callee$(_context) {
                        while (1) {
                            switch (_context.prev = _context.next) {
                                case 0:
                                    doubleCount = 2 * count;

                                    if (!this.m_staticPeers.length) {
                                        _context.next = 34;
                                        break;
                                    }

                                    ex = new _set2.default(excludes);
                                    inc = [];
                                    _iteratorNormalCompletion = true;
                                    _didIteratorError = false;
                                    _iteratorError = undefined;
                                    _context.prev = 7;

                                    for (_iterator = (0, _getIterator3.default)(this.m_staticPeers); !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                                        peerid = _step.value;

                                        if (!ex.has(peerid)) {
                                            inc.push(peerid);
                                        }
                                    }
                                    _context.next = 15;
                                    break;

                                case 11:
                                    _context.prev = 11;
                                    _context.t0 = _context["catch"](7);
                                    _didIteratorError = true;
                                    _iteratorError = _context.t0;

                                case 15:
                                    _context.prev = 15;
                                    _context.prev = 16;

                                    if (!_iteratorNormalCompletion && _iterator.return) {
                                        _iterator.return();
                                    }

                                case 18:
                                    _context.prev = 18;

                                    if (!_didIteratorError) {
                                        _context.next = 21;
                                        break;
                                    }

                                    throw _iteratorError;

                                case 21:
                                    return _context.finish(18);

                                case 22:
                                    return _context.finish(15);

                                case 23:
                                    if (!(inc.length <= doubleCount)) {
                                        _context.next = 27;
                                        break;
                                    }

                                    return _context.abrupt("return", { err: error_code_1.ErrorCode.RESULT_OK, peers: inc });

                                case 27:
                                    start = Math.floor(inc.length * Math.random());
                                    peers = [];

                                    peers.push.apply(peers, (0, _toConsumableArray3.default)(inc.slice(start)));
                                    if (peers.length <= doubleCount) {
                                        peers.push.apply(peers, (0, _toConsumableArray3.default)(inc.slice(doubleCount - peers.length)));
                                    }
                                    return _context.abrupt("return", { err: error_code_1.ErrorCode.RESULT_OK, peers: peers });

                                case 32:
                                    _context.next = 35;
                                    break;

                                case 34:
                                    return _context.abrupt("return", { err: error_code_1.ErrorCode.RESULT_SKIPPED, peers: [] });

                                case 35:
                                case "end":
                                    return _context.stop();
                            }
                        }
                    }, _callee, this, [[7, 11, 15, 23], [16,, 18, 22]]);
                }));

                function randomPeers(_x, _x2) {
                    return _ref2.apply(this, arguments);
                }

                return randomPeers;
            }()
        }]);
        return _class;
    }(superClass);
}
exports.instance = instance;