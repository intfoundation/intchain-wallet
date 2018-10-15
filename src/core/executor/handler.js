"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class BaseHandler {
    constructor() {
        this.m_txListeners = new Map();
        this.m_viewListeners = new Map();
        this.m_preBlockListeners = [];
        this.m_postBlockListeners = [];
    }
    addTX(name, listener) {
        if (name.length > 0 && listener) {
            this.m_txListeners.set(name, listener);
        }
    }
    getListener(name) {
        return this.m_txListeners.get(name);
    }
    addViewMethod(name, listener) {
        if (name.length > 0 && listener) {
            this.m_viewListeners.set(name, listener);
        }
    }
    getViewMethod(name) {
        return this.m_viewListeners.get(name);
    }
    addPreBlockListener(filter, listener) {
        this.m_preBlockListeners.push({ filter, listener });
    }
    addPostBlockListener(filter, listener) {
        this.m_postBlockListeners.push({ filter, listener });
    }
    getPreBlockListeners(h) {
        let listeners = [];
        for (let l of this.m_preBlockListeners) {
            if (l.filter(h)) {
                listeners.push(l.listener);
            }
        }
        return listeners;
    }
    getPostBlockListeners(h) {
        let listeners = [];
        for (let l of this.m_postBlockListeners) {
            if (l.filter(h)) {
                listeners.push(l.listener);
            }
        }
        return listeners;
    }
}
exports.BaseHandler = BaseHandler;
