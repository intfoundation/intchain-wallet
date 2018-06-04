"use strict";
const EventEmitter = require('events');

class NewBlockDriver extends EventEmitter {
    constructor(number, id, txStorage, devmode = false) {
        super();
        this.nodeTurns = [];//记录参与出块的节点的id列表
        this.currNode = -1; //当前出块的id
        this.prevNode = -2;
        this.m_id = id;//自己的id
        this.receivedIDs = []; //新加入的节点“下一轮”出块，它来负责触发更新nodeTurns
        this.bInTurns = false;
        this.intervalTime = 5 * 1000;//出块时间间隔
        this.moniterTimerID = 0;
        this.newBlockTimer = 0;
        this.number = number;//分配的顺序number
        this.txStorage = txStorage;
        this.devmode = devmode?devmode:0;

        this.txStorage.on('OnNewTx', (storageObj) => {
            console.log(`devmode:${this.devmode},currNode:${this.currNode},this.nodeTurns=${JSON.stringify(this.nodeTurns)},prevNode=${this.prevNode}`);
            if (this.devmode) {
                if (this.currNode === this.m_id && (this.nodeTurns.length === 1 || (this.nodeTurns.length > 1 && this.prevNode !== this.m_id))) {
                    this._beginNewBlock(true);
                }
                else {
                    if (this.moniterTimerID === 0 && this.bInTurns) {
                        this._beginMoniter();
                    }
                }
            }
            else {
                if (this.currNode === this.m_id && (this.nodeTurns.length === 1 || (this.nodeTurns.length > 1 && this.prevNode !== this.m_id))) {
                    if (this.newBlockTimer === 0) {
                        this._beginNewBlock();
                    }
                }
                else {
                    if (this.moniterTimerID === 0 && this.bInTurns) {
                        this._beginMoniter();
                    }
                }
            }
        });

        this.txStorage.on('OnEmpty', (storageObj) => {
            this._endMoniter();
            this._endNewBlockTimer();
        });
    }

    getCurrNodeID() {
        return this.m_currNode;
    }

    //
    updateTurns(turns) {
        if (this._compareList(turns, this.nodeTurns)) {
            return;
        }
        this.receivedIDs = [];
        this.nodeTurns = turns;
        if (!this.bInTurns) {
            for (let i = 0; i < this.nodeTurns.length; i++) {
                if (this.nodeTurns[i] === this.m_id) {
                    this._endMoniter();
                    this.bInTurns = true;
                    break;
                }
            }
        }
    }

    next(prevId) {
        if (!this.bInTurns) {
            return;
        }

        this.prevNode = this.currNode;
        let currIndex = this._getIndex(prevId);
        currIndex++;
        if (currIndex === this.nodeTurns.length) {
            currIndex = 0;
        }
        this.currNode = this.nodeTurns[currIndex];

        if (currIndex === 0) {
            //更新出块序列，把新加上来的节点进入出块列表
            this.emit("OnUpdateTurns", this);
        }
        if (this.prevNode === this.currNode) {
            this.prevNode = -1;
        }
        if (this.currNode === this.m_id) {
            //轮到自己出块了
            this._beginNewBlock();
        }
        else {
            //重新开启监听器
            this._beginMoniter();
        }
    }

    _endNewBlockTimer() {
        if (this.newBlockTimer !== 0) {
            clearInterval(this.newBlockTimer);
            this.newBlockTimer = 0;
        }
    }

    _beginNewBlock(bNow = false) {
        this._endMoniter();
        this._endNewBlockTimer();
        if (this.txStorage.getCount() === 0) {
            return;
        }
        if (bNow) {
            this.emit("OnNewBlock", this, this.nodeTurns);
        }
        else {
            this.newBlockTimer = setInterval(() => {
                if (this.newBlockTimer !== 0) {
                    this._endNewBlockTimer();
                }
                this.emit("OnNewBlock", this, this.nodeTurns);
            }, this.intervalTime);
        }
    }

    _endMoniter() {
        if (this.moniterTimerID !== 0) {
            clearInterval(this.moniterTimerID);
            this.moniterTimerID = 0;
        }
    }
    _beginMoniter() {
        this._endMoniter()
        if (this.txStorage.getCount() === 0) {
            return;
        }
        this.moniterTimerID = setInterval(() => {
            console.log("newBlockDriver.js _beginMoniter trigger");
            if (this.moniterTimerID !== 0) {
                this._endMoniter();
            }
            this.next(this.currNode);
        }, this.intervalTime * 3 / 2);
    }

    _compareList(list1, list2) {
        if (list1.length !== list2.length) {
            return false;
        }

        for (let i = 0; i < list1.length; i++) {
            if (list1[i] != list2[i]) {
                return false;
            }
        }

        return true;
    }

    _getIndex(nodeID) {
        for (let i = 0; i < this.nodeTurns.length; i++) {
            if (nodeID === this.nodeTurns[i]) {
                return i;
            }
        }
        return -1;
    }
}

module.exports = NewBlockDriver;