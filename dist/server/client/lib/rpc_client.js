"use strict";

var _regenerator = require("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _promise = require("babel-runtime/core-js/promise");

var _promise2 = _interopRequireDefault(_promise);

var _asyncToGenerator2 = require("babel-runtime/helpers/asyncToGenerator");

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _stringify = require("babel-runtime/core-js/json/stringify");

var _stringify2 = _interopRequireDefault(_stringify);

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("babel-runtime/helpers/createClass");

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

Object.defineProperty(exports, "__esModule", { value: true });
var XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;

var RPCClient = function () {
    function RPCClient(serveraddr, port, logger) {
        (0, _classCallCheck3.default)(this, RPCClient);

        this.logger = logger;
        this.m_url = 'http://' + serveraddr + ':' + port + '/rpc';
    }

    (0, _createClass3.default)(RPCClient, [{
        key: "call",
        value: function call(funName, funcArgs, onComplete) {
            var sendObj = {
                funName: funName,
                args: funcArgs
            };
            // this.logger.info(`RPCClient send request ${sendObj.funName}, params ${JSON.stringify(sendObj.args)}`);
            var xmlhttp = new XMLHttpRequest();
            xmlhttp.onreadystatechange = function () {
                if (xmlhttp.readyState === 4) {
                    if (xmlhttp.status === 200) {
                        var strResp = xmlhttp.responseText;
                        onComplete(strResp, xmlhttp.status);
                    } else {
                        onComplete(null, xmlhttp.status);
                    }
                }
            };
            xmlhttp.ontimeout = function (err) {
                onComplete(null, 504);
            };
            xmlhttp.open('POST', this.m_url, true);
            xmlhttp.setRequestHeader('Content-Type', 'application/json');
            xmlhttp.send((0, _stringify2.default)(sendObj));
        }
    }, {
        key: "callAsync",
        value: function () {
            var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(funcName, funcArgs) {
                var _this = this;

                return _regenerator2.default.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                return _context.abrupt("return", new _promise2.default(function (reslove, reject) {
                                    _this.call(funcName, funcArgs, function (resp, statusCode) {
                                        reslove({ resp: resp, ret: statusCode });
                                    });
                                }));

                            case 1:
                            case "end":
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));

            function callAsync(_x, _x2) {
                return _ref.apply(this, arguments);
            }

            return callAsync;
        }()
    }]);
    return RPCClient;
}();

exports.RPCClient = RPCClient;