"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require('assert');
const error_code_1 = require("../error_code");
const value_chain_1 = require("../value_chain");
class DbftContext {
    constructor(storage, globalOptions, logger) {
        this.storage = storage;
        this.globalOptions = globalOptions;
        this.logger = logger;
    }
    async init(miners) {
        let storage = this.storage;
        let dbr = await storage.getReadWritableDatabase(value_chain_1.Chain.dbSystem);
        if (dbr.err) {
            this.logger.error(`get system database failed ${dbr.err}`);
            return { err: dbr.err };
        }
        let kvr = await dbr.value.getReadWritableKeyValue(DbftContext.kvDBFT);
        if (kvr.err) {
            this.logger.error(`get dbft keyvalue failed ${dbr.err}`);
            return { err: kvr.err };
        }
        let kvDBFT = kvr.kv;
        for (let address of miners) {
            let info = { height: 0 };
            let { err } = await kvDBFT.hset(DbftContext.keyCandidate, address, info);
            if (err) {
                return { err };
            }
        }
        return { err: error_code_1.ErrorCode.RESULT_OK };
    }
    static getElectionBlockNumber(globalOptions, n) {
        if (n === 0) {
            return 0;
        }
        return Math.floor((n - 1) / globalOptions.reSelectionBlocks) * globalOptions.reSelectionBlocks;
    }
    static isElectionBlockNumber(globalOptions, n) {
        // n=0的时候为创世块，config里面还没有值呢
        if (n === 0) {
            return true;
        }
        return n % globalOptions.reSelectionBlocks === 0;
    }
    static isAgreeRateReached(globalOptions, minerCount, agreeCount) {
        return agreeCount >= (minerCount * globalOptions.agreeRate);
    }
    static getDueNextMiner(globalOptions, preBlock, nextMiners, view) {
        let offset = view;
        if (!DbftContext.isElectionBlockNumber(globalOptions, preBlock.number)) {
            let idx = nextMiners.indexOf(preBlock.miner);
            assert(idx > 0);
            offset += idx;
        }
        return nextMiners[offset % nextMiners.length];
    }
    async getMiners() {
        let dbr = await this.storage.getReadableDataBase(value_chain_1.Chain.dbSystem);
        if (dbr.err) {
            this.logger.error(`get system database failed ${dbr.err}`);
            return { err: dbr.err };
        }
        let kvr = await dbr.value.getReadableKeyValue(DbftContext.kvDBFT);
        if (kvr.err) {
            this.logger.error(`get dbft keyvalue failed ${dbr.err}`);
            return { err: kvr.err };
        }
        let kvDBFT = kvr.kv;
        let gm = await kvDBFT.get(DbftContext.keyMiners);
        if (gm.err) {
            this.logger.error(`getMinersFromStorage failed,errcode=${gm.err}`);
            return { err: gm.err };
        }
        return { err: error_code_1.ErrorCode.RESULT_OK, miners: gm.value };
    }
    async isMiner(address) {
        let dbr = await this.storage.getReadableDataBase(value_chain_1.Chain.dbSystem);
        if (dbr.err) {
            this.logger.error(`get system database failed ${dbr.err}`);
            return { err: dbr.err };
        }
        let kvr = await dbr.value.getReadableKeyValue(DbftContext.kvDBFT);
        if (kvr.err) {
            this.logger.error(`get dbft keyvalue failed ${dbr.err}`);
            return { err: kvr.err };
        }
        let kvDBFT = kvr.kv;
        let gm = await kvDBFT.get(DbftContext.keyMiners);
        if (gm.err) {
            if (gm.err === error_code_1.ErrorCode.RESULT_NOT_FOUND) {
                return { err: error_code_1.ErrorCode.RESULT_OK, isminer: false };
            }
            else {
                return { err: gm.err };
            }
        }
        let miners = new Set(gm.value);
        return { err: error_code_1.ErrorCode.RESULT_OK, isminer: miners.has(address) };
    }
    async registerToCandidate(blockheight, address) {
        let storage = this.storage;
        let dbr = await storage.getReadWritableDatabase(value_chain_1.Chain.dbSystem);
        if (dbr.err) {
            this.logger.error(`get system database failed ${dbr.err}`);
            return dbr.err;
        }
        let kvr = await dbr.value.getReadWritableKeyValue(DbftContext.kvDBFT);
        if (kvr.err) {
            this.logger.error(`get dbft keyvalue failed ${dbr.err}`);
            return kvr.err;
        }
        let kvDBFT = kvr.kv;
        let info = { height: blockheight };
        let { err } = await kvDBFT.hset(DbftContext.keyCandidate, address, info);
        return err;
    }
    async unRegisterFromCandidate(address) {
        let storage = this.storage;
        let dbr = await storage.getReadWritableDatabase(value_chain_1.Chain.dbSystem);
        if (dbr.err) {
            this.logger.error(`get system database failed ${dbr.err}`);
            return dbr.err;
        }
        let kvr = await dbr.value.getReadWritableKeyValue(DbftContext.kvDBFT);
        if (kvr.err) {
            this.logger.error(`get dbft keyvalue failed ${dbr.err}`);
            return kvr.err;
        }
        let kvDBFT = kvr.kv;
        let { err } = await kvDBFT.hdel(DbftContext.keyCandidate, address);
        return err;
    }
    async updateMiners(blockheight) {
        let storage = this.storage;
        let dbr = await storage.getReadWritableDatabase(value_chain_1.Chain.dbSystem);
        if (dbr.err) {
            this.logger.error(`get system database failed ${dbr.err}`);
            return dbr.err;
        }
        let kvr = await dbr.value.getReadWritableKeyValue(DbftContext.kvDBFT);
        if (kvr.err) {
            this.logger.error(`get dbft keyvalue failed ${dbr.err}`);
            return kvr.err;
        }
        let kvDBFT = kvr.kv;
        let ga = await kvDBFT.hgetall(DbftContext.keyCandidate);
        if (ga.err) {
            this.logger.error(`updateCandidate failed,hgetall errcode=${ga.err}`);
            return ga.err;
        }
        let minWaitBlocksToMiner = this.globalOptions.minWaitBlocksToMiner;
        let miners = [];
        ga.value.forEach((v) => {
            let info = v.value;
            if (blockheight - info.height >= minWaitBlocksToMiner) {
                miners.push(v.key);
            }
        });
        let minValidator = this.globalOptions.minValidator;
        let maxValidator = this.globalOptions.maxValidator;
        if (minValidator > miners.length) {
            this.logger.error(`updateCandidate failed, valid miners not enough, length ${miners.length} minValidator ${minValidator}`);
            return error_code_1.ErrorCode.RESULT_NOT_ENOUGH;
        }
        if (miners.length > maxValidator) {
            miners = miners.slice(maxValidator);
        }
        let { err } = await kvDBFT.set(DbftContext.keyMiners, miners);
        return err;
    }
}
DbftContext.kvDBFT = 'dbft';
DbftContext.keyCandidate = 'candidate';
DbftContext.keyMiners = 'miner';
exports.DbftContext = DbftContext;
