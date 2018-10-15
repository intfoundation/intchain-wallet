"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const error_code_1 = require("../error_code");
const LRUCache_1 = require("../lib/LRUCache");
const context_1 = require("./context");
const initHeadersSql = 'CREATE TABLE IF NOT EXISTS "miners"("hash" CHAR(64) PRIMARY KEY NOT NULL UNIQUE, "miners" TEXT NOT NULL, "totalView" INTEGER NOT NULL);';
const addHeaderSql = 'INSERT INTO miners (hash, miners, totalView) values ($hash, $miners, $totalView)';
const getHeaderSql = 'SELECT miners, totalView FROM miners WHERE hash=$hash';
class DbftHeaderStorage {
    constructor(options) {
        this.m_cache = new LRUCache_1.LRUCache(12);
        this.m_db = options.db;
        this.m_logger = options.logger;
        this.m_headerStorage = options.headerStorage;
    }
    async init() {
        try {
            await this.m_db.run(initHeadersSql);
            return error_code_1.ErrorCode.RESULT_OK;
        }
        catch (e) {
            this.m_logger.error(e);
            return error_code_1.ErrorCode.RESULT_EXCEPTION;
        }
    }
    uninit() {
        // do nothing
    }
    async _getHeader(hash) {
        let c = this.m_cache.get(hash);
        if (c) {
            return { err: error_code_1.ErrorCode.RESULT_OK, miners: c.m };
        }
        try {
            const gm = await this.m_db.get(getHeaderSql, { $hash: hash });
            if (!gm || !gm.miners) {
                this.m_logger.error(`getMinersSql error,election block hash=${hash}`);
                return { err: error_code_1.ErrorCode.RESULT_NOT_FOUND };
            }
            let miners = JSON.parse(gm.miners);
            this.m_cache.set(hash, { m: miners, v: gm.totalView });
            return { err: error_code_1.ErrorCode.RESULT_OK, miners: miners };
        }
        catch (e) {
            this.m_logger.error(e);
            return { err: error_code_1.ErrorCode.RESULT_EXCEPTION };
        }
    }
    async addHeader(header, storageManager) {
        let miners;
        if (!context_1.DbftContext.isElectionBlockNumber(this.m_globalOptions, header.number)) {
            const gs = await storageManager.getSnapshotView(header.hash);
            if (gs.err) {
                return gs.err;
            }
            const context = new context_1.DbftContext(gs.storage, this.m_globalOptions, this.m_logger);
            const gmr = await context.getMiners();
            storageManager.releaseSnapshotView(header.hash);
            if (gmr.err) {
                return gmr.err;
            }
            miners = gmr.miners;
        }
        let totalView = 0;
        if (header.number !== 0) {
            const ghr = await this._getHeader(header.preBlockHash);
            if (ghr.err) {
                return ghr.err;
            }
            totalView = ghr.totalView;
        }
        totalView += Math.pow(2, header.view);
        try {
            await this.m_db.run(addHeaderSql, { $hash: header.hash, $miners: JSON.stringify(miners), $totalView: totalView });
            return error_code_1.ErrorCode.RESULT_OK;
        }
        catch (e) {
            this.m_logger.error(e);
            return error_code_1.ErrorCode.RESULT_EXCEPTION;
        }
    }
    async getTotalView(header) {
        return this._getHeader(header.hash);
    }
    async getMiners(header) {
        return await this._getMiners(header, false);
    }
    async getNextMiners(header) {
        return await this._getMiners(header, true);
    }
    async _getMiners(header, bNext) {
        let en = context_1.DbftContext.getElectionBlockNumber(this.m_globalOptions, bNext ? header.number + 1 : header.number);
        let electionHeader;
        if (header.number === en) {
            electionHeader = header;
        }
        else {
            let hr = await this.m_headerStorage.getHeader(header.preBlockHash, en - header.number + 1);
            if (hr.err) {
                this.m_logger.error(`dbft get electionHeader error,number=${header.number},prevblockhash=${header.preBlockHash}`);
                return { err: hr.err };
            }
            electionHeader = hr.header;
        }
        return this._getHeader(electionHeader.hash);
    }
    async getDueMiner(header, miners) {
        if (header.number === 0) {
            return { err: error_code_1.ErrorCode.RESULT_OK, miner: header.miner };
        }
        const hr = await this.m_headerStorage.getHeader(header.preBlockHash);
        if (hr.err) {
            this.m_logger.error(`getDueMiner failed for get pre block failed `, hr.err);
            return { err: hr.err };
        }
        let due = context_1.DbftContext.getDueNextMiner(this.m_globalOptions, hr.header, miners, header.view);
        return { err: error_code_1.ErrorCode.RESULT_OK, miner: due };
    }
}
exports.DbftHeaderStorage = DbftHeaderStorage;
