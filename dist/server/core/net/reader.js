"use strict";

var _getIterator2 = require("babel-runtime/core-js/get-iterator");

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _toConsumableArray2 = require("babel-runtime/helpers/toConsumableArray");

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _assign = require("babel-runtime/core-js/object/assign");

var _assign2 = _interopRequireDefault(_assign);

var _setImmediate2 = require("babel-runtime/core-js/set-immediate");

var _setImmediate3 = _interopRequireDefault(_setImmediate2);

var _getPrototypeOf = require("babel-runtime/core-js/object/get-prototype-of");

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("babel-runtime/helpers/createClass");

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require("babel-runtime/helpers/possibleConstructorReturn");

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require("babel-runtime/helpers/inherits");

var _inherits3 = _interopRequireDefault(_inherits2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

Object.defineProperty(exports, "__esModule", { value: true });
var package_1 = require("./package");
var events_1 = require("events");
var error_code_1 = require("../error_code");
var msgpack = require('msgpack-lite');
var assert = require('assert');
var READER_STATE;
(function (READER_STATE) {
    READER_STATE[READER_STATE["error"] = -1] = "error";
    READER_STATE[READER_STATE["wait"] = 0] = "wait";
    READER_STATE[READER_STATE["header"] = 1] = "header";
    READER_STATE[READER_STATE["body"] = 2] = "body";
    READER_STATE[READER_STATE["data"] = 3] = "data";
})(READER_STATE || (READER_STATE = {}));
var READER_EVENT;
(function (READER_EVENT) {
    READER_EVENT["error"] = "error";
    READER_EVENT["pkg"] = "pkg";
})(READER_EVENT = exports.READER_EVENT || (exports.READER_EVENT = {}));

var PackageStreamReader = function (_events_1$EventEmitte) {
    (0, _inherits3.default)(PackageStreamReader, _events_1$EventEmitte);

    function PackageStreamReader() {
        (0, _classCallCheck3.default)(this, PackageStreamReader);

        var _this = (0, _possibleConstructorReturn3.default)(this, (PackageStreamReader.__proto__ || (0, _getPrototypeOf2.default)(PackageStreamReader)).call(this));

        _this.m_stateInfo = {
            state: READER_STATE.wait,
            pkg: new package_1.Package(),
            pendingLength: 0,
            pending: []
        };
        _this.m_connection = null;
        _this.m_dataListener = function (buffers) {
            var stateInfo = _this.m_stateInfo;
            if (stateInfo.state === READER_STATE.wait) {
                stateInfo.pkg = new package_1.Package();
                stateInfo.pending = [];
                stateInfo.state = READER_STATE.header;
                stateInfo.pendingLength = 0;
            }
            _this._pushPending(buffers);
            do {
                if (stateInfo.state === READER_STATE.wait) {
                    stateInfo.pkg = new package_1.Package();
                    stateInfo.state = READER_STATE.header;
                }
                if (stateInfo.state === READER_STATE.header) {
                    var headerBuffers = _this._popPending(package_1.Package.headerLength);
                    if (!headerBuffers) {
                        break;
                    }
                    var headerBuffer = Buffer.concat(headerBuffers);
                    var header = stateInfo.pkg.header;
                    var offset = 0;
                    header.magic = headerBuffer.readUInt16BE(offset);
                    offset += 2;
                    if (header.magic !== package_1.Package.magic) {
                        stateInfo.state = READER_STATE.error;
                        (0, _setImmediate3.default)(function () {
                            return _this.emit('error', error_code_1.ErrorCode.RESULT_PARSE_ERROR, 'magic' // 标记一下触发error的字段
                            );
                        });
                    }
                    header.version = headerBuffer.readUInt16BE(offset);
                    offset += 2;
                    header.flags = headerBuffer.readUInt16BE(offset);
                    offset += 2;
                    header.cmdType = headerBuffer.readUInt16BE(offset);
                    offset += 2;
                    header.totalLength = headerBuffer.readUInt32BE(offset);
                    offset += 4;
                    header.bodyLength = headerBuffer.readUInt32BE(offset);
                    offset += 4;
                    stateInfo.state = READER_STATE.body;
                }
                if (stateInfo.state === READER_STATE.body) {
                    if (stateInfo.pkg.header.bodyLength) {
                        var bodyBuffers = _this._popPending(stateInfo.pkg.header.bodyLength);
                        if (!bodyBuffers) {
                            break;
                        }
                        var bodyBuffer = Buffer.concat(bodyBuffers);
                        (0, _assign2.default)(stateInfo.pkg.body, msgpack.decode(bodyBuffer));
                    }
                    stateInfo.state = READER_STATE.data;
                }
                if (stateInfo.state === READER_STATE.data) {
                    var _ret = function () {
                        var pkg = void 0;
                        if (stateInfo.pkg.dataLength) {
                            var _stateInfo$pkg$data;

                            var dataBuffers = _this._popPending(stateInfo.pkg.dataLength);
                            if (!dataBuffers) {
                                return "break";
                            }
                            (_stateInfo$pkg$data = stateInfo.pkg.data).push.apply(_stateInfo$pkg$data, (0, _toConsumableArray3.default)(dataBuffers));
                            pkg = stateInfo.pkg;
                        } else {
                            pkg = stateInfo.pkg;
                        }
                        stateInfo.state = READER_STATE.wait;
                        if (pkg) {
                            pkg.data[0] = Buffer.concat(pkg.data);
                            (0, _setImmediate3.default)(function () {
                                _this.emit(READER_EVENT.pkg, pkg);
                            });
                        }
                    }();

                    if (_ret === "break") break;
                }
            } while (stateInfo.pendingLength);
        };
        return _this;
    }

    (0, _createClass3.default)(PackageStreamReader, [{
        key: "_clearPending",
        value: function _clearPending() {
            this.m_stateInfo.pendingLength = 0;
            this.m_stateInfo.pending = [];
        }
    }, {
        key: "_popPending",
        value: function _popPending(length) {
            var stateInfo = this.m_stateInfo;
            if (length > stateInfo.pendingLength) {
                return null;
            }
            var next = length;
            var spliceTo = 0;
            var popLast = null;
            for (; spliceTo < stateInfo.pending.length; ++spliceTo) {
                var buffer = stateInfo.pending[spliceTo];
                if (buffer.length === next) {
                    spliceTo += 1;
                    break;
                } else if (buffer.length > next) {
                    popLast = Buffer.from(buffer.buffer, buffer.offset, next);
                    stateInfo.pending[spliceTo] = Buffer.from(buffer.buffer, buffer.offset + next, buffer.length - next);
                    break;
                } else {
                    next -= buffer.length;
                }
            }
            var pop = stateInfo.pending.splice(0, spliceTo);
            if (popLast) {
                pop.push(popLast);
            }
            stateInfo.pendingLength -= length;
            return pop;
        }
    }, {
        key: "_pushPending",
        value: function _pushPending(buffers) {
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = (0, _getIterator3.default)(buffers), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var buffer = _step.value;

                    this.m_stateInfo.pending.push(buffer);
                    this.m_stateInfo.pendingLength += buffer.length;
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
        }
    }, {
        key: "start",
        value: function start(connection) {
            if (this.m_connection) {
                return;
            }
            this.m_connection = connection;
            this.m_connection.on('data', this.m_dataListener);
        }
    }, {
        key: "stop",
        value: function stop() {
            if (this.m_connection) {
                this.m_connection.removeListener('data', this.m_dataListener);
                this.m_connection = null;
            }
        }
    }, {
        key: "close",
        value: function close() {
            this.stop();
        }
    }]);
    return PackageStreamReader;
}(events_1.EventEmitter);

exports.PackageStreamReader = PackageStreamReader;