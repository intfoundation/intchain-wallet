/**
 * 钱包账户类：包含其中的加密解密等操作，加密流程由系统生成公钥和秘钥，然后使用秘钥对称算法加密了用户密码
 * 优点：1，随机生成的公钥和秘钥对，其它用户无法获取；
 *      2，使用秘钥再次对用户的密码进行加密，双重保证。
 * 
 * 时间：2018-5-21
 * 作者：黄龙浩
 */

'use strict'
const { createKeyPair, addressFromSecretKey } = require('./account')
const { encrypt, decrypt } = require('./crypt')

const util = require("./util");
const assert = require("assert");
const Mapping = require("./mapping");
/**
 * http和https模块
 */
const HttpsUtil = require("../httputils").HttpsUtil;
const httpsUtil = new HttpsUtil();
const HttpUtil = require("../httputils").HttpUtil;
const httpUtil = new HttpUtil();


const GETACCOUNT_URL = 'https://explorer.intchain.io/api/balance/';
//const GETCOINSBYADDRESS_URL = 'https://explorer.intchain.io/api/query/coins/';
const GETCOINSBYADDRESS_URL = 'http://localhost:3001/query/coins/';
//const TRANSATION_URL = 'https://explorer.intchain.io/api/transation/';
const TRANSATION_URL = 'http://localhost:3001/transation/';
const GETTXBYADDRESS_URL = 'https://explorer.intchain.io/api/query/4/';


//const QUERYINTONETH_URL = "http://localhost:3001/mapping/queryEthIntBalance/";
//const GETMYDATA_URL = "http://localhost:3001/mapping/getMydata/";
const QUERYINTONETH_URL = "https://explorer.intchain.io/api/mapping/queryEthIntBalance/";
const GETMYDATA_URL = "https://explorer.intchain.io/api/mapping/getMydata/";
const BURNINTONETH_URL = "/api/mapping/sendSignedTransaction";
//const HOST = "localhost";
const HOST = "explorer.intchain.io";
const PORT = "";


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
    // makeWalletAccount(pwd) {
    //     assert(pwd, 'pwd must not empty');
    //     let account = KeyRing.generate();
    //     let privatekey = account.getPrivateKey();
    //     let encode = aesUtil.encryption(pwd, privatekey, account.address);
    //     this.address = account.getAddress().toString();
    //     this.crypto.ciphertext = encode;
    //     this.crypto.wif = account.toSecret();
    //     return this.toJson();
    // }

    makeWalletAccount(pwd) {
        assert(pwd, 'pwd must not empty');
        let [key, secret] = createKeyPair();
        let addr = addressFromSecretKey(secret);
        let address = addr;
        let privateKey = secret.toString('hex')
        let json = encrypt(privateKey, pwd)
        json.address = address;
        return json;
    }





    /**
     * 通过option对象解密文件
     * 
     * @param {option 对象} option 
     */
    decodeFromOption(option, pwd) {
        //TODO：需要改进，验证地址等等
        assert(option, "option must be not null");
        try {
            let privatekey = decrypt(option, pwd)
            return privatekey;
        } catch (e) {
            return "";
        }
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

    async burnIntOnEth(options) {
        let url = GETMYDATA_URL + options.decimalAmount + "/" + options.fromAddress
        let result = await httpsUtil.sendGet(url);
        let parseResult = JSON.parse(result);
        options.mydata = parseResult.mydata
        options.mynonce = parseResult.mynonce;
        options.transferData = parseResult.transferData;
        options.TOADDRESS = parseResult.TOADDRESS;
        let data = await Mapping.getSerializedTx(options);
        if (data) {
            if (data.status === "success") {
                let result = await httpsUtil.sendPost(data.data, HOST, PORT, BURNINTONETH_URL);
                return JSON.parse(result);
            } else {
                return data;
            }
        }
    }
    async queryBalance(address) {
        let url = QUERYINTONETH_URL + address;
        let result = await httpsUtil.sendGet(url);
        return JSON.parse(result);
    }
}
module.exports = WalletAccount;
//browserify --require  ./walletAccount.js:int ./walletAccount.js > int.js