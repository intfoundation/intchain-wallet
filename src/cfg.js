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
    getVoteRecordUrl: "http://localhost:3001/wallet/voteRecord/",
    getTokenBalanceUrl: "http://localhost:3001/wallet/getTokenBalance/",
    getTestCoinUrl: "http://localhost:3001/wallet/getTestCoin",
    getProposalRfdUrl: "http://localhost:3001/wallet/queryProposalRfd",
    getRfd2Url: "http://localhost:3001/wallet/queryrfd2",
    http: httpUtil,
    host: 'localhost',
    port: 3001,
    transferUrl: '/wallet/transfer',
    transferArrUrl: '/wallet/transferArr',
    //ETH_CONTRACT_ADDRESS: '0x867F01e6b0331045629eFd2E0ddf26Ac470c80C2',
    ETH_CONTRACT_ADDRESS: '0x0b76544f6c413a555f309bf76260d1e02377c02a',
    decimalDigits: 18
}

let production = {
    http: httpsUtil,
    getBalanceUrl: 'https://explorer.intchain.io/api/wallet/getBalance/',
    rewardHistoryUrl: 'https://explorer.intchain.io/api/wallet/rewardHistory/',
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
    getVoteRecordUrl: "https://explorer.intchain.io/api/wallet/voteRecord/",
    getTokenBalanceUrl: "https://explorer.intchain.io/api/wallet/getTokenBalance/",
    getTestCoinUrl: "https://explorer.intchain.io/api/wallet/getTestCoin",
    getProposalRfdUrl: "https://explorer.intchain.io/api/wallet/queryProposalRfd",
    getRfd2Url: "https://explorer.intchain.io/api/wallet/queryrfd2",
    host: 'explorer.intchain.io',
    port: "",
    transferUrl: '/api/wallet/transfer',
    transferArrUrl: '/api/wallet/transferArr',
    //ETH_CONTRACT_ADDRESS: '0x867F01e6b0331045629eFd2E0ddf26Ac470c80C2',
    ETH_CONTRACT_ADDRESS: '0x0b76544f6c413a555f309bf76260d1e02377c02a',
    decimalDigits: 18
}

let cfg = pro ? production : development


module.exports = cfg;