"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const error_code_1 = require("../error_code");
const util_1 = require("util");
const value_chain_1 = require("../value_chain");
const block_1 = require("./block");
const context_1 = require("./context");
const executor_1 = require("./executor");
const ValueContext = require("../value_chain/context");
const header_storage_1 = require("./header_storage");
class DbftChain extends value_chain_1.ValueChain {
    constructor(options) {
        super(options);
    }
    async newBlockExecutor(block, storage) {
        let kvBalance = (await storage.getKeyValue(value_chain_1.Chain.dbSystem, value_chain_1.ValueChain.kvBalance)).kv;
        let ve = new ValueContext.Context(kvBalance);
        let externalContext = Object.create(null);
        externalContext.getBalance = async (address) => {
            return await ve.getBalance(address);
        };
        externalContext.transferTo = async (address, amount) => {
            return await ve.transferTo(value_chain_1.ValueChain.sysAddress, address, amount);
        };
        let context = new context_1.DbftContext(storage, this.globalOptions, this.logger);
        externalContext.register = async (address) => {
            return await context.registerToCandidate(block.number, address);
        };
        externalContext.unregister = async (address) => {
            return await context.unRegisterFromCandidate(address);
        };
        externalContext.getMiners = async () => {
            let gm = await context.getMiners();
            if (gm.err) {
                throw Error('newBlockExecutor getMiners failed errcode ${gm.err}');
            }
            return gm.miners;
        };
        externalContext.isMiner = async (address) => {
            let im = await context.isMiner(address);
            if (im.err) {
                throw Error('newBlockExecutor isMiner failed errcode ${gm.err}');
            }
            return im.isminer;
        };
        let executor = new executor_1.DbftBlockExecutor({ logger: this.logger, block, storage, handler: this.handler, externContext: externalContext, globalOptions: this.globalOptions });
        return { err: error_code_1.ErrorCode.RESULT_OK, executor: executor };
    }
    async newViewExecutor(header, storage, method, param) {
        let nvex = await super.newViewExecutor(header, storage, method, param);
        let externalContext = nvex.executor.externContext;
        let dbftProxy = new context_1.DbftContext(storage, this.globalOptions, this.logger);
        externalContext.getMiners = async () => {
            let gm = await dbftProxy.getMiners();
            if (gm.err) {
                throw Error('newBlockExecutor getMiners failed errcode ${gm.err}');
            }
            return gm.miners;
        };
        externalContext.isMiner = async (address) => {
            let im = await dbftProxy.isMiner(address);
            if (im.err) {
                throw Error('newBlockExecutor isMiner failed errcode ${gm.err}');
            }
            return im.isminer;
        };
        return nvex;
    }
    async uninitComponents() {
        if (this.m_dbftHeaderStorage) {
            this.m_dbftHeaderStorage.uninit();
            delete this.m_dbftHeaderStorage;
        }
        await super.uninitComponents();
    }
    _getBlockHeaderType() {
        return block_1.DbftBlockHeader;
    }
    async _onVerifiedBlock(block) {
        return this.m_dbftHeaderStorage.addHeader(block.header, this.m_storageManager);
    }
    async _onLoadGlobalOptions() {
        this.m_dbftHeaderStorage = new header_storage_1.DbftHeaderStorage({
            db: this.m_db,
            headerStorage: this.m_headerStorage,
            globalOptions: this.globalOptions,
            logger: this.logger
        });
        const err = await this.m_dbftHeaderStorage.init();
        if (err) {
            this.logger.error(`dbft header storage init err `, err);
        }
        return err;
    }
    _onCheckGlobalOptions(globalOptions) {
        if (!super._onCheckGlobalOptions(globalOptions)) {
            return false;
        }
        if (util_1.isNullOrUndefined(globalOptions.minValidator)) {
            this.m_logger.error(`globalOptions should has minValidator`);
            return false;
        }
        if (util_1.isNullOrUndefined(globalOptions.maxValidator)) {
            this.m_logger.error(`globalOptions should has maxValidator`);
            return false;
        }
        if (util_1.isNullOrUndefined(globalOptions.reSelectionBlocks)) {
            this.m_logger.error(`globalOptions should has reSelectionBlocks`);
            return false;
        }
        if (util_1.isNullOrUndefined(globalOptions.blockInterval)) {
            this.m_logger.error(`globalOptions should has blockInterval`);
            return false;
        }
        if (util_1.isNullOrUndefined(globalOptions.minWaitBlocksToMiner)) {
            this.m_logger.error(`globalOptions should has minWaitBlocksToMiner`);
            return false;
        }
        if (util_1.isNullOrUndefined(globalOptions.superAdmin)) {
            this.m_logger.error(`globalOptions should has superAdmin`);
            return false;
        }
        if (util_1.isNullOrUndefined(globalOptions.agreeRate)) {
            this.m_logger.error(`globalOptions should has superAdmin`);
            return false;
        }
        if (util_1.isNullOrUndefined(globalOptions.systemAddress)) {
            this.m_logger.error(`globalOptions should has systemAddress`);
            return false;
        }
        return true;
    }
    _onCheckTypeOptions(typeOptions) {
        return typeOptions.consensus === 'dbft';
    }
    get dbftHeaderStorage() {
        return this.m_dbftHeaderStorage;
    }
    async onCreateGenesisBlock(block, storage, genesisOptions) {
        let err = await super.onCreateGenesisBlock(block, storage, genesisOptions);
        if (err) {
            return err;
        }
        let gkvr = await storage.getKeyValue(value_chain_1.Chain.dbSystem, value_chain_1.Chain.kvConfig);
        if (gkvr.err) {
            return gkvr.err;
        }
        let rpr = await gkvr.kv.set('consensus', 'dbft');
        if (rpr.err) {
            return rpr.err;
        }
        let dbr = await storage.getReadWritableDatabase(value_chain_1.Chain.dbSystem);
        if (dbr.err) {
            return dbr.err;
        }
        // storage的键值对要在初始化的时候就建立好
        let kvr = await dbr.value.createKeyValue(context_1.DbftContext.kvDBFT);
        if (kvr.err) {
            return kvr.err;
        }
        let denv = new context_1.DbftContext(storage, this.globalOptions, this.m_logger);
        let ir = await denv.init(genesisOptions.miners);
        if (ir.err) {
            return ir.err;
        }
        return error_code_1.ErrorCode.RESULT_OK;
    }
}
exports.DbftChain = DbftChain;
