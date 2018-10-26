"use strict";

var _getIterator2 = require("babel-runtime/core-js/get-iterator");

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _regenerator = require("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require("babel-runtime/helpers/asyncToGenerator");

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _createClass2 = require("babel-runtime/helpers/createClass");

var _createClass3 = _interopRequireDefault(_createClass2);

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

Object.defineProperty(exports, "__esModule", { value: true });
var block_1 = require("./block");
var writer_1 = require("../lib/writer");
var reader_1 = require("../lib/reader");
var error_code_1 = require("../error_code");
var assert = require("assert");
var LRUCache_1 = require("../lib/LRUCache");
var Lock_1 = require("../lib/Lock");
var tx_storage_1 = require("./tx_storage");
var initHeaderSql = 'CREATE TABLE IF NOT EXISTS "headers"("hash" CHAR(64) PRIMARY KEY NOT NULL UNIQUE, "pre" CHAR(64) NOT NULL, "verified" TINYINT NOT NULL, "raw" BLOB NOT NULL);';
var initBestSql = 'CREATE TABLE IF NOT EXISTS "best"("height" INTEGER PRIMARY KEY NOT NULL UNIQUE, "hash" CHAR(64) NOT NULL,  "timestamp" INTEGER NOT NULL);';
var getByHashSql = 'SELECT raw, verified FROM headers WHERE hash = $hash';
var getByTimestampSql = 'SELECT h.raw, h.verified FROM headers AS h LEFT JOIN best AS b ON b.hash = h.hash WHERE b.timestamp = $timestamp';
var getHeightOnBestSql = 'SELECT b.height, h.raw, h.verified FROM headers AS h LEFT JOIN best AS b ON b.hash = h.hash WHERE b.hash = $hash';
var getByHeightSql = 'SELECT h.raw, h.verified FROM headers AS h LEFT JOIN best AS b ON b.hash = h.hash WHERE b.height = $height';
var insertHeaderSql = 'INSERT INTO headers (hash, pre, raw, verified) VALUES($hash, $pre, $raw, $verified)';
var getBestHeightSql = 'SELECT max(height) AS height FROM best';
var rollbackBestSql = 'DELETE best WHERE height > $height';
var extendBestSql = 'INSERT INTO best (hash, height, timestamp) VALUES($hash, $height, $timestamp)';
var getTipSql = 'SELECT h.raw, h.verified FROM headers AS h LEFT JOIN best AS b ON b.hash = h.hash ORDER BY b.height DESC';
var updateVerifiedSql = 'UPDATE headers SET verified=$verified WHERE hash=$hash';
var getByPreBlockSql = 'SELECT raw, verified FROM headers WHERE pre = $pre';
var VERIFY_STATE;
(function (VERIFY_STATE) {
    VERIFY_STATE[VERIFY_STATE["notVerified"] = 0] = "notVerified";
    VERIFY_STATE[VERIFY_STATE["verified"] = 1] = "verified";
    VERIFY_STATE[VERIFY_STATE["invalid"] = 2] = "invalid";
})(VERIFY_STATE = exports.VERIFY_STATE || (exports.VERIFY_STATE = {}));

var BlockHeaderEntry = function BlockHeaderEntry(blockheader, verified) {
    (0, _classCallCheck3.default)(this, BlockHeaderEntry);

    this.blockheader = blockheader;
    this.verified = verified;
};

var HeaderStorage = function () {
    function HeaderStorage(options) {
        (0, _classCallCheck3.default)(this, HeaderStorage);

        this.m_transactionLock = new Lock_1.Lock();
        this.m_db = options.db;
        this.m_blockHeaderType = options.blockHeaderType;
        this.m_logger = options.logger;
        this.m_cacheHeight = new LRUCache_1.LRUCache(100);
        this.m_cacheHash = new LRUCache_1.LRUCache(100);
        this.m_txView = new tx_storage_1.TxStorage({ logger: options.logger, db: options.db, blockstorage: options.blockStorage });
    }

    (0, _createClass3.default)(HeaderStorage, [{
        key: "init",
        value: function () {
            var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
                var stmt;
                return _regenerator2.default.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                _context.prev = 0;
                                _context.next = 3;
                                return this.m_db.run(initHeaderSql);

                            case 3:
                                stmt = _context.sent;
                                _context.next = 6;
                                return this.m_db.run(initBestSql);

                            case 6:
                                stmt = _context.sent;
                                _context.next = 13;
                                break;

                            case 9:
                                _context.prev = 9;
                                _context.t0 = _context["catch"](0);

                                this.m_logger.error(_context.t0);
                                return _context.abrupt("return", error_code_1.ErrorCode.RESULT_EXCEPTION);

                            case 13:
                                _context.next = 15;
                                return this.m_txView.init();

                            case 15:
                                return _context.abrupt("return", _context.sent);

                            case 16:
                            case "end":
                                return _context.stop();
                        }
                    }
                }, _callee, this, [[0, 9]]);
            }));

            function init() {
                return _ref.apply(this, arguments);
            }

            return init;
        }()
    }, {
        key: "uninit",
        value: function uninit() {
            this.m_txView.uninit();
        }
    }, {
        key: "getHeader",
        value: function () {
            var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(arg1, arg2) {
                var header, fromHeader, hr, headers, ix, _hr;

                return _regenerator2.default.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                header = void 0;

                                if (!(arg2 === undefined || arg2 === undefined)) {
                                    _context2.next = 10;
                                    break;
                                }

                                if (!(arg1 instanceof block_1.BlockHeader)) {
                                    _context2.next = 5;
                                    break;
                                }

                                assert(false);
                                return _context2.abrupt("return", { err: error_code_1.ErrorCode.RESULT_INVALID_PARAM });

                            case 5:
                                _context2.next = 7;
                                return this._loadHeader(arg1);

                            case 7:
                                return _context2.abrupt("return", _context2.sent);

                            case 10:
                                fromHeader = void 0;

                                if (!(arg1 instanceof block_1.BlockHeader)) {
                                    _context2.next = 15;
                                    break;
                                }

                                fromHeader = arg1;
                                _context2.next = 21;
                                break;

                            case 15:
                                _context2.next = 17;
                                return this._loadHeader(arg1);

                            case 17:
                                hr = _context2.sent;

                                if (!hr.err) {
                                    _context2.next = 20;
                                    break;
                                }

                                return _context2.abrupt("return", hr);

                            case 20:
                                fromHeader = hr.header;

                            case 21:
                                headers = [];

                                headers.push(fromHeader);

                                if (!(arg2 > 0)) {
                                    _context2.next = 28;
                                    break;
                                }

                                assert(false);
                                return _context2.abrupt("return", { err: error_code_1.ErrorCode.RESULT_INVALID_PARAM });

                            case 28:
                                if (fromHeader.number + arg2 < 0) {
                                    arg2 = -fromHeader.number;
                                }
                                ix = 0;

                            case 30:
                                if (!(ix < -arg2)) {
                                    _context2.next = 41;
                                    break;
                                }

                                _context2.next = 33;
                                return this._loadHeader(fromHeader.preBlockHash);

                            case 33:
                                _hr = _context2.sent;

                                if (!_hr.err) {
                                    _context2.next = 36;
                                    break;
                                }

                                return _context2.abrupt("return", _hr);

                            case 36:
                                fromHeader = _hr.header;
                                headers.push(fromHeader);

                            case 38:
                                ++ix;
                                _context2.next = 30;
                                break;

                            case 41:
                                headers = headers.reverse();
                                return _context2.abrupt("return", { err: error_code_1.ErrorCode.RESULT_OK, header: headers[0], headers: headers });

                            case 43:
                            case "end":
                                return _context2.stop();
                        }
                    }
                }, _callee2, this);
            }));

            function getHeader(_x, _x2) {
                return _ref2.apply(this, arguments);
            }

            return getHeader;
        }()
    }, {
        key: "_loadHeader",
        value: function () {
            var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(arg) {
                var rawHeader, verified, headerEntry, result, _result2, _headerEntry, _result3, header, err, entry;

                return _regenerator2.default.wrap(function _callee3$(_context3) {
                    while (1) {
                        switch (_context3.prev = _context3.next) {
                            case 0:
                                rawHeader = void 0;
                                verified = void 0;

                                if (!(typeof arg === 'number')) {
                                    _context3.next = 22;
                                    break;
                                }

                                headerEntry = this.m_cacheHeight.get(arg);

                                if (!headerEntry) {
                                    _context3.next = 6;
                                    break;
                                }

                                return _context3.abrupt("return", { err: error_code_1.ErrorCode.RESULT_OK, header: headerEntry.blockheader, verified: headerEntry.verified });

                            case 6:
                                _context3.prev = 6;
                                _context3.next = 9;
                                return this.m_db.get(getByHeightSql, { $height: arg });

                            case 9:
                                result = _context3.sent;

                                if (result) {
                                    _context3.next = 12;
                                    break;
                                }

                                return _context3.abrupt("return", { err: error_code_1.ErrorCode.RESULT_NOT_FOUND });

                            case 12:
                                rawHeader = result.raw;
                                verified = result.verified;
                                _context3.next = 20;
                                break;

                            case 16:
                                _context3.prev = 16;
                                _context3.t0 = _context3["catch"](6);

                                this.m_logger.error("load Header height " + arg + " failed, " + _context3.t0);
                                return _context3.abrupt("return", { err: error_code_1.ErrorCode.RESULT_EXCEPTION });

                            case 20:
                                _context3.next = 61;
                                break;

                            case 22:
                                if (!(typeof arg === 'string')) {
                                    _context3.next = 60;
                                    break;
                                }

                                if (!(arg === 'latest')) {
                                    _context3.next = 40;
                                    break;
                                }

                                _context3.prev = 24;
                                _context3.next = 27;
                                return this.m_db.get(getTipSql);

                            case 27:
                                _result2 = _context3.sent;

                                if (_result2) {
                                    _context3.next = 30;
                                    break;
                                }

                                return _context3.abrupt("return", { err: error_code_1.ErrorCode.RESULT_NOT_FOUND });

                            case 30:
                                rawHeader = _result2.raw;
                                verified = _result2.verified;
                                _context3.next = 38;
                                break;

                            case 34:
                                _context3.prev = 34;
                                _context3.t1 = _context3["catch"](24);

                                this.m_logger.error("load latest Header failed, " + _context3.t1);
                                return _context3.abrupt("return", { err: error_code_1.ErrorCode.RESULT_EXCEPTION });

                            case 38:
                                _context3.next = 58;
                                break;

                            case 40:
                                _headerEntry = this.m_cacheHash.get(arg);

                                if (!_headerEntry) {
                                    _context3.next = 44;
                                    break;
                                }

                                this.m_logger.debug("get header storage directly from cache hash: " + _headerEntry.blockheader.hash + " number: " + _headerEntry.blockheader.number + " verified: " + _headerEntry.verified);
                                return _context3.abrupt("return", { err: error_code_1.ErrorCode.RESULT_OK, header: _headerEntry.blockheader, verified: _headerEntry.verified });

                            case 44:
                                _context3.prev = 44;
                                _context3.next = 47;
                                return this.m_db.get(getByHashSql, { $hash: arg });

                            case 47:
                                _result3 = _context3.sent;

                                if (_result3) {
                                    _context3.next = 50;
                                    break;
                                }

                                return _context3.abrupt("return", { err: error_code_1.ErrorCode.RESULT_NOT_FOUND });

                            case 50:
                                rawHeader = _result3.raw;
                                verified = _result3.verified;
                                _context3.next = 58;
                                break;

                            case 54:
                                _context3.prev = 54;
                                _context3.t2 = _context3["catch"](44);

                                this.m_logger.error("load Header hash " + arg + " failed, " + _context3.t2);
                                return _context3.abrupt("return", { err: error_code_1.ErrorCode.RESULT_EXCEPTION });

                            case 58:
                                _context3.next = 61;
                                break;

                            case 60:
                                return _context3.abrupt("return", { err: error_code_1.ErrorCode.RESULT_INVALID_PARAM });

                            case 61:
                                header = new this.m_blockHeaderType();
                                err = header.decode(new reader_1.BufferReader(rawHeader, false));

                                if (!(err !== error_code_1.ErrorCode.RESULT_OK)) {
                                    _context3.next = 66;
                                    break;
                                }

                                this.m_logger.error("decode header " + arg + " from header storage failed");
                                return _context3.abrupt("return", { err: err });

                            case 66:
                                if (!(arg !== 'latest' && header.number !== arg && header.hash !== arg)) {
                                    _context3.next = 68;
                                    break;
                                }

                                return _context3.abrupt("return", { err: error_code_1.ErrorCode.RESULT_EXCEPTION });

                            case 68:
                                entry = new BlockHeaderEntry(header, verified);

                                this.m_logger.debug("update header storage cache hash: " + header.hash + " number: " + header.number + " verified: " + verified);
                                this.m_cacheHash.set(header.hash, entry);
                                if (typeof arg === 'number') {
                                    this.m_cacheHeight.set(header.number, entry);
                                }
                                return _context3.abrupt("return", { err: error_code_1.ErrorCode.RESULT_OK, header: header, verified: verified });

                            case 73:
                            case "end":
                                return _context3.stop();
                        }
                    }
                }, _callee3, this, [[6, 16], [24, 34], [44, 54]]);
            }));

            function _loadHeader(_x3) {
                return _ref3.apply(this, arguments);
            }

            return _loadHeader;
        }()
    }, {
        key: "getHeightOnBest",
        value: function () {
            var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4(hash) {
                var result, header, err;
                return _regenerator2.default.wrap(function _callee4$(_context4) {
                    while (1) {
                        switch (_context4.prev = _context4.next) {
                            case 0:
                                _context4.next = 2;
                                return this.m_db.get(getHeightOnBestSql, { $hash: hash });

                            case 2:
                                result = _context4.sent;

                                if (!(!result || result.height === undefined)) {
                                    _context4.next = 5;
                                    break;
                                }

                                return _context4.abrupt("return", { err: error_code_1.ErrorCode.RESULT_NOT_FOUND });

                            case 5:
                                header = new this.m_blockHeaderType();
                                err = header.decode(new reader_1.BufferReader(result.raw, false));

                                if (!(err !== error_code_1.ErrorCode.RESULT_OK)) {
                                    _context4.next = 10;
                                    break;
                                }

                                this.m_logger.error("decode header " + hash + " from header storage failed");
                                return _context4.abrupt("return", { err: err });

                            case 10:
                                return _context4.abrupt("return", { err: error_code_1.ErrorCode.RESULT_OK, height: result.height, header: header });

                            case 11:
                            case "end":
                                return _context4.stop();
                        }
                    }
                }, _callee4, this);
            }));

            function getHeightOnBest(_x4) {
                return _ref4.apply(this, arguments);
            }

            return getHeightOnBest;
        }()
    }, {
        key: "_saveHeader",
        value: function () {
            var _ref5 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee5(header) {
                var writer, err, headerRaw;
                return _regenerator2.default.wrap(function _callee5$(_context5) {
                    while (1) {
                        switch (_context5.prev = _context5.next) {
                            case 0:
                                writer = new writer_1.BufferWriter();
                                err = header.encode(writer);

                                if (!err) {
                                    _context5.next = 5;
                                    break;
                                }

                                this.m_logger.error("encode header failed ", err);
                                return _context5.abrupt("return", err);

                            case 5:
                                _context5.prev = 5;
                                headerRaw = writer.render();
                                _context5.next = 9;
                                return this.m_db.run(insertHeaderSql, { $hash: header.hash, $raw: headerRaw, $pre: header.preBlockHash, $verified: VERIFY_STATE.notVerified });

                            case 9:
                                _context5.next = 15;
                                break;

                            case 11:
                                _context5.prev = 11;
                                _context5.t0 = _context5["catch"](5);

                                this.m_logger.error("save Header " + header.hash + "(" + header.number + ") failed, " + _context5.t0);
                                return _context5.abrupt("return", error_code_1.ErrorCode.RESULT_EXCEPTION);

                            case 15:
                                return _context5.abrupt("return", error_code_1.ErrorCode.RESULT_OK);

                            case 16:
                            case "end":
                                return _context5.stop();
                        }
                    }
                }, _callee5, this, [[5, 11]]);
            }));

            function _saveHeader(_x5) {
                return _ref5.apply(this, arguments);
            }

            return _saveHeader;
        }()
    }, {
        key: "saveHeader",
        value: function () {
            var _ref6 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee6(header) {
                return _regenerator2.default.wrap(function _callee6$(_context6) {
                    while (1) {
                        switch (_context6.prev = _context6.next) {
                            case 0:
                                _context6.next = 2;
                                return this._saveHeader(header);

                            case 2:
                                return _context6.abrupt("return", _context6.sent);

                            case 3:
                            case "end":
                                return _context6.stop();
                        }
                    }
                }, _callee6, this);
            }));

            function saveHeader(_x6) {
                return _ref6.apply(this, arguments);
            }

            return saveHeader;
        }()
    }, {
        key: "createGenesis",
        value: function () {
            var _ref7 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee7(genesis) {
                var writer, err, hash, headerRaw;
                return _regenerator2.default.wrap(function _callee7$(_context7) {
                    while (1) {
                        switch (_context7.prev = _context7.next) {
                            case 0:
                                assert(genesis.number === 0);

                                if (!(genesis.number !== 0)) {
                                    _context7.next = 3;
                                    break;
                                }

                                return _context7.abrupt("return", error_code_1.ErrorCode.RESULT_INVALID_PARAM);

                            case 3:
                                writer = new writer_1.BufferWriter();
                                err = genesis.encode(writer);

                                if (!err) {
                                    _context7.next = 8;
                                    break;
                                }

                                this.m_logger.error("genesis block encode failed");
                                return _context7.abrupt("return", err);

                            case 8:
                                hash = genesis.hash;
                                headerRaw = writer.render();
                                _context7.prev = 10;
                                _context7.next = 13;
                                return this._begin();

                            case 13:
                                _context7.next = 19;
                                break;

                            case 15:
                                _context7.prev = 15;
                                _context7.t0 = _context7["catch"](10);

                                this.m_logger.error("createGenesis begin " + genesis.hash + "(" + genesis.number + ") failed, " + _context7.t0);
                                return _context7.abrupt("return", error_code_1.ErrorCode.RESULT_EXCEPTION);

                            case 19:
                                _context7.prev = 19;
                                _context7.next = 22;
                                return this.m_db.run(insertHeaderSql, { $hash: genesis.hash, $pre: genesis.preBlockHash, $raw: headerRaw, $verified: VERIFY_STATE.verified });

                            case 22:
                                _context7.next = 24;
                                return this.m_db.run(extendBestSql, { $hash: genesis.hash, $height: genesis.number, $timestamp: genesis.timestamp });

                            case 24:
                                _context7.next = 26;
                                return this._commit();

                            case 26:
                                _context7.next = 34;
                                break;

                            case 28:
                                _context7.prev = 28;
                                _context7.t1 = _context7["catch"](19);

                                this.m_logger.error("createGenesis " + genesis.hash + "(" + genesis.number + ") failed, " + _context7.t1);
                                _context7.next = 33;
                                return this._rollback();

                            case 33:
                                return _context7.abrupt("return", error_code_1.ErrorCode.RESULT_EXCEPTION);

                            case 34:
                                return _context7.abrupt("return", error_code_1.ErrorCode.RESULT_OK);

                            case 35:
                            case "end":
                                return _context7.stop();
                        }
                    }
                }, _callee7, this, [[10, 15], [19, 28]]);
            }));

            function createGenesis(_x7) {
                return _ref7.apply(this, arguments);
            }

            return createGenesis;
        }()
    }, {
        key: "getNextHeader",
        value: function () {
            var _ref8 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee8(hash) {
                var query, results, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, result, header, err;

                return _regenerator2.default.wrap(function _callee8$(_context8) {
                    while (1) {
                        switch (_context8.prev = _context8.next) {
                            case 0:
                                query = void 0;
                                _context8.prev = 1;
                                _context8.next = 4;
                                return this.m_db.all(getByPreBlockSql, { $pre: hash });

                            case 4:
                                query = _context8.sent;
                                _context8.next = 11;
                                break;

                            case 7:
                                _context8.prev = 7;
                                _context8.t0 = _context8["catch"](1);

                                this.m_logger.error("getNextHeader " + hash + " failed, " + _context8.t0);
                                return _context8.abrupt("return", { err: error_code_1.ErrorCode.RESULT_EXCEPTION });

                            case 11:
                                if (!(!query || !query.length)) {
                                    _context8.next = 13;
                                    break;
                                }

                                return _context8.abrupt("return", { err: error_code_1.ErrorCode.RESULT_NOT_FOUND });

                            case 13:
                                results = [];
                                _iteratorNormalCompletion = true;
                                _didIteratorError = false;
                                _iteratorError = undefined;
                                _context8.prev = 17;
                                _iterator = (0, _getIterator3.default)(query);

                            case 19:
                                if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
                                    _context8.next = 30;
                                    break;
                                }

                                result = _step.value;
                                header = new this.m_blockHeaderType();
                                err = header.decode(new reader_1.BufferReader(result.raw, false));

                                if (!(err !== error_code_1.ErrorCode.RESULT_OK)) {
                                    _context8.next = 26;
                                    break;
                                }

                                this.m_logger.error("decode header " + result.hash + " from header storage failed");
                                return _context8.abrupt("return", { err: err });

                            case 26:
                                results.push({ header: header, verified: result.verified });

                            case 27:
                                _iteratorNormalCompletion = true;
                                _context8.next = 19;
                                break;

                            case 30:
                                _context8.next = 36;
                                break;

                            case 32:
                                _context8.prev = 32;
                                _context8.t1 = _context8["catch"](17);
                                _didIteratorError = true;
                                _iteratorError = _context8.t1;

                            case 36:
                                _context8.prev = 36;
                                _context8.prev = 37;

                                if (!_iteratorNormalCompletion && _iterator.return) {
                                    _iterator.return();
                                }

                            case 39:
                                _context8.prev = 39;

                                if (!_didIteratorError) {
                                    _context8.next = 42;
                                    break;
                                }

                                throw _iteratorError;

                            case 42:
                                return _context8.finish(39);

                            case 43:
                                return _context8.finish(36);

                            case 44:
                                return _context8.abrupt("return", { err: error_code_1.ErrorCode.RESULT_OK, results: results });

                            case 45:
                            case "end":
                                return _context8.stop();
                        }
                    }
                }, _callee8, this, [[1, 7], [17, 32, 36, 44], [37,, 39, 43]]);
            }));

            function getNextHeader(_x8) {
                return _ref8.apply(this, arguments);
            }

            return getNextHeader;
        }()
    }, {
        key: "updateVerified",
        value: function () {
            var _ref9 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee9(header, verified) {
                return _regenerator2.default.wrap(function _callee9$(_context9) {
                    while (1) {
                        switch (_context9.prev = _context9.next) {
                            case 0:
                                _context9.prev = 0;

                                this.m_logger.debug("remove header storage cache hash: " + header.hash + " number: " + header.number);
                                this.m_cacheHash.remove(header.hash);
                                this.m_cacheHeight.remove(header.number);
                                _context9.next = 6;
                                return this.m_db.run(updateVerifiedSql, { $hash: header.hash, $verified: verified });

                            case 6:
                                _context9.next = 12;
                                break;

                            case 8:
                                _context9.prev = 8;
                                _context9.t0 = _context9["catch"](0);

                                this.m_logger.error("updateVerified " + header.hash + "(" + header.number + ") failed, " + _context9.t0);
                                return _context9.abrupt("return", error_code_1.ErrorCode.RESULT_EXCEPTION);

                            case 12:
                                return _context9.abrupt("return", error_code_1.ErrorCode.RESULT_OK);

                            case 13:
                            case "end":
                                return _context9.stop();
                        }
                    }
                }, _callee9, this, [[0, 8]]);
            }));

            function updateVerified(_x9, _x10) {
                return _ref9.apply(this, arguments);
            }

            return updateVerified;
        }()
    }, {
        key: "changeBest",
        value: function () {
            var _ref10 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee10(header) {
                var sqls, txViewOp, forkFrom, result, _result, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, e, err, _iteratorNormalCompletion3, _didIteratorError3, _iteratorError3, _iterator3, _step3, sql;

                return _regenerator2.default.wrap(function _callee10$(_context10) {
                    while (1) {
                        switch (_context10.prev = _context10.next) {
                            case 0:
                                sqls = [];
                                txViewOp = [];

                                sqls.push("INSERT INTO best (hash, height, timestamp) VALUES(\"" + header.hash + "\", \"" + header.number + "\", \"" + header.timestamp + "\")");
                                txViewOp.push({ op: 'add', value: header.hash });
                                forkFrom = header;

                            case 5:
                                if (!true) {
                                    _context10.next = 31;
                                    break;
                                }

                                _context10.next = 8;
                                return this.getHeightOnBest(forkFrom.preBlockHash);

                            case 8:
                                result = _context10.sent;

                                if (!(result.err === error_code_1.ErrorCode.RESULT_OK)) {
                                    _context10.next = 17;
                                    break;
                                }

                                assert(result.header);
                                forkFrom = result.header;
                                sqls.push("DELETE FROM best WHERE height > " + forkFrom.number);
                                txViewOp.push({ op: 'remove', value: forkFrom.number });
                                return _context10.abrupt("break", 31);

                            case 17:
                                if (!(result.err === error_code_1.ErrorCode.RESULT_NOT_FOUND)) {
                                    _context10.next = 28;
                                    break;
                                }

                                _context10.next = 20;
                                return this._loadHeader(forkFrom.preBlockHash);

                            case 20:
                                _result = _context10.sent;

                                assert(_result.header);
                                forkFrom = _result.header;
                                sqls.push("INSERT INTO best (hash, height, timestamp) VALUES(\"" + forkFrom.hash + "\", \"" + forkFrom.number + "\", \"" + forkFrom.timestamp + "\")");
                                txViewOp.push({ op: 'add', value: forkFrom.hash });
                                return _context10.abrupt("continue", 5);

                            case 28:
                                return _context10.abrupt("return", result.err);

                            case 29:
                                _context10.next = 5;
                                break;

                            case 31:
                                sqls.push("UPDATE headers SET verified=\"" + VERIFY_STATE.verified + "\" WHERE hash=\"" + header.hash + "\"");
                                sqls = sqls.reverse();
                                txViewOp = txViewOp.reverse();
                                _context10.next = 36;
                                return this._begin();

                            case 36:
                                _context10.prev = 36;
                                _iteratorNormalCompletion2 = true;
                                _didIteratorError2 = false;
                                _iteratorError2 = undefined;
                                _context10.prev = 40;
                                _iterator2 = (0, _getIterator3.default)(txViewOp);

                            case 42:
                                if (_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done) {
                                    _context10.next = 63;
                                    break;
                                }

                                e = _step2.value;
                                err = void 0;

                                if (!(e.op === 'add')) {
                                    _context10.next = 51;
                                    break;
                                }

                                _context10.next = 48;
                                return this.m_txView.add(e.value);

                            case 48:
                                err = _context10.sent;
                                _context10.next = 58;
                                break;

                            case 51:
                                if (!(e.op === 'remove')) {
                                    _context10.next = 57;
                                    break;
                                }

                                _context10.next = 54;
                                return this.m_txView.remove(e.value);

                            case 54:
                                err = _context10.sent;
                                _context10.next = 58;
                                break;

                            case 57:
                                err = error_code_1.ErrorCode.RESULT_FAILED;

                            case 58:
                                if (!(err !== error_code_1.ErrorCode.RESULT_OK)) {
                                    _context10.next = 60;
                                    break;
                                }

                                throw new Error("run txview error,code=" + err);

                            case 60:
                                _iteratorNormalCompletion2 = true;
                                _context10.next = 42;
                                break;

                            case 63:
                                _context10.next = 69;
                                break;

                            case 65:
                                _context10.prev = 65;
                                _context10.t0 = _context10["catch"](40);
                                _didIteratorError2 = true;
                                _iteratorError2 = _context10.t0;

                            case 69:
                                _context10.prev = 69;
                                _context10.prev = 70;

                                if (!_iteratorNormalCompletion2 && _iterator2.return) {
                                    _iterator2.return();
                                }

                            case 72:
                                _context10.prev = 72;

                                if (!_didIteratorError2) {
                                    _context10.next = 75;
                                    break;
                                }

                                throw _iteratorError2;

                            case 75:
                                return _context10.finish(72);

                            case 76:
                                return _context10.finish(69);

                            case 77:
                                _iteratorNormalCompletion3 = true;
                                _didIteratorError3 = false;
                                _iteratorError3 = undefined;
                                _context10.prev = 80;
                                _iterator3 = (0, _getIterator3.default)(sqls);

                            case 82:
                                if (_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done) {
                                    _context10.next = 89;
                                    break;
                                }

                                sql = _step3.value;
                                _context10.next = 86;
                                return this.m_db.run(sql);

                            case 86:
                                _iteratorNormalCompletion3 = true;
                                _context10.next = 82;
                                break;

                            case 89:
                                _context10.next = 95;
                                break;

                            case 91:
                                _context10.prev = 91;
                                _context10.t1 = _context10["catch"](80);
                                _didIteratorError3 = true;
                                _iteratorError3 = _context10.t1;

                            case 95:
                                _context10.prev = 95;
                                _context10.prev = 96;

                                if (!_iteratorNormalCompletion3 && _iterator3.return) {
                                    _iterator3.return();
                                }

                            case 98:
                                _context10.prev = 98;

                                if (!_didIteratorError3) {
                                    _context10.next = 101;
                                    break;
                                }

                                throw _iteratorError3;

                            case 101:
                                return _context10.finish(98);

                            case 102:
                                return _context10.finish(95);

                            case 103:
                                _context10.next = 105;
                                return this._commit();

                            case 105:
                                _context10.next = 112;
                                break;

                            case 107:
                                _context10.prev = 107;
                                _context10.t2 = _context10["catch"](36);

                                this.m_logger.error("changeBest " + header.hash + "(" + header.number + ") failed, " + _context10.t2);
                                this._rollback();
                                return _context10.abrupt("return", error_code_1.ErrorCode.RESULT_EXCEPTION);

                            case 112:
                                this.m_logger.debug("remove header storage cache hash: " + header.hash + " number: " + header.number);
                                this.m_cacheHash.remove(header.hash);
                                this.m_cacheHeight.clear();
                                return _context10.abrupt("return", error_code_1.ErrorCode.RESULT_OK);

                            case 116:
                            case "end":
                                return _context10.stop();
                        }
                    }
                }, _callee10, this, [[36, 107], [40, 65, 69, 77], [70,, 72, 76], [80, 91, 95, 103], [96,, 98, 102]]);
            }));

            function changeBest(_x11) {
                return _ref10.apply(this, arguments);
            }

            return changeBest;
        }()
    }, {
        key: "_begin",
        value: function () {
            var _ref11 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee11() {
                return _regenerator2.default.wrap(function _callee11$(_context11) {
                    while (1) {
                        switch (_context11.prev = _context11.next) {
                            case 0:
                                _context11.next = 2;
                                return this.m_transactionLock.enter();

                            case 2:
                                _context11.next = 4;
                                return this.m_db.run('BEGIN;');

                            case 4:
                            case "end":
                                return _context11.stop();
                        }
                    }
                }, _callee11, this);
            }));

            function _begin() {
                return _ref11.apply(this, arguments);
            }

            return _begin;
        }()
    }, {
        key: "_commit",
        value: function () {
            var _ref12 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee12() {
                return _regenerator2.default.wrap(function _callee12$(_context12) {
                    while (1) {
                        switch (_context12.prev = _context12.next) {
                            case 0:
                                _context12.next = 2;
                                return this.m_db.run('COMMIT;');

                            case 2:
                                this.m_transactionLock.leave();

                            case 3:
                            case "end":
                                return _context12.stop();
                        }
                    }
                }, _callee12, this);
            }));

            function _commit() {
                return _ref12.apply(this, arguments);
            }

            return _commit;
        }()
    }, {
        key: "_rollback",
        value: function () {
            var _ref13 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee13() {
                return _regenerator2.default.wrap(function _callee13$(_context13) {
                    while (1) {
                        switch (_context13.prev = _context13.next) {
                            case 0:
                                _context13.next = 2;
                                return this.m_db.run('ROLLBACK;');

                            case 2:
                                this.m_transactionLock.leave();

                            case 3:
                            case "end":
                                return _context13.stop();
                        }
                    }
                }, _callee13, this);
            }));

            function _rollback() {
                return _ref13.apply(this, arguments);
            }

            return _rollback;
        }()
    }, {
        key: "txView",
        get: function get() {
            return this.m_txView;
        }
    }]);
    return HeaderStorage;
}();

exports.HeaderStorage = HeaderStorage;