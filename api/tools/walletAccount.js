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
const MTX = require('../chainlib/Transcation/mtx');
const Address = require('../chainlib/Account/address');
const Coin = require("../chainlib/Coins/coin");
/**
 * http和https模块
 */
const HttpsUtil = require("../httputils").HttpsUtil;
const httpsutil = new HttpsUtil();
const HttpUtil = require("../httputils").HttpUtil;
const httpUtil = new HttpUtil();


const GETACCOUNT_URL = 'https://explorer.intchain.io/api/balance/';
const GETCOINSBYADDRESS_URL = 'https://explorer.intchain.io/api/query/coins/';
const TRANSATION_URL = 'https://explorer.intchain.io/api/transation/';
const GETTXBYADDRESS_URL = 'https://explorer.intchain.io/api/query/4/';

class WalletAccount {
    constructor() {
        this.id = util.uuidv4();
        this.version = 1.0;
        this.address = "";
        this.crypto = {
            dphertext: '',
            ciphertext: '',
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
        //TODO：需要改进，验证地址等等
        assert(option, "option must be not null");
        let account = KeyRing.fromSecret(option.crypto.wif);
        let address = account.getAddress();
        let decode = aesUtil.decryption(option.crypto.ciphertext, account.getPrivateKey(), account.address);
        this.version = 1.0;
        this.address = account.getAddress().toString();
        this.crypto = {
            dphertext: decode,
            ciphertext: option.crypto.ciphertext,
            wif: option.crypto.wif
        };
        let json = this.toJson();
        json.crypto.dphertext = this.crypto.dphertext;
        return json;
    }


    toJson() {
        var json = {
            id: this.id,
            version: this.version,
            address: this.address,
            crypto: {
                ciphertext: this.crypto.ciphertext,
                wif: this.crypto.wif
            }
        };
        return json;
    }



    /**
     * 
     * @param {地址} address 
     * @param {页} page 
     */
    async getTxByAddress(address, page) {
        var url = GETTXBYADDRESS_URL + address + "/" + page.size + "/" + page.num;
        let data = await httpUtil.sendGet(url, true);
        return data;
    }

    /**
     * 
     * @param {账户地址公钥} address 
     */
    async getaccount(address) {
        // var url = "https://explorer.intchain.io/api/balance/" + address;
        // let data = await httpsutil.sendGet(url);
        var url = GETACCOUNT_URL + address;
        let data = await httpUtil.sendGet(url, true);
        return data;
    }

    /**
     * 
     * @param {*} senderWIF 
     * @param {*} outputsArray 
     */
    async spendByAddress(senderWIF, outputsArray) {
        let account = KeyRing.fromSecret(senderWIF);
        let address = account.getAddress();
        let mtx = new MTX();
        let needTotal = 0;
        let unit = Math.pow(10, 6);
        for (let output of outputsArray) {
            output.amount = parseFloat(output.amount) * unit;
            mtx.addOutput(Address.fromString(output.address), output.amount);
            needTotal += output.amount;
        }
        var url = GETCOINSBYADDRESS_URL + address;
        let result = await httpUtil.sendGet(url, true);
        let data = JSON.parse(result);
        let coins = [];
        for (let item of data) {
            let txRaw = Buffer.from(item.rawtx, 'hex');
            let coin = new Coin();
            coin.fromRaw(txRaw);
            coin.hash = item.hash;
            coins.push(coin);
            coin.index = item.index;
        }
        //检查一下总value是否足够
        let total = 0;
        for (let coin of coins) {
            total += coin.value;
        }
        if (total < needTotal) {
            return;
        }
        await mtx.fund(coins, { rate: 0, changeAddress: address });
        mtx.sign(account);
        let tx = mtx.toTX();
        let txRaw = tx.toRaw();
        let xxRaw = txRaw.toString('hex');
        var rurl = TRANSATION_URL + address + "/" + xxRaw;
        await httpUtil.sendGet(rurl, true);
    }
}

module.exports = WalletAccount;