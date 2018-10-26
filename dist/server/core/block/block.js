"use strict";

var _map = require("babel-runtime/core-js/map");

var _map2 = _interopRequireDefault(_map);

var _regenerator = require("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require("babel-runtime/helpers/asyncToGenerator");

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _getIterator2 = require("babel-runtime/core-js/get-iterator");

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _slicedToArray2 = require("babel-runtime/helpers/slicedToArray");

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

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
var transaction_1 = require("./transaction");
var serializable_1 = require("../serializable");
var error_code_1 = require("../error_code");
var merkle = require("../lib/merkle");
var encoding_1 = require("../lib/encoding");
var assert = require("assert");
var digest = require('../lib/digest');

var BlockHeader = function (_serializable_1$Seria) {
    (0, _inherits3.default)(BlockHeader, _serializable_1$Seria);

    function BlockHeader() {
        (0, _classCallCheck3.default)(this, BlockHeader);

        var _this = (0, _possibleConstructorReturn3.default)(this, (BlockHeader.__proto__ || (0, _getPrototypeOf2.default)(BlockHeader)).call(this));

        _this.m_number = 0;
        _this.m_storageHash = encoding_1.Encoding.NULL_HASH;
        _this.m_preBlockHash = encoding_1.Encoding.NULL_HASH;
        _this.m_receiptHash = encoding_1.Encoding.NULL_HASH;
        _this.m_merkleRoot = encoding_1.Encoding.NULL_HASH;
        _this.m_timestamp = -1;
        return _this;
    }

    (0, _createClass3.default)(BlockHeader, [{
        key: "isPreBlock",
        value: function isPreBlock(header) {
            return this.m_number + 1 === header.m_number && this.m_hash === header.m_preBlockHash;
        }
    }, {
        key: "setPreBlock",
        value: function setPreBlock(header) {
            if (header) {
                this.m_number = header.m_number + 1;
                this.m_preBlockHash = header.hash;
            } else {
                // gensis block
                this.m_number = 0;
                this.m_preBlockHash = encoding_1.Encoding.NULL_HASH;
            }
        }
    }, {
        key: "hasTransaction",
        value: function hasTransaction(txHash) {
            // TODO: find hash from txHash
            return false;
        }
    }, {
        key: "_genMerkleRoot",
        value: function _genMerkleRoot(txs) {
            var leaves = [];
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = (0, _getIterator3.default)(txs), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var tx = _step.value;

                    leaves.push(Buffer.from(tx.hash, 'hex'));
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

            var _merkle$createRoot = merkle.createRoot(leaves),
                _merkle$createRoot2 = (0, _slicedToArray3.default)(_merkle$createRoot, 2),
                root = _merkle$createRoot2[0],
                malleated = _merkle$createRoot2[1];

            if (malleated) {
                return encoding_1.Encoding.NULL_HASH;
            }
            return root.toString('hex');
        }
    }, {
        key: "_genReceiptHash",
        value: function _genReceiptHash(receipts) {
            var writer = new serializable_1.BufferWriter();
            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = (0, _getIterator3.default)(receipts), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var receipt = _step2.value;

                    receipt.encode(writer);
                }
            } catch (err) {
                _didIteratorError2 = true;
                _iteratorError2 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion2 && _iterator2.return) {
                        _iterator2.return();
                    }
                } finally {
                    if (_didIteratorError2) {
                        throw _iteratorError2;
                    }
                }
            }

            return digest.hash256(writer.render()).toString('hex');
        }
        /**
         * virtual
         * verify hash here
         */

    }, {
        key: "verify",
        value: function () {
            var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(chain) {
                return _regenerator2.default.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                return _context.abrupt("return", { err: error_code_1.ErrorCode.RESULT_OK, valid: true });

                            case 1:
                            case "end":
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));

            function verify(_x) {
                return _ref.apply(this, arguments);
            }

            return verify;
        }()
    }, {
        key: "verifyContent",
        value: function verifyContent(content) {
            if (this.m_merkleRoot !== this._genMerkleRoot(content.transactions)) {
                return false;
            }
            if (this.m_receiptHash !== this._genReceiptHash(content.receipts)) {
                return false;
            }
            return true;
        }
    }, {
        key: "updateContent",
        value: function updateContent(content) {
            this.m_merkleRoot = this._genMerkleRoot(content.transactions);
            this.m_receiptHash = this._genReceiptHash(content.receipts);
        }
    }, {
        key: "_encodeHashContent",
        value: function _encodeHashContent(writer) {
            try {
                writer.writeU32(this.m_number);
                writer.writeI32(this.m_timestamp);
                writer.writeHash(this.m_merkleRoot);
                writer.writeHash(this.m_storageHash);
                writer.writeHash(this.m_receiptHash);
                writer.writeHash(this.m_preBlockHash);
            } catch (e) {
                return error_code_1.ErrorCode.RESULT_INVALID_FORMAT;
            }
            return error_code_1.ErrorCode.RESULT_OK;
        }
    }, {
        key: "_decodeHashContent",
        value: function _decodeHashContent(reader) {
            try {
                this.m_number = reader.readU32();
                this.m_timestamp = reader.readI32();
                this.m_merkleRoot = reader.readHash('hex');
                this.m_storageHash = reader.readHash('hex');
                this.m_receiptHash = reader.readHash('hex');
                this.m_preBlockHash = reader.readHash('hex');
            } catch (e) {
                return error_code_1.ErrorCode.RESULT_INVALID_FORMAT;
            }
            return error_code_1.ErrorCode.RESULT_OK;
        }
    }, {
        key: "stringify",
        value: function stringify() {
            var obj = (0, _get3.default)(BlockHeader.prototype.__proto__ || (0, _getPrototypeOf2.default)(BlockHeader.prototype), "stringify", this).call(this);
            obj.number = this.number;
            obj.timestamp = this.timestamp;
            obj.preBlock = this.preBlockHash;
            obj.merkleRoot = this.merkleRoot;
            return obj;
        }
    }, {
        key: "number",
        get: function get() {
            return this.m_number;
        }
    }, {
        key: "storageHash",
        get: function get() {
            return this.m_storageHash;
        },
        set: function set(h) {
            this.m_storageHash = h;
        }
    }, {
        key: "preBlockHash",
        get: function get() {
            return this.m_preBlockHash;
        }
    }, {
        key: "timestamp",
        get: function get() {
            return this.m_timestamp;
        },
        set: function set(n) {
            this.m_timestamp = n;
        }
    }, {
        key: "merkleRoot",
        get: function get() {
            return this.m_merkleRoot;
        }
    }]);
    return BlockHeader;
}(serializable_1.SerializableWithHash);

exports.BlockHeader = BlockHeader;

var BlockContent = function () {
    function BlockContent(transactionType) {
        (0, _classCallCheck3.default)(this, BlockContent);

        this.m_transactions = new Array();
        this.m_receipts = new _map2.default();
        this.m_transactionType = transactionType;
    }

    (0, _createClass3.default)(BlockContent, [{
        key: "hasTransaction",
        value: function hasTransaction(txHash) {
            var _iteratorNormalCompletion3 = true;
            var _didIteratorError3 = false;
            var _iteratorError3 = undefined;

            try {
                for (var _iterator3 = (0, _getIterator3.default)(this.m_transactions), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                    var tx = _step3.value;

                    if (tx.hash === txHash) {
                        return true;
                    }
                }
            } catch (err) {
                _didIteratorError3 = true;
                _iteratorError3 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion3 && _iterator3.return) {
                        _iterator3.return();
                    }
                } finally {
                    if (_didIteratorError3) {
                        throw _iteratorError3;
                    }
                }
            }

            return false;
        }
    }, {
        key: "getTransaction",
        value: function getTransaction(arg) {
            if (typeof arg === 'string') {
                var _iteratorNormalCompletion4 = true;
                var _didIteratorError4 = false;
                var _iteratorError4 = undefined;

                try {
                    for (var _iterator4 = (0, _getIterator3.default)(this.m_transactions), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                        var tx = _step4.value;

                        if (tx.hash === arg) {
                            return tx;
                        }
                    }
                } catch (err) {
                    _didIteratorError4 = true;
                    _iteratorError4 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion4 && _iterator4.return) {
                            _iterator4.return();
                        }
                    } finally {
                        if (_didIteratorError4) {
                            throw _iteratorError4;
                        }
                    }
                }
            } else if (typeof arg === 'number') {
                if (arg >= 0 && arg < this.m_transactions.length) {
                    return this.m_transactions[arg];
                }
            }
            return null;
        }
    }, {
        key: "getReceipt",
        value: function getReceipt(txHash) {
            return this.m_receipts.get(txHash);
        }
    }, {
        key: "addTransaction",
        value: function addTransaction(tx) {
            this.m_transactions.push(tx);
        }
    }, {
        key: "addReceipt",
        value: function addReceipt(receipt) {
            this.m_receipts.set(receipt.transactionHash, receipt);
        }
    }, {
        key: "setReceipts",
        value: function setReceipts(receipts) {
            this.m_receipts.clear();
            var _iteratorNormalCompletion5 = true;
            var _didIteratorError5 = false;
            var _iteratorError5 = undefined;

            try {
                for (var _iterator5 = (0, _getIterator3.default)(receipts), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
                    var r = _step5.value;

                    this.m_receipts.set(r.transactionHash, r);
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
        }
    }, {
        key: "encode",
        value: function encode(writer) {
            try {
                writer.writeU16(this.m_transactions.length);
                var _iteratorNormalCompletion6 = true;
                var _didIteratorError6 = false;
                var _iteratorError6 = undefined;

                try {
                    for (var _iterator6 = (0, _getIterator3.default)(this.m_transactions), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
                        var tx = _step6.value;

                        var err = tx.encode(writer);
                        if (err) {
                            return err;
                        }
                        var r = this.m_receipts.get(tx.hash);
                        assert(r);
                        err = r.encode(writer);
                        if (err) {
                            return err;
                        }
                    }
                } catch (err) {
                    _didIteratorError6 = true;
                    _iteratorError6 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion6 && _iterator6.return) {
                            _iterator6.return();
                        }
                    } finally {
                        if (_didIteratorError6) {
                            throw _iteratorError6;
                        }
                    }
                }
            } catch (e) {
                return error_code_1.ErrorCode.RESULT_INVALID_FORMAT;
            }
            return error_code_1.ErrorCode.RESULT_OK;
        }
    }, {
        key: "decode",
        value: function decode(reader) {
            this.m_transactions = [];
            this.m_receipts = new _map2.default();
            var txCount = void 0;
            try {
                txCount = reader.readU16();
            } catch (e) {
                return error_code_1.ErrorCode.RESULT_INVALID_FORMAT;
            }
            for (var ix = 0; ix < txCount; ++ix) {
                var tx = new this.m_transactionType();
                var err = tx.decode(reader);
                if (err !== error_code_1.ErrorCode.RESULT_OK) {
                    return err;
                }
                this.m_transactions.push(tx);
                var receipt = new transaction_1.Receipt();
                err = receipt.decode(reader);
                if (err !== error_code_1.ErrorCode.RESULT_OK) {
                    return err;
                }
                this.m_receipts.set(tx.hash, receipt);
            }
            return error_code_1.ErrorCode.RESULT_OK;
        }
    }, {
        key: "transactions",
        get: function get() {
            var t = this.m_transactions;
            return t;
        }
    }, {
        key: "receipts",
        get: function get() {
            return this.m_receipts.values();
        }
    }]);
    return BlockContent;
}();

exports.BlockContent = BlockContent;

var Block = function () {
    function Block(options) {
        (0, _classCallCheck3.default)(this, Block);

        this.m_transactionType = options.transactionType;
        this.m_headerType = options.headerType;
        this.m_header = new this.m_headerType();
        if (options.header) {
            var writer = new serializable_1.BufferWriter();
            var err = options.header.encode(writer);
            assert(!err, "encode header failed with err " + err);
            var reader = new serializable_1.BufferReader(writer.render());
            err = this.m_header.decode(reader);
            assert(!err, "clone header failed with err " + err);
        }
        this.m_content = new BlockContent(this.m_transactionType);
    }

    (0, _createClass3.default)(Block, [{
        key: "clone",
        value: function clone() {
            var writer = new serializable_1.BufferWriter();
            var err = this.encode(writer);
            assert(!err, "encode block failed " + err);
            var reader = new serializable_1.BufferReader(writer.render());
            var newBlock = new Block({
                headerType: this.headerType,
                transactionType: this.transactionType
            });
            err = newBlock.decode(reader);
            assert(!err, "clone block " + this.m_header.hash + " failed for " + err);
            return newBlock;
        }
    }, {
        key: "encode",
        value: function encode(writer) {
            var err = this.m_header.encode(writer);
            if (err) {
                return err;
            }
            return this.m_content.encode(writer);
        }
    }, {
        key: "decode",
        value: function decode(reader) {
            var err = this.m_header.decode(reader);
            if (err !== error_code_1.ErrorCode.RESULT_OK) {
                return err;
            }
            return this.m_content.decode(reader);
        }
    }, {
        key: "verify",
        value: function verify() {
            // 验证content hash
            return this.m_header.verifyContent(this.m_content);
        }
    }, {
        key: "transactionType",
        get: function get() {
            return this.m_transactionType;
        }
    }, {
        key: "headerType",
        get: function get() {
            return this.m_headerType;
        }
    }, {
        key: "header",
        get: function get() {
            return this.m_header;
        }
    }, {
        key: "content",
        get: function get() {
            return this.m_content;
        }
    }, {
        key: "hash",
        get: function get() {
            return this.m_header.hash;
        }
    }, {
        key: "number",
        get: function get() {
            return this.m_header.number;
        }
    }]);
    return Block;
}();

exports.Block = Block;