"use strict";

var _getIterator2 = require("babel-runtime/core-js/get-iterator");

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _set = require("babel-runtime/core-js/set");

var _set2 = _interopRequireDefault(_set);

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
var base_node_1 = require("./base_node");

var RandomOutNode = function (_base_node_1$BaseNode) {
    (0, _inherits3.default)(RandomOutNode, _base_node_1$BaseNode);

    function RandomOutNode(options) {
        (0, _classCallCheck3.default)(this, RandomOutNode);

        var _this = (0, _possibleConstructorReturn3.default)(this, (RandomOutNode.__proto__ || (0, _getPrototypeOf2.default)(RandomOutNode)).call(this, options));

        _this.m_minOutbound = options.minOutbound;
        _this.m_checkCycle = options.checkCycle;
        return _this;
    }

    (0, _createClass3.default)(RandomOutNode, [{
        key: "uninit",
        value: function uninit() {
            if (this.m_checkOutboundTimer) {
                clearInterval(this.m_checkOutboundTimer);
                delete this.m_checkOutboundTimer;
            }
            return (0, _get3.default)(RandomOutNode.prototype.__proto__ || (0, _getPrototypeOf2.default)(RandomOutNode.prototype), "uninit", this).call(this);
        }
    }, {
        key: "initialOutbounds",
        value: function () {
            var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
                var _this2 = this;

                var err;
                return _regenerator2.default.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                this.logger.debug("initialOutbounds");

                                if (!(this.m_minOutbound === 0)) {
                                    _context.next = 3;
                                    break;
                                }

                                return _context.abrupt("return", error_code_1.ErrorCode.RESULT_SKIPPED);

                            case 3:
                                _context.next = 5;
                                return this._newOutbounds(this.m_minOutbound);

                            case 5:
                                err = _context.sent;

                                if (!err) {
                                    _context.next = 8;
                                    break;
                                }

                                return _context.abrupt("return", err);

                            case 8:
                                this.m_checkOutboundTimer = setInterval(function () {
                                    var next = _this2.m_minOutbound - (_this2.m_connecting.size + _this2.m_node.getConnnectionCount());
                                    if (next > 0) {
                                        _this2.logger.debug("node need more " + next + " connection, call  _newOutbounds");
                                        _this2._newOutbounds(next);
                                    }
                                }, this.m_checkCycle);
                                return _context.abrupt("return", error_code_1.ErrorCode.RESULT_OK);

                            case 10:
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
        key: "_newOutbounds",
        value: function () {
            var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(count, callback) {
                var peerids, willConn, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, _pid3, excludes, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, _pid, _iteratorNormalCompletion3, _didIteratorError3, _iteratorError3, _iterator3, _step3, _pid2, _iteratorNormalCompletion4, _didIteratorError4, _iteratorError4, _iterator4, _step4, ib, _iteratorNormalCompletion5, _didIteratorError5, _iteratorError5, _iterator5, _step5, ob, result, _iteratorNormalCompletion6, _didIteratorError6, _iteratorError6, _iterator6, _step6, pid;

                return _regenerator2.default.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                peerids = this.m_nodeStorage.get('all');
                                willConn = new _set2.default();
                                _iteratorNormalCompletion = true;
                                _didIteratorError = false;
                                _iteratorError = undefined;
                                _context2.prev = 5;

                                for (_iterator = (0, _getIterator3.default)(peerids); !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                                    _pid3 = _step.value;

                                    if (this._onWillConnectTo(_pid3)) {
                                        willConn.add(_pid3);
                                    }
                                }
                                _context2.next = 13;
                                break;

                            case 9:
                                _context2.prev = 9;
                                _context2.t0 = _context2["catch"](5);
                                _didIteratorError = true;
                                _iteratorError = _context2.t0;

                            case 13:
                                _context2.prev = 13;
                                _context2.prev = 14;

                                if (!_iteratorNormalCompletion && _iterator.return) {
                                    _iterator.return();
                                }

                            case 16:
                                _context2.prev = 16;

                                if (!_didIteratorError) {
                                    _context2.next = 19;
                                    break;
                                }

                                throw _iteratorError;

                            case 19:
                                return _context2.finish(16);

                            case 20:
                                return _context2.finish(13);

                            case 21:
                                this.logger.debug("will connect to peers from node storage: ", willConn);

                                if (!(willConn.size < count)) {
                                    _context2.next = 134;
                                    break;
                                }

                                excludes = [];
                                _iteratorNormalCompletion2 = true;
                                _didIteratorError2 = false;
                                _iteratorError2 = undefined;
                                _context2.prev = 27;

                                for (_iterator2 = (0, _getIterator3.default)(this.m_connecting); !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                                    _pid = _step2.value;

                                    excludes.push(_pid);
                                }
                                _context2.next = 35;
                                break;

                            case 31:
                                _context2.prev = 31;
                                _context2.t1 = _context2["catch"](27);
                                _didIteratorError2 = true;
                                _iteratorError2 = _context2.t1;

                            case 35:
                                _context2.prev = 35;
                                _context2.prev = 36;

                                if (!_iteratorNormalCompletion2 && _iterator2.return) {
                                    _iterator2.return();
                                }

                            case 38:
                                _context2.prev = 38;

                                if (!_didIteratorError2) {
                                    _context2.next = 41;
                                    break;
                                }

                                throw _iteratorError2;

                            case 41:
                                return _context2.finish(38);

                            case 42:
                                return _context2.finish(35);

                            case 43:
                                _iteratorNormalCompletion3 = true;
                                _didIteratorError3 = false;
                                _iteratorError3 = undefined;
                                _context2.prev = 46;
                                for (_iterator3 = (0, _getIterator3.default)(willConn); !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                                    _pid2 = _step3.value;

                                    excludes.push(_pid2);
                                }
                                _context2.next = 54;
                                break;

                            case 50:
                                _context2.prev = 50;
                                _context2.t2 = _context2["catch"](46);
                                _didIteratorError3 = true;
                                _iteratorError3 = _context2.t2;

                            case 54:
                                _context2.prev = 54;
                                _context2.prev = 55;

                                if (!_iteratorNormalCompletion3 && _iterator3.return) {
                                    _iterator3.return();
                                }

                            case 57:
                                _context2.prev = 57;

                                if (!_didIteratorError3) {
                                    _context2.next = 60;
                                    break;
                                }

                                throw _iteratorError3;

                            case 60:
                                return _context2.finish(57);

                            case 61:
                                return _context2.finish(54);

                            case 62:
                                _iteratorNormalCompletion4 = true;
                                _didIteratorError4 = false;
                                _iteratorError4 = undefined;
                                _context2.prev = 65;
                                for (_iterator4 = (0, _getIterator3.default)(this.node.getInbounds()); !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                                    ib = _step4.value;

                                    excludes.push(ib.getRemote());
                                }
                                _context2.next = 73;
                                break;

                            case 69:
                                _context2.prev = 69;
                                _context2.t3 = _context2["catch"](65);
                                _didIteratorError4 = true;
                                _iteratorError4 = _context2.t3;

                            case 73:
                                _context2.prev = 73;
                                _context2.prev = 74;

                                if (!_iteratorNormalCompletion4 && _iterator4.return) {
                                    _iterator4.return();
                                }

                            case 76:
                                _context2.prev = 76;

                                if (!_didIteratorError4) {
                                    _context2.next = 79;
                                    break;
                                }

                                throw _iteratorError4;

                            case 79:
                                return _context2.finish(76);

                            case 80:
                                return _context2.finish(73);

                            case 81:
                                _iteratorNormalCompletion5 = true;
                                _didIteratorError5 = false;
                                _iteratorError5 = undefined;
                                _context2.prev = 84;
                                for (_iterator5 = (0, _getIterator3.default)(this.node.getOutbounds()); !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
                                    ob = _step5.value;

                                    excludes.push(ob.getRemote());
                                }
                                _context2.next = 92;
                                break;

                            case 88:
                                _context2.prev = 88;
                                _context2.t4 = _context2["catch"](84);
                                _didIteratorError5 = true;
                                _iteratorError5 = _context2.t4;

                            case 92:
                                _context2.prev = 92;
                                _context2.prev = 93;

                                if (!_iteratorNormalCompletion5 && _iterator5.return) {
                                    _iterator5.return();
                                }

                            case 95:
                                _context2.prev = 95;

                                if (!_didIteratorError5) {
                                    _context2.next = 98;
                                    break;
                                }

                                throw _iteratorError5;

                            case 98:
                                return _context2.finish(95);

                            case 99:
                                return _context2.finish(92);

                            case 100:
                                _context2.next = 102;
                                return this.m_node.randomPeers(count, excludes);

                            case 102:
                                result = _context2.sent;

                                if (result.peers.length === 0) {
                                    result.peers = this.m_nodeStorage.staticNodes.filter(function (value) {
                                        return !excludes.includes(value);
                                    });
                                    result.err = result.peers.length > 0 ? error_code_1.ErrorCode.RESULT_OK : error_code_1.ErrorCode.RESULT_SKIPPED;
                                }

                                if (!(result.err === error_code_1.ErrorCode.RESULT_OK)) {
                                    _context2.next = 127;
                                    break;
                                }

                                this.logger.debug("will connect to peers from random peers: ", result.peers);
                                _iteratorNormalCompletion6 = true;
                                _didIteratorError6 = false;
                                _iteratorError6 = undefined;
                                _context2.prev = 109;
                                for (_iterator6 = (0, _getIterator3.default)(result.peers); !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
                                    pid = _step6.value;

                                    willConn.add(pid);
                                }
                                _context2.next = 117;
                                break;

                            case 113:
                                _context2.prev = 113;
                                _context2.t5 = _context2["catch"](109);
                                _didIteratorError6 = true;
                                _iteratorError6 = _context2.t5;

                            case 117:
                                _context2.prev = 117;
                                _context2.prev = 118;

                                if (!_iteratorNormalCompletion6 && _iterator6.return) {
                                    _iterator6.return();
                                }

                            case 120:
                                _context2.prev = 120;

                                if (!_didIteratorError6) {
                                    _context2.next = 123;
                                    break;
                                }

                                throw _iteratorError6;

                            case 123:
                                return _context2.finish(120);

                            case 124:
                                return _context2.finish(117);

                            case 125:
                                _context2.next = 134;
                                break;

                            case 127:
                                if (!(result.err === error_code_1.ErrorCode.RESULT_SKIPPED)) {
                                    _context2.next = 132;
                                    break;
                                }

                                this.logger.error("cannot find any peers, ignore connect.");
                                return _context2.abrupt("return", error_code_1.ErrorCode.RESULT_SKIPPED);

                            case 132:
                                this.logger.error("random peers failed for : ", result.err);
                                return _context2.abrupt("return", result.err);

                            case 134:
                                _context2.next = 136;
                                return this._connectTo(willConn, callback);

                            case 136:
                                return _context2.abrupt("return", _context2.sent);

                            case 137:
                            case "end":
                                return _context2.stop();
                        }
                    }
                }, _callee2, this, [[5, 9, 13, 21], [14,, 16, 20], [27, 31, 35, 43], [36,, 38, 42], [46, 50, 54, 62], [55,, 57, 61], [65, 69, 73, 81], [74,, 76, 80], [84, 88, 92, 100], [93,, 95, 99], [109, 113, 117, 125], [118,, 120, 124]]);
            }));

            function _newOutbounds(_x, _x2) {
                return _ref2.apply(this, arguments);
            }

            return _newOutbounds;
        }()
    }]);
    return RandomOutNode;
}(base_node_1.BaseNode);

exports.RandomOutNode = RandomOutNode;