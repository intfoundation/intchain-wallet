"use strict";

var _stringify = require("babel-runtime/core-js/json/stringify");

var _stringify2 = _interopRequireDefault(_stringify);

var _regenerator = require("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _create = require("babel-runtime/core-js/object/create");

var _create2 = _interopRequireDefault(_create);

var _asyncToGenerator2 = require("babel-runtime/helpers/asyncToGenerator");

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("babel-runtime/helpers/createClass");

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

Object.defineProperty(exports, "__esModule", { value: true });
var error_code_1 = require("../error_code");
var chain_1 = require("../chain");

var ViewExecutor = function () {
    function ViewExecutor(options) {
        (0, _classCallCheck3.default)(this, ViewExecutor);

        this.m_handler = options.handler;
        this.m_method = options.method;
        this.m_param = options.param;
        this.m_externContext = options.externContext;
        this.m_header = options.header;
        this.m_storage = options.storage;
        this.m_logger = options.logger;
    }

    (0, _createClass3.default)(ViewExecutor, [{
        key: "prepareContext",
        value: function () {
            var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(blockHeader, storage, externContext) {
                var database, context;
                return _regenerator2.default.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                _context.next = 2;
                                return storage.getReadableDataBase(chain_1.Chain.dbUser);

                            case 2:
                                database = _context.sent.value;
                                context = (0, _create2.default)(externContext);
                                // context.getNow = (): number => {
                                //     return blockHeader.timestamp;
                                // };

                                Object.defineProperty(context, 'now', {
                                    writable: false,
                                    value: blockHeader.timestamp
                                });
                                // context.getHeight = (): number => {
                                //     return blockHeader.number;
                                // };
                                Object.defineProperty(context, 'height', {
                                    writable: false,
                                    value: blockHeader.number
                                });
                                // context.getStorage = (): IReadWritableKeyValue => {
                                //     return kv;
                                // }
                                Object.defineProperty(context, 'storage', {
                                    writable: false,
                                    value: database
                                });
                                Object.defineProperty(context, 'logger', {
                                    writable: false,
                                    value: this.m_logger
                                });
                                return _context.abrupt("return", context);

                            case 9:
                            case "end":
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));

            function prepareContext(_x, _x2, _x3) {
                return _ref.apply(this, arguments);
            }

            return prepareContext;
        }()
    }, {
        key: "execute",
        value: function () {
            var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2() {
                var fcall, context, v;
                return _regenerator2.default.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                fcall = this.m_handler.getViewMethod(this.m_method);

                                if (fcall) {
                                    _context2.next = 3;
                                    break;
                                }

                                return _context2.abrupt("return", { err: error_code_1.ErrorCode.RESULT_NOT_SUPPORT });

                            case 3:
                                _context2.next = 5;
                                return this.prepareContext(this.m_header, this.m_storage, this.m_externContext);

                            case 5:
                                context = _context2.sent;
                                _context2.prev = 6;

                                this.m_logger.info("will execute view method " + this.m_method + ", params " + (0, _stringify2.default)(this.m_param));
                                _context2.next = 10;
                                return fcall(context, this.m_param);

                            case 10:
                                v = _context2.sent;
                                return _context2.abrupt("return", { err: error_code_1.ErrorCode.RESULT_OK, value: v });

                            case 14:
                                _context2.prev = 14;
                                _context2.t0 = _context2["catch"](6);
                                return _context2.abrupt("return", { err: error_code_1.ErrorCode.RESULT_EXCEPTION });

                            case 17:
                            case "end":
                                return _context2.stop();
                        }
                    }
                }, _callee2, this, [[6, 14]]);
            }));

            function execute() {
                return _ref2.apply(this, arguments);
            }

            return execute;
        }()
    }, {
        key: "externContext",
        get: function get() {
            return this.m_externContext;
        }
    }]);
    return ViewExecutor;
}();

exports.ViewExecutor = ViewExecutor;