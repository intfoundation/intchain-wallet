"use strict";

var _getPrototypeOf = require("babel-runtime/core-js/object/get-prototype-of");

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _possibleConstructorReturn2 = require("babel-runtime/helpers/possibleConstructorReturn");

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require("babel-runtime/helpers/inherits");

var _inherits3 = _interopRequireDefault(_inherits2);

var _map = require("babel-runtime/core-js/map");

var _map2 = _interopRequireDefault(_map);

var _getIterator2 = require("babel-runtime/core-js/get-iterator");

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _regenerator = require("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require("babel-runtime/helpers/asyncToGenerator");

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("babel-runtime/helpers/createClass");

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("util");
var error_code_1 = require("../error_code");
var bignumber_js_1 = require("bignumber.js");
var assert = require("assert");
// DPOS的节点会定时出块，如果时间间隔已到，指定节点还未出块的话，就跳过这个节点，下一个节点出块
// 出块间隔时间必须远小于创建并广播块到所有DPOS出块节点的时间
// 所有time单位均为seconds
// 出块间隔时间
// export const blockInterval = 10
// 出块间隔允许的最大误差
// export const maxBlockIntervalOffset = 1
// //重新选举的块时间，暂时设定成每10块选举一次
// export const reSelectionBlocks = 10
// //最大出块者总数，先定成21
// export const maxCreator = 21;
// //最小出块者总数，先定成2
// export const minCreator = 2;
// //每个节点最多可以投的producer数量
// export const dposVoteMaxProducers = 30;
// //超过该时间不出块就将被封禁
// export const timeOffsetToLastBlock = 60 * 60 * 24;
// //封禁时长
// export const timeBan = 30 * timeOffsetToLastBlock;
// //每unbanBlocks个块后进行一次解禁计算
// export const unbanBlocks = reSelectionBlocks * 2;
function onCheckGlobalOptions(globalOptions) {
    if (util_1.isNullOrUndefined(globalOptions.minCreateor)) {
        return false;
    }
    if (util_1.isNullOrUndefined(globalOptions.maxCreateor)) {
        return false;
    }
    if (util_1.isNullOrUndefined(globalOptions.reSelectionBlocks)) {
        return false;
    }
    if (util_1.isNullOrUndefined(globalOptions.blockInterval)) {
        return false;
    }
    if (util_1.isNullOrUndefined(globalOptions.timeOffsetToLastBlock)) {
        return false;
    }
    if (util_1.isNullOrUndefined(globalOptions.timeBan)) {
        return false;
    }
    if (util_1.isNullOrUndefined(globalOptions.unbanBlocks)) {
        return false;
    }
    if (util_1.isNullOrUndefined(globalOptions.dposVoteMaxProducers)) {
        return false;
    }
    if (util_1.isNullOrUndefined(globalOptions.maxBlockIntervalOffset)) {
        return false;
    }
    return true;
}
exports.onCheckGlobalOptions = onCheckGlobalOptions;

var ViewContext = function () {
    function ViewContext(m_database, globalOptions, logger) {
        (0, _classCallCheck3.default)(this, ViewContext);

        this.m_database = m_database;
        this.globalOptions = globalOptions;
        this.logger = logger;
    }

    (0, _createClass3.default)(ViewContext, [{
        key: "getNextMiners",
        value: function () {
            var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
                var kvElectionDPOS, llr, lrr;
                return _regenerator2.default.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                _context.next = 2;
                                return this.database.getReadableKeyValue(ViewContext.kvDPOS);

                            case 2:
                                kvElectionDPOS = _context.sent.kv;
                                _context.next = 5;
                                return kvElectionDPOS.llen(ViewContext.keyNextMiners);

                            case 5:
                                llr = _context.sent;

                                if (!llr.err) {
                                    _context.next = 8;
                                    break;
                                }

                                return _context.abrupt("return", { err: llr.err });

                            case 8:
                                _context.next = 10;
                                return kvElectionDPOS.lrange(ViewContext.keyNextMiners, 0, llr.value);

                            case 10:
                                lrr = _context.sent;

                                if (!lrr.err) {
                                    _context.next = 13;
                                    break;
                                }

                                return _context.abrupt("return", { err: lrr.err });

                            case 13:
                                return _context.abrupt("return", { err: error_code_1.ErrorCode.RESULT_OK, creators: lrr.value });

                            case 14:
                            case "end":
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));

            function getNextMiners() {
                return _ref.apply(this, arguments);
            }

            return getNextMiners;
        }()
    }, {
        key: "getStoke",
        value: function () {
            var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(address) {
                var kvCurDPOS, her, gr;
                return _regenerator2.default.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                _context2.next = 2;
                                return this.database.getReadableKeyValue(ViewContext.kvDPOS);

                            case 2:
                                kvCurDPOS = _context2.sent.kv;
                                _context2.next = 5;
                                return kvCurDPOS.hexists(ViewContext.keyStoke, address);

                            case 5:
                                her = _context2.sent;

                                if (!her.err) {
                                    _context2.next = 8;
                                    break;
                                }

                                return _context2.abrupt("return", { err: her.err });

                            case 8:
                                if (her.value) {
                                    _context2.next = 12;
                                    break;
                                }

                                return _context2.abrupt("return", { err: error_code_1.ErrorCode.RESULT_OK, stoke: new bignumber_js_1.BigNumber(0) });

                            case 12:
                                _context2.next = 14;
                                return kvCurDPOS.hget(ViewContext.keyStoke, address);

                            case 14:
                                gr = _context2.sent;

                                if (!gr.err) {
                                    _context2.next = 17;
                                    break;
                                }

                                return _context2.abrupt("return", { err: gr.err });

                            case 17:
                                return _context2.abrupt("return", { err: error_code_1.ErrorCode.RESULT_OK, stoke: gr.value });

                            case 18:
                            case "end":
                                return _context2.stop();
                        }
                    }
                }, _callee2, this);
            }));

            function getStoke(_x) {
                return _ref2.apply(this, arguments);
            }

            return getStoke;
        }()
    }, {
        key: "getVote",
        value: function () {
            var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3() {
                var kvCurDPOS, gr, cans, isValid, vote, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, v;

                return _regenerator2.default.wrap(function _callee3$(_context3) {
                    while (1) {
                        switch (_context3.prev = _context3.next) {
                            case 0:
                                _context3.next = 2;
                                return this.database.getReadableKeyValue(ViewContext.kvDPOS);

                            case 2:
                                kvCurDPOS = _context3.sent.kv;
                                _context3.next = 5;
                                return kvCurDPOS.hgetall(ViewContext.keyVote);

                            case 5:
                                gr = _context3.sent;

                                if (!gr.err) {
                                    _context3.next = 8;
                                    break;
                                }

                                return _context3.abrupt("return", { err: gr.err });

                            case 8:
                                _context3.next = 10;
                                return this.getValidCandidates();

                            case 10:
                                cans = _context3.sent;

                                if (!cans.err) {
                                    _context3.next = 13;
                                    break;
                                }

                                return _context3.abrupt("return", { err: cans.err });

                            case 13:
                                cans.candidates.sort();

                                isValid = function isValid(s) {
                                    var _iteratorNormalCompletion = true;
                                    var _didIteratorError = false;
                                    var _iteratorError = undefined;

                                    try {
                                        for (var _iterator = (0, _getIterator3.default)(cans.candidates), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                                            var c = _step.value;

                                            if (c === s) {
                                                return true;
                                            } else if (c > s) {
                                                return false;
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

                                    return false;
                                };

                                vote = new _map2.default();
                                _iteratorNormalCompletion2 = true;
                                _didIteratorError2 = false;
                                _iteratorError2 = undefined;
                                _context3.prev = 19;

                                for (_iterator2 = (0, _getIterator3.default)(gr.value); !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                                    v = _step2.value;

                                    if (isValid(v.key)) {
                                        vote.set(v.key, v.value);
                                    }
                                }
                                _context3.next = 27;
                                break;

                            case 23:
                                _context3.prev = 23;
                                _context3.t0 = _context3["catch"](19);
                                _didIteratorError2 = true;
                                _iteratorError2 = _context3.t0;

                            case 27:
                                _context3.prev = 27;
                                _context3.prev = 28;

                                if (!_iteratorNormalCompletion2 && _iterator2.return) {
                                    _iterator2.return();
                                }

                            case 30:
                                _context3.prev = 30;

                                if (!_didIteratorError2) {
                                    _context3.next = 33;
                                    break;
                                }

                                throw _iteratorError2;

                            case 33:
                                return _context3.finish(30);

                            case 34:
                                return _context3.finish(27);

                            case 35:
                                return _context3.abrupt("return", { err: error_code_1.ErrorCode.RESULT_OK, vote: vote });

                            case 36:
                            case "end":
                                return _context3.stop();
                        }
                    }
                }, _callee3, this, [[19, 23, 27, 35], [28,, 30, 34]]);
            }));

            function getVote() {
                return _ref3.apply(this, arguments);
            }

            return getVote;
        }()
    }, {
        key: "getCandidates",
        value: function () {
            var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4() {
                var kvDPos, gr, gv, vote, _iteratorNormalCompletion3, _didIteratorError3, _iteratorError3, _iterator3, _step3, v;

                return _regenerator2.default.wrap(function _callee4$(_context4) {
                    while (1) {
                        switch (_context4.prev = _context4.next) {
                            case 0:
                                _context4.next = 2;
                                return this.database.getReadableKeyValue(ViewContext.kvDPOS);

                            case 2:
                                kvDPos = _context4.sent.kv;
                                _context4.next = 5;
                                return this.getValidCandidates();

                            case 5:
                                gr = _context4.sent;

                                if (!gr.err) {
                                    _context4.next = 8;
                                    break;
                                }

                                return _context4.abrupt("return", { err: gr.err });

                            case 8:
                                _context4.next = 10;
                                return kvDPos.hgetall(ViewContext.keyVote);

                            case 10:
                                gv = _context4.sent;

                                if (!gv.err) {
                                    _context4.next = 13;
                                    break;
                                }

                                return _context4.abrupt("return", { err: gv.err });

                            case 13:
                                vote = new _map2.default();
                                _iteratorNormalCompletion3 = true;
                                _didIteratorError3 = false;
                                _iteratorError3 = undefined;
                                _context4.prev = 17;

                                for (_iterator3 = (0, _getIterator3.default)(gv.value); !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                                    v = _step3.value;

                                    vote.set(v.key, v.value);
                                }
                                _context4.next = 25;
                                break;

                            case 21:
                                _context4.prev = 21;
                                _context4.t0 = _context4["catch"](17);
                                _didIteratorError3 = true;
                                _iteratorError3 = _context4.t0;

                            case 25:
                                _context4.prev = 25;
                                _context4.prev = 26;

                                if (!_iteratorNormalCompletion3 && _iterator3.return) {
                                    _iterator3.return();
                                }

                            case 28:
                                _context4.prev = 28;

                                if (!_didIteratorError3) {
                                    _context4.next = 31;
                                    break;
                                }

                                throw _iteratorError3;

                            case 31:
                                return _context4.finish(28);

                            case 32:
                                return _context4.finish(25);

                            case 33:
                                gr.candidates.sort(function (a, b) {
                                    if (vote.has(a) && vote.has(b)) {
                                        if (vote.get(a).eq(vote.get(b))) {
                                            return 0;
                                        }
                                        return vote.get(a).gt(vote.get(b)) ? -1 : 1;
                                    }
                                    if (!vote.has(a) && !vote.has(b)) {
                                        return 0;
                                    }
                                    if (vote.has(a)) {
                                        return -1;
                                    }
                                    return 1;
                                });
                                return _context4.abrupt("return", { err: error_code_1.ErrorCode.RESULT_OK, candidates: gr.candidates });

                            case 35:
                            case "end":
                                return _context4.stop();
                        }
                    }
                }, _callee4, this, [[17, 21, 25, 33], [26,, 28, 32]]);
            }));

            function getCandidates() {
                return _ref4.apply(this, arguments);
            }

            return getCandidates;
        }()
    }, {
        key: "getValidCandidates",
        value: function () {
            var _ref5 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee5() {
                var kvDPos, gr, candidates, _iteratorNormalCompletion4, _didIteratorError4, _iteratorError4, _iterator4, _step4, v;

                return _regenerator2.default.wrap(function _callee5$(_context5) {
                    while (1) {
                        switch (_context5.prev = _context5.next) {
                            case 0:
                                _context5.next = 2;
                                return this.database.getReadableKeyValue(ViewContext.kvDPOS);

                            case 2:
                                kvDPos = _context5.sent.kv;
                                _context5.next = 5;
                                return kvDPos.hgetall(ViewContext.keyCandidate);

                            case 5:
                                gr = _context5.sent;

                                if (!gr.err) {
                                    _context5.next = 8;
                                    break;
                                }

                                return _context5.abrupt("return", { err: gr.err });

                            case 8:
                                candidates = [];
                                _iteratorNormalCompletion4 = true;
                                _didIteratorError4 = false;
                                _iteratorError4 = undefined;
                                _context5.prev = 12;

                                for (_iterator4 = (0, _getIterator3.default)(gr.value); !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                                    v = _step4.value;

                                    if (v.value === 0) {
                                        candidates.push(v.key);
                                    }
                                }
                                _context5.next = 20;
                                break;

                            case 16:
                                _context5.prev = 16;
                                _context5.t0 = _context5["catch"](12);
                                _didIteratorError4 = true;
                                _iteratorError4 = _context5.t0;

                            case 20:
                                _context5.prev = 20;
                                _context5.prev = 21;

                                if (!_iteratorNormalCompletion4 && _iterator4.return) {
                                    _iterator4.return();
                                }

                            case 23:
                                _context5.prev = 23;

                                if (!_didIteratorError4) {
                                    _context5.next = 26;
                                    break;
                                }

                                throw _iteratorError4;

                            case 26:
                                return _context5.finish(23);

                            case 27:
                                return _context5.finish(20);

                            case 28:
                                return _context5.abrupt("return", { err: error_code_1.ErrorCode.RESULT_OK, candidates: candidates });

                            case 29:
                            case "end":
                                return _context5.stop();
                        }
                    }
                }, _callee5, this, [[12, 16, 20, 28], [21,, 23, 27]]);
            }));

            function getValidCandidates() {
                return _ref5.apply(this, arguments);
            }

            return getValidCandidates;
        }()
    }, {
        key: "isBan",
        value: function () {
            var _ref6 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee6(address) {
                var kvDPos, timeInfo;
                return _regenerator2.default.wrap(function _callee6$(_context6) {
                    while (1) {
                        switch (_context6.prev = _context6.next) {
                            case 0:
                                _context6.next = 2;
                                return this.database.getReadableKeyValue(ViewContext.kvDPOS);

                            case 2:
                                kvDPos = _context6.sent.kv;
                                _context6.next = 5;
                                return kvDPos.hget(ViewContext.keyCandidate, address);

                            case 5:
                                timeInfo = _context6.sent;

                                if (!timeInfo.err) {
                                    _context6.next = 8;
                                    break;
                                }

                                return _context6.abrupt("return", { err: error_code_1.ErrorCode.RESULT_OK, ban: false });

                            case 8:
                                return _context6.abrupt("return", { err: error_code_1.ErrorCode.RESULT_OK, ban: timeInfo.value === 0 ? false : true });

                            case 9:
                            case "end":
                                return _context6.stop();
                        }
                    }
                }, _callee6, this);
            }));

            function isBan(_x2) {
                return _ref6.apply(this, arguments);
            }

            return isBan;
        }()
    }, {
        key: "database",
        get: function get() {
            return this.m_database;
        }
    }], [{
        key: "getElectionBlockNumber",
        value: function getElectionBlockNumber(globalOptions, _number) {
            if (_number === 0) {
                return 0;
            }
            return Math.floor((_number - 1) / globalOptions.reSelectionBlocks) * globalOptions.reSelectionBlocks;
        }
    }]);
    return ViewContext;
}();

ViewContext.kvDPOS = 'dpos';
ViewContext.keyCandidate = 'candidate'; // 总的候选人
ViewContext.keyVote = 'vote';
ViewContext.keyStoke = 'stoke';
ViewContext.keyNextMiners = 'miner';
// 每个代表投票的那些人
ViewContext.keyProducers = 'producers';
// 生产者最后一次出块时间
ViewContext.keyNewBlockTime = 'newblocktime';
exports.ViewContext = ViewContext;

var Context = function (_ViewContext) {
    (0, _inherits3.default)(Context, _ViewContext);

    function Context() {
        (0, _classCallCheck3.default)(this, Context);
        return (0, _possibleConstructorReturn3.default)(this, (Context.__proto__ || (0, _getPrototypeOf2.default)(Context)).apply(this, arguments));
    }

    (0, _createClass3.default)(Context, [{
        key: "removeDuplicate",
        value: function removeDuplicate(s) {
            var s1 = [];
            var bit = new _map2.default();
            var _iteratorNormalCompletion5 = true;
            var _didIteratorError5 = false;
            var _iteratorError5 = undefined;

            try {
                for (var _iterator5 = (0, _getIterator3.default)(s), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
                    var v = _step5.value;

                    if (!bit.has(v)) {
                        s1.push(v);
                        bit.set(v, 1);
                    }
                }
            } catch (err) {
                _didIteratorError5 = true;
                _iteratorError5 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion5 && _iterator5.return) {
                        _iterator5.return();
                    }
                } finally {
                    if (_didIteratorError5) {
                        throw _iteratorError5;
                    }
                }
            }

            return s1;
        }
    }, {
        key: "init",
        value: function () {
            var _ref7 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee7(candidates, miners) {
                var kvCurDPOS, candiateValues, hmr, rpr;
                return _regenerator2.default.wrap(function _callee7$(_context7) {
                    while (1) {
                        switch (_context7.prev = _context7.next) {
                            case 0:
                                candidates = this.removeDuplicate(candidates);
                                miners = this.removeDuplicate(miners);
                                _context7.next = 4;
                                return this.database.getReadWritableKeyValue(ViewContext.kvDPOS);

                            case 4:
                                kvCurDPOS = _context7.sent.kv;
                                candiateValues = candidates.map(function () {
                                    return 0;
                                });
                                _context7.next = 8;
                                return kvCurDPOS.hmset(Context.keyCandidate, candidates, candiateValues);

                            case 8:
                                hmr = _context7.sent;

                                if (!hmr.err) {
                                    _context7.next = 11;
                                    break;
                                }

                                return _context7.abrupt("return", hmr);

                            case 11:
                                _context7.next = 13;
                                return kvCurDPOS.rpushx(Context.keyNextMiners, miners);

                            case 13:
                                rpr = _context7.sent;

                                if (!rpr.err) {
                                    _context7.next = 16;
                                    break;
                                }

                                return _context7.abrupt("return", rpr);

                            case 16:
                                return _context7.abrupt("return", { err: error_code_1.ErrorCode.RESULT_OK });

                            case 17:
                            case "end":
                                return _context7.stop();
                        }
                    }
                }, _callee7, this);
            }));

            function init(_x3, _x4) {
                return _ref7.apply(this, arguments);
            }

            return init;
        }()
    }, {
        key: "finishElection",
        value: function () {
            var _ref8 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee8(blockhash) {
                var kvCurDPOS, gvr, election, _iteratorNormalCompletion6, _didIteratorError6, _iteratorError6, _iterator6, _step6, address, creators, minersInfo, currMiners, _iteratorNormalCompletion7, _didIteratorError7, _iteratorError7, _iterator7, _step7, _m, currLen, m, i, llr, ix, lrr, lpr;

                return _regenerator2.default.wrap(function _callee8$(_context8) {
                    while (1) {
                        switch (_context8.prev = _context8.next) {
                            case 0:
                                _context8.next = 2;
                                return this.database.getReadWritableKeyValue(ViewContext.kvDPOS);

                            case 2:
                                kvCurDPOS = _context8.sent.kv;
                                _context8.next = 5;
                                return this.getVote();

                            case 5:
                                gvr = _context8.sent;

                                if (!gvr.err) {
                                    _context8.next = 9;
                                    break;
                                }

                                this.logger.error("finishElection, getvote failde,errcode=" + gvr.err);
                                return _context8.abrupt("return", { err: gvr.err });

                            case 9:
                                election = new Array();
                                _iteratorNormalCompletion6 = true;
                                _didIteratorError6 = false;
                                _iteratorError6 = undefined;
                                _context8.prev = 13;

                                for (_iterator6 = (0, _getIterator3.default)(gvr.vote.keys()); !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
                                    address = _step6.value;

                                    election.push({ address: address, vote: gvr.vote.get(address) });
                                }
                                // 按照投票权益排序
                                _context8.next = 21;
                                break;

                            case 17:
                                _context8.prev = 17;
                                _context8.t0 = _context8["catch"](13);
                                _didIteratorError6 = true;
                                _iteratorError6 = _context8.t0;

                            case 21:
                                _context8.prev = 21;
                                _context8.prev = 22;

                                if (!_iteratorNormalCompletion6 && _iterator6.return) {
                                    _iterator6.return();
                                }

                            case 24:
                                _context8.prev = 24;

                                if (!_didIteratorError6) {
                                    _context8.next = 27;
                                    break;
                                }

                                throw _iteratorError6;

                            case 27:
                                return _context8.finish(24);

                            case 28:
                                return _context8.finish(21);

                            case 29:
                                election.sort(function (l, r) {
                                    if (l.vote.eq(r.vote)) {
                                        return 0;
                                    } else {
                                        return l.vote.gt(r.vote) ? -1 : 1;
                                    }
                                });
                                creators = election.slice(0, this.globalOptions.maxCreator).map(function (x) {
                                    return x.address;
                                });

                                if (!(creators.length === 0)) {
                                    _context8.next = 33;
                                    break;
                                }

                                return _context8.abrupt("return", { err: error_code_1.ErrorCode.RESULT_OK });

                            case 33:
                                if (!(creators.length < this.globalOptions.minCreator)) {
                                    _context8.next = 83;
                                    break;
                                }

                                _context8.next = 36;
                                return this.getNextMiners();

                            case 36:
                                minersInfo = _context8.sent;

                                assert(minersInfo.err === error_code_1.ErrorCode.RESULT_OK, 'miners must exist');
                                currMiners = [];
                                _iteratorNormalCompletion7 = true;
                                _didIteratorError7 = false;
                                _iteratorError7 = undefined;
                                _context8.prev = 42;
                                _iterator7 = (0, _getIterator3.default)(minersInfo.creators);

                            case 44:
                                if (_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done) {
                                    _context8.next = 53;
                                    break;
                                }

                                _m = _step7.value;
                                _context8.next = 48;
                                return this.isBan(_m);

                            case 48:
                                if (_context8.sent.ban) {
                                    _context8.next = 50;
                                    break;
                                }

                                currMiners.push(_m);

                            case 50:
                                _iteratorNormalCompletion7 = true;
                                _context8.next = 44;
                                break;

                            case 53:
                                _context8.next = 59;
                                break;

                            case 55:
                                _context8.prev = 55;
                                _context8.t1 = _context8["catch"](42);
                                _didIteratorError7 = true;
                                _iteratorError7 = _context8.t1;

                            case 59:
                                _context8.prev = 59;
                                _context8.prev = 60;

                                if (!_iteratorNormalCompletion7 && _iterator7.return) {
                                    _iterator7.return();
                                }

                            case 62:
                                _context8.prev = 62;

                                if (!_didIteratorError7) {
                                    _context8.next = 65;
                                    break;
                                }

                                throw _iteratorError7;

                            case 65:
                                return _context8.finish(62);

                            case 66:
                                return _context8.finish(59);

                            case 67:
                                if (!(currMiners.length < this.globalOptions.minCreator)) {
                                    _context8.next = 82;
                                    break;
                                }

                                // 这个时候就需要从外面补充了
                                currLen = currMiners.length;

                            case 69:
                                if (!(creators.length > 0 && currMiners.length < this.globalOptions.minCreator)) {
                                    _context8.next = 82;
                                    break;
                                }

                                m = creators.shift();
                                i = 0;
                                i = 0;

                            case 73:
                                if (!(i < currLen)) {
                                    _context8.next = 79;
                                    break;
                                }

                                if (!(m === currMiners[i])) {
                                    _context8.next = 76;
                                    break;
                                }

                                return _context8.abrupt("break", 79);

                            case 76:
                                i++;
                                _context8.next = 73;
                                break;

                            case 79:
                                if (i === currLen) {
                                    currMiners.push(m);
                                }
                                _context8.next = 69;
                                break;

                            case 82:
                                if (currMiners.length < this.globalOptions.minCreator) {
                                    // 补充起来后，数量都还小于最小出块人数，这种情况是不是不应该存在啊，先报错吧
                                    // throw new Error();
                                    creators = minersInfo.creators;
                                } else {
                                    creators = currMiners;
                                }

                            case 83:
                                this._shuffle(blockhash, creators);
                                _context8.next = 86;
                                return kvCurDPOS.llen(ViewContext.keyNextMiners);

                            case 86:
                                llr = _context8.sent;

                                if (!llr.err) {
                                    _context8.next = 89;
                                    break;
                                }

                                return _context8.abrupt("return", { err: llr.err });

                            case 89:
                                ix = 0;

                            case 90:
                                if (!(ix < llr.value)) {
                                    _context8.next = 99;
                                    break;
                                }

                                _context8.next = 93;
                                return kvCurDPOS.lremove(ViewContext.keyNextMiners, 0);

                            case 93:
                                lrr = _context8.sent;

                                if (!lrr.err) {
                                    _context8.next = 96;
                                    break;
                                }

                                return _context8.abrupt("return", { err: lrr.err });

                            case 96:
                                ++ix;
                                _context8.next = 90;
                                break;

                            case 99:
                                _context8.next = 101;
                                return kvCurDPOS.rpushx(ViewContext.keyNextMiners, creators);

                            case 101:
                                lpr = _context8.sent;

                                if (!lpr.err) {
                                    _context8.next = 104;
                                    break;
                                }

                                return _context8.abrupt("return", { err: lpr.err });

                            case 104:
                                return _context8.abrupt("return", { err: error_code_1.ErrorCode.RESULT_OK });

                            case 105:
                            case "end":
                                return _context8.stop();
                        }
                    }
                }, _callee8, this, [[13, 17, 21, 29], [22,, 24, 28], [42, 55, 59, 67], [60,, 62, 66]]);
            }));

            function finishElection(_x5) {
                return _ref8.apply(this, arguments);
            }

            return finishElection;
        }()
    }, {
        key: "mortgage",
        value: function () {
            var _ref9 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee9(from, amount) {
                var kvDPos, stokeInfo, stoke;
                return _regenerator2.default.wrap(function _callee9$(_context9) {
                    while (1) {
                        switch (_context9.prev = _context9.next) {
                            case 0:
                                assert(amount.gt(0), 'amount must positive');
                                _context9.next = 3;
                                return this.database.getReadWritableKeyValue(ViewContext.kvDPOS);

                            case 3:
                                kvDPos = _context9.sent.kv;
                                _context9.next = 6;
                                return kvDPos.hget(ViewContext.keyStoke, from);

                            case 6:
                                stokeInfo = _context9.sent;
                                stoke = stokeInfo.err === error_code_1.ErrorCode.RESULT_OK ? stokeInfo.value : new bignumber_js_1.BigNumber(0);
                                _context9.next = 10;
                                return kvDPos.hset(ViewContext.keyStoke, from, stoke.plus(amount));

                            case 10:
                                _context9.next = 12;
                                return this._updatevote(from, amount);

                            case 12:
                                return _context9.abrupt("return", { err: error_code_1.ErrorCode.RESULT_OK, returnCode: error_code_1.ErrorCode.RESULT_OK });

                            case 13:
                            case "end":
                                return _context9.stop();
                        }
                    }
                }, _callee9, this);
            }));

            function mortgage(_x6, _x7) {
                return _ref9.apply(this, arguments);
            }

            return mortgage;
        }()
    }, {
        key: "unmortgage",
        value: function () {
            var _ref10 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee10(from, amount) {
                var kvDPos, stokeInfo, stoke;
                return _regenerator2.default.wrap(function _callee10$(_context10) {
                    while (1) {
                        switch (_context10.prev = _context10.next) {
                            case 0:
                                assert(amount.gt(0), 'amount must positive');
                                _context10.next = 3;
                                return this.database.getReadWritableKeyValue(ViewContext.kvDPOS);

                            case 3:
                                kvDPos = _context10.sent.kv;
                                _context10.next = 6;
                                return kvDPos.hget(ViewContext.keyStoke, from);

                            case 6:
                                stokeInfo = _context10.sent;

                                if (!stokeInfo.err) {
                                    _context10.next = 9;
                                    break;
                                }

                                return _context10.abrupt("return", { err: stokeInfo.err });

                            case 9:
                                stoke = stokeInfo.value;

                                if (!stoke.lt(amount)) {
                                    _context10.next = 12;
                                    break;
                                }

                                return _context10.abrupt("return", { err: error_code_1.ErrorCode.RESULT_OK, returnCode: error_code_1.ErrorCode.RESULT_NOT_ENOUGH });

                            case 12:
                                if (!stoke.isEqualTo(amount)) {
                                    _context10.next = 17;
                                    break;
                                }

                                _context10.next = 15;
                                return kvDPos.hdel(ViewContext.keyStoke, from);

                            case 15:
                                _context10.next = 19;
                                break;

                            case 17:
                                _context10.next = 19;
                                return kvDPos.hset(ViewContext.keyStoke, from, stoke.minus(amount));

                            case 19:
                                _context10.next = 21;
                                return this._updatevote(from, new bignumber_js_1.BigNumber(0).minus(amount));

                            case 21:
                                if (!stoke.isEqualTo(amount)) {
                                    _context10.next = 24;
                                    break;
                                }

                                _context10.next = 24;
                                return kvDPos.hdel(ViewContext.keyProducers, from);

                            case 24:
                                return _context10.abrupt("return", { err: error_code_1.ErrorCode.RESULT_OK, returnCode: error_code_1.ErrorCode.RESULT_OK });

                            case 25:
                            case "end":
                                return _context10.stop();
                        }
                    }
                }, _callee10, this);
            }));

            function unmortgage(_x8, _x9) {
                return _ref10.apply(this, arguments);
            }

            return unmortgage;
        }()
    }, {
        key: "vote",
        value: function () {
            var _ref11 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee11(from, candidates) {
                var cans, isValid, _iteratorNormalCompletion9, _didIteratorError9, _iteratorError9, _iterator9, _step9, p, kvDPos, stokeInfo, stoke, producerInfo, producers, i;

                return _regenerator2.default.wrap(function _callee11$(_context11) {
                    while (1) {
                        switch (_context11.prev = _context11.next) {
                            case 0:
                                candidates = this.removeDuplicate(candidates);
                                assert(candidates.length > 0 && candidates.length <= this.globalOptions.dposVoteMaxProducers, 'candidates.length must right');
                                _context11.next = 4;
                                return this.getValidCandidates();

                            case 4:
                                cans = _context11.sent;

                                if (!cans.err) {
                                    _context11.next = 7;
                                    break;
                                }

                                return _context11.abrupt("return", { err: cans.err });

                            case 7:
                                cans.candidates.sort();

                                isValid = function isValid(s) {
                                    var _iteratorNormalCompletion8 = true;
                                    var _didIteratorError8 = false;
                                    var _iteratorError8 = undefined;

                                    try {
                                        for (var _iterator8 = (0, _getIterator3.default)(cans.candidates), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
                                            var c = _step8.value;

                                            if (c === s) {
                                                return true;
                                            } else if (c > s) {
                                                return false;
                                            }
                                        }
                                    } catch (err) {
                                        _didIteratorError8 = true;
                                        _iteratorError8 = err;
                                    } finally {
                                        try {
                                            if (!_iteratorNormalCompletion8 && _iterator8.return) {
                                                _iterator8.return();
                                            }
                                        } finally {
                                            if (_didIteratorError8) {
                                                throw _iteratorError8;
                                            }
                                        }
                                    }

                                    return false;
                                };

                                _iteratorNormalCompletion9 = true;
                                _didIteratorError9 = false;
                                _iteratorError9 = undefined;
                                _context11.prev = 12;
                                _iterator9 = (0, _getIterator3.default)(candidates);

                            case 14:
                                if (_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done) {
                                    _context11.next = 21;
                                    break;
                                }

                                p = _step9.value;

                                if (isValid(p)) {
                                    _context11.next = 18;
                                    break;
                                }

                                return _context11.abrupt("return", { err: error_code_1.ErrorCode.RESULT_OK, returnCode: error_code_1.ErrorCode.RESULT_NOT_FOUND });

                            case 18:
                                _iteratorNormalCompletion9 = true;
                                _context11.next = 14;
                                break;

                            case 21:
                                _context11.next = 27;
                                break;

                            case 23:
                                _context11.prev = 23;
                                _context11.t0 = _context11["catch"](12);
                                _didIteratorError9 = true;
                                _iteratorError9 = _context11.t0;

                            case 27:
                                _context11.prev = 27;
                                _context11.prev = 28;

                                if (!_iteratorNormalCompletion9 && _iterator9.return) {
                                    _iterator9.return();
                                }

                            case 30:
                                _context11.prev = 30;

                                if (!_didIteratorError9) {
                                    _context11.next = 33;
                                    break;
                                }

                                throw _iteratorError9;

                            case 33:
                                return _context11.finish(30);

                            case 34:
                                return _context11.finish(27);

                            case 35:
                                _context11.next = 37;
                                return this.database.getReadWritableKeyValue(ViewContext.kvDPOS);

                            case 37:
                                kvDPos = _context11.sent.kv;
                                _context11.next = 40;
                                return kvDPos.hget(ViewContext.keyStoke, from);

                            case 40:
                                stokeInfo = _context11.sent;

                                if (!stokeInfo.err) {
                                    _context11.next = 43;
                                    break;
                                }

                                return _context11.abrupt("return", { err: error_code_1.ErrorCode.RESULT_OK, returnCode: error_code_1.ErrorCode.RESULT_NOT_ENOUGH });

                            case 43:
                                stoke = stokeInfo.value;
                                _context11.next = 46;
                                return kvDPos.hget(ViewContext.keyProducers, from);

                            case 46:
                                producerInfo = _context11.sent;

                                if (!(producerInfo.err === error_code_1.ErrorCode.RESULT_OK)) {
                                    _context11.next = 64;
                                    break;
                                }

                                producers = producerInfo.value;

                                if (!(producers.length === candidates.length)) {
                                    _context11.next = 62;
                                    break;
                                }

                                producers.sort();
                                candidates.sort();
                                i = 0;
                                i = 0;

                            case 54:
                                if (!(i < producers.length)) {
                                    _context11.next = 60;
                                    break;
                                }

                                if (!(producers[i] !== candidates[i])) {
                                    _context11.next = 57;
                                    break;
                                }

                                return _context11.abrupt("break", 60);

                            case 57:
                                i++;
                                _context11.next = 54;
                                break;

                            case 60:
                                if (!(i === producers.length)) {
                                    _context11.next = 62;
                                    break;
                                }

                                return _context11.abrupt("return", { err: error_code_1.ErrorCode.RESULT_OK, returnCode: error_code_1.ErrorCode.RESULT_OK });

                            case 62:
                                _context11.next = 64;
                                return this._updatevote(from, new bignumber_js_1.BigNumber(0).minus(stoke));

                            case 64:
                                _context11.next = 66;
                                return kvDPos.hset(ViewContext.keyProducers, from, candidates);

                            case 66:
                                _context11.next = 68;
                                return this._updatevote(from, stoke);

                            case 68:
                                return _context11.abrupt("return", { err: error_code_1.ErrorCode.RESULT_OK, returnCode: error_code_1.ErrorCode.RESULT_OK });

                            case 69:
                            case "end":
                                return _context11.stop();
                        }
                    }
                }, _callee11, this, [[12, 23, 27, 35], [28,, 30, 34]]);
            }));

            function vote(_x10, _x11) {
                return _ref11.apply(this, arguments);
            }

            return vote;
        }()
    }, {
        key: "registerToCandidate",
        value: function () {
            var _ref12 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee12(candidate) {
                var kvDPos, her;
                return _regenerator2.default.wrap(function _callee12$(_context12) {
                    while (1) {
                        switch (_context12.prev = _context12.next) {
                            case 0:
                                _context12.next = 2;
                                return this.database.getReadWritableKeyValue(ViewContext.kvDPOS);

                            case 2:
                                kvDPos = _context12.sent.kv;
                                _context12.next = 5;
                                return kvDPos.hexists(ViewContext.keyCandidate, candidate);

                            case 5:
                                her = _context12.sent;

                                if (!her.err) {
                                    _context12.next = 8;
                                    break;
                                }

                                return _context12.abrupt("return", { err: her.err });

                            case 8:
                                if (!her.value) {
                                    _context12.next = 10;
                                    break;
                                }

                                return _context12.abrupt("return", { err: error_code_1.ErrorCode.RESULT_OK, returnCode: error_code_1.ErrorCode.RESULT_OK });

                            case 10:
                                _context12.next = 12;
                                return kvDPos.hset(ViewContext.keyCandidate, candidate, 0);

                            case 12:
                                return _context12.abrupt("return", { err: error_code_1.ErrorCode.RESULT_OK, returnCode: error_code_1.ErrorCode.RESULT_OK });

                            case 13:
                            case "end":
                                return _context12.stop();
                        }
                    }
                }, _callee12, this);
            }));

            function registerToCandidate(_x12) {
                return _ref12.apply(this, arguments);
            }

            return registerToCandidate;
        }()
    }, {
        key: "unbanProducer",
        value: function () {
            var _ref13 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee13(timestamp) {
                var kvDPos, candidateInfo, _iteratorNormalCompletion10, _didIteratorError10, _iteratorError10, _iterator10, _step10, c;

                return _regenerator2.default.wrap(function _callee13$(_context13) {
                    while (1) {
                        switch (_context13.prev = _context13.next) {
                            case 0:
                                _context13.next = 2;
                                return this.database.getReadWritableKeyValue(ViewContext.kvDPOS);

                            case 2:
                                kvDPos = _context13.sent.kv;
                                _context13.next = 5;
                                return kvDPos.hgetall(ViewContext.keyCandidate);

                            case 5:
                                candidateInfo = _context13.sent;
                                _iteratorNormalCompletion10 = true;
                                _didIteratorError10 = false;
                                _iteratorError10 = undefined;
                                _context13.prev = 9;
                                _iterator10 = (0, _getIterator3.default)(candidateInfo.value);

                            case 11:
                                if (_iteratorNormalCompletion10 = (_step10 = _iterator10.next()).done) {
                                    _context13.next = 19;
                                    break;
                                }

                                c = _step10.value;

                                if (!(c.value !== 0 && c.value <= timestamp)) {
                                    _context13.next = 16;
                                    break;
                                }

                                _context13.next = 16;
                                return kvDPos.hset(ViewContext.keyCandidate, c.key, 0);

                            case 16:
                                _iteratorNormalCompletion10 = true;
                                _context13.next = 11;
                                break;

                            case 19:
                                _context13.next = 25;
                                break;

                            case 21:
                                _context13.prev = 21;
                                _context13.t0 = _context13["catch"](9);
                                _didIteratorError10 = true;
                                _iteratorError10 = _context13.t0;

                            case 25:
                                _context13.prev = 25;
                                _context13.prev = 26;

                                if (!_iteratorNormalCompletion10 && _iterator10.return) {
                                    _iterator10.return();
                                }

                            case 28:
                                _context13.prev = 28;

                                if (!_didIteratorError10) {
                                    _context13.next = 31;
                                    break;
                                }

                                throw _iteratorError10;

                            case 31:
                                return _context13.finish(28);

                            case 32:
                                return _context13.finish(25);

                            case 33:
                            case "end":
                                return _context13.stop();
                        }
                    }
                }, _callee13, this, [[9, 21, 25, 33], [26,, 28, 32]]);
            }));

            function unbanProducer(_x13) {
                return _ref13.apply(this, arguments);
            }

            return unbanProducer;
        }()
    }, {
        key: "banProducer",
        value: function () {
            var _ref14 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee14(timestamp) {
                var kvDPos, allTimeInfo, minersInfo, _iteratorNormalCompletion11, _didIteratorError11, _iteratorError11, _iterator11, _step11, m, i;

                return _regenerator2.default.wrap(function _callee14$(_context14) {
                    while (1) {
                        switch (_context14.prev = _context14.next) {
                            case 0:
                                _context14.next = 2;
                                return this.database.getReadWritableKeyValue(ViewContext.kvDPOS);

                            case 2:
                                kvDPos = _context14.sent.kv;
                                _context14.next = 5;
                                return kvDPos.hgetall(ViewContext.keyNewBlockTime);

                            case 5:
                                allTimeInfo = _context14.sent;
                                _context14.next = 8;
                                return this.getNextMiners();

                            case 8:
                                minersInfo = _context14.sent;

                                assert(minersInfo.err === error_code_1.ErrorCode.RESULT_OK);
                                _iteratorNormalCompletion11 = true;
                                _didIteratorError11 = false;
                                _iteratorError11 = undefined;
                                _context14.prev = 13;
                                _iterator11 = (0, _getIterator3.default)(minersInfo.creators);

                            case 15:
                                if (_iteratorNormalCompletion11 = (_step11 = _iterator11.next()).done) {
                                    _context14.next = 30;
                                    break;
                                }

                                m = _step11.value;
                                i = 0;

                            case 18:
                                if (!(i < allTimeInfo.value.length)) {
                                    _context14.next = 27;
                                    break;
                                }

                                if (!(m === allTimeInfo.value[i].key)) {
                                    _context14.next = 24;
                                    break;
                                }

                                if (!(timestamp - allTimeInfo.value[i].value >= this.globalOptions.timeOffsetToLastBlock)) {
                                    _context14.next = 23;
                                    break;
                                }

                                _context14.next = 23;
                                return kvDPos.hset(ViewContext.keyCandidate, m, timestamp + this.globalOptions.timeBan);

                            case 23:
                                return _context14.abrupt("break", 27);

                            case 24:
                                i++;
                                _context14.next = 18;
                                break;

                            case 27:
                                _iteratorNormalCompletion11 = true;
                                _context14.next = 15;
                                break;

                            case 30:
                                _context14.next = 36;
                                break;

                            case 32:
                                _context14.prev = 32;
                                _context14.t0 = _context14["catch"](13);
                                _didIteratorError11 = true;
                                _iteratorError11 = _context14.t0;

                            case 36:
                                _context14.prev = 36;
                                _context14.prev = 37;

                                if (!_iteratorNormalCompletion11 && _iterator11.return) {
                                    _iterator11.return();
                                }

                            case 39:
                                _context14.prev = 39;

                                if (!_didIteratorError11) {
                                    _context14.next = 42;
                                    break;
                                }

                                throw _iteratorError11;

                            case 42:
                                return _context14.finish(39);

                            case 43:
                                return _context14.finish(36);

                            case 44:
                            case "end":
                                return _context14.stop();
                        }
                    }
                }, _callee14, this, [[13, 32, 36, 44], [37,, 39, 43]]);
            }));

            function banProducer(_x14) {
                return _ref14.apply(this, arguments);
            }

            return banProducer;
        }()
    }, {
        key: "updateProducerTime",
        value: function () {
            var _ref15 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee15(producer, timestamp) {
                var kvDPos;
                return _regenerator2.default.wrap(function _callee15$(_context15) {
                    while (1) {
                        switch (_context15.prev = _context15.next) {
                            case 0:
                                _context15.next = 2;
                                return this.database.getReadWritableKeyValue(ViewContext.kvDPOS);

                            case 2:
                                kvDPos = _context15.sent.kv;
                                _context15.next = 5;
                                return kvDPos.hset(ViewContext.keyNewBlockTime, producer, timestamp);

                            case 5:
                            case "end":
                                return _context15.stop();
                        }
                    }
                }, _callee15, this);
            }));

            function updateProducerTime(_x15, _x16) {
                return _ref15.apply(this, arguments);
            }

            return updateProducerTime;
        }()
    }, {
        key: "maintain_producer",
        value: function () {
            var _ref16 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee16(timestamp) {
                var kvDPos, minersInfo, _iteratorNormalCompletion12, _didIteratorError12, _iteratorError12, _iterator12, _step12, m, her, allTimeInfo, _iteratorNormalCompletion13, _didIteratorError13, _iteratorError13, _iterator13, _step13, p, i, _her;

                return _regenerator2.default.wrap(function _callee16$(_context16) {
                    while (1) {
                        switch (_context16.prev = _context16.next) {
                            case 0:
                                _context16.next = 2;
                                return this.database.getReadWritableKeyValue(ViewContext.kvDPOS);

                            case 2:
                                kvDPos = _context16.sent.kv;
                                _context16.next = 5;
                                return this.getNextMiners();

                            case 5:
                                minersInfo = _context16.sent;

                                assert(minersInfo.err === error_code_1.ErrorCode.RESULT_OK);
                                _iteratorNormalCompletion12 = true;
                                _didIteratorError12 = false;
                                _iteratorError12 = undefined;
                                _context16.prev = 10;
                                _iterator12 = (0, _getIterator3.default)(minersInfo.creators);

                            case 12:
                                if (_iteratorNormalCompletion12 = (_step12 = _iterator12.next()).done) {
                                    _context16.next = 25;
                                    break;
                                }

                                m = _step12.value;
                                _context16.next = 16;
                                return kvDPos.hexists(ViewContext.keyNewBlockTime, m);

                            case 16:
                                her = _context16.sent;

                                if (!her.err) {
                                    _context16.next = 19;
                                    break;
                                }

                                return _context16.abrupt("return", her.err);

                            case 19:
                                if (her.value) {
                                    _context16.next = 22;
                                    break;
                                }

                                _context16.next = 22;
                                return kvDPos.hset(ViewContext.keyNewBlockTime, m, timestamp);

                            case 22:
                                _iteratorNormalCompletion12 = true;
                                _context16.next = 12;
                                break;

                            case 25:
                                _context16.next = 31;
                                break;

                            case 27:
                                _context16.prev = 27;
                                _context16.t0 = _context16["catch"](10);
                                _didIteratorError12 = true;
                                _iteratorError12 = _context16.t0;

                            case 31:
                                _context16.prev = 31;
                                _context16.prev = 32;

                                if (!_iteratorNormalCompletion12 && _iterator12.return) {
                                    _iterator12.return();
                                }

                            case 34:
                                _context16.prev = 34;

                                if (!_didIteratorError12) {
                                    _context16.next = 37;
                                    break;
                                }

                                throw _iteratorError12;

                            case 37:
                                return _context16.finish(34);

                            case 38:
                                return _context16.finish(31);

                            case 39:
                                _context16.next = 41;
                                return kvDPos.hgetall(ViewContext.keyNewBlockTime);

                            case 41:
                                allTimeInfo = _context16.sent;
                                _iteratorNormalCompletion13 = true;
                                _didIteratorError13 = false;
                                _iteratorError13 = undefined;
                                _context16.prev = 45;
                                _iterator13 = (0, _getIterator3.default)(allTimeInfo.value);

                            case 47:
                                if (_iteratorNormalCompletion13 = (_step13 = _iterator13.next()).done) {
                                    _context16.next = 69;
                                    break;
                                }

                                p = _step13.value;
                                i = 0;
                                i = 0;

                            case 51:
                                if (!(i < minersInfo.creators.length)) {
                                    _context16.next = 57;
                                    break;
                                }

                                if (!(p.key === minersInfo.creators[i])) {
                                    _context16.next = 54;
                                    break;
                                }

                                return _context16.abrupt("break", 57);

                            case 54:
                                i++;
                                _context16.next = 51;
                                break;

                            case 57:
                                if (!(i === minersInfo.creators.length)) {
                                    _context16.next = 66;
                                    break;
                                }

                                _context16.next = 60;
                                return kvDPos.hexists(ViewContext.keyNewBlockTime, p.key);

                            case 60:
                                _her = _context16.sent;

                                if (!_her.err) {
                                    _context16.next = 63;
                                    break;
                                }

                                return _context16.abrupt("return", _her.err);

                            case 63:
                                if (!_her.value) {
                                    _context16.next = 66;
                                    break;
                                }

                                _context16.next = 66;
                                return kvDPos.hdel(ViewContext.keyNewBlockTime, p.key);

                            case 66:
                                _iteratorNormalCompletion13 = true;
                                _context16.next = 47;
                                break;

                            case 69:
                                _context16.next = 75;
                                break;

                            case 71:
                                _context16.prev = 71;
                                _context16.t1 = _context16["catch"](45);
                                _didIteratorError13 = true;
                                _iteratorError13 = _context16.t1;

                            case 75:
                                _context16.prev = 75;
                                _context16.prev = 76;

                                if (!_iteratorNormalCompletion13 && _iterator13.return) {
                                    _iterator13.return();
                                }

                            case 78:
                                _context16.prev = 78;

                                if (!_didIteratorError13) {
                                    _context16.next = 81;
                                    break;
                                }

                                throw _iteratorError13;

                            case 81:
                                return _context16.finish(78);

                            case 82:
                                return _context16.finish(75);

                            case 83:
                                return _context16.abrupt("return", error_code_1.ErrorCode.RESULT_OK);

                            case 84:
                            case "end":
                                return _context16.stop();
                        }
                    }
                }, _callee16, this, [[10, 27, 31, 39], [32,, 34, 38], [45, 71, 75, 83], [76,, 78, 82]]);
            }));

            function maintain_producer(_x17) {
                return _ref16.apply(this, arguments);
            }

            return maintain_producer;
        }()
    }, {
        key: "_updatevote",
        value: function () {
            var _ref17 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee17(voteor, amount) {
                var kvDPos, producerInfo, producers, _iteratorNormalCompletion14, _didIteratorError14, _iteratorError14, _iterator14, _step14, p, voteInfo, vote;

                return _regenerator2.default.wrap(function _callee17$(_context17) {
                    while (1) {
                        switch (_context17.prev = _context17.next) {
                            case 0:
                                _context17.next = 2;
                                return this.database.getReadWritableKeyValue(ViewContext.kvDPOS);

                            case 2:
                                kvDPos = _context17.sent.kv;
                                _context17.next = 5;
                                return kvDPos.hget(ViewContext.keyProducers, voteor);

                            case 5:
                                producerInfo = _context17.sent;

                                if (!(producerInfo.err === error_code_1.ErrorCode.RESULT_OK)) {
                                    _context17.next = 49;
                                    break;
                                }

                                producers = producerInfo.value;
                                _iteratorNormalCompletion14 = true;
                                _didIteratorError14 = false;
                                _iteratorError14 = undefined;
                                _context17.prev = 11;
                                _iterator14 = (0, _getIterator3.default)(producers);

                            case 13:
                                if (_iteratorNormalCompletion14 = (_step14 = _iterator14.next()).done) {
                                    _context17.next = 35;
                                    break;
                                }

                                p = _step14.value;
                                _context17.next = 17;
                                return kvDPos.hget(ViewContext.keyVote, p);

                            case 17:
                                voteInfo = _context17.sent;

                                if (!(voteInfo.err === error_code_1.ErrorCode.RESULT_OK)) {
                                    _context17.next = 29;
                                    break;
                                }

                                vote = voteInfo.value.plus(amount);

                                if (!vote.eq(0)) {
                                    _context17.next = 25;
                                    break;
                                }

                                _context17.next = 23;
                                return kvDPos.hdel(ViewContext.keyVote, p);

                            case 23:
                                _context17.next = 27;
                                break;

                            case 25:
                                _context17.next = 27;
                                return kvDPos.hset(ViewContext.keyVote, p, vote);

                            case 27:
                                _context17.next = 32;
                                break;

                            case 29:
                                assert(amount.gt(0), '_updatevote amount must positive');
                                _context17.next = 32;
                                return kvDPos.hset(ViewContext.keyVote, p, amount);

                            case 32:
                                _iteratorNormalCompletion14 = true;
                                _context17.next = 13;
                                break;

                            case 35:
                                _context17.next = 41;
                                break;

                            case 37:
                                _context17.prev = 37;
                                _context17.t0 = _context17["catch"](11);
                                _didIteratorError14 = true;
                                _iteratorError14 = _context17.t0;

                            case 41:
                                _context17.prev = 41;
                                _context17.prev = 42;

                                if (!_iteratorNormalCompletion14 && _iterator14.return) {
                                    _iterator14.return();
                                }

                            case 44:
                                _context17.prev = 44;

                                if (!_didIteratorError14) {
                                    _context17.next = 47;
                                    break;
                                }

                                throw _iteratorError14;

                            case 47:
                                return _context17.finish(44);

                            case 48:
                                return _context17.finish(41);

                            case 49:
                                return _context17.abrupt("return", error_code_1.ErrorCode.RESULT_OK);

                            case 50:
                            case "end":
                                return _context17.stop();
                        }
                    }
                }, _callee17, this, [[11, 37, 41, 49], [42,, 44, 48]]);
            }));

            function _updatevote(_x18, _x19) {
                return _ref17.apply(this, arguments);
            }

            return _updatevote;
        }()
    }, {
        key: "_shuffle",
        value: function _shuffle(blockhash, producers) {
            var buf = Buffer.from(blockhash);
            var total = 0;
            for (var i = 0; i < buf.length; i++) {
                total = total + buf[i];
            }
            for (var _i = 0; _i < producers.length; ++_i) {
                var k = total + _i * 2685821657736338717;
                k ^= k >> 12;
                k ^= k << 25;
                k ^= k >> 27;
                k *= 2685821657736338717;
                var jmax = producers.length - _i;
                var j = _i + k % jmax;
                var temp = producers[_i];
                producers[_i] = producers[j];
                producers[j] = temp;
            }
        }
    }, {
        key: "database",
        get: function get() {
            return this.m_database;
        }
    }]);
    return Context;
}(ViewContext);

exports.Context = Context;