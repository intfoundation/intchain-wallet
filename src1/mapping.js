'use strict';

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

// if (typeof web3 !== 'undefined') {
// 	web3 = new Web3(web3.currentProvider);
// } else {
// 	// set the provider you want from Web3.providers
// 	// web3 = new Web3(new Web3.providers.HttpProvider("https://rinkeby.infura.io/bWQAsi2JbfmO9YAoxOgm"));
//      web3 = new Web3(new Web3.providers.HttpProvider("https://mainnet.infura.io/bWQAsi2JbfmO9YAoxOgm"));
// }

var getSerializedTx = function () {
    var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(options) {
        var decimalGas, fromAddress, fromAddressPrivateKey, gasLimit, gasPrice, info, mygasPrice, mygasLimit, functionName, functionSig, rawTx, tx, privateKey, serializedTx, serializedTxHex, lowAddress, toAddress, transferRawTx, transferTx, transferSerializedTx, transferSerializedTxHex;
        return _regenerator2.default.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        _context.prev = 0;

                        assert(options.decimalAmount, "decimalAmount must be not empty");
                        assert(options.decimalGas, "decimalGas must be not empty");
                        assert(options.fromAddress, "fromAddress must be not empty");
                        assert(options.fromAddressPrivateKey, "fromAddressPrivateKey must be not empty");
                        assert(options.toAddress, "toAddress must be not empty");
                        assert(options.mydata, "mydata must be not empty");
                        assert(options.mynonce, "mynonce must be not empty");

                        if (Web3.utils.isAddress(options.fromAddress.toLowerCase())) {
                            _context.next = 11;
                            break;
                        }

                        modal.error("ETH wallet address is not legal");
                        return _context.abrupt('return');

                    case 11:
                        if (isIntAddress(options.toAddress)) {
                            _context.next = 14;
                            break;
                        }

                        modal.error("INT wallet address is not legal");
                        return _context.abrupt('return');

                    case 14:
                        if (isEthPrivateKey(options.fromAddressPrivateKey)) {
                            _context.next = 17;
                            break;
                        }

                        modal.error("ETH private key is not legal");
                        return _context.abrupt('return');

                    case 17:
                        //var decimalAmount=options.decimalAmount;
                        decimalGas = options.decimalGas;
                        fromAddress = options.fromAddress;
                        fromAddressPrivateKey = options.fromAddressPrivateKey;
                        gasLimit = options.gasLimit; //100000;
                        //合约转账
                        //let amount = Math.round(decimalAmount * Math.pow(10,18));//代币的小数位

                        gasPrice = Math.round(decimalGas * Math.pow(10, decimalDigits));
                        //防止输入过大的price导致损失

                        if (!(gasPrice > 50000000000)) {
                            _context.next = 25;
                            break;
                        }

                        util.alert("Gas price is High");
                        return _context.abrupt('return');

                    case 25:
                        info = {
                            "ETH wallet address": options.fromAddress,
                            "INT wallet address": options.toAddress,
                            "Gas price": options.decimalGas,
                            "Gas limit": gasLimit,
                            "Fee": gasLimit * options.decimalGas + "ETH",
                            "Method": "burn(uint256)",
                            "Nonce": options.mynonce,
                            "Amount": options.decimalAmount + " INT"
                            //let currnonce = await web3.eth.getTransactionCount(fromAddress);

                            //let mynonce = Web3.utils.toHex(currnonce);
                        };
                        mygasPrice = Web3.utils.toHex(gasPrice);
                        mygasLimit = Web3.utils.toHex(gasLimit);
                        functionName = "burn(uint256)";

                        //组装data
                        //let mydata = web3.eth.abi.encodeParameters(['uint256'], [amount]);
                        //去除0x
                        //mydata = mydata.substring(2);

                        //签名函数

                        functionSig = Web3.utils.sha3(functionName).substr(2, 8);
                        rawTx = {
                            nonce: options.mynonce,
                            gasPrice: mygasPrice,
                            gasLimit: mygasLimit,
                            to: ETH_CONTRACT_ADDRESS,
                            from: fromAddress,
                            value: '0x00',
                            data: '0x' + functionSig + options.mydata
                        };
                        tx = new Tx(rawTx);
                        privateKey = new Buffer(fromAddressPrivateKey, 'hex');

                        tx.sign(privateKey);
                        serializedTx = tx.serialize();
                        serializedTxHex = '0x' + serializedTx.toString('hex');
                        lowAddress = options.TOADDRESS.toLowerCase();
                        toAddress = Web3.utils.toChecksumAddress(lowAddress);
                        //let functionNameTransfer = "transfer(address,uint256)";
                        //let functionSigTransfer = Web3.utils.sha3(functionNameTransfer).substr(2, 8);

                        transferRawTx = {
                            nonce: Web3.utils.toHex(parseInt(options.mynonce) + 1),
                            gasPrice: mygasPrice,
                            gasLimit: mygasLimit,
                            from: fromAddress,
                            to: toAddress,
                            value: '0x00',
                            data: '?intAddress=' + options.toAddress + '&num=' + options.decimalAmount + '&fromAddress=' + options.fromAddress
                            //data: '0x' + functionSigTransfer + options.transferData + `?intAddress=${options.toAddress}&num=${options.decimalAmount}&fromAddress=${options.fromAddress}`

                        };
                        transferTx = new Tx(transferRawTx);

                        transferTx.sign(privateKey);
                        transferSerializedTx = transferTx.serialize();
                        transferSerializedTxHex = '0x' + transferSerializedTx.toString('hex');
                        return _context.abrupt('return', { "status": "success", data: { serializedTxHex: serializedTxHex, transferSerializedTxHex: transferSerializedTxHex }, info: info });

                    case 46:
                        _context.prev = 46;
                        _context.t0 = _context['catch'](0);
                        return _context.abrupt('return', { "status": "error", message: _context.t0.message });

                    case 49:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, this, [[0, 46]]);
    }));

    return function getSerializedTx(_x) {
        return _ref.apply(this, arguments);
    };
}();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Web3 = require('web3');
var Tx = require('ethereumjs-tx');
var assert = require("assert");
var rlp = require('rlp');

//const ETH_CONTRACT_ADDRESS = '0x0b76544f6c413a555f309bf76260d1e02377c02a';
//const ETH_CONTRACT_ADDRESS_TEST = '0x867F01e6b0331045629eFd2E0ddf26Ac470c80C2';

var _require = require('./cfg'),
    ETH_CONTRACT_ADDRESS = _require.ETH_CONTRACT_ADDRESS,
    decimalDigits = _require.decimalDigits;

;

function isIntAddress(address) {
    var flag = true;
    if (address.length !== 34) {
        return false;
    }
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = (0, _getIterator3.default)(address), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var a = _step.value;

            if (!/^[0-9]|[a-zA-Z]$/.test(a)) {
                flag = false;
                break;
            }
        }
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
            }
        } finally {
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }

    return flag;
}

function isEthPrivateKey(privateKey) {
    var flag = true;
    if (privateKey.length !== 64) {
        return false;
    }
    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
        for (var _iterator2 = (0, _getIterator3.default)(privateKey), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var a = _step2.value;

            if (!/^[0-9]|[a-zA-Z]$/.test(a)) {
                flag = false;
                break;
            }
        }
    } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion2 && _iterator2.return) {
                _iterator2.return();
            }
        } finally {
            if (_didIteratorError2) {
                throw _iteratorError2;
            }
        }
    }

    return flag;
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