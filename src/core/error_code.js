"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ErrorCode;
(function (ErrorCode) {
    ErrorCode[ErrorCode["RESULT_OK"] = 0] = "RESULT_OK";
    ErrorCode[ErrorCode["RESULT_FAILED"] = 1] = "RESULT_FAILED";
    ErrorCode[ErrorCode["RESULT_WAIT_INIT"] = 2] = "RESULT_WAIT_INIT";
    ErrorCode[ErrorCode["RESULT_ERROR_STATE"] = 3] = "RESULT_ERROR_STATE";
    ErrorCode[ErrorCode["RESULT_INVALID_TYPE"] = 4] = "RESULT_INVALID_TYPE";
    ErrorCode[ErrorCode["RESULT_SCRIPT_ERROR"] = 5] = "RESULT_SCRIPT_ERROR";
    ErrorCode[ErrorCode["RESULT_NO_IMP"] = 6] = "RESULT_NO_IMP";
    ErrorCode[ErrorCode["RESULT_ALREADY_EXIST"] = 7] = "RESULT_ALREADY_EXIST";
    ErrorCode[ErrorCode["RESULT_NEED_SYNC"] = 8] = "RESULT_NEED_SYNC";
    ErrorCode[ErrorCode["RESULT_NOT_FOUND"] = 9] = "RESULT_NOT_FOUND";
    ErrorCode[ErrorCode["RESULT_EXPIRED"] = 10] = "RESULT_EXPIRED";
    ErrorCode[ErrorCode["RESULT_INVALID_PARAM"] = 11] = "RESULT_INVALID_PARAM";
    ErrorCode[ErrorCode["RESULT_PARSE_ERROR"] = 12] = "RESULT_PARSE_ERROR";
    ErrorCode[ErrorCode["RESULT_REQUEST_ERROR"] = 13] = "RESULT_REQUEST_ERROR";
    ErrorCode[ErrorCode["RESULT_NOT_SUPPORT"] = 14] = "RESULT_NOT_SUPPORT";
    ErrorCode[ErrorCode["RESULT_TIMEOUT"] = 15] = "RESULT_TIMEOUT";
    ErrorCode[ErrorCode["RESULT_EXCEPTION"] = 16] = "RESULT_EXCEPTION";
    ErrorCode[ErrorCode["RESULT_INVALID_FORMAT"] = 17] = "RESULT_INVALID_FORMAT";
    ErrorCode[ErrorCode["RESULT_UNKNOWN_VALUE"] = 18] = "RESULT_UNKNOWN_VALUE";
    ErrorCode[ErrorCode["RESULT_INVALID_TOKEN"] = 19] = "RESULT_INVALID_TOKEN";
    ErrorCode[ErrorCode["RESULT_INVALID_SESSION"] = 21] = "RESULT_INVALID_SESSION";
    ErrorCode[ErrorCode["RESULT_OUT_OF_LIMIT"] = 22] = "RESULT_OUT_OF_LIMIT";
    ErrorCode[ErrorCode["RESULT_PERMISSION_DENIED"] = 23] = "RESULT_PERMISSION_DENIED";
    ErrorCode[ErrorCode["RESULT_OUT_OF_MEMORY"] = 24] = "RESULT_OUT_OF_MEMORY";
    ErrorCode[ErrorCode["RESULT_INVALID_STATE"] = 25] = "RESULT_INVALID_STATE";
    ErrorCode[ErrorCode["RESULT_NOT_ENOUGH"] = 26] = "RESULT_NOT_ENOUGH";
    ErrorCode[ErrorCode["RESULT_ERROR_NONCE_IN_TX"] = 27] = "RESULT_ERROR_NONCE_IN_TX";
    ErrorCode[ErrorCode["RESULT_INVALID_BLOCK"] = 28] = "RESULT_INVALID_BLOCK";
    ErrorCode[ErrorCode["RESULT_CANCELED"] = 29] = "RESULT_CANCELED";
    ErrorCode[ErrorCode["RESULT_FEE_TOO_SMALL"] = 30] = "RESULT_FEE_TOO_SMALL";
    ErrorCode[ErrorCode["RESULT_READ_ONLY"] = 31] = "RESULT_READ_ONLY";
    ErrorCode[ErrorCode["RESULT_TX_EXIST"] = 34] = "RESULT_TX_EXIST";
    ErrorCode[ErrorCode["RESULT_VER_NOT_SUPPORT"] = 35] = "RESULT_VER_NOT_SUPPORT";
    ErrorCode[ErrorCode["RESULT_EXECUTE_ERROR"] = 36] = "RESULT_EXECUTE_ERROR";
    ErrorCode[ErrorCode["RESULT_VERIFY_NOT_MATCH"] = 37] = "RESULT_VERIFY_NOT_MATCH";
    ErrorCode[ErrorCode["RESULT_SKIPPED"] = 40] = "RESULT_SKIPPED";
    ErrorCode[ErrorCode["RESULT_FORK_DETECTED"] = 50] = "RESULT_FORK_DETECTED";
})(ErrorCode = exports.ErrorCode || (exports.ErrorCode = {}));
function stringifyErrorCode(err) {
    if (err === ErrorCode.RESULT_OK) {
        return 'ok';
    }
    else if (err === ErrorCode.RESULT_FAILED) {
        return 'failed';
    }
    else if (err === ErrorCode.RESULT_WAIT_INIT) {
        return 'wait init';
    }
    else if (err === ErrorCode.RESULT_ERROR_STATE) {
        return 'error state';
    }
    else if (err === ErrorCode.RESULT_INVALID_TYPE) {
        return 'invalid type';
    }
    else if (err === ErrorCode.RESULT_SCRIPT_ERROR) {
        return 'script error';
    }
    else if (err === ErrorCode.RESULT_NO_IMP) {
        return 'no implemention';
    }
    else if (err === ErrorCode.RESULT_ALREADY_EXIST) {
        return 'already exists';
    }
    else if (err === ErrorCode.RESULT_NEED_SYNC) {
        return 'need sync';
    }
    else if (err === ErrorCode.RESULT_NOT_FOUND) {
        return 'not found';
    }
    else if (err === ErrorCode.RESULT_EXPIRED) {
        return 'expired';
    }
    else if (err === ErrorCode.RESULT_INVALID_PARAM) {
        return 'invalid param';
    }
    else if (err === ErrorCode.RESULT_PARSE_ERROR) {
        return 'parse error';
    }
    else if (err === ErrorCode.RESULT_REQUEST_ERROR) {
        return 'request error';
    }
    else if (err === ErrorCode.RESULT_NOT_SUPPORT) {
        return 'not support';
    }
    else if (err === ErrorCode.RESULT_TIMEOUT) {
        return 'timeout';
    }
    else if (err === ErrorCode.RESULT_EXCEPTION) {
        return 'exception';
    }
    else if (err === ErrorCode.RESULT_INVALID_FORMAT) {
        return 'invalid format';
    }
    else if (err === ErrorCode.RESULT_UNKNOWN_VALUE) {
        return 'unknown value';
    }
    else if (err === ErrorCode.RESULT_INVALID_TOKEN) {
        return 'invalid token';
    }
    else if (err === ErrorCode.RESULT_INVALID_SESSION) {
        return 'invalid session';
    }
    else if (err === ErrorCode.RESULT_OUT_OF_LIMIT) {
        return 'out of limit';
    }
    else if (err === ErrorCode.RESULT_PERMISSION_DENIED) {
        return 'permission denied';
    }
    else if (err === ErrorCode.RESULT_OUT_OF_MEMORY) {
        return 'out of memory';
    }
    else if (err === ErrorCode.RESULT_INVALID_STATE) {
        return 'invalid state';
    }
    else if (err === ErrorCode.RESULT_NOT_ENOUGH) {
        return 'not enough';
    }
    else if (err === ErrorCode.RESULT_ERROR_NONCE_IN_TX) {
        return 'transaction nonce error';
    }
    else if (err === ErrorCode.RESULT_INVALID_BLOCK) {
        return 'invalid block';
    }
    else if (err === ErrorCode.RESULT_CANCELED) {
        return 'canceled';
    }
    else if (err === ErrorCode.RESULT_FEE_TOO_SMALL) {
        return 'to small fee';
    }
    else if (err === ErrorCode.RESULT_READ_ONLY) {
        return 'readonly';
    }
    else if (err === ErrorCode.RESULT_TX_EXIST) {
        return 'transaction exists';
    }
    else if (err === ErrorCode.RESULT_VER_NOT_SUPPORT) {
        return 'version not support';
    }
    else if (err === ErrorCode.RESULT_EXECUTE_ERROR) {
        return 'execute error';
    }
    else if (err === ErrorCode.RESULT_VERIFY_NOT_MATCH) {
        return 'verify as invalid';
    }
    else if (err === ErrorCode.RESULT_SKIPPED) {
        return 'skipped';
    }
    else if (err === ErrorCode.RESULT_FORK_DETECTED) {
        return 'fork detected';
    }
    else {
        return 'unknown';
    }
}
exports.stringifyErrorCode = stringifyErrorCode;
