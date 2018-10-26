"use strict";

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("babel-runtime/helpers/createClass");

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

Object.defineProperty(exports, "__esModule", { value: true });
var error_code_1 = require("../error_code");
var path = require("path");
var fs = require("fs-extra");

var NodeStorage = function () {
    function NodeStorage(options) {
        var _this = this;

        (0, _classCallCheck3.default)(this, NodeStorage);

        this.m_nodes = [];
        this.m_banNodes = [];
        this.m_bFlush = false;
        this.m_staticNodes = [];
        this.m_file = path.join(options.dataDir, 'nodeinfo');
        this.m_logger = options.logger;
        try {
            fs.ensureDirSync(options.dataDir);
            if (fs.existsSync(this.m_file)) {
                var json = fs.readJsonSync(this.m_file);
                this.m_nodes = json['nodes'] ? json['nodes'] : [];
                this.m_banNodes = json['bans'] ? json['bans'] : [];
            }
        } catch (e) {
            this.m_logger.error("[node_storage NodeStorage constructor] " + e.toString());
        }
        // 在这里读一次staticnodes
        var staticFile = path.join(options.dataDir, 'staticnodes');
        if (fs.pathExistsSync(staticFile)) {
            this.m_staticNodes = fs.readJSONSync(staticFile);
        }
        setInterval(function () {
            _this.flush();
        }, 60 * 1000);
    }

    (0, _createClass3.default)(NodeStorage, [{
        key: "get",
        value: function get(arg) {
            var count = 0;
            if (arg === 'all') {
                count = this.m_nodes.length;
            } else {
                count = count > this.m_nodes.length ? this.m_nodes.length : arg;
            }
            var peerids = this.m_nodes.slice(0, count);
            return peerids;
        }
    }, {
        key: "add",
        value: function add(peerid) {
            var nIndex = this.getIndex(peerid);
            if (nIndex !== -1) {
                this.m_nodes.splice(nIndex, 1);
            }
            this.m_nodes.splice(0, 0, peerid);
            this.m_bFlush = true;
            return error_code_1.ErrorCode.RESULT_OK;
        }
    }, {
        key: "remove",
        value: function remove(peerid) {
            var nIndex = this.getIndex(peerid);
            if (nIndex === -1) {
                return error_code_1.ErrorCode.RESULT_NOT_FOUND;
            }
            this.m_nodes.splice(nIndex, 1);
            this.m_bFlush = true;
            return error_code_1.ErrorCode.RESULT_OK;
        }
        // time的单位为分钟

    }, {
        key: "ban",
        value: function ban(peerid, time) {
            var nIndex = this.getIndex(peerid);
            if (nIndex !== -1) {
                this.m_nodes.splice(nIndex, 1);
            }
            nIndex = this.getBanIndex(peerid);
            if (nIndex !== -1) {
                this.m_banNodes.splice(nIndex, 1);
            }
            var info = { peerid: peerid, endtime: time === 0 ? 0 : Date.now() + time * 60 * 1000 };
            var pos = 0;
            for (var i = 0; i < this.m_banNodes.length; i++) {
                pos++;
                if (info.endtime <= this.m_banNodes[i].endtime) {
                    break;
                }
            }
            this.m_banNodes.splice(pos, 0, info);
            this.m_bFlush = true;
            return error_code_1.ErrorCode.RESULT_OK;
        }
    }, {
        key: "isBan",
        value: function isBan(peerid) {
            var nIndex = this.getBanIndex(peerid);
            if (nIndex === -1) {
                return false;
            }
            if (this.m_banNodes[nIndex].endtime === 0) {
                return true;
            }
            if (Date.now() >= this.m_banNodes[nIndex].endtime) {
                this.m_banNodes.splice(nIndex, 1);
                this.m_bFlush = true;
                return true;
            }
            return false;
        }
    }, {
        key: "getIndex",
        value: function getIndex(peerid) {
            for (var i = 0; i < this.m_nodes.length; i++) {
                if (this.m_nodes[i] === peerid) {
                    return i;
                }
            }
            return -1;
        }
    }, {
        key: "getBanIndex",
        value: function getBanIndex(peerid) {
            for (var i = 0; i < this.m_banNodes.length; i++) {
                if (this.m_banNodes[i].peerid === peerid) {
                    return i;
                }
            }
            return -1;
        }
    }, {
        key: "flush",
        value: function flush() {
            if (!this.m_bFlush) {
                return;
            }
            try {
                var json = {};
                json['nodes'] = this.m_nodes;
                json['bans'] = this.m_banNodes;
                fs.writeJsonSync(this.m_file, json);
                this.m_bFlush = false;
            } catch (e) {
                this.m_logger.error("[node_storage NodeStorage flush] " + e.toString());
            }
        }
    }, {
        key: "staticNodes",
        get: function get() {
            return this.m_staticNodes;
        }
    }]);
    return NodeStorage;
}();

exports.NodeStorage = NodeStorage;