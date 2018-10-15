"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const error_code_1 = require("../error_code");
const chain_1 = require("../chain");
const transaction_1 = require("./transaction");
class BlockExecutor {
    constructor(options) {
        this.m_storage = options.storage;
        this.m_handler = options.handler;
        this.m_block = options.block;
        this.m_externContext = options.externContext;
        this.m_logger = options.logger;
        Object.defineProperty(this.m_externContext, 'logger', {
            writable: false,
            value: this.m_logger
        });
        this.m_globalOptions = options.globalOptions;
    }
    get externContext() {
        return this.m_externContext;
    }
    _newTransactionExecutor(l, tx) {
        return new transaction_1.TransactionExecutor(l, tx, this.m_logger);
    }
    _newEventExecutor(l) {
        return new transaction_1.EventExecutor(l, this.m_logger);
    }
    async execute() {
        return await this._execute(this.m_block);
    }
    async verify(logger) {
        let oldBlock = this.m_block;
        this.m_block = this.m_block.clone();
        let err = await this.execute();
        if (err) {
            return { err };
        }
        if (this.m_block.hash !== oldBlock.hash) {
            logger.error(`block ${oldBlock.number} hash mismatch!! 
            except storage hash ${oldBlock.header.storageHash}, actual ${this.m_block.header.storageHash}
            except hash ${oldBlock.hash}, actual ${this.m_block.hash}
            `);
        }
        return { err: error_code_1.ErrorCode.RESULT_OK,
            valid: this.m_block.hash === oldBlock.hash };
    }
    async _execute(block) {
        this.m_logger.info(`begin execute block ${block.number}`);
        this.m_storage.createLogger();
        let err = await this._executePreBlockEvent();
        if (err) {
            this.m_logger.error(`blockexecutor execute begin_event failed,errcode=${err},blockhash=${block.hash}`);
            return err;
        }
        let ret = await this._executeTransactions();
        if (ret.err) {
            this.m_logger.error(`blockexecutor execute method failed,errcode=${ret.err},blockhash=${block.hash}`);
            return ret.err;
        }
        err = await this._executePostBlockEvent();
        if (err) {
            this.m_logger.error(`blockexecutor execute end_event failed,errcode=${err},blockhash=${block.hash}`);
            return err;
        }
        let receipts = ret.value;
        // 票据
        block.content.setReceipts(receipts);
        // 更新块信息
        await this.updateBlock(block);
        return error_code_1.ErrorCode.RESULT_OK;
    }
    async executeBlockEvent(listener) {
        let exec = this._newEventExecutor(listener);
        let ret = await exec.execute(this.m_block.header, this.m_storage, this.m_externContext);
        if (ret.err || ret.returnCode) {
            this.m_logger.error(`block event execute failed`);
            return error_code_1.ErrorCode.RESULT_EXCEPTION;
        }
        return error_code_1.ErrorCode.RESULT_OK;
    }
    async _executePreBlockEvent() {
        if (this.m_block.number === 0) {
            // call initialize
            if (this.m_handler.genesisListener) {
                const err = await this.executeBlockEvent(this.m_handler.genesisListener);
                if (err) {
                    this.m_logger.error(`handler's genesisListener execute failed`);
                    return error_code_1.ErrorCode.RESULT_EXCEPTION;
                }
            }
        }
        let listeners = await this.m_handler.getPreBlockListeners(this.m_block.number);
        for (let l of listeners) {
            const err = await this.executeBlockEvent(l);
            if (err) {
                return err;
            }
        }
        return error_code_1.ErrorCode.RESULT_OK;
    }
    async _executePostBlockEvent() {
        let listeners = await this.m_handler.getPostBlockListeners(this.m_block.number);
        for (let l of listeners) {
            const err = this.executeBlockEvent(l);
            if (err) {
                return err;
            }
        }
        return error_code_1.ErrorCode.RESULT_OK;
    }
    async _executeTransactions() {
        let receipts = [];
        // 执行tx
        for (let tx of this.m_block.content.transactions) {
            const ret = await this.executeTransaction(tx);
            if (ret.err) {
                return { err: ret.err };
            }
            receipts.push(ret.receipt);
        }
        return { err: error_code_1.ErrorCode.RESULT_OK, value: receipts };
    }
    async executeTransaction(tx, flag) {
        let listener = this.m_handler.getListener(tx.method);
        if (!listener) {
            this.m_logger.error(`not find listener,method name=${tx.method}`);
            let receipt = new chain_1.Receipt();
            receipt.returnCode = error_code_1.ErrorCode.RESULT_NOT_SUPPORT;
            receipt.transactionHash = tx.hash;
            return { err: error_code_1.ErrorCode.RESULT_OK, receipt };
        }
        let exec = this._newTransactionExecutor(listener, tx);
        let ret = await exec.execute(this.m_block.header, this.m_storage, this.m_externContext, flag);
        return ret;
    }
    async updateBlock(block) {
        // 写回数据库签名
        block.header.storageHash = (await this.m_storage.messageDigest()).value;
        block.header.updateContent(block.content);
        block.header.updateHash();
    }
}
exports.BlockExecutor = BlockExecutor;
