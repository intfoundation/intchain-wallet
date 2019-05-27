const { createKeyPair } = require('./crypt/account')
const { encrypt, decrypt } = require('./crypt/crypt')
const { ValueTransaction } = require('./core/value_chain/transaction')
const BigNumber = require('bignumber.js')
const { addressFromSecretKey, addressFromPublicKey, isValidAddress } = require('./core/address')
    //const core_1 = require("./core");
const { BufferWriter } = require('./core/lib/writer')
const { encodeAddressAndNonce } = require('./core/serializable')
const assert = require('assert');
const rlp = require('rlp');
const web3 = require("web3")
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
    getLimitUrl,
    getVoteRecordUrl,
    getTokenBalanceUrl,
    getTestCoinUrl,
    rewardHistoryUrl,
    getProposalRfdUrl,
    getRfd2Url
} = require('./cfg')

const Mapping = require("./mapping");
let getPrice = async() => {
    let result = await http.sendGet(getPriceUrl);
    return result;
}

let getTestCoin = async address => {
    let url = getTestCoinUrl + '/' + address
    let result = await http.sendGet(url);
    return result;
}

let getTokenBalance = async(tokenid, address) => {
    let url = getTokenBalanceUrl + tokenid + '/' + address
    let result = await http.sendGet(url);
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
        //let privatekey2 = decrypt(json, pwd)
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

let rewardHistory = async address => {
    assert(address, 'address is required.');
    let url = rewardHistoryUrl + address;
    let result = await http.sendGet(url);
    return result;
}

let voteRecord = async address => {
    assert(address, 'address is required.');
    let url = getVoteRecordUrl + address;
    let result = await http.sendGet(url);
    if (typeof result == 'string') {
        result = JSON.parse(result)
    }
    let teamList = await http.sendGet('https://explorer.intchain.io/api/node/nodeTeamList')
    if (typeof teamList == 'string') {
        teamList = JSON.parse(teamList)
    }
    let candidates = [];
    for (let c of result.candidates) {
        let obj = { node: c }
        for (let t of teamList.data) {
            if (c == t.node) {
                obj.teamName = t.teamName;
                obj.webUrl = t.webUrl
            }
        }
        candidates.push(obj)
    }
    result.candidates = candidates;
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
    let teamList = await http.sendGet('https://explorer.intchain.io/api/node/nodeTeamList')
    if (typeof teamList == 'string') {
        teamList = JSON.parse(teamList)
    }
    let data = [];
    for (let n of nodes) {
        let obj = {};
        let flag = true
        for (let vn of voteNodes) {
            if (vn.address == n) {
                obj.node = vn.address
                obj.num = vn.vote
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
    for (let t of teamList.data) {
        for (let d of data) {
            if (t.node == d.node) {
                d.teamName = t.teamName
                d.webUrl = t.webUrl
            }
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
    tx.price = new BigNumber(price).multipliedBy(Math.pow(10, 18));
    tx.input = { candidates: candidates };
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
            Fee: new BigNumber(tx.limit).multipliedBy(price).toString() + ' INT',
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
    tx.price = new BigNumber(price).multipliedBy(Math.pow(10, 18));
    tx.value = new BigNumber(amount).multipliedBy(Math.pow(10, 18));
    tx.input = { amount: new BigNumber(amount).multipliedBy(Math.pow(10, 18)).toString() };
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
            Fee: new BigNumber(tx.limit).multipliedBy(price).toString() + ' INT',
            Input: JSON.stringify(tx.input),
            Nonce: tx.nonce
        },
        renderStr: renderStr,
        hash: tx.m_hash
    }
    //let mortgageResult = await http.sendPost({ renderStr: renderStr }, host, port, transferUrl)
    //return mortgageResult
}
let createToken = async(amount, limit, price, name, symbol, secret) => {
    assert(amount, 'amount is required');
    assert(limit, 'limit is required');
    assert(price, 'price is required');
    assert(secret, 'secret is required');
    assert(name, 'name is required');
    assert(symbol, 'symbol is required');
    let address = addressFromSecretKey(secret)
    let url = getNonceUrl + address;
    let result = await http.sendGet(url);
    let { err, nonce } = JSON.parse(result);
    if (err) {
        return { err: `unmortgage getNonce failed for ${err}` };
    }
    let contract = addressFromPublicKey(encodeAddressAndNonce(address, nonce + 1));
    let tx = new ValueTransaction();
    let newAmount = new BigNumber(amount).multipliedBy(Math.pow(10, 18)).toString();

    tx.method = 'createToken';
    tx.value = new BigNumber('0');
    tx.limit = new BigNumber(limit);
    tx.price = new BigNumber(price).multipliedBy(Math.pow(10, 18));
    tx.input = { tokenid: contract, amount: newAmount, name, symbol };
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
            value: 0,
            'Gas limit': limit,
            'Gas price': price,
            Fee: new BigNumber(tx.limit).multipliedBy(price).toString() + ' INT',
            Input: JSON.stringify(tx.input),
            Nonce: tx.nonce
        },
        renderStr: renderStr,
        hash: tx.m_hash
    }
}


let transferTokenTo = async(tokenid, to, amount, limit, price, secret) => {
    assert(tokenid, 'tokenid is required.');
    assert(to, 'to is required.');
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
    let newAmount = new BigNumber(amount).multipliedBy(Math.pow(10, 18)).toString();
    tx.method = 'transferTokenTo';
    tx.value = new BigNumber('0');
    tx.limit = new BigNumber(limit);
    tx.price = new BigNumber(price).multipliedBy(Math.pow(10, 18));
    tx.input = { tokenid, to, amount: newAmount };
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
            value: 0,
            'Gas limit': limit,
            'Gas price': price,
            Fee: new BigNumber(tx.limit).multipliedBy(price).toString() + ' INT',
            Input: JSON.stringify(tx.input),
            Nonce: tx.nonce
        },
        renderStr: renderStr,
        hash: tx.m_hash
    }
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
    tx.price = new BigNumber(price).multipliedBy(Math.pow(10, 18));
    tx.value = new BigNumber(0);
    tx.input = { amount: new BigNumber(amount).multipliedBy(Math.pow(10, 18)).toString() };
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
            Fee: new BigNumber(tx.limit).multipliedBy(price).toString() + ' INT',
            Input: JSON.stringify(tx.input),
            Nonce: tx.nonce
        },
        renderStr: renderStr,
        hash: tx.m_hash
    }
    //let mortgageResult = await http.sendPost({ renderStr: renderStr }, host, port, transferUrl)
    //return mortgageResult
}

let rfdVote = async(price, secret, rfdId, optId) => {
    assert(price, 'price is required.');
    assert(secret, 'secret is required.');
    assert(rfdId, 'rfdId is required.');
    assert(optId, 'optId is required.');
    let address = addressFromSecretKey(secret)
    let url = getNonceUrl + address;
    let result = await http.sendGet(url);
    let { err, nonce } = JSON.parse(result);
    if (err) {
        return { err: `transferTo getNonce failed for ${err}` };
    }
    let limitUrl = getLimitUrl + '/' + 'transferTo' + '/' + JSON.stringify({ to: address, data: { type: 'referendum_vote', rfdId: rfdId, optId: optId } })
    let resLimit = await http.sendGet(limitUrl);
    if (typeof resLimit == 'string') {
        resLimit = JSON.parse(resLimit);
    }
    let limit = resLimit.limit;
    let tx = new ValueTransaction()
    tx.method = 'transferTo';
    tx.value = new BigNumber(0).multipliedBy(Math.pow(10, 18));
    tx.limit = new BigNumber(limit);
    tx.price = new BigNumber(price).multipliedBy(Math.pow(10, 18));
    tx.input = { to: address, data: { type: 'referendum_vote', rfdId: rfdId, optId: optId } };
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
            Amount: '0 INT',
            'Gas limit': tx.limit,
            'Gas price': price,
            Fee: new BigNumber(tx.limit).multipliedBy(price).toString() + ' INT',
            Input: JSON.stringify(tx.input),
            Nonce: tx.nonce
        },
        renderStr: renderStr,
        hash: tx.m_hash
    }
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
    tx.value = new BigNumber(amount).multipliedBy(Math.pow(10, 18));
    tx.limit = new BigNumber(limit);
    tx.price = new BigNumber(price).multipliedBy(Math.pow(10, 18));
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
            Fee: new BigNumber(tx.limit).multipliedBy(price).toString() + ' INT',
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

let ethPrivateKeyToAccount = privateKey => {
    let account = new web3().eth.accounts.privateKeyToAccount("0x" + privateKey)
    return account.address
}

let queryProposalRfd = async() => {
    let result = await http.sendGet(getProposalRfdUrl);
    return JSON.parse(result);
}
let getRfd2 = async() => {
    let result = await http.sendGet(getRfd2Url);
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
    getLimit,
    ethPrivateKeyToAccount,
    voteRecord,
    getTokenBalance,
    transferTokenTo,
    getTestCoin,
    createToken,
    isValidAddress,
    rewardHistory,
    rfdVote,
    queryProposalRfd,
    getRfd2
}