/*!
 * base58.js - base58 for bcoin
 * Copyright (c) 2014-2015, Fedor Indutny (MIT License)
 * Copyright (c) 2014-2017, Christopher Jeffrey (MIT License).
 * https://github.com/bcoin-org/bcoin
 */
'use strict';

Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @module utils/base58
 */
var assert = require('assert');
/*
 * Base58
 */
var base58 = '' + '123456789' + 'ABCDEFGHJKLMNPQRSTUVWXYZ' + 'abcdefghijkmnopqrstuvwxyz';
var unbase58 = {};
for (var i = 0; i < base58.length; i++) {
    unbase58[base58[i]] = i;
} /**
   * Encode a base58 string.
   * @see https://github.com/bitcoin/bitcoin/blob/master/src/base58.cpp
   * @param {Buffer} data
   * @returns {Base58String}
   */
function encode(data) {
    var zeroes = 0;
    var i = 0;
    for (; i < data.length; i++) {
        if (data[i] !== 0) break;
        zeroes++;
    }
    var b58 = Buffer.allocUnsafe((data.length * 138 / 100 | 0) + 1);
    b58.fill(0);
    var length = 0;
    for (; i < data.length; i++) {
        var carry = data[i];
        var j = 0;
        for (var k = b58.length - 1; k >= 0; k--, j++) {
            if (carry === 0 && j >= length) break;
            carry += 256 * b58[k];
            b58[k] = carry % 58;
            carry = carry / 58 | 0;
        }
        assert(carry === 0);
        length = j;
    }
    i = b58.length - length;
    while (i < b58.length && b58[i] === 0) {
        i++;
    }var str = '';
    for (var _j = 0; _j < zeroes; _j++) {
        str += '1';
    }for (; i < b58.length; i++) {
        str += base58[b58[i]];
    }return str;
}
exports.encode = encode;
;
/**
 * Decode a base58 string.
 * @see https://github.com/bitcoin/bitcoin/blob/master/src/base58.cpp
 * @param {Base58String} str
 * @returns {Buffer}
 * @throws on non-base58 character.
 */
function decode(str) {
    var zeroes = 0;
    var i = 0;
    for (; i < str.length; i++) {
        if (str[i] !== '1') break;
        zeroes++;
    }
    var b256 = Buffer.allocUnsafe((str.length * 733 / 1000 | 0) + 1);
    b256.fill(0);
    var length = 0;
    for (; i < str.length; i++) {
        var ch = unbase58[str[i]];
        if (ch == null) throw new Error('Non-base58 character.');
        var carry = ch;
        var _j2 = 0;
        for (var k = b256.length - 1; k >= 0; k--, _j2++) {
            if (carry === 0 && _j2 >= length) break;
            carry += 58 * b256[k];
            b256[k] = carry % 256;
            carry = carry / 256 | 0;
        }
        assert(carry === 0);
        length = _j2;
    }
    i = 0;
    while (i < b256.length && b256[i] === 0) {
        i++;
    }var out = Buffer.allocUnsafe(zeroes + (b256.length - i));
    var j = void 0;
    for (j = 0; j < zeroes; j++) {
        out[j] = 0;
    }while (i < b256.length) {
        out[j++] = b256[i++];
    }return out;
}
exports.decode = decode;
;