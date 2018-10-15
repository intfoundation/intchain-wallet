"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("events");
const assert = require('assert');
const error_code_1 = require("../error_code");
const writer_1 = require("../lib/writer");
const chain_1 = require("../chain");
const block_1 = require("./block");
const context_1 = require("./context");
const reader_1 = require("../lib/reader");
const libAddress = require("../address");
var DBFT_SYNC_CMD_TYPE;
(function (DBFT_SYNC_CMD_TYPE) {
    DBFT_SYNC_CMD_TYPE[DBFT_SYNC_CMD_TYPE["prepareRequest"] = 23] = "prepareRequest";
    DBFT_SYNC_CMD_TYPE[DBFT_SYNC_CMD_TYPE["prepareResponse"] = 24] = "prepareResponse";
    DBFT_SYNC_CMD_TYPE[DBFT_SYNC_CMD_TYPE["changeview"] = 25] = "changeview";
    DBFT_SYNC_CMD_TYPE[DBFT_SYNC_CMD_TYPE["end"] = 26] = "end";
})(DBFT_SYNC_CMD_TYPE = exports.DBFT_SYNC_CMD_TYPE || (exports.DBFT_SYNC_CMD_TYPE = {}));
var ConsensusState;
(function (ConsensusState) {
    ConsensusState[ConsensusState["none"] = 0] = "none";
    ConsensusState[ConsensusState["waitingCreate"] = 1] = "waitingCreate";
    ConsensusState[ConsensusState["waitingProposal"] = 3] = "waitingProposal";
    ConsensusState[ConsensusState["waitingVerify"] = 4] = "waitingVerify";
    ConsensusState[ConsensusState["waitingAgree"] = 5] = "waitingAgree";
    ConsensusState[ConsensusState["waitingBlock"] = 6] = "waitingBlock";
    ConsensusState[ConsensusState["changeViewSent"] = 10] = "changeViewSent";
})(ConsensusState || (ConsensusState = {}));
class DbftConsensusNode extends events_1.EventEmitter {
    constructor(options) {
        super();
        this.m_node = options.node;
        this.m_globalOptions = options.globalOptions;
        this.m_state = ConsensusState.none;
        this.m_secret = options.secret;
        this.m_address = libAddress.addressFromSecretKey(this.m_secret);
        this.m_pubkey = libAddress.publicKeyFromSecretKey(this.m_secret);
    }
    on(event, listener) {
        return super.on(event, listener);
    }
    once(event, listener) {
        return super.once(event, listener);
    }
    get base() {
        return this.m_node;
    }
    get logger() {
        return this.m_node.logger;
    }
    async init() {
        await this.m_node.init();
        let hr = await this.m_node.headerStorage.getHeader(0);
        if (hr.err) {
            this.logger.error(`dbft consensus node init failed for ${hr.err}`);
            return hr.err;
        }
        this.m_genesisTime = hr.header.timestamp;
        let err = await this.m_node.initialOutbounds();
        if (err) {
            this.logger.error(`dbft consensus node init failed for ${err}`);
            return err;
        }
        return error_code_1.ErrorCode.RESULT_OK;
    }
    _cancel() {
        this.m_state = ConsensusState.none;
        this.m_context = undefined;
        this._resetTimer();
    }
    updateTip(header, nextMiners, totalView) {
        // TODO: 这里还需要比较两个header 的work，只有大的时候覆盖
        if (!this.m_tip || this.m_tip.header.hash !== header.hash) {
            this.m_tip = {
                header,
                nextMiners,
                totalView
            };
            if (this.m_state !== ConsensusState.none) {
                this.logger.warn(`dbft conensus update tip when in consensus `, this.m_context);
                this._cancel();
            }
            else {
                this._resetTimer();
            }
            this.m_node.setValidators(nextMiners);
        }
    }
    async agreeProposal(block) {
        if (this.m_state !== ConsensusState.waitingVerify) {
            this.logger.warn(`skip agreeProposal in state `, this.m_state);
            return error_code_1.ErrorCode.RESULT_SKIPPED;
        }
        let curContext = this.m_context;
        assert(curContext && curContext.block && curContext.from);
        if (!curContext || !curContext.block || !curContext.from) {
            this.logger.error(`agreeProposal in invalid context `, curContext);
            return error_code_1.ErrorCode.RESULT_SKIPPED;
        }
        if (!curContext.block.header.isPreBlock(block.header)) {
            this.logger.error(`agreeProposal block ${block.header} ${block.number} in invalid context block ${curContext.block.hash} ${curContext.block.number}`);
            return error_code_1.ErrorCode.RESULT_SKIPPED;
        }
        const sign = libAddress.sign(block.hash, this.m_secret);
        this._sendPrepareResponse(curContext.from, curContext.block, sign);
        // TODO?要进入什么状态?
        return error_code_1.ErrorCode.RESULT_OK;
    }
    async newProposal(block) {
        assert(this.m_tip);
        if (!this.m_tip) {
            return error_code_1.ErrorCode.RESULT_SKIPPED;
        }
        if (this.m_state !== ConsensusState.waitingCreate) {
            this.logger.warn(`dbft conensus newProposal ${block.header.hash}  ${block.header.number} while not in waitingCreate state`);
            return error_code_1.ErrorCode.RESULT_SKIPPED;
        }
        if (!this.m_tip.header.isPreBlock(block.header)) {
            this.logger.warn(`dbft conensus newProposal ${block.header.hash}  ${block.header.number} while in another context ${this.m_tip.header.hash} ${this.m_tip.header.number}`);
            return error_code_1.ErrorCode.RESULT_SKIPPED;
        }
        this._sendPrepareRequest(block);
        this.m_state = ConsensusState.waitingAgree;
        let curContext = {
            curView: 0,
            block,
            signs: new Map()
        };
        this.m_context = curContext;
        return error_code_1.ErrorCode.RESULT_OK;
    }
    async _resetTimer() {
        let tr = await this._nextTimeout();
        if (tr.err === error_code_1.ErrorCode.RESULT_SKIPPED) {
            return tr.err;
        }
        if (this.m_timer) {
            clearTimeout(this.m_timer);
            delete this.m_timer;
        }
        this.m_timer = setTimeout(async () => {
            delete this.m_timer;
            this._resetTimer();
            this._onTimeout();
        }, tr.timeout);
        return error_code_1.ErrorCode.RESULT_OK;
    }
    _isOneOfMiner() {
        return this.m_tip.nextMiners.indexOf(this.m_address) >= 0;
    }
    _onTimeout() {
        assert(this.m_tip);
        if (!this.m_tip) {
            this.logger.warn(`bdft consensus has no tip when time out`);
            return;
        }
        if (this.m_state === ConsensusState.none) {
            if (!this._isOneOfMiner()) {
                this.logger.debug(`bdft consensus is not one of miner when time out`);
                return;
            }
            let due = context_1.DbftContext.getDueNextMiner(this.m_globalOptions, this.m_tip.header, this.m_tip.nextMiners, 0);
            if (this.m_address === due) {
                this.m_state = ConsensusState.waitingCreate;
                let newContext = {
                    curView: 0
                };
                this.m_context = newContext;
                let now = Date.now() / 1000;
                let blockHeader = new block_1.DbftBlockHeader();
                blockHeader.setPreBlock(this.m_tip.header);
                blockHeader.timestamp = now;
                this.logger.debug(`bdft consensus enter waitingCreate ${blockHeader.hash} ${blockHeader.number}`);
                this.emit('createBlock', blockHeader);
            }
            else {
                this.m_state = ConsensusState.waitingProposal;
                let newContext = {
                    curView: 0
                };
                this.m_context = newContext;
                this.logger.debug(`bdft consensus enter waitingProposal ${this.m_tip.header.hash} ${this.m_tip.header.number}`);
            }
        }
        else if (this.m_state === ConsensusState.waitingAgree) {
            // 超时未能达成共识，触发提升view
        }
        else {
            // TODO:
            assert(false);
        }
    }
    async _sendPrepareRequest(block) {
        let writer = new writer_1.BufferWriter();
        let err = block.encode(writer);
        let data = writer.render();
        let pkg = chain_1.PackageStreamWriter.fromPackage(DBFT_SYNC_CMD_TYPE.prepareRequest, {}, data.length).writeData(data);
        this.m_node.broadcastToValidators(pkg);
    }
    _sendPrepareResponse(to, block, sign) {
        let writer = new writer_1.BufferWriter();
        writer.writeBytes(this.m_pubkey);
        writer.writeBytes(sign);
        let data = writer.render();
        let pkg = chain_1.PackageStreamWriter.fromPackage(DBFT_SYNC_CMD_TYPE.prepareResponse, { hash: block.hash }, data.length).writeData(data);
        to.addPendingWriter(pkg);
    }
    _beginSyncWithNode(conn) {
        conn.on('pkg', async (pkg) => {
            if (pkg.header.cmdType === DBFT_SYNC_CMD_TYPE.prepareRequest) {
                let block = this.base.newBlock();
                let reader = new reader_1.BufferReader(pkg.copyData());
                let err = block.decode(reader);
                if (err) {
                    // TODO: ban it
                    // this.base.banConnection();
                    this.logger.error(`recv invalid prepareRequest from `, conn.getRemote());
                    return;
                }
                if (!block.header.verifySign()) {
                    // TODO: ban it
                    // this.base.banConnection();
                    this.logger.error(`recv invalid signature prepareRequest from `, conn.getRemote());
                    return;
                }
                if (!block.verify()) {
                    // TODO: ban it
                    // this.base.banConnection();
                    this.logger.error(`recv invalid block in prepareRequest from `, conn.getRemote());
                    return;
                }
                this._onPrepareRequest(conn, { block });
            }
            else if (pkg.header.cmdType === DBFT_SYNC_CMD_TYPE.prepareResponse) {
                const hash = pkg.body.hash;
                let reader = new reader_1.BufferReader(pkg.copyData());
                let pubkey;
                let sign;
                try {
                    pubkey = reader.readBytes(33);
                    sign = reader.readBytes(64);
                }
                catch (e) {
                    // TODO: ban it
                    // this.base.banConnection();
                    this.logger.error(`decode prepareResponse failed `, e);
                    return;
                }
                if (!libAddress.verify(hash, sign, pubkey)) {
                    // TODO: ban it
                    // this.base.banConnection();
                    this.logger.error(`prepareResponse verify sign invalid`);
                    return;
                }
                if (libAddress.addressFromPublicKey(pubkey) === this.m_address) {
                    // TODO: ban it
                    // this.base.banConnection();
                    this.logger.error(`prepareResponse got my sign`);
                    return;
                }
                this._onPrepareResponse(conn, { hash, pubkey, sign });
            }
            else if (pkg.header.cmdType === DBFT_SYNC_CMD_TYPE.changeview) {
                this.emit('changeview', pkg.body);
            }
        });
    }
    _onPrepareRequest(from, pkg) {
        if (!this.m_tip) {
            this.logger.warn(`_onPrepareRequest while no tip`);
            return;
        }
        if (this.m_state === ConsensusState.waitingProposal) {
            assert(this.m_context);
            let curContext = this.m_context;
            if (!this.m_tip.header.isPreBlock(pkg.block.header)) {
                this.logger.debug(`_onPrepareRequest got block ${pkg.block.header.hash} ${pkg.block.header.number} while tip is ${this.m_tip.header.hash} ${this.m_tip.header.number}`);
                return;
            }
            let header = pkg.block.header;
            if (curContext.curView !== header.view) {
                // 有可能漏了change view，两边view 不一致
                this.logger.debug(`_onPrepareRequest got block ${header.hash} ${header.number} ${header.view} while cur view is ${curContext.curView}`);
                return;
            }
            let due = context_1.DbftContext.getDueNextMiner(this.m_globalOptions, this.m_tip.header, this.m_tip.nextMiners, curContext.curView);
            if (header.miner !== due) {
                // TODO: ban it
                // this.base.banConnection();
                this.logger.error(`recv prepareRequest's block ${pkg.block.header.hash} ${pkg.block.header.number} ${header.miner} not match due miner ${due}`);
                return;
            }
            this.m_state = ConsensusState.waitingVerify;
            let newContext = {
                curView: curContext.curView,
                block: pkg.block,
                from
            };
            this.m_context = newContext;
            this.logger.debug(`bdft consensus enter waitingVerify ${header.hash} ${header.number}`);
            this.emit('verifyBlock', pkg.block);
        }
        else {
            // 其他状态都忽略
            this.logger.warn(`_onPrepareRequest in invalid state `, this.m_state);
        }
    }
    _onPrepareResponse(from, pkg) {
        if (!this.m_tip) {
            this.logger.warn(`_onPrepareResponse while no tip`);
            return;
        }
        if (this.m_state === ConsensusState.waitingAgree) {
            assert(this.m_context);
            let curContext = this.m_context;
            if (curContext.block.hash !== pkg.hash) {
                this.logger.warn(`_onPrepareResponse got ${pkg.hash} while waiting ${curContext.block.hash}`);
                return;
            }
            const address = libAddress.addressFromPublicKey(pkg.pubkey);
            if (this.m_tip.nextMiners.indexOf(address) < 0) {
                this.logger.warn(`_onPrepareResponse got ${address} 's sign not in next miners`);
                // TODO: ban it
                // this.base.banConnection();
                return;
            }
            if (curContext.signs.has(address)) {
                this.logger.warn(`_onPrepareResponse got ${address} 's duplicated sign`);
                return;
            }
            curContext.signs.set(address, { pubkey: pkg.pubkey, sign: pkg.pubkey });
            if (context_1.DbftContext.isAgreeRateReached(this.m_globalOptions, this.m_tip.nextMiners.length, curContext.signs.size + 1)) {
                this.logger.info(`bdft consensus node enter state waitingBlock ${curContext.block.hash} ${curContext.block.number}`);
                this.m_state = ConsensusState.waitingBlock;
                let signs = [];
                for (let s of curContext.signs.values()) {
                    signs.push(s);
                }
                this.emit('mineBlock', curContext.block, signs);
            }
        }
        else {
            // 其他状态都忽略
            this.logger.warn(`_onPrepareResponse in invalid state `, this.m_state);
        }
    }
    async _nextTimeout() {
        if (!this.m_tip) {
            return { err: error_code_1.ErrorCode.RESULT_SKIPPED };
        }
        let blockInterval = this.m_globalOptions.blockInterval;
        let intervalCount = this.m_tip.totalView;
        if (this.m_context) {
            intervalCount += Math.pow(2, this.m_context.curView);
        }
        else {
            intervalCount += 1;
        }
        let nextTime = this.m_genesisTime + intervalCount * blockInterval;
        let now = Date.now() / 1000;
        if (nextTime > now) {
            return { err: error_code_1.ErrorCode.RESULT_OK, timeout: (nextTime - now) * 1000 };
        }
        else {
            return { err: error_code_1.ErrorCode.RESULT_SKIPPED };
        }
    }
}
exports.DbftConsensusNode = DbftConsensusNode;
