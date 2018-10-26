"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const secp256k1 = require('secp256k1');
const { randomBytes } = require('crypto');
const digest = require("./lib/digest");
const staticwriter_1 = require("./lib/staticwriter");
const base58 = require("./lib/base58");
const util_1 = require("util");
// prefix can identify different network
// will be readed from consensus params
const prefix = 0x00;




function publicKeyFromSecretKey(secret) {
    if (typeof secret === 'string') {
        secret = Buffer.from(secret, 'hex');
    }
    if (!secp256k1.privateKeyVerify(secret)) {
        return;
    }
    const key = secp256k1.publicKeyCreate(secret, true);
    return key;
}
exports.publicKeyFromSecretKey = publicKeyFromSecretKey;





function sign(md, secret) {
    if (util_1.isString(secret)) {
        secret = Buffer.from(secret, 'hex');
    }
    if (util_1.isString(md)) {
        md = Buffer.from(md, 'hex');
    }
    return signBufferMsg(md, secret);
}
exports.sign = sign;