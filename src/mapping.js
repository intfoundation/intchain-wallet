'use strict';

const Web3 = require('web3');
const Tx = require('ethereumjs-tx');
const assert = require("assert");
const rlp = require('rlp');


//const ETH_CONTRACT_ADDRESS = '0x0b76544f6c413a555f309bf76260d1e02377c02a';
//const ETH_CONTRACT_ADDRESS_TEST = '0x867F01e6b0331045629eFd2E0ddf26Ac470c80C2';

const {
    ETH_CONTRACT_ADDRESS,
    decimalDigits
} = require('./cfg')

// if (typeof web3 !== 'undefined') {
// 	web3 = new Web3(web3.currentProvider);
// } else {
// 	// set the provider you want from Web3.providers
// 	// web3 = new Web3(new Web3.providers.HttpProvider("https://rinkeby.infura.io/bWQAsi2JbfmO9YAoxOgm"));
//      web3 = new Web3(new Web3.providers.HttpProvider("https://mainnet.infura.io/bWQAsi2JbfmO9YAoxOgm"));
// }

async function getSerializedTx(options) {
    try {
        assert(options.decimalAmount, "decimalAmount must be not empty");
        assert(options.decimalGas, "decimalGas must be not empty");
        assert(options.fromAddress, "fromAddress must be not empty");
        assert(options.fromAddressPrivateKey, "fromAddressPrivateKey must be not empty");
        assert(options.toAddress, "toAddress must be not empty");
        assert(options.mydata, "mydata must be not empty");
        assert(options.mynonce, "mynonce must be not empty");
        if (!Web3.utils.isAddress(options.fromAddress.toLowerCase())) {
            modal.error("ETH wallet address is not legal");
            return;
        }
        if (!isIntAddress(options.toAddress)) {
            modal.error("INT wallet address is not legal");
            return;
        }
        if (!isEthPrivateKey(options.fromAddressPrivateKey)) {
            modal.error("ETH private key is not legal");
            return;
        }
        //var decimalAmount=options.decimalAmount;
        var decimalGas = options.decimalGas;
        var fromAddress = options.fromAddress;
        var fromAddressPrivateKey = options.fromAddressPrivateKey;
        let gasLimit = options.gasLimit; //100000;
        //合约转账
        //let amount = Math.round(decimalAmount * Math.pow(10,18));//代币的小数位
        let gasPrice = Math.round(decimalGas * Math.pow(10, decimalDigits));
        //防止输入过大的price导致损失
        if (gasPrice > 50000000000) {
            util.alert("Gas price is High");
            return;
        }
        let info = {
                "ETH wallet address": options.fromAddress,
                "INT wallet address": options.toAddress,
                "Gas price": options.decimalGas,
                "Gas limit": gasLimit,
                "Fee": gasLimit * options.decimalGas + "ETH",
                "Method": "burn(uint256)",
                "Nonce": options.mynonce,
                "Amount": options.decimalAmount + " INT",
            }
            //let currnonce = await web3.eth.getTransactionCount(fromAddress);

        //let mynonce = Web3.utils.toHex(currnonce);
        let mygasPrice = Web3.utils.toHex(gasPrice);
        let mygasLimit = Web3.utils.toHex(gasLimit);


        let functionName = "burn(uint256)";

        //组装data
        //let mydata = web3.eth.abi.encodeParameters(['uint256'], [amount]);
        //去除0x
        //mydata = mydata.substring(2);

        //签名函数
        var functionSig = Web3.utils.sha3(functionName).substr(2, 8)

        var rawTx = {
            nonce: options.mynonce,
            gasPrice: mygasPrice,
            gasLimit: mygasLimit,
            to: ETH_CONTRACT_ADDRESS,
            from: fromAddress,
            value: '0x00',
            data: '0x' + functionSig + options.mydata
        };

        var tx = new Tx(rawTx);

        const privateKey = new Buffer(fromAddressPrivateKey, 'hex');
        tx.sign(privateKey);
        var serializedTx = tx.serialize();
        var serializedTxHex = '0x' + serializedTx.toString('hex')

        let lowAddress = options.TOADDRESS.toLowerCase();
        let toAddress = Web3.utils.toChecksumAddress(lowAddress);
        //let functionNameTransfer = "transfer(address,uint256)";
        //let functionSigTransfer = Web3.utils.sha3(functionNameTransfer).substr(2, 8);

        var transferRawTx = {
            nonce: Web3.utils.toHex(parseInt(options.mynonce) + 1),
            gasPrice: mygasPrice,
            gasLimit: mygasLimit,
            from: fromAddress,
            to: toAddress,
            value: '0x00',
            data: `?intAddress=${options.toAddress}&num=${options.decimalAmount}&fromAddress=${options.fromAddress}`
                //data: '0x' + functionSigTransfer + options.transferData + `?intAddress=${options.toAddress}&num=${options.decimalAmount}&fromAddress=${options.fromAddress}`

        }
        var transferTx = new Tx(transferRawTx)
        transferTx.sign(privateKey)
        var transferSerializedTx = transferTx.serialize()
        var transferSerializedTxHex = '0x' + transferSerializedTx.toString('hex')
        return { "status": "success", data: { serializedTxHex, transferSerializedTxHex }, info: info };
    } catch (e) {
        return { "status": "error", message: e.message };
    }
};

function isIntAddress(address) {
    let flag = true
    if (address.length !== 34) {
        return false
    }
    for (let a of address) {
        if (!/^[0-9]|[a-zA-Z]$/.test(a)) {
            flag = false
            break
        }
    }
    return flag
}


function isEthPrivateKey(privateKey) {
    let flag = true
    if (privateKey.length !== 64) {
        return false
    }
    for (let a of privateKey) {
        if (!/^[0-9]|[a-zA-Z]$/.test(a)) {
            flag = false
            break
        }
    }
    return flag
}
// async function queryEthIntBalance (address) {
// 	try{
// 	     let lowAddress = address.toLowerCase();
//
// 		 if(!Web3.utils.isAddress(lowAddress)){
// 			util.alert("input toAddress is not legal");
// 			return;
// 	     }
//
// 	     address = Web3.utils.toChecksumAddress(lowAddress);
//
// 		let functionName = "balanceOf(address)";
//
// 		//组装data
// 		let mydata = web3.eth.abi.encodeParameters(['address'], [address]);
// 		//去除0x
// 		mydata = mydata.substring(2);
//
// 		//签名函数
// 		var functionSig = Web3.utils.sha3(functionName).substr(2,8)
//
// 		var rawTx = {
// 			to: ETH_CONTRACT_ADDRESS,
// 			data: '0x' + functionSig + mydata
// 		};
//
// 		let balance0x = await web3.eth.call(rawTx);
//
// 		let balance = Web3.utils.hexToNumber(balance0x)/1000000;
//
// 		return {"status": "success","balance": balance};
//
// 	} catch (e) {
// 		util.alert(e.message);
//     }
// };

module.exports.getSerializedTx = getSerializedTx;
//module.exports.queryEthIntBalance = queryEthIntBalance;