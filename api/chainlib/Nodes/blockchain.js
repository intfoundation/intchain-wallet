'use strict'

const ChainDB = require('../../db/chain');
const BlockStorage = require('../Block/block_storage');
const HeaderChain = require('../Chain/HeaderChain');
const Block = require('../Block/block');
const BlockUtil = require("../Block/util");
const KeyRing = require('../Account/keyring');

const assert = require('assert');
const {Info, MetaInfo} = require('../Infos/Info');
const TX = require('../Transcation/tx');
const EventEmitter = require('events');
const LockSimple = require('../Utils/LockSimple');

class BlockChain  extends EventEmitter{
    constructor(params){
        super();
        this.m_chainDB = new ChainDB(params.chaindb);
        this.m_blockStorage = new BlockStorage(10, params.storagePath);
        this.m_headerChain = new HeaderChain(this.m_chainDB);
        this.config = params.config;
        this.m_orphanBlocks = new Map();
        this.m_bUpdateBlockList = [];
        this.m_requestingBlock = new Map();
        this.m_updateTimeout = 3*60*1000;
        this.m_addBlockLock = new LockSimple();
        this.m_addHeaderLock = new LockSimple();
    }

    async create() {
        await this.m_chainDB.init();
        await this.m_headerChain.init();
        this.m_blockStorage.init();
       
        if (this.m_headerChain.isEmpty()) {
            let genesisBlock = Block.fromRaw(this.config.genesisBlockRaw, 'hex');
            await this.addBlocks([genesisBlock]);
        }   
    }

    async createBlock() {
        let lastHeader = await this.m_headerChain.getHeaderByHeight(this.getNowHeight());
        let newBlock = await BlockUtil.createBlock(lastHeader,this.m_headerChain);
        return newBlock;
    }

    //Step1: updateUTXO
    //Step2: addHeader
    //Step3: (optional) write block to disk
    async storageBlock(newBlock) {
        await this.m_chainDB.BeginTranscation();
        let newHeaders = newBlock.toHeaders();

        let headerHash = newHeaders.hash('hex');
        let blockHash = newBlock.hash('hex');
        
        if (newHeaders.height === this.m_headerChain.getNowHeight() + 1) {
            await this.m_headerChain.addHeader(newHeaders);
        }
        await this.m_chainDB.CommitTranscation();

         this.m_blockStorage.add(newBlock);
    }

    //主动触发更新header的逻辑
    async EmitUpdateHeader() {
        this.emit("OnUpdateHeader",this,this.getNowHeight()+1);
    }

    async EmitUpdateBlock() {
        let hashList = [];
        let nHeight = this.getNowHeight();
        for (let i=0;i<=nHeight; i++) {
            let header = await this.getHeaderByHeight(i);
            let hash = header.hash('hex');
            if (!this.m_blockStorage.has(hash)) {
                hashList.push(hash);
            }
        }
        if (hashList.length > 0) {
            this._doUpdateBlock(hashList);
        }
    }

    //一旦检测到某个header的index比链里面的大就触发更新header
    async addHeaders(headers){
        await this.m_addHeaderLock.enter();
        let updateBlockHashList = [];
        for(let header of headers){
            console.log('[blockchain.js addHeaders]header.hegith='+header.height.toString()+' now='+this.getNowHeight().toString());
            if(header.height > this.getNowHeight()+1) {
                this.emit("OnUpdateHeader",this,this.getNowHeight()+1);
                //不更新block
                updateBlockHashList = [];
                break;
            }
            else if (header.height < this.getNowHeight()) {
                continue;
            }
            else {
                let bRet = await this.m_headerChain.addHeader(header);
                if (!bRet) {
                    break;
                }
                let blockHash = header.hash('hex');
                if(this.m_blockStorage.has(blockHash)) {
                    continue;
                }
                if (this.m_orphanBlocks.has(header.height)) {
                    let block = this.m_orphanBlocks.get(header.height);
                    let prevBlock = this.getBlock(block.prevBlock);
                    if (prevBlock) {
                        this.m_orphanBlocks.delete(header.height);
                        console.log('[blockchain.js addHeaders] storageBlock 1,height=' + block.height.toString());
                        await this.storageBlock(block);
                    }
                } else {
                    updateBlockHashList.push(blockHash);
                }
            }

        }
        //检测是否需要更新block
        if (updateBlockHashList.length > 0) {
            this._doUpdateBlock(updateBlockHashList);
        }
        await this.m_addHeaderLock.leave();
    }

    _doUpdateBlock(list) {
        for (let hash of list) {
            if (!this.isRequesting(hash)) {
                this.m_bUpdateBlockList.push(hash);
            }
        }
        console.log('[blockchain.js _doUpdateBlock] this.m_bUpdateBlockList.length='+this.m_bUpdateBlockList.length);
        if (this.m_bUpdateBlockList.length > 0) {
            this.emit("OnUpdateBlock",this);
        }
    }


    getUpdateBlockListCount() {
        return this.m_bUpdateBlockList.length;
    }

    isRequesting(hash) {
        for (let h of this.m_bUpdateBlockList) {
            if (h === hash) {
                return true;
            }
        }

        if (!this.m_requestingBlock.has(hash)) {
            return false;
        }

        if (Date.now() > this.m_requestingBlock.get(hash) + this.m_updateTimeout) {
            console.log(`[blockchain.js isRequesting] timeout hash=${hash}`);
            this.m_requestingBlock.delete(hash);
            return false;
        }

        return true;
    }

    getUpdateBlockList(nCount) {
        if (nCount < 1) {
            nCount = 1000
        }
        let updateList = this.m_bUpdateBlockList.splice(0,nCount);
        for (let hash of updateList) {
            this.m_requestingBlock.set(hash, Date.now());
        }
        return updateList;
    }

    async addBlocks(blocks) {
        await this.m_addBlockLock.enter();
        for (let block of blocks){
            if (!block.verify()) {
                continue;
            }

            let hash = block.hash('hex');
            if (this.m_requestingBlock.has(hash)) {
                this.m_requestingBlock.delete(hash);
            }

            if (block.height > this.getNowHeight() +1) {
                this.m_orphanBlocks.set(block.height,block);
                this.emit("OnUpdateHeader",this,this.getNowHeight()+1);
            }
            else {
                let prevBlock = this.getBlock(block.prevBlock);
                if (block.height > 0 && !prevBlock) {
                    console.log('[blockchain.js addBlocks] add to m_orphanBlocks,height='+block.height.toString());
                    this.m_orphanBlocks.set(block.height,block);
                } else {
                    console.log('[blockchain.js addBlocks] storageBlock 2,height='+block.height.toString());
                    await this.storageBlock(block);
                }
            }
        }

        //遍历一下m_orphanBlocks中是否有可以加入的了
        //网络回来时异步，可能在 await this.storageBlock(block)的时候有新块插入
        while (true) {
            if (this.m_orphanBlocks.size === 0) {
                break;
            }
            let keys = [...this.m_orphanBlocks.keys()];
            keys.sort((a, b) => {
                if (a < b) {
                    return -1;
                } else if (a === b) {
                    return 0;
                }
                return 1
            });
            console.log('============================'+JSON.stringify(keys));
            let block = this.m_orphanBlocks.get(keys[0]);
            if (this.isRequesting(block.prevBlock)) {
                break;
            }
            let prevBlock = this.getBlock(block.prevBlock);
            if (!prevBlock) {
                let list = [];
                list.push(block.prevBlock);
                //再检查更前面得
                let bHeight = block.height - 2;
                while(bHeight > 1) {
                    let header = await this.getHeaderByHeight(bHeight);
                    let prevBlock = this.getBlock(header.hash('hex'));
                    if (prevBlock || this.isRequesting(header.hash('hex')) || list.length >= 50) {
                        break;
                    }
                    list.push(header.hash('hex'));
                    list1.push(bHeight);
                    bHeight--;
                }
                console.log(`[blockchain.js addBlocks] download prevblock,height=${keys[0]},prevblock hash=${block.prevBlock}`);
                this._doUpdateBlock(list);
                break;
            }
            let prevIndex = prevBlock.height;
            let blocklist = [];
            for (let index of keys) {
                if (index === prevIndex + 1) {
                    let block = this.m_orphanBlocks.get(index);
                    this.m_orphanBlocks.delete(index);
                    blocklist.push(block);
                    prevIndex = index;
                } else {
                    break;
                }
            }
            console.log('[blockchain.js addBlocks] this.m_orphanBlocks,length=' + this.m_orphanBlocks.size.toString() + JSON.stringify([...this.m_orphanBlocks.keys()]));
            for (let block of blocklist) {
                console.log('[blockchain.js addBlocks] storageBlock 3,height=' + block.height.toString());
                await this.storageBlock(block);
            }
        }
        //this._doUpdateBlock([]);
        await this.m_addBlockLock.leave();
    }

    async getHeadersRaw(start, len) {
        return await this.m_headerChain.getHeadersRaw(start, len);
    }

    async getHeaderByHeight(height) {
        return await this.m_headerChain.getHeaderByHeight(height);
    }

    getBlock(hash) {
        return this.m_blockStorage.get(hash);
    }

    getBlocksRaw(hashList) {
        let buf = new Buffer(0);
        for(let hash of hashList) {
            let block = this.getBlock(hash);
            if (block) {
                let raw = block.toRaw();
                buf = Buffer.concat([buf,raw],buf.length+raw.length);
            }
        }
        return buf;
    }

    hasBlock(hash) {
        return this.m_blockStorage.has(hash);
    }

    getBlockSize(hash) {
        return this.m_blockStorage.getSize(hash);
    }

    getNowHeight() {
        return this.m_headerChain.getNowHeight();
    }

    getStorageHeight() {
        return this.m_blockStorage.getHeight();
    }
}

module.exports = BlockChain;