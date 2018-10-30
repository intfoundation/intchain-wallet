"use strict";

function __export(m) {
    for (var p in m) {
        if (!exports.hasOwnProperty(p)) exports[p] = m[p];
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(require("../core"));
__export(require("./client/client"));
__export(require("./lib/simple_command"));
//var unhandled_rejection_1 = require("./lib/unhandled_rejection");
//exports.initUnhandledRejection = unhandled_rejection_1.init;
var rejectify_1 = require("./lib/rejectify");
exports.rejectifyValue = rejectify_1.rejectifyValue;
exports.rejectifyErrorCode = rejectify_1.rejectifyErrorCode;
__export(require("./host/chain_host"));
var chain_host_1 = require("./host/chain_host");
var core_1 = require("../core");
var host = new chain_host_1.ChainHost();
exports.host = host;
host.registerNet('tcp', function (commandOptions) {
    var _host = commandOptions.get('host');
    if (!_host) {
        console.error('invalid tcp host');
        return;
    }
    var port = commandOptions.get('port');
    if (!port) {
        console.error('invalid tcp port');
        return;
    }
    var peers = commandOptions.get('peers');
    if (!peers) {
        peers = [];
    } else {
        peers = peers.split(';');
    }
    var nodeType = core_1.StaticOutNode(core_1.TcpNode);
    return new nodeType(peers, { host: _host, port: port });
});
host.registerNet('bdt', function (commandOptions) {
    var _host = commandOptions.get('host');
    if (!_host) {
        console.error('invalid bdt host');
        return;
    }
    var port = commandOptions.get('port');
    if (!port) {
        console.error('no bdt port');
        return;
    }
    port = port.split('|');
    var udpport = 0;
    var tcpport = parseInt(port[0]);
    if (port.length === 1) {
        udpport = tcpport + 10;
    } else {
        udpport = parseInt(port[1]);
    }
    if (isNaN(tcpport) || isNaN(udpport)) {
        console.error('invalid bdt port');
        return;
    }
    var peerid = commandOptions.get('peerid');
    if (!peerid) {
        peerid = host + ":" + port;
    }
    var snPeers = commandOptions.get('sn');
    if (!snPeers) {
        console.error('no sn');
        return;
    }
    var snconfig = snPeers.split('@');
    if (snconfig.length !== 4) {
        console.error('invalid sn: <SN_PEERID>@<SN_IP>@<SN_TCP_PORT>@<SN_UDP_PORT>');
    }
    var snPeer = {
        peerid: "" + snconfig[0],
        eplist: ["4@" + snconfig[1] + "@" + snconfig[2] + "@t", "4@" + snconfig[1] + "@" + snconfig[3] + "@u"]
    };
    var bdt_logger = {
        level: commandOptions.get('bdt_log_level') || 'info',
        // 设置log目录
        file_dir: commandOptions.get('dataDir') + '/log'
    };
    return new core_1.BdtNode({ host: _host, tcpport: tcpport, udpport: udpport, peerid: peerid, snPeer: snPeer, bdtLoggerOptions: bdt_logger });
});