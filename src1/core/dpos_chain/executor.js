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
var error_code_1 = require("../error_code");
var value_chain_1 = require("../value_chain");
var consensus = require("./consensus");

var DposBlockExecutor = function (_value_chain_1$ValueB) {
    (0, _inherits3.default)(DposBlockExecutor, _value_chain_1$ValueB);

    function DposBlockExecutor() {
        (0, _classCallCheck3.default)(this, DposBlockExecutor);
        return (0, _possibleConstructorReturn3.default)(this, (DposBlockExecutor.__proto__ || (0, _getPrototypeOf2.default)(DposBlockExecutor)).apply(this, arguments));
    }

    (0, _createClass3.default)(DposBlockExecutor, [{
        key: "_executePostBlockEvent",
        value: function () {
            var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
                var err, dbr, denv, bReSelect, ber;
                return _regenerator2.default.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                _context.next = 2;
                                return (0, _get3.default)(DposBlockExecutor.prototype.__proto__ || (0, _getPrototypeOf2.default)(DposBlockExecutor.prototype), "_executePostBlockEvent", this).call(this);

                            case 2:
                                err = _context.sent;

                                if (!err) {
                                    _context.next = 5;
                                    break;
                                }

                                return _context.abrupt("return", err);

                            case 5:
                                if (!(this.m_block.number > 0)) {
                                    _context.next = 31;
                                    break;
                                }

                                _context.next = 8;
                                return this.m_storage.getReadWritableDatabase(value_chain_1.Chain.dbSystem);

                            case 8:
                                dbr = _context.sent;

                                if (!dbr.err) {
                                    _context.next = 12;
                                    break;
                                }

                                this.m_logger.error("execute block failed for get system database " + dbr.err);
                                return _context.abrupt("return", dbr.err);

                            case 12:
                                denv = new consensus.Context(dbr.value, this.m_globalOptions, this.m_logger);
                                // 修改miner的最后一次出块时间
                                // 创世快不算时间，因为创世快产生后可能很长时间才开始出其他块的

                                _context.next = 15;
                                return denv.updateProducerTime(this.m_block.header.coinbase, this.m_block.header.timestamp);

                            case 15:
                                if (!(this.m_block.number % this.m_globalOptions.unbanBlocks === 0)) {
                                    _context.next = 18;
                                    break;
                                }

                                _context.next = 18;
                                return denv.unbanProducer(this.m_block.header.timestamp);

                            case 18:
                                bReSelect = false;

                                if (!(this.m_block.number % this.m_globalOptions.reSelectionBlocks === 0)) {
                                    _context.next = 28;
                                    break;
                                }

                                _context.next = 22;
                                return denv.banProducer(this.m_block.header.timestamp);

                            case 22:
                                _context.next = 24;
                                return denv.finishElection(this.m_block.header.hash);

                            case 24:
                                ber = _context.sent;

                                if (!ber.err) {
                                    _context.next = 27;
                                    break;
                                }

                                return _context.abrupt("return", ber.err);

                            case 27:
                                bReSelect = true;

                            case 28:
                                if (!(this.m_block.number === 1 || bReSelect)) {
                                    _context.next = 31;
                                    break;
                                }

                                _context.next = 31;
                                return denv.maintain_producer(this.m_block.header.timestamp);

                            case 31:
                                return _context.abrupt("return", error_code_1.ErrorCode.RESULT_OK);

                            case 32:
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
    return DposBlockExecutor;
}(value_chain_1.ValueBlockExecutor);

exports.DposBlockExecutor = DposBlockExecutor;