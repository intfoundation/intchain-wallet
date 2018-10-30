'use strict';

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _require = require('./crypt/account'),
    createKeyPair = _require.createKeyPair;

var _require2 = require('./crypt/crypt'),
    encrypt = _require2.encrypt,
    decrypt = _require2.decrypt;

var _require3 = require('./core/value_chain/transaction'),
    ValueTransaction = _require3.ValueTransaction;

var BigNumber = require('bignumber.js');

var _require4 = require('./core/address'),
    addressFromSecretKey = _require4.addressFromSecretKey;
//const core_1 = require("./core");


var _require5 = require('./core/lib/writer'),
    BufferWriter = _require5.BufferWriter;

var assert = require('assert');
var rlp = require('rlp');

var _require6 = require('./cfg'),
    http = _require6.http,
    getBalanceUrl = _require6.getBalanceUrl,
    getNonceUrl = _require6.getNonceUrl,
    host = _require6.host,
    port = _require6.port,
    transferUrl = _require6.transferUrl,
    getVotesUrl = _require6.getVotesUrl,
    getCandiesUrl = _require6.getCandiesUrl,
    getVoteCandiesUrl = _require6.getVoteCandiesUrl,
    getMydataUrl = _require6.getMydataUrl,
    burnIntOnEthUrl = _require6.burnIntOnEthUrl,
    queryIntOnEthUrl = _require6.queryIntOnEthUrl,
    getTokenUrl = _require6.getTokenUrl,
    getPriceUrl = _require6.getPriceUrl,
    getLimitUrl = _require6.getLimitUrl;

var Mapping = require("./mapping");
var getPrice = function () {
    var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
        var result;
        return _regenerator2.default.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        _context.next = 2;
                        return http.sendGet(getPriceUrl);

                    case 2:
                        result = _context.sent;
                        return _context.abrupt('return', result);

                    case 4:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, undefined);
    }));

    return function getPrice() {
        return _ref.apply(this, arguments);
    };
}();
var getLimit = function () {
    var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(method, input) {
        var url, result;
        return _regenerator2.default.wrap(function _callee2$(_context2) {
            while (1) {
                switch (_context2.prev = _context2.next) {
                    case 0:
                        url = getLimitUrl + '/' + method + '/' + input;
                        _context2.next = 3;
                        return http.sendGet(url);

                    case 3:
                        result = _context2.sent;
                        return _context2.abrupt('return', result);

                    case 5:
                    case 'end':
                        return _context2.stop();
                }
            }
        }, _callee2, undefined);
    }));

    return function getLimit(_x, _x2) {
        return _ref2.apply(this, arguments);
    };
}();

var makeWalletAccount = function makeWalletAccount(pwd) {
    assert(pwd, 'pwd must not empty');

    var _createKeyPair = createKeyPair(),
        _createKeyPair2 = (0, _slicedToArray3.default)(_createKeyPair, 2),
        key = _createKeyPair2[0],
        secret = _createKeyPair2[1];

    var addr = addressFromSecretKey(secret);
    var address = addr;
    var privateKey = secret.toString('hex');
    var json = encrypt(privateKey, pwd);
    var privatekey2 = decrypt(json, pwd);
    console.log(privateKey, privatekey2);
    json.address = address;
    return { json: json, privateKey: privateKey };
};

var addressFromPrivateKey = function addressFromPrivateKey(privateKey) {
    return addressFromSecretKey(new Buffer(privateKey, 'hex'));
};

var makeWalletByPrivate = function makeWalletByPrivate(privateKey, pwd) {
    var addr = addressFromSecretKey(new Buffer(privateKey, 'hex'));
    var address = addr;
    var json = encrypt(privateKey, pwd);
    json.address = address;
    return json;
};

var decodeFromOption = function decodeFromOption(option, pwd) {
    assert(option, "option must be not null");
    assert(option, "password is required");
    return new _promise2.default(function (resolve, reject) {
        var privatekey = decrypt(option, pwd);
        resolve(privatekey);
    });
};

var getBalance = function () {
    var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(address) {
        var url, result;
        return _regenerator2.default.wrap(function _callee3$(_context3) {
            while (1) {
                switch (_context3.prev = _context3.next) {
                    case 0:
                        assert(address, 'address is required.');
                        url = getBalanceUrl + address;
                        _context3.next = 4;
                        return http.sendGet(url);

                    case 4:
                        result = _context3.sent;
                        return _context3.abrupt('return', result);

                    case 6:
                    case 'end':
                        return _context3.stop();
                }
            }
        }, _callee3, undefined);
    }));

    return function getBalance(_x3) {
        return _ref3.apply(this, arguments);
    };
}();

var getVotes = function () {
    var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4(address) {
        var url, result;
        return _regenerator2.default.wrap(function _callee4$(_context4) {
            while (1) {
                switch (_context4.prev = _context4.next) {
                    case 0:
                        assert(address, 'address is required.');
                        url = getVotesUrl + address;
                        _context4.next = 4;
                        return http.sendGet(url);

                    case 4:
                        result = _context4.sent;
                        return _context4.abrupt('return', result);

                    case 6:
                    case 'end':
                        return _context4.stop();
                }
            }
        }, _callee4, undefined);
    }));

    return function getVotes(_x4) {
        return _ref4.apply(this, arguments);
    };
}();

var getNodes = function () {
    var _ref5 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee5() {
        var nodes, voteNodes, data, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, n, obj, flag, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, vn;

        return _regenerator2.default.wrap(function _callee5$(_context5) {
            while (1) {
                switch (_context5.prev = _context5.next) {
                    case 0:
                        _context5.next = 2;
                        return http.sendGet(getCandiesUrl);

                    case 2:
                        nodes = _context5.sent;

                        if (typeof nodes == 'string') {
                            nodes = JSON.parse(nodes);
                        }
                        _context5.next = 6;
                        return http.sendGet(getVoteCandiesUrl);

                    case 6:
                        voteNodes = _context5.sent;

                        if (typeof voteNodes == 'string') {
                            voteNodes = JSON.parse(voteNodes);
                        }
                        data = [];
                        _iteratorNormalCompletion = true;
                        _didIteratorError = false;
                        _iteratorError = undefined;
                        _context5.prev = 12;
                        _iterator = (0, _getIterator3.default)(nodes);

                    case 14:
                        if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
                            _context5.next = 41;
                            break;
                        }

                        n = _step.value;
                        obj = {};
                        flag = true;
                        _iteratorNormalCompletion2 = true;
                        _didIteratorError2 = false;
                        _iteratorError2 = undefined;
                        _context5.prev = 21;

                        for (_iterator2 = (0, _getIterator3.default)(voteNodes); !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                            vn = _step2.value;

                            if (vn[0] == n) {
                                obj.node = vn[0];
                                obj.num = vn[1];
                                data = [obj].concat((0, _toConsumableArray3.default)(data));
                                flag = false;
                            }
                        }
                        _context5.next = 29;
                        break;

                    case 25:
                        _context5.prev = 25;
                        _context5.t0 = _context5['catch'](21);
                        _didIteratorError2 = true;
                        _iteratorError2 = _context5.t0;

                    case 29:
                        _context5.prev = 29;
                        _context5.prev = 30;

                        if (!_iteratorNormalCompletion2 && _iterator2.return) {
                            _iterator2.return();
                        }

                    case 32:
                        _context5.prev = 32;

                        if (!_didIteratorError2) {
                            _context5.next = 35;
                            break;
                        }

                        throw _iteratorError2;

                    case 35:
                        return _context5.finish(32);

                    case 36:
                        return _context5.finish(29);

                    case 37:
                        if (flag) {
                            obj.node = n;
                            obj.num = 0;
                            data.push(obj);
                        }

                    case 38:
                        _iteratorNormalCompletion = true;
                        _context5.next = 14;
                        break;

                    case 41:
                        _context5.next = 47;
                        break;

                    case 43:
                        _context5.prev = 43;
                        _context5.t1 = _context5['catch'](12);
                        _didIteratorError = true;
                        _iteratorError = _context5.t1;

                    case 47:
                        _context5.prev = 47;
                        _context5.prev = 48;

                        if (!_iteratorNormalCompletion && _iterator.return) {
                            _iterator.return();
                        }

                    case 50:
                        _context5.prev = 50;

                        if (!_didIteratorError) {
                            _context5.next = 53;
                            break;
                        }

                        throw _iteratorError;

                    case 53:
                        return _context5.finish(50);

                    case 54:
                        return _context5.finish(47);

                    case 55:
                        return _context5.abrupt('return', data);

                    case 56:
                    case 'end':
                        return _context5.stop();
                }
            }
        }, _callee5, undefined, [[12, 43, 47, 55], [21, 25, 29, 37], [30,, 32, 36], [48,, 50, 54]]);
    }));

    return function getNodes() {
        return _ref5.apply(this, arguments);
    };
}();
var vote = function () {
    var _ref6 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee6(candidates, limit, price, secret) {
        var address, url, result, _JSON$parse, err, nonce, tx, writer, er, render, encodeRender, renderStr;

        return _regenerator2.default.wrap(function _callee6$(_context6) {
            while (1) {
                switch (_context6.prev = _context6.next) {
                    case 0:
                        assert(candidates, 'candidates is required.');
                        assert(limit, 'fee is required.');
                        assert(price, 'price is required.');
                        assert(secret, 'secret is required.');
                        address = addressFromSecretKey(secret);
                        url = getNonceUrl + address;
                        _context6.next = 8;
                        return http.sendGet(url);

                    case 8:
                        result = _context6.sent;
                        _JSON$parse = JSON.parse(result), err = _JSON$parse.err, nonce = _JSON$parse.nonce;

                        if (!err) {
                            _context6.next = 12;
                            break;
                        }

                        return _context6.abrupt('return', { err: 'mortgage getNonce failed for ' + err });

                    case 12:
                        tx = new ValueTransaction();

                        tx.method = 'vote';
                        tx.limit = new BigNumber(limit);
                        tx.price = new BigNumber(price * Math.pow(10, 18));
                        tx.input = candidates;
                        tx.nonce = nonce + 1;
                        tx.sign(secret);

                        writer = new BufferWriter();
                        er = tx.encode(writer);

                        if (!er) {
                            _context6.next = 23;
                            break;
                        }

                        return _context6.abrupt('return', { err: er });

                    case 23:
                        render = writer.render();
                        encodeRender = rlp.encode(render);
                        renderStr = encodeRender.toString('hex');
                        return _context6.abrupt('return', {
                            info: {
                                Method: tx.method,
                                'Gas limit': tx.limit,
                                'Gas price': price,
                                Fee: tx.limit * price + ' INT',
                                Input: (0, _stringify2.default)(tx.input),
                                Nonce: tx.nonce
                            },
                            renderStr: renderStr,
                            hash: tx.m_hash
                            //let mortgageResult = await http.sendPost({ renderStr: renderStr }, host, port, transferUrl)
                            //return mortgageResult
                        });

                    case 27:
                    case 'end':
                        return _context6.stop();
                }
            }
        }, _callee6, undefined);
    }));

    return function vote(_x5, _x6, _x7, _x8) {
        return _ref6.apply(this, arguments);
    };
}();

var mortgage = function () {
    var _ref7 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee7(amount, limit, price, secret) {
        var address, url, result, _JSON$parse2, err, nonce, tx, writer, er, render, encodeRender, renderStr;

        return _regenerator2.default.wrap(function _callee7$(_context7) {
            while (1) {
                switch (_context7.prev = _context7.next) {
                    case 0:
                        assert(amount, 'amount is required.');
                        assert(limit, 'fee is required.');
                        assert(price, 'price is required.');
                        assert(secret, 'secret is required.');
                        address = addressFromSecretKey(secret);
                        url = getNonceUrl + address;
                        _context7.next = 8;
                        return http.sendGet(url);

                    case 8:
                        result = _context7.sent;
                        _JSON$parse2 = JSON.parse(result), err = _JSON$parse2.err, nonce = _JSON$parse2.nonce;

                        if (!err) {
                            _context7.next = 12;
                            break;
                        }

                        return _context7.abrupt('return', { err: 'mortgage getNonce failed for ' + err });

                    case 12:
                        tx = new ValueTransaction();

                        tx.method = 'mortgage';
                        tx.limit = new BigNumber(limit);
                        tx.price = new BigNumber(price * Math.pow(10, 18));
                        tx.value = new BigNumber(amount * Math.pow(10, 18));
                        tx.input = new BigNumber(amount * Math.pow(10, 18));
                        tx.nonce = nonce + 1;
                        tx.sign(secret);

                        writer = new BufferWriter();
                        er = tx.encode(writer);

                        if (!er) {
                            _context7.next = 24;
                            break;
                        }

                        return _context7.abrupt('return', { err: er });

                    case 24:
                        render = writer.render();
                        encodeRender = rlp.encode(render);
                        renderStr = encodeRender.toString('hex');
                        return _context7.abrupt('return', {
                            info: {
                                Method: tx.method,
                                Amount: amount + ' INT',
                                'Gas limit': tx.limit,
                                'Gas price': price,
                                Fee: tx.limit * price + ' INT',
                                Input: (0, _stringify2.default)(tx.input),
                                Nonce: tx.nonce
                            },
                            renderStr: renderStr,
                            hash: tx.m_hash
                            //let mortgageResult = await http.sendPost({ renderStr: renderStr }, host, port, transferUrl)
                            //return mortgageResult
                        });

                    case 28:
                    case 'end':
                        return _context7.stop();
                }
            }
        }, _callee7, undefined);
    }));

    return function mortgage(_x9, _x10, _x11, _x12) {
        return _ref7.apply(this, arguments);
    };
}();

var unmortgage = function () {
    var _ref8 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee8(amount, limit, price, secret) {
        var address, url, result, _JSON$parse3, err, nonce, tx, writer, er, render, encodeRender, renderStr;

        return _regenerator2.default.wrap(function _callee8$(_context8) {
            while (1) {
                switch (_context8.prev = _context8.next) {
                    case 0:
                        assert(amount, 'amount is required.');
                        assert(limit, 'fee is required.');
                        assert(price, 'price is required.');
                        assert(secret, 'secret is required.');
                        address = addressFromSecretKey(secret);
                        url = getNonceUrl + address;
                        _context8.next = 8;
                        return http.sendGet(url);

                    case 8:
                        result = _context8.sent;
                        _JSON$parse3 = JSON.parse(result), err = _JSON$parse3.err, nonce = _JSON$parse3.nonce;

                        if (!err) {
                            _context8.next = 12;
                            break;
                        }

                        return _context8.abrupt('return', { err: 'unmortgage getNonce failed for ' + err });

                    case 12:
                        tx = new ValueTransaction();

                        tx.method = 'unmortgage';
                        tx.limit = new BigNumber(limit);
                        tx.price = new BigNumber(price * Math.pow(10, 18));
                        tx.value = new BigNumber(amount * Math.pow(10, 18));
                        tx.input = new BigNumber(amount * Math.pow(10, 18));
                        tx.nonce = nonce + 1;
                        tx.sign(secret);

                        writer = new BufferWriter();
                        er = tx.encode(writer);

                        if (!er) {
                            _context8.next = 24;
                            break;
                        }

                        return _context8.abrupt('return', { err: er });

                    case 24:
                        render = writer.render();
                        encodeRender = rlp.encode(render);
                        renderStr = encodeRender.toString('hex');
                        return _context8.abrupt('return', {
                            info: {
                                Method: tx.method,
                                Amount: amount + ' INT',
                                'Gas limit': tx.limit,
                                'Gas price': price,
                                Fee: tx.limit * price + ' INT',
                                Input: (0, _stringify2.default)(tx.input),
                                Nonce: tx.nonce
                            },
                            renderStr: renderStr,
                            hash: tx.m_hash
                            //let mortgageResult = await http.sendPost({ renderStr: renderStr }, host, port, transferUrl)
                            //return mortgageResult
                        });

                    case 28:
                    case 'end':
                        return _context8.stop();
                }
            }
        }, _callee8, undefined);
    }));

    return function unmortgage(_x13, _x14, _x15, _x16) {
        return _ref8.apply(this, arguments);
    };
}();

var transfer = function () {
    var _ref9 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee9(amount, limit, price, to, secret) {
        var address, url, result, _JSON$parse4, err, nonce, tx, writer, er, render, encodeRender, renderStr;

        return _regenerator2.default.wrap(function _callee9$(_context9) {
            while (1) {
                switch (_context9.prev = _context9.next) {
                    case 0:
                        assert(amount, 'amount is required.');
                        assert(limit, 'limit is required.');
                        assert(price, 'price is required.');
                        assert(to, 'to is required.');
                        assert(secret, 'secret is required.');
                        address = addressFromSecretKey(secret);
                        url = getNonceUrl + address;
                        _context9.next = 9;
                        return http.sendGet(url);

                    case 9:
                        result = _context9.sent;
                        _JSON$parse4 = JSON.parse(result), err = _JSON$parse4.err, nonce = _JSON$parse4.nonce;

                        if (!err) {
                            _context9.next = 13;
                            break;
                        }

                        return _context9.abrupt('return', { err: 'transferTo getNonce failed for ' + err });

                    case 13:
                        tx = new ValueTransaction();

                        tx.method = 'transferTo';
                        tx.value = new BigNumber(amount * Math.pow(10, 18));
                        tx.limit = new BigNumber(limit);
                        tx.price = new BigNumber(price * Math.pow(10, 18));
                        tx.input = { to: to };
                        tx.nonce = nonce + 1;
                        tx.sign(secret);

                        writer = new BufferWriter();
                        er = tx.encode(writer);

                        if (!er) {
                            _context9.next = 25;
                            break;
                        }

                        return _context9.abrupt('return', { err: er });

                    case 25:
                        render = writer.render();
                        encodeRender = rlp.encode(render);
                        renderStr = encodeRender.toString('hex');
                        return _context9.abrupt('return', {
                            info: {
                                Method: tx.method,
                                Amount: amount + ' INT',
                                'Gas limit': tx.limit,
                                'Gas price': price,
                                Fee: tx.limit * price + ' INT',
                                Input: (0, _stringify2.default)(tx.input),
                                Nonce: tx.nonce
                            },
                            renderStr: renderStr,
                            hash: tx.m_hash
                        });

                    case 29:
                    case 'end':
                        return _context9.stop();
                }
            }
        }, _callee9, undefined);
    }));

    return function transfer(_x17, _x18, _x19, _x20, _x21) {
        return _ref9.apply(this, arguments);
    };
}();

var burnIntOnEth = function () {
    var _ref10 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee10(options) {
        var url, result, parseResult, data;
        return _regenerator2.default.wrap(function _callee10$(_context10) {
            while (1) {
                switch (_context10.prev = _context10.next) {
                    case 0:
                        url = getMydataUrl + options.decimalAmount + "/" + options.fromAddress;
                        _context10.next = 3;
                        return http.sendGet(url);

                    case 3:
                        result = _context10.sent;
                        parseResult = JSON.parse(result);

                        options.mydata = parseResult.mydata;
                        options.mynonce = parseResult.mynonce;
                        options.transferData = parseResult.transferData;
                        options.TOADDRESS = parseResult.TOADDRESS;
                        _context10.next = 11;
                        return Mapping.getSerializedTx(options);

                    case 11:
                        data = _context10.sent;
                        return _context10.abrupt('return', data);

                    case 13:
                    case 'end':
                        return _context10.stop();
                }
            }
        }, _callee10, undefined);
    }));

    return function burnIntOnEth(_x22) {
        return _ref10.apply(this, arguments);
    };
}();

var sendBurn = function () {
    var _ref11 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee11(data) {
        var result;
        return _regenerator2.default.wrap(function _callee11$(_context11) {
            while (1) {
                switch (_context11.prev = _context11.next) {
                    case 0:
                        _context11.next = 2;
                        return http.sendPost(data, host, port, burnIntOnEthUrl);

                    case 2:
                        result = _context11.sent;
                        return _context11.abrupt('return', JSON.parse(result));

                    case 4:
                    case 'end':
                        return _context11.stop();
                }
            }
        }, _callee11, undefined);
    }));

    return function sendBurn(_x23) {
        return _ref11.apply(this, arguments);
    };
}();
var queryBalance = function () {
    var _ref12 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee12(address) {
        var url, result;
        return _regenerator2.default.wrap(function _callee12$(_context12) {
            while (1) {
                switch (_context12.prev = _context12.next) {
                    case 0:
                        url = queryIntOnEthUrl + address;
                        _context12.next = 3;
                        return http.sendGet(url);

                    case 3:
                        result = _context12.sent;
                        return _context12.abrupt('return', JSON.parse(result));

                    case 5:
                    case 'end':
                        return _context12.stop();
                }
            }
        }, _callee12, undefined);
    }));

    return function queryBalance(_x24) {
        return _ref12.apply(this, arguments);
    };
}();
var sendSignedTransaction = function () {
    var _ref13 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee13(renderStr) {
        var result;
        return _regenerator2.default.wrap(function _callee13$(_context13) {
            while (1) {
                switch (_context13.prev = _context13.next) {
                    case 0:
                        _context13.next = 2;
                        return http.sendPost({ renderStr: renderStr }, host, port, transferUrl);

                    case 2:
                        result = _context13.sent;
                        return _context13.abrupt('return', result);

                    case 4:
                    case 'end':
                        return _context13.stop();
                }
            }
        }, _callee13, undefined);
    }));

    return function sendSignedTransaction(_x25) {
        return _ref13.apply(this, arguments);
    };
}();

var getToken = function () {
    var _ref14 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee14(address) {
        var url, result;
        return _regenerator2.default.wrap(function _callee14$(_context14) {
            while (1) {
                switch (_context14.prev = _context14.next) {
                    case 0:
                        url = getTokenUrl + 'address=' + address + '&pageSize=10000&source=wallet';
                        _context14.next = 3;
                        return http.sendGet(url);

                    case 3:
                        result = _context14.sent;
                        return _context14.abrupt('return', JSON.parse(result));

                    case 5:
                    case 'end':
                        return _context14.stop();
                }
            }
        }, _callee14, undefined);
    }));

    return function getToken(_x26) {
        return _ref14.apply(this, arguments);
    };
}();
module.exports = {
    getBalance: getBalance,
    transfer: transfer,
    makeWalletAccount: makeWalletAccount,
    decodeFromOption: decodeFromOption,
    getVotes: getVotes,
    mortgage: mortgage,
    unmortgage: unmortgage,
    vote: vote,
    getNodes: getNodes,
    burnIntOnEth: burnIntOnEth,
    queryBalance: queryBalance,
    sendSignedTransaction: sendSignedTransaction,
    getToken: getToken,
    addressFromPrivateKey: addressFromPrivateKey,
    makeWalletByPrivate: makeWalletByPrivate,
    sendBurn: sendBurn,
    BigNumber: BigNumber,
    getPrice: getPrice,
    getLimit: getLimit

    //transfer(2, 3, '1F9hNoR4xhPeqEcvjQ1qt7hLrdZhAQepcm', 'a86f164acf7eaff87c12c0dae926506a9ba31cd2f68f0d55f96a1b891b961d02')
    //mortgage(100, 2, 'a86f164acf7eaff87c12c0dae926506a9ba31cd2f68f0d55f96a1b891b961d02')
    //getVotes('1CHpy1NayZHXxLe21LuzpTMLSs32Xk9D1K')

};