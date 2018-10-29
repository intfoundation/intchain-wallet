let pro = require('./env')
const HttpsUtil = require("./httputils").HttpsUtil;
const httpsUtil = new HttpsUtil();
const HttpUtil = require("./httputils").HttpUtil;
const httpUtil = new HttpUtil();
let development = {
    getBalanceUrl: 'http://localhost:3001/wallet/getBalance/',
    getNonceUrl: 'http://localhost:3001/wallet/getNonce/',
    getVotesUrl: 'http://localhost:3001/wallet/getVotes/',
    getCandiesUrl: 'http://localhost:3001/wallet/candies',
    getTokenUrl: 'http://localhost:3001/wallet/walletList?',
    getVoteCandiesUrl: 'http://localhost:3001/wallet/voteCandies',
    getMydataUrl: "http://localhost:3001/mapping/getMydata/",
    burnIntOnEthUrl: "/mapping/sendSignedTransaction",
    queryIntOnEthUrl: "http://localhost:3001/mapping/queryEthIntBalance/",
    getPriceUrl: "http://localhost:3001/wallet/getPrice",
    getLimitUrl: "http://localhost:3001/wallet/getLimit",
    http: httpUtil,
    host: 'localhost',
    port: 3001,
    transferUrl: '/wallet/transfer',
    ETH_CONTRACT_ADDRESS: '0x867F01e6b0331045629eFd2E0ddf26Ac470c80C2',
    decimalDigits: 18
}

let production = {
    http: httpsUtil,
    getBalanceUrl: 'https://explorer.intchain.io/api/wallet/getBalance/',
    getNonceUrl: 'https://explorer.intchain.io/api/wallet/getNonce/',
    getVotesUrl: 'https://explorer.intchain.io/api/wallet/getVotes/',
    getCandiesUrl: 'https://explorer.intchain.io/api/wallet/candies',
    getTokenUrl: 'https://explorer.intchain.io/api/wallet/walletList?',
    getVoteCandiesUrl: 'https://explorer.intchain.io/api/wallet/voteCandies',
    getMydataUrl: "https://explorer.intchain.io/api/mapping/getMydata/",
    burnIntOnEthUrl: "/api/mapping/sendSignedTransaction",
    queryIntOnEthUrl: "https://explorer.intchain.io/api/mapping/queryEthIntBalance/",
    getPriceUrl: "https://explorer.intchain.io/api/wallet/getPrice",
    getLimitUrl: "https://explorer.intchain.io/api/wallet/getLimit",
    host: 'explorer.intchain.io',
    port: "",
    transferUrl: '/api/wallet/transfer',
    ETH_CONTRACT_ADDRESS: '0x867F01e6b0331045629eFd2E0ddf26Ac470c80C2',
    decimalDigits: 18
}

let cfg = pro ? production : development


module.exports = cfg;