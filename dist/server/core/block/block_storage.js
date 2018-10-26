"use strict";

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("babel-runtime/helpers/createClass");

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

Object.defineProperty(exports, "__esModule", { value: true });
var block_1 = require("./block");
var serializable_1 = require("../serializable");
var fs = require("fs-extra");
var path = require("path");
var client_1 = require("../../client");

var BlockStorage = function () {
    function BlockStorage(options) {
        (0, _classCallCheck3.default)(this, BlockStorage);

        this.m_path = path.join(options.path, 'Block');
        this.m_blockHeaderType = options.blockHeaderType;
        this.m_transactionType = options.transactionType;
        this.m_logger = options.logger;
        this.m_readonly = !!options.readonly;
    }

    (0, _createClass3.default)(BlockStorage, [{
        key: "init",
        value: function init() {
            fs.mkdirsSync(this.m_path);
            return client_1.ErrorCode.RESULT_OK;
        }
    }, {
        key: "uninit",
        value: function uninit() {
            // do nothing
        }
    }, {
        key: "has",
        value: function has(blockHash) {
            return fs.existsSync(this._pathOfBlock(blockHash));
        }
    }, {
        key: "_pathOfBlock",
        value: function _pathOfBlock(hash) {
            return path.join(this.m_path, hash);
        }
    }, {
        key: "get",
        value: function get(blockHash) {
            var blockRaw = void 0;
            try {
                blockRaw = fs.readFileSync(this._pathOfBlock(blockHash));
            } catch (error) {
                this.m_logger.warn("readBlockFile " + this._pathOfBlock(blockHash) + " failed.");
            }
            if (blockRaw) {
                var block = new block_1.Block({ headerType: this.m_blockHeaderType, transactionType: this.m_transactionType });
                var err = block.decode(new serializable_1.BufferReader(blockRaw));
                if (err) {
                    this.m_logger.error("load block " + blockHash + " from storage failed!");
                    return undefined;
                }
                return block;
            } else {
                return undefined;
            }
        }
    }, {
        key: "_add",
        value: function _add(hash, blockRaw) {
            fs.writeFileSync(this._pathOfBlock(hash), blockRaw);
        }
    }, {
        key: "add",
        value: function add(block) {
            if (this.m_readonly) {
                return client_1.ErrorCode.RESULT_NOT_SUPPORT;
            }
            var hash = block.hash;
            if (this.has(hash)) {
                return client_1.ErrorCode.RESULT_ALREADY_EXIST;
            }
            var writer = new serializable_1.BufferWriter();
            var err = block.encode(writer);
            if (err) {
                this.m_logger.error("invalid block ", block);
                return err;
            }
            this._add(hash, writer.render());
            return client_1.ErrorCode.RESULT_OK;
        }
    }, {
        key: "getSize",
        value: function getSize(blockHash) {
            if (!this.has(blockHash)) {
                return -1;
            }
            var stat = fs.statSync(this._pathOfBlock(blockHash));
            return stat.size;
        }
    }]);
    return BlockStorage;
}();

exports.BlockStorage = BlockStorage;