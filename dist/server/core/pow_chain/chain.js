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
var block_1 = require("./block");
var consensus = require("./consensus");

var PowChain = function (_value_chain_1$ValueC) {
    (0, _inherits3.default)(PowChain, _value_chain_1$ValueC);

    function PowChain() {
        (0, _classCallCheck3.default)(this, PowChain);
        return (0, _possibleConstructorReturn3.default)(this, (PowChain.__proto__ || (0, _getPrototypeOf2.default)(PowChain)).apply(this, arguments));
    }

    (0, _createClass3.default)(PowChain, [{
        key: "_getBlockHeaderType",
        value: function _getBlockHeaderType() {
            return block_1.PowBlockHeader;
        }
    }, {
        key: "_onCheckGlobalOptions",
        value: function _onCheckGlobalOptions(globalOptions) {
            if (!(0, _get3.default)(PowChain.prototype.__proto__ || (0, _getPrototypeOf2.default)(PowChain.prototype), "_onCheckGlobalOptions", this).call(this, globalOptions)) {
                return false;
            }
            return consensus.onCheckGlobalOptions(globalOptions);
        }
    }, {
        key: "_onCheckTypeOptions",
        value: function _onCheckTypeOptions(typeOptions) {
            return typeOptions.consensus === 'pow';
        }
    }, {
        key: "onCreateGenesisBlock",
        value: function () {
            var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(block, storage, genesisOptions) {
                var err, gkvr, rpr;
                return _regenerator2.default.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                _context.next = 2;
                                return (0, _get3.default)(PowChain.prototype.__proto__ || (0, _getPrototypeOf2.default)(PowChain.prototype), "onCreateGenesisBlock", this).call(this, block, storage, genesisOptions);

                            case 2:
                                err = _context.sent;

                                if (!err) {
                                    _context.next = 5;
                                    break;
                                }

                                return _context.abrupt("return", err);

                            case 5:
                                _context.next = 7;
                                return storage.getKeyValue(value_chain_1.ValueChain.dbSystem, value_chain_1.ValueChain.kvConfig);

                            case 7:
                                gkvr = _context.sent;

                                if (!gkvr.err) {
                                    _context.next = 10;
                                    break;
                                }

                                return _context.abrupt("return", gkvr.err);

                            case 10:
                                _context.next = 12;
                                return gkvr.kv.set('consensus', 'pow');

                            case 12:
                                rpr = _context.sent;

                                if (!rpr.err) {
                                    _context.next = 15;
                                    break;
                                }

                                return _context.abrupt("return", rpr.err);

                            case 15:
                                block.header.bits = this.globalOptions.basicBits;
                                block.header.updateHash();
                                return _context.abrupt("return", error_code_1.ErrorCode.RESULT_OK);

                            case 18:
                            case "end":
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));

            function onCreateGenesisBlock(_x, _x2, _x3) {
                return _ref.apply(this, arguments);
            }

            return onCreateGenesisBlock;
        }()
    }]);
    return PowChain;
}(value_chain_1.ValueChain);

exports.PowChain = PowChain;