const { createKeyPair } = require('./crypt/account')
const { encrypt, decrypt } = require('./crypt/crypt')
const { ValueTransaction } = require('./core/value_chain/transaction')
const BigNumber = require('bignumber.js')
const { addressFromSecretKey } = require('./core/address')
    //const core_1 = require("./core");
const { BufferWriter } = require('./core/lib/writer')
const assert = require('assert');
const rlp = require('rlp');
const {
    http,
    getBalanceUrl,
    getNonceUrl,
    host,
    port,
    transferUrl,
    getVotesUrl,
    getCandiesUrl,
    getVoteCandiesUrl,
    getMydataUrl,
    burnIntOnEthUrl,
    queryIntOnEthUrl,
    getTokenUrl,
    getPriceUrl,
    getLimitUrl
} = require('./cfg')

const Mapping = require("./mapping");
let getPrice = async() => {
    let result = await http.sendGet(getPriceUrl);
    return result;
}
let getLimit = async(method, input) => {
    let url = getLimitUrl + '/' + method + '/' + input
    let result = await http.sendGet(url);
    return result;
}

let makeWalletAccount = pwd => {
    assert(pwd, 'pwd must not empty');
    let [key, secret] = createKeyPair();
    let addr = addressFromSecretKey(secret);
    let address = addr;
    let privateKey = secret.toString('hex')
    let json = encrypt(privateKey, pwd)
    let privatekey2 = decrypt(json, pwd)
    console.log(privateKey, privatekey2)
    json.address = address;
    return { json, privateKey };
}

let addressFromPrivateKey = privateKey => addressFromSecretKey(new Buffer(privateKey, 'hex'));

let makeWalletByPrivate = (privateKey, pwd) => {
    let addr = addressFromSecretKey(new Buffer(privateKey, 'hex'));
    let address = addr;
    let json = encrypt(privateKey, pwd)
    json.address = address;
    return json;
}

let decodeFromOption = (option, pwd) => {
    assert(option, "option must be not null");
    assert(option, "password is required");
    return new Promise((resolve, reject) => {
        let privatekey = decrypt(option, pwd)
        resolve(privatekey)
    })
}




let getBalance = async address => {
    assert(address, 'address is required.');
    let url = getBalanceUrl + address;
    let result = await http.sendGet(url);
    return result;
}

let getVotes = async address => {
    assert(address, 'address is required.');
    let url = getVotesUrl + address;
    let result = await http.sendGet(url);
    return result;
}

let getNodes = async() => {
    let nodes = await http.sendGet(getCandiesUrl);
    if (typeof nodes == 'string') {
        nodes = JSON.parse(nodes)
    }
    let voteNodes = await http.sendGet(getVoteCandiesUrl);
    if (typeof voteNodes == 'string') {
        voteNodes = JSON.parse(voteNodes)
    }
    let data = [];
    for (let n of nodes) {
        let obj = {};
        let flag = true
        for (let vn of voteNodes) {
            if (vn[0] == n) {
                obj.node = vn[0]
                obj.num = vn[1]
                data = [obj, ...data]
                flag = false
            }
        }
        if (flag) {
            obj.node = n;
            obj.num = 0
            data.push(obj)
        }
    }
    return data;
}
let vote = async(candidates, limit, price, secret) => {
    assert(candidates, 'candidates is required.');
    assert(limit, 'fee is required.');
    assert(price, 'price is required.');
    assert(secret, 'secret is required.');
    let address = addressFromSecretKey(secret)
    let url = getNonceUrl + address;
    let result = await http.sendGet(url);
    let { err, nonce } = JSON.parse(result);
    if (err) {
        return { err: `mortgage getNonce failed for ${err}` };
    }
    let tx = new ValueTransaction()
    tx.method = 'vote';
    tx.limit = new BigNumber(limit);
    tx.price = new BigNumber(price * Math.pow(10, 18));
    tx.input = candidates;
    tx.nonce = nonce + 1;
    tx.sign(secret);

    let writer = new BufferWriter();
    let er = tx.encode(writer);
    if (er) {
        return { err: er };
    }
    let render = writer.render();

    let encodeRender = rlp.encode(render)
    let renderStr = encodeRender.toString('hex')
    return {
        info: {
            Method: tx.method,
            'Gas limit': tx.limit,
            'Gas price': price,
            Fee: tx.limit * price + ' INT',
            Input: JSON.stringify(tx.input),
            Nonce: tx.nonce
        },
        renderStr: renderStr,
        hash: tx.m_hash
    }
    //let mortgageResult = await http.sendPost({ renderStr: renderStr }, host, port, transferUrl)
    //return mortgageResult
}

let mortgage = async(amount, limit, price, secret) => {
    assert(amount, 'amount is required.');
    assert(limit, 'fee is required.');
    assert(price, 'price is required.');
    assert(secret, 'secret is required.');
    let address = addressFromSecretKey(secret)
    let url = getNonceUrl + address;
    let result = await http.sendGet(url);
    let { err, nonce } = JSON.parse(result);
    if (err) {
        return { err: `mortgage getNonce failed for ${err}` };
    }
    let tx = new ValueTransaction()
    tx.method = 'mortgage';
    tx.limit = new BigNumber(limit);
    tx.price = new BigNumber(price * Math.pow(10, 18));
    tx.value = new BigNumber(amount * Math.pow(10, 18));
    tx.input = amount;
    tx.nonce = nonce + 1;
    tx.sign(secret);

    let writer = new BufferWriter();
    let er = tx.encode(writer);
    if (er) {
        return { err: er };
    }
    let render = writer.render();

    let encodeRender = rlp.encode(render)
    let renderStr = encodeRender.toString('hex')
    return {
        info: {
            Method: tx.method,
            Amount: amount + ' INT',
            'Gas limit': tx.limit,
            'Gas price': price,
            Fee: tx.limit * price + ' INT',
            Input: JSON.stringify(tx.input),
            Nonce: tx.nonce
        },
        renderStr: renderStr,
        hash: tx.m_hash
    }
    //let mortgageResult = await http.sendPost({ renderStr: renderStr }, host, port, transferUrl)
    //return mortgageResult
}



let unmortgage = async(amount, limit, price, secret) => {
    assert(amount, 'amount is required.');
    assert(limit, 'fee is required.');
    assert(price, 'price is required.');
    assert(secret, 'secret is required.');
    let address = addressFromSecretKey(secret)
    let url = getNonceUrl + address;
    let result = await http.sendGet(url);
    let { err, nonce } = JSON.parse(result);
    if (err) {
        return { err: `unmortgage getNonce failed for ${err}` };
    }
    let tx = new ValueTransaction()
    tx.method = 'unmortgage';
    tx.limit = new BigNumber(limit);
    tx.price = new BigNumber(price * Math.pow(10, 18));
    tx.value = new BigNumber(amount * Math.pow(10, 18));
    tx.input = amount;
    tx.nonce = nonce + 1;
    tx.sign(secret);

    let writer = new BufferWriter();
    let er = tx.encode(writer);
    if (er) {
        return { err: er };
    }
    let render = writer.render();

    let encodeRender = rlp.encode(render)
    let renderStr = encodeRender.toString('hex')
    return {
        info: {
            Method: tx.method,
            Amount: amount + ' INT',
            'Gas limit': tx.limit,
            'Gas price': price,
            Fee: tx.limit * price + ' INT',
            Input: JSON.stringify(tx.input),
            Nonce: tx.nonce
        },
        renderStr: renderStr,
        hash: tx.m_hash
    }
    //let mortgageResult = await http.sendPost({ renderStr: renderStr }, host, port, transferUrl)
    //return mortgageResult
}

let transfer = async(amount, limit, price, to, secret) => {
    assert(amount, 'amount is required.');
    assert(limit, 'limit is required.');
    assert(price, 'price is required.');
    assert(to, 'to is required.');
    assert(secret, 'secret is required.');
    let address = addressFromSecretKey(secret)
    let url = getNonceUrl + address;
    let result = await http.sendGet(url);
    let { err, nonce } = JSON.parse(result);
    if (err) {
        return { err: `transferTo getNonce failed for ${err}` };
    }
    let tx = new ValueTransaction()
    tx.method = 'transferTo';
    tx.value = new BigNumber(amount * Math.pow(10, 18));
    tx.limit = new BigNumber(limit);
    tx.price = new BigNumber(price * Math.pow(10, 18));
    tx.input = { to };
    tx.nonce = nonce + 1;
    tx.sign(secret);

    let writer = new BufferWriter();
    let er = tx.encode(writer);
    if (er) {
        return { err: er };
    }
    let render = writer.render();

    let encodeRender = rlp.encode(render)
    let renderStr = encodeRender.toString('hex')
    return {
        info: {
            Method: tx.method,
            Amount: amount + ' INT',
            'Gas limit': tx.limit,
            'Gas price': price,
            Fee: tx.limit * price + ' INT',
            Input: JSON.stringify(tx.input),
            Nonce: tx.nonce
        },
        renderStr: renderStr,
        hash: tx.m_hash
    }
}

let burnIntOnEth = async(options) => {
    let url = getMydataUrl + options.decimalAmount + "/" + options.fromAddress
    let result = await http.sendGet(url);
    let parseResult = JSON.parse(result);
    options.mydata = parseResult.mydata
    options.mynonce = parseResult.mynonce;
    options.transferData = parseResult.transferData;
    options.TOADDRESS = parseResult.TOADDRESS;
    let data = await Mapping.getSerializedTx(options);
    return data;
    // if (data) {
    //     if (data.status === "success") {
    //         let result = await http.sendPost(data.data, host, port, burnIntOnEthUrl);
    //         return JSON.parse(result);
    //     } else {
    //         return data;
    //     }
    // }
}

let sendBurn = async data => {
    let result = await http.sendPost(data, host, port, burnIntOnEthUrl);
    return JSON.parse(result);
}
let queryBalance = async(address) => {
    let url = queryIntOnEthUrl + address;
    let result = await http.sendGet(url);
    return JSON.parse(result);
}
let sendSignedTransaction = async renderStr => {
    let result = await http.sendPost({ renderStr: renderStr }, host, port, transferUrl)
    return result
}

let getToken = async address => {
    let url = `${getTokenUrl}address=${address}&pageSize=10000&source=wallet`
    let result = await http.sendGet(url);
    return JSON.parse(result);
}
module.exports = {
    getBalance,
    transfer,
    makeWalletAccount,
    decodeFromOption,
    getVotes,
    mortgage,
    unmortgage,
    vote,
    getNodes,
    burnIntOnEth,
    queryBalance,
    sendSignedTransaction,
    getToken,
    addressFromPrivateKey,
    makeWalletByPrivate,
    sendBurn,
    BigNumber,
    getPrice,
    getLimit
}

//transfer(2, 3, '1F9hNoR4xhPeqEcvjQ1qt7hLrdZhAQepcm', 'a86f164acf7eaff87c12c0dae926506a9ba31cd2f68f0d55f96a1b891b961d02')
//mortgage(100, 2, 'a86f164acf7eaff87c12c0dae926506a9ba31cd2f68f0d55f96a1b891b961d02')
//getVotes('1CHpy1NayZHXxLe21LuzpTMLSs32Xk9D1K')