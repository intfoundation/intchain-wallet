const fs = require('fs-extra');
const shuffle = require('shuffle-array');
const Subtract = require('array-subtract');

const { GroupInfo } = require('../chainlib/Infos/Info');
const TX = require('../chainlib/Transcation/tx');
const KeyRing = require('../chainlib/Account/keyring');
const RPCClient = require("../client/RPC/RPCClient");

let systemAccount = null;

function sendGroupTx(members) {
    let info = new GroupInfo(members);
    let dataTX = TX.createDataTX(info.toRaw(), systemAccount);
    let txRaw = dataTX.toRaw();
    let sig = systemAccount.signHash(txRaw);

    let client = new RPCClient(process.argv[5], process.argv[6]);
    client.Call("addGroupTx", { tx: txRaw, sig: sig }, (resp, status) => {
        if (resp) {
            console.log(resp.toString());
        } else {
            console.log('send failed');
        }
    });
}

function addGroup(file, count) {
    let accounts = fs.readJSONSync(file);
    accounts = Array.from(Object.keys(accounts));
    let subtract = new Subtract((a, b) => {
        return a === b;
    });

    // let accounts = [
    //     "19fHD2uxWtQ5xJ9rjhDVhFNEMp659u7JHb",
    //     "1HH3SwayDsS2MsXVi6b3dLBbuZPQp3P8wH",
    //     "12cnRvyhCEVFVcx8BawPbn4kgp3ixsdedM",
    //     "19jAKRouUbCtGcYJgZqqimUw2DGbAZzDUZ",
    //     "1Fbfv5f5QjWCGsCRSY8tA7Whmg2FPyNJ5j",
    //     "1JSjsnzXf6A8GKAd8eytwPHqr6Ci33FCbp",
    // ];

    while (accounts.length > 0) {
        let members = shuffle.pick(accounts, { 'picks': count });
        sendGroupTx(members);
        accounts = subtract.sub(accounts, members);
    }
}

if (process.argv.length < 6) {
    console.log('Usage: node addGroup.js <systemCount> <file> <group_mebers> <ip> <port>');
    process.exit(1);
}

systemAccount = KeyRing.fromSecret(process.argv[2]);

let file = process.argv[3] || './Accounts.txt';
let groupNum = parseInt(process.argv[4]) || 128;
addGroup(file, groupNum);