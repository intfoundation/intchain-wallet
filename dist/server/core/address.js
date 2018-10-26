"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var secp256k1 = require('secp256k1');

var _require = require('crypto'),
    randomBytes = _require.randomBytes;

var digest = require("./lib/digest");
var staticwriter_1 = require("./lib/staticwriter");
var base58 = require("./lib/base58");
var util_1 = require("util");
// prefix can identify different network
// will be readed from consensus params
var prefix = 0x00;
function pubKeyToBCFormat(publickey, netPrefix) {
    var keyHash = digest.hash160(publickey);
    var size = 5 + keyHash.length;
    var bw = new staticwriter_1.StaticWriter(size);
    bw.writeU8(netPrefix);
    bw.writeBytes(keyHash);
    bw.writeChecksum();
    return bw.render();
}
function signBufferMsg(msg, key) {
    // Sign message
    var sig = secp256k1.sign(msg, key);
    // Ensure low S value
    return secp256k1.signatureNormalize(sig.signature);
}
exports.signBufferMsg = signBufferMsg;
function verifyBufferMsg(msg, sig, key) {
    if (sig.length === 0) {
        return false;
    }
    if (key.length === 0) {
        return false;
    }
    try {
        sig = secp256k1.signatureNormalize(sig);
        return secp256k1.verify(msg, sig, key);
    } catch (e) {
        return false;
    }
}
exports.verifyBufferMsg = verifyBufferMsg;
function addressFromPublicKey(publicKey) {
    if (util_1.isString(publicKey)) {
        publicKey = Buffer.from(publicKey, 'hex');
    }
    return base58.encode(pubKeyToBCFormat(publicKey, prefix));
}
exports.addressFromPublicKey = addressFromPublicKey;
function publicKeyFromSecretKey(secret) {
    if (util_1.isString(secret)) {
        secret = Buffer.from(secret, 'hex');
    }
    if (!secp256k1.privateKeyVerify(secret)) {
        return;
    }
    var key = secp256k1.publicKeyCreate(secret, true);
    return key;
}
exports.publicKeyFromSecretKey = publicKeyFromSecretKey;
function addressFromSecretKey(secret) {
    var publicKey = publicKeyFromSecretKey(secret);
    if (publicKey) {
        return addressFromPublicKey(publicKey);
    }
}
exports.addressFromSecretKey = addressFromSecretKey;
function createKeyPair() {
    var privateKey = void 0;
    do {
        privateKey = randomBytes(32);
    } while (!secp256k1.privateKeyVerify(privateKey));
    var key = secp256k1.publicKeyCreate(privateKey, true);
    return [key, privateKey];
}
exports.createKeyPair = createKeyPair;
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
function verify(md, signature, publicKey) {
    if (util_1.isString(md)) {
        md = Buffer.from(md, 'hex');
    }
    return verifyBufferMsg(md, signature, publicKey);
}
exports.verify = verify;
function isValidAddress(address) {
    var buf = base58.decode(address);
    return buf.length === 25;
}
exports.isValidAddress = isValidAddress;