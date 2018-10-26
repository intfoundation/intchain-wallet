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

var _get2 = require("babel-runtime/helpers/get");

var _get3 = _interopRequireDefault(_get2);

var _inherits2 = require("babel-runtime/helpers/inherits");

var _inherits3 = _interopRequireDefault(_inherits2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

Object.defineProperty(exports, "__esModule", { value: true });
var value_chain_1 = require("../value_chain");
var context_1 = require("./context");

var DbftBlockExecutor = function (_value_chain_1$ValueB) {
    (0, _inherits3.default)(DbftBlockExecutor, _value_chain_1$ValueB);

    function DbftBlockExecutor() {
        (0, _classCallCheck3.default)(this, DbftBlockExecutor);
        return (0, _possibleConstructorReturn3.default)(this, (DbftBlockExecutor.__proto__ || (0, _getPrototypeOf2.default)(DbftBlockExecutor)).apply(this, arguments));
    }

    (0, _createClass3.default)(DbftBlockExecutor, [{
        key: "_executePostBlockEvent",
        value: function () {
            var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
                var dbftProxy;
                return _regenerator2.default.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                if (!(this.m_block.number > 0)) {
                                    _context.next = 5;
                                    break;
                                }

                                dbftProxy = new context_1.DbftContext(this.m_storage, this.m_globalOptions, this.m_logger);

                                if (!context_1.DbftContext.isElectionBlockNumber(this.m_globalOptions, this.m_block.number)) {
                                    _context.next = 5;
                                    break;
                                }

                                _context.next = 5;
                                return dbftProxy.updateMiners(this.m_block.number);

                            case 5:
                                return _context.abrupt("return", (0, _get3.default)(DbftBlockExecutor.prototype.__proto__ || (0, _getPrototypeOf2.default)(DbftBlockExecutor.prototype), "_executePostBlockEvent", this).call(this));

                            case 6:
                            case "end":
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));

            function _executePostBlockEvent() {
                return _ref.apply(this, arguments);
            }

            return _executePostBlockEvent;
        }()
    }]);
    return DbftBlockExecutor;
}(value_chain_1.ValueBlockExecutor);

exports.DbftBlockExecutor = DbftBlockExecutor;