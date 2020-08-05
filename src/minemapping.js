const {
    mineMappingUrl
} = require('./cfg');

const int4 = require('int4.js');

const INT4Account = int4.account;
const RPC = int4.rpc;

const INT4URL = mineMappingUrl;
const send = RPC(INT4URL);

const queryInt4Balance = async function(address) {
    let balance = await send("int_getBalance", [address, "latest"]);
    return balance
};

const getInt4Nonce = async function(address) {
    let nonce = await send("int_getTransactionCount", [address, "latest"]);
    return nonce
};

module.exports = {
    INT4Account,
    queryInt4Balance
}
