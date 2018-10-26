"use strict";

var _stringify = require("babel-runtime/core-js/json/stringify");

var _stringify2 = _interopRequireDefault(_stringify);

var _getPrototypeOf = require("babel-runtime/core-js/object/get-prototype-of");

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("babel-runtime/helpers/createClass");

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require("babel-runtime/helpers/possibleConstructorReturn");

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _get2 = require("babel-runtime/helpers/get");

var _get3 = _interopRequireDefault(_get2);

var _inherits2 = require("babel-runtime/helpers/inherits");

var _inherits3 = _interopRequireDefault(_inherits2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

Object.defineProperty(exports, "__esModule", { value: true });
var events_1 = require("events");
var http = require("http");

var RPCServer = function (_events_1$EventEmitte) {
    (0, _inherits3.default)(RPCServer, _events_1$EventEmitte);

    function RPCServer(listenaddr, port) {
        (0, _classCallCheck3.default)(this, RPCServer);

        var _this = (0, _possibleConstructorReturn3.default)(this, (RPCServer.__proto__ || (0, _getPrototypeOf2.default)(RPCServer)).call(this));

        _this.m_addr = listenaddr;
        _this.m_port = port;
        return _this;
    }

    (0, _createClass3.default)(RPCServer, [{
        key: "on",
        value: function on(event, listener) {
            return (0, _get3.default)(RPCServer.prototype.__proto__ || (0, _getPrototypeOf2.default)(RPCServer.prototype), "on", this).call(this, event, listener);
        }
    }, {
        key: "once",
        value: function once(event, listener) {
            return (0, _get3.default)(RPCServer.prototype.__proto__ || (0, _getPrototypeOf2.default)(RPCServer.prototype), "once", this).call(this, event, listener);
        }
    }, {
        key: "prependListener",
        value: function prependListener(event, listener) {
            return (0, _get3.default)(RPCServer.prototype.__proto__ || (0, _getPrototypeOf2.default)(RPCServer.prototype), "prependListener", this).call(this, event, listener);
        }
    }, {
        key: "prependOnceListener",
        value: function prependOnceListener(event, listener) {
            return (0, _get3.default)(RPCServer.prototype.__proto__ || (0, _getPrototypeOf2.default)(RPCServer.prototype), "prependOnceListener", this).call(this, event, listener);
        }
    }, {
        key: "start",
        value: function start() {
            var _this2 = this;

            if (this.m_server) {
                return;
            }
            this.m_server = http.createServer();
            this.m_server.on('request', function (req, resp) {
                if (req.url !== '/rpc' || req.method !== 'POST') {
                    resp.writeHead(404);
                    resp.end();
                } else {
                    var jsonData = '';
                    req.on('data', function (chunk) {
                        jsonData += chunk;
                    });
                    req.on('end', function () {
                        var reqObj = JSON.parse(jsonData);
                        console.info("RPCServer emit request " + reqObj.funName + ", params " + (0, _stringify2.default)(reqObj.args));
                        if (!_this2.emit(reqObj.funName, reqObj.args, resp)) {
                            resp.writeHead(404);
                            resp.end();
                        }
                    });
                }
            });
            this.m_server.listen(this.m_port, this.m_addr);
        }
    }, {
        key: "stop",
        value: function stop() {
            if (this.m_server) {
                this.m_server.close();
                delete this.m_server;
            }
        }
    }]);
    return RPCServer;
}(events_1.EventEmitter);

exports.RPCServer = RPCServer;