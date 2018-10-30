'use strict';

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var https = require("https");
var http = require('http');
var querystring = require('querystring');

var HttpsUtil = function () {
    function HttpsUtil() {
        (0, _classCallCheck3.default)(this, HttpsUtil);
    }

    (0, _createClass3.default)(HttpsUtil, [{
        key: 'sendGet',
        value: function () {
            var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(url) {
                return _regenerator2.default.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                return _context.abrupt('return', new _promise2.default(function (resolove, reject) {
                                    var result = '';
                                    https.get(url, function (res) {
                                        res.on('data', function (chunk) {
                                            result += chunk;
                                        });
                                        res.on('end', function () {
                                            resolove(result);
                                        });
                                    });
                                }));

                            case 1:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));

            function sendGet(_x) {
                return _ref.apply(this, arguments);
            }

            return sendGet;
        }()
    }, {
        key: 'sendPost',
        value: function () {
            var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(data, hostname, port, path) {
                var postData, options;
                return _regenerator2.default.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                //发送 http Post 请求  
                                postData = querystring.stringify(data);
                                options = {
                                    hostname: hostname,
                                    port: port,
                                    path: path,
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                                        'Content-Length': Buffer.byteLength(postData)
                                    }
                                };
                                return _context2.abrupt('return', new _promise2.default(function (resolove, reject) {
                                    var req = https.request(options, function (res) {
                                        console.log('Status:', res.statusCode);
                                        //console.log('headers:', JSON.stringify(res.headers));
                                        res.setEncoding('utf-8');
                                        var result = '';
                                        res.on('data', function (chun) {
                                            result += chun;
                                        });
                                        res.on('end', function () {
                                            resolove(result);
                                        });
                                    });
                                    req.on('error', function (err) {
                                        console.error(err);
                                    });
                                    req.write(postData);
                                    req.end();
                                }));

                            case 3:
                            case 'end':
                                return _context2.stop();
                        }
                    }
                }, _callee2, this);
            }));

            function sendPost(_x2, _x3, _x4, _x5) {
                return _ref2.apply(this, arguments);
            }

            return sendPost;
        }()
    }]);
    return HttpsUtil;
}();

var HttpUtil = function () {
    function HttpUtil() {
        (0, _classCallCheck3.default)(this, HttpUtil);
    }

    (0, _createClass3.default)(HttpUtil, [{
        key: 'sendGet',
        value: function () {
            var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(url, ishttps) {
                var httpsUtil, result;
                return _regenerator2.default.wrap(function _callee3$(_context3) {
                    while (1) {
                        switch (_context3.prev = _context3.next) {
                            case 0:
                                if (!ishttps) {
                                    _context3.next = 8;
                                    break;
                                }

                                httpsUtil = new HttpsUtil();
                                _context3.next = 4;
                                return httpsUtil.sendGet(url);

                            case 4:
                                result = _context3.sent;
                                return _context3.abrupt('return', result);

                            case 8:
                                return _context3.abrupt('return', new _promise2.default(function (resolove, reject) {
                                    var result = '';
                                    http.get(url, function (res) {
                                        res.on('data', function (chunk) {
                                            result += chunk;
                                        });
                                        res.on('end', function () {
                                            resolove(result);
                                        });
                                    });
                                }));

                            case 9:
                            case 'end':
                                return _context3.stop();
                        }
                    }
                }, _callee3, this);
            }));

            function sendGet(_x6, _x7) {
                return _ref3.apply(this, arguments);
            }

            return sendGet;
        }()
    }, {
        key: 'sendPost',
        value: function () {
            var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4(data, hostname, port, path, ishttps) {
                var httpsUtil, result, postData, options;
                return _regenerator2.default.wrap(function _callee4$(_context4) {
                    while (1) {
                        switch (_context4.prev = _context4.next) {
                            case 0:
                                if (!ishttps) {
                                    _context4.next = 8;
                                    break;
                                }

                                httpsUtil = new HttpsUtil();
                                _context4.next = 4;
                                return httpsUtil.sendPost(data, hostname, port, path);

                            case 4:
                                result = _context4.sent;
                                return _context4.abrupt('return', result);

                            case 8:
                                //发送 http Post 请求  
                                postData = querystring.stringify(data);
                                options = {
                                    hostname: hostname,
                                    port: port,
                                    path: path,
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                                        'Content-Length': Buffer.byteLength(postData)
                                    }
                                };
                                return _context4.abrupt('return', new _promise2.default(function (resolove, reject) {
                                    var req = http.request(options, function (res) {
                                        console.log('Status:', res.statusCode);
                                        console.log('headers:', (0, _stringify2.default)(res.headers));
                                        res.setEncoding('utf-8');
                                        var result = '';
                                        res.on('data', function (chun) {
                                            result += chun;
                                        });
                                        res.on('end', function () {
                                            resolove(result);
                                        });
                                    });
                                    req.on('error', function (err) {
                                        console.error(err);
                                    });
                                    req.write(postData);
                                    req.end();
                                }));

                            case 11:
                            case 'end':
                                return _context4.stop();
                        }
                    }
                }, _callee4, this);
            }));

            function sendPost(_x8, _x9, _x10, _x11, _x12) {
                return _ref4.apply(this, arguments);
            }

            return sendPost;
        }()
    }]);
    return HttpUtil;
}();

module.exports.HttpsUtil = HttpsUtil;
module.exports.HttpUtil = HttpUtil;