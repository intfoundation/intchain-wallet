/**
 * 钱包账户类：包含其中的加密解密等操作，加密流程由系统生成公钥和秘钥，然后使用秘钥对称算法加密了用户密码
 * 优点：1，随机生成的公钥和秘钥对，其它用户无法获取；
 *      2，使用秘钥再次对用户的密码进行加密，双重保证。
 * 
 * 时间：2018-5-21
 * 作者：黄龙浩
 */

'use strict'

const KeyRing = require('../chainlib/Account/keyring');
const aesUtil = require("../chainlib/Crypto/aesutil");
const util = require("./util");
const assert = require("assert");

class WalletAccount {

    constructor() {
        this.id = util.uuidv4();
        this.version = 1.0;
        this.address = "";
        this.crypto = {
            dphertext: '',
            ciphertext: '',
            cipher: 'aes-256-ctr',
            wif: ''
        };
    }

    /**
     * 通过用户密码生成钱包地址信息
     * 
     * @param {密码} pwd 
     */
    makeWalletAccount(pwd) {
        assert(pwd, 'pwd must not empty');
        let account = KeyRing.generate();
        let privatekey = account.getPrivateKey();
        //console.log(privatekey);
        let encode = aesUtil.encryption(pwd, privatekey, account.address);
        this.address = account.getAddress().toString();
        this.crypto.ciphertext = encode;
        this.crypto.wif = account.toSecret();
        return this.toJson();
    }

    /**
     * 通过用户密码生成用户密码和私钥解密钱包
     * 
     * @param {密码} pwd 
     * @param {私钥} wif 
     */
    decodeFromPwdAndWif(pwd, wif) {
        assert(pwd, "pwd must be not empty");
        assert(wif, "wif must be not empty")
        let account = KeyRing.fromSecret(wif); //"Kx1vvQLVhSpRprKLBY9TU5CygfbCCT4aPZPvCW6AKrtUuqqibweU");
        let address = account.getAddress();
        let decode = aesUtil.decryption(pwd, account.getPrivateKey(), account.address);
        this.version = 1.0;
        this.address = account.getAddress().toString();
        this.crypto = {
            dphertext: decode,
            ciphertext: pwd,
            cipher: 'aes-256-ctr',
            wif: wif
        };
        return this.toJson();
    }



    /**
     * 通过option对象解密文件
     * 
     * @param {option 对象} option 
     */
    decodeFromOption(option) {
        assert(option, "option must be not null");
        let account = KeyRing.fromSecret(option.crypto.wif);
        let address = account.getAddress();
        let decode = aesUtil.decryption(option.crypto.ciphertext, account.getPrivateKey(), account.address);
        this.version = 1.0;
        this.address = account.getAddress().toString();
        this.crypto = {
            dphertext: decode,
            ciphertext: option.crypto.ciphertext,
            cipher: 'aes-256-ctr',
            wif: option.crypto.wif
        };
        return this.toJson();
    }


    toJson() {
        var json = {
            id: this.id,
            version: this.version,
            address: this.address,
            crypto: {
                dphertext: this.crypto.dphertext,
                ciphertext: this.crypto.ciphertext,
                cipher: 'aes-256-ctr',
                wif: this.crypto.wif
            }
        };
        return json;
    }
}

module.exports = WalletAccount;
// let account = KeyRing.generate();
// console.log(account.getAddress().toString());
// var encode = aesUtil.encryption("123456aaaaa", account.getPrivateKey(), account.address);

// var decode = aesUtil.decryption(encode, account.getPrivateKey(), account.address);
// console.log(encode, decode, account.toSecret());

// var walletAccount = new WalletAccount();
// var waccount = walletAccount.makeWalletAccount("123333333333333333");
// console.log(waccount);

// console.log(walletAccount.decodeFromOption(waccount));
// let account = KeyRing.fromSecret(waccount.crypto.wif); //"Kx1vvQLVhSpRprKLBY9TU5CygfbCCT4aPZPvCW6AKrtUuqqibweU");
// let address = account.getAddress();
// var decode = aesUtil.decryption(waccount.crypto.ciphertext, account.getPrivateKey(), account.address);
// console.log(decode);