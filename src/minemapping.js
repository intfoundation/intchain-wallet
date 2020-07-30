const int4 = require('int4.js');

const INT4Account = int4.account;
const RPC = int4.rpc;

const INT4URL = "http://129.226.134.100:8555/testnet";
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
