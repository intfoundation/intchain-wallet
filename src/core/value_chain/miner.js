"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const error_code_1 = require("../error_code");
const chain_1 = require("../chain");
const chain_2 = require("./chain");
const assert = require('assert');
class ValueMiner extends chain_1.Miner {
    constructor(options) {
        super(options);
    }
    set coinbase(address) {
        this.m_coinbase = address;
    }
    get coinbase() {
        return this.m_coinbase;
    }
    _chainInstance() {
        return new chain_2.ValueChain({ logger: this.m_logger });
    }
    get chain() {
        return this.m_chain;
    }
    parseInstanceOptions(node, instanceOptions) {
        let { err, value } = super.parseInstanceOptions(node, instanceOptions);
        if (err) {
            return { err };
        }
        value.coinbase = instanceOptions.get('coinbase');
        return { err: error_code_1.ErrorCode.RESULT_OK, value };
    }
    async initialize(options) {
        if (options.coinbase) {
            this.m_coinbase = options.coinbase;
        }
        return super.initialize(options);
    }
    async _decorateBlock(block) {
        block.header.coinbase = this.m_coinbase;
        return error_code_1.ErrorCode.RESULT_OK;
    }
}
exports.ValueMiner = ValueMiner;
