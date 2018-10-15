"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const error_code_1 = require("./error_code");
const bignumber_js_1 = require("bignumber.js");
const storage_1 = require("./storage_json/storage");
const value_chain_1 = require("./value_chain");
const address_1 = require("./address");
const storage_2 = require("./storage");
const util_1 = require("util");
class ValueChainDebugSession {
    constructor(debuger) {
        this.debuger = debuger;
    }
    async init(storageDir) {
        const chain = this.debuger.chain;
        const dumpSnapshotManager = new storage_2.StorageDumpSnapshotManager({
            logger: chain.logger,
            path: storageDir
        });
        this.m_dumpSnapshotManager = dumpSnapshotManager;
        const snapshotManager = new storage_2.StorageLogSnapshotManager({
            path: chain.storageManager.path,
            headerStorage: chain.headerStorage,
            storageType: storage_1.JsonStorage,
            logger: chain.logger,
            dumpSnapshotManager
        });
        const storageManager = new storage_2.StorageManager({
            path: storageDir,
            storageType: storage_1.JsonStorage,
            logger: chain.logger,
            snapshotManager
        });
        this.m_storageManager = storageManager;
        let err = await this.m_storageManager.init();
        if (err) {
            chain.logger.error(`ValueChainDebugSession init storageManager init failed `, error_code_1.stringifyErrorCode(err));
            return err;
        }
        const ghr = await chain.headerStorage.getHeader(0);
        if (ghr.err) {
            chain.logger.error(`ValueChainDebugSession init get genesis header failed `, error_code_1.stringifyErrorCode(ghr.err));
            return ghr.err;
        }
        const genesisHash = ghr.header.hash;
        const gsr = await this.m_dumpSnapshotManager.getSnapshot(genesisHash);
        if (!gsr.err) {
            return error_code_1.ErrorCode.RESULT_OK;
        }
        else if (gsr.err !== error_code_1.ErrorCode.RESULT_NOT_FOUND) {
            chain.logger.error(`ValueChainDebugSession init get gensis dump snapshot err `, error_code_1.stringifyErrorCode(gsr.err));
            return gsr.err;
        }
        const gsvr = await chain.storageManager.getSnapshotView(genesisHash);
        if (gsvr.err) {
            chain.logger.error(`ValueChainDebugSession init get gensis dump snapshot err `, error_code_1.stringifyErrorCode(gsvr.err));
            return gsvr.err;
        }
        const srcStorage = gsvr.storage;
        let csr = await storageManager.createStorage('genesis');
        if (csr.err) {
            chain.logger.error(`ValueChainDebugSession init create genesis memory storage failed `, error_code_1.stringifyErrorCode(csr.err));
            return csr.err;
        }
        const dstStorage = csr.storage;
        const tjsr = await srcStorage.toJsonStorage(dstStorage);
        if (tjsr.err) {
            chain.logger.error(`ValueChainDebugSession init transfer genesis memory storage failed `, error_code_1.stringifyErrorCode(tjsr.err));
            return tjsr.err;
        }
        csr = await this.m_storageManager.createSnapshot(dstStorage, genesisHash, true);
        if (csr.err) {
            chain.logger.error(`ValueChainDebugSession init create genesis memory dump failed `, error_code_1.stringifyErrorCode(csr.err));
            return csr.err;
        }
        return error_code_1.ErrorCode.RESULT_OK;
    }
    async block(hash) {
        const chain = this.debuger.chain;
        const block = chain.blockStorage.get(hash);
        if (!block) {
            chain.logger.error(`block ${hash} not found`);
            return { err: error_code_1.ErrorCode.RESULT_NOT_FOUND };
        }
        const csr = await this.m_storageManager.createStorage(hash, block.header.preBlockHash);
        if (csr.err) {
            chain.logger.error(`block ${hash} create pre block storage failed `, error_code_1.stringifyErrorCode(csr.err));
        }
        const { err } = await this.debuger.debugBlock(csr.storage, block);
        csr.storage.remove();
        return { err };
    }
    async transaction(hash) {
        const chain = this.debuger.chain;
        const gtrr = await chain.getTransactionReceipt(hash);
        if (gtrr.err) {
            chain.logger.error(`transaction ${hash} get receipt failed `, error_code_1.stringifyErrorCode(gtrr.err));
            return { err: gtrr.err };
        }
        return this.block(gtrr.block.hash);
    }
    async view(from, method, params) {
        const chain = this.debuger.chain;
        let hr = await chain.headerStorage.getHeader(from);
        if (hr.err !== error_code_1.ErrorCode.RESULT_OK) {
            chain.logger.error(`view ${method} failed for load header ${from} failed for ${hr.err}`);
            return { err: hr.err };
        }
        let header = hr.header;
        let svr = await this.m_storageManager.getSnapshotView(header.hash);
        if (svr.err !== error_code_1.ErrorCode.RESULT_OK) {
            chain.logger.error(`view ${method} failed for get snapshot ${header.hash} failed for ${svr.err}`);
            return { err: svr.err };
        }
        const ret = await this.debuger.debugView(svr.storage, header, method, params);
        this.m_storageManager.releaseSnapshotView(header.hash);
        return ret;
    }
}
exports.ValueChainDebugSession = ValueChainDebugSession;
class ValueIndependentDebugSession {
    constructor(debuger) {
        this.debuger = debuger;
    }
    async init(options) {
        const csr = await this.debuger.createStorage();
        if (csr.err) {
            return csr.err;
        }
        this.m_storage = csr.storage;
        if (util_1.isArray(options.accounts)) {
            this.m_accounts = options.accounts.map((x) => Buffer.from(x));
        }
        else {
            this.m_accounts = [];
            for (let i = 0; i < options.accounts; ++i) {
                this.m_accounts.push(address_1.createKeyPair()[1]);
            }
        }
        this.m_interval = options.interval;
        const chain = this.debuger.chain;
        let gh = chain.newBlockHeader();
        gh.timestamp = Date.now() / 1000;
        let block = chain.newBlock(gh);
        let genesissOptions = {};
        genesissOptions.candidates = [];
        genesissOptions.miners = [];
        genesissOptions.coinbase = address_1.addressFromSecretKey(this.m_accounts[options.coinbase]);
        if (options.preBalance) {
            genesissOptions.preBalances = [];
            this.m_accounts.forEach((value) => {
                genesissOptions.preBalances.push({ address: address_1.addressFromSecretKey(value), amount: options.preBalance });
            });
        }
        const err = await chain.onCreateGenesisBlock(block, csr.storage, genesissOptions);
        if (err) {
            chain.logger.error(`onCreateGenesisBlock failed for `, error_code_1.stringifyErrorCode(err));
            return err;
        }
        gh.updateHash();
        if (options.height > 0) {
            const _err = this.updateHeightTo(options.height, options.coinbase);
            if (_err) {
                return _err;
            }
        }
        else {
            this.m_curHeader = block.header;
        }
        return error_code_1.ErrorCode.RESULT_OK;
    }
    updateHeightTo(height, coinbase) {
        if (height <= this.m_curHeader.number) {
            this.debuger.chain.logger.error(`updateHeightTo ${height} failed for current height ${this.m_curHeader.number} is larger`);
            return error_code_1.ErrorCode.RESULT_INVALID_PARAM;
        }
        let curHeader = this.m_curHeader;
        const offset = height - curHeader.number;
        for (let i = 0; i <= offset; ++i) {
            let header = this.debuger.chain.newBlockHeader();
            header.timestamp = curHeader.timestamp + this.m_interval;
            header.coinbase = address_1.addressFromSecretKey(this.m_accounts[coinbase]);
            header.setPreBlock(curHeader);
            curHeader = header;
        }
        this.m_curHeader = curHeader;
        return error_code_1.ErrorCode.RESULT_OK;
    }
    transaction(options) {
        const tx = new value_chain_1.ValueTransaction();
        tx.fee = new bignumber_js_1.BigNumber(0);
        tx.value = new bignumber_js_1.BigNumber(options.value);
        tx.method = options.method;
        tx.input = options.input;
        tx.sign(this.m_accounts[options.caller]);
        return this.debuger.debugTransaction(this.m_storage, this.m_curHeader, tx);
    }
    wage() {
        return this.debuger.debugMinerWageEvent(this.m_storage, this.m_curHeader);
    }
    view(options) {
        return this.debuger.debugView(this.m_storage, this.m_curHeader, options.method, options.params);
    }
    getAccount(index) {
        return address_1.addressFromSecretKey(this.m_accounts[index]);
    }
}
exports.ValueIndependentDebugSession = ValueIndependentDebugSession;
class MemoryDebuger {
    constructor(chain, logger) {
        this.chain = chain;
        this.logger = logger;
    }
    async createStorage() {
        const storage = new storage_1.JsonStorage({
            filePath: '',
            logger: this.logger
        });
        const err = await storage.init();
        if (err) {
            this.chain.logger.error(`init storage failed `, error_code_1.stringifyErrorCode(err));
            return { err };
        }
        storage.createLogger();
        return { err: error_code_1.ErrorCode.RESULT_OK, storage };
    }
    async debugTransaction(storage, header, tx) {
        const block = this.chain.newBlock(header);
        const nber = await this.chain.newBlockExecutor(block, storage);
        if (nber.err) {
            return { err: nber.err };
        }
        const etr = await nber.executor.executeTransaction(tx, { ignoreNoce: true });
        if (etr.err) {
            return { err: etr.err };
        }
        return { err: error_code_1.ErrorCode.RESULT_OK, receipt: etr.receipt };
    }
    async debugBlockEvent(storage, header, listener) {
        const block = this.chain.newBlock(header);
        const nber = await this.chain.newBlockExecutor(block, storage);
        if (nber.err) {
            return { err: nber.err };
        }
        const err = await nber.executor.executeBlockEvent(listener);
        return { err };
    }
    async debugView(storage, header, method, params) {
        const nver = await this.chain.newViewExecutor(header, storage, method, params);
        if (nver.err) {
            return { err: nver.err };
        }
        return nver.executor.execute();
    }
    async debugBlock(storage, block) {
        const nber = await this.chain.newBlockExecutor(block, storage);
        if (nber.err) {
            return { err: nber.err };
        }
        const err = await nber.executor.execute();
        return { err };
    }
}
class ValueMemoryDebuger extends MemoryDebuger {
    async debugMinerWageEvent(storage, header) {
        const block = this.chain.newBlock(header);
        const nber = await this.chain.newBlockExecutor(block, storage);
        if (nber.err) {
            return { err: nber.err };
        }
        const err = await nber.executor.executeMinerWageEvent();
        return { err };
    }
    createIndependentSession() {
        return new ValueIndependentDebugSession(this);
    }
    async createChainSession(storageDir) {
        const session = new ValueChainDebugSession(this);
        const err = await session.init(storageDir);
        if (err) {
            return { err };
        }
        return { err: error_code_1.ErrorCode.RESULT_OK, session };
    }
}
async function createValueDebuger(chainCreator, dataDir) {
    const ccir = await chainCreator.createChainInstance(dataDir, { readonly: true });
    if (ccir.err) {
        chainCreator.logger.error(`create chain instance from ${dataDir} failed `, error_code_1.stringifyErrorCode(ccir.err));
        return { err: ccir.err };
    }
    const err = await ccir.chain.setGlobalOptions(ccir.globalOptions);
    if (err) {
        chainCreator.logger.error(`setGlobalOptions failed `, error_code_1.stringifyErrorCode(err));
        return { err };
    }
    return { err: error_code_1.ErrorCode.RESULT_OK, debuger: new ValueMemoryDebuger(ccir.chain, chainCreator.logger) };
}
exports.createValueDebuger = createValueDebuger;
