"use strict";

var _stringify = require("babel-runtime/core-js/json/stringify");

var _stringify2 = _interopRequireDefault(_stringify);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

Object.defineProperty(exports, "__esModule", { value: true });
var block_1 = require("./block");
var serializable_1 = require("../serializable");
var error_code_1 = require("../error_code");
function _calcuteBlockHash(blockHeader, nonceRange, nonce1Range) {
    // 这里做单线程的hash计算
    var errCode = error_code_1.ErrorCode.RESULT_FAILED;
    blockHeader.nonce = nonceRange.start;
    blockHeader.nonce1 = nonce1Range.start;
    while (true) {
        //
        if (blockHeader.verifyPOW()) {
            errCode = error_code_1.ErrorCode.RESULT_OK;
            break;
        }
        if (!_stepNonce(blockHeader, nonceRange, nonce1Range)) {
            errCode = error_code_1.ErrorCode.RESULT_OUT_OF_LIMIT;
            break;
        }
    }
    return errCode;
}
function _stepNonce(blockHeader, nonceRange, nonce1Range) {
    if (blockHeader.nonce === nonceRange.end) {
        blockHeader.nonce = nonceRange.start;
        blockHeader.nonce1 += 1;
    } else {
        blockHeader.nonce += 1;
    }
    return blockHeader.nonce1 <= nonce1Range.end;
}
function work(_param) {
    var headerBuffer = Buffer.from(_param['data'], 'hex');
    var header = new block_1.PowBlockHeader();
    header.decode(new serializable_1.BufferReader(headerBuffer));
    var errCode = _calcuteBlockHash(header, _param['nonce'], _param['nonce1']);
    process.stdout.write((0, _stringify2.default)({ nonce: header.nonce, nonce1: header.nonce1 }));
}
var param = JSON.parse(process.argv[2]);
if (!param) {
    process.stdout.write("process argv error! " + process.argv[2]);
    process.exit(1);
}
work(param);