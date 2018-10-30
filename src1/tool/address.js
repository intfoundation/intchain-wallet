#!/usr/bin/env node

"use strict";

var _slicedToArray2 = require("babel-runtime/helpers/slicedToArray");

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

Object.defineProperty(exports, "__esModule", { value: true });
var process = require("process");
var client_1 = require("../client");
client_1.initUnhandledRejection(client_1.initLogger({ loggerOptions: { console: true } }));
function main() {
    var command = client_1.parseCommand(process.argv);
    if (!command || !command.command) {
        console.log("Usage: node address.js <create | convert> {--secret {secret} | --pubkey {pubkey}}");
        process.exit();
    }
    if (command.command === 'create') {
        var _client_1$createKeyPa = client_1.createKeyPair(),
            _client_1$createKeyPa2 = (0, _slicedToArray3.default)(_client_1$createKeyPa, 2),
            key = _client_1$createKeyPa2[0],
            secret = _client_1$createKeyPa2[1];

        var addr = client_1.addressFromSecretKey(secret);
        console.log("address:" + addr + " secret:" + secret.toString('hex'));
        process.exit();
    } else {
        if (command.options.has('secret')) {
            var pub = client_1.publicKeyFromSecretKey(command.options.get('secret'));
            var _addr = client_1.addressFromPublicKey(pub);
            console.log("address:" + _addr + "\npubkey:" + pub.toString('hex'));
            process.exit();
        } else if (command.options.has('pubkey')) {
            var _addr2 = client_1.addressFromPublicKey(command.options.get('pubkey'));
            console.log("address:" + _addr2);
            process.exit();
        } else {
            console.log("Usage: node address.js <create | convert> {--secret {secret} | --pubkey {pubkey}}");
            process.exit();
        }
    }
}
main();