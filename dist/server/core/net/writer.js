"use strict";

var _regenerator = require("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _setImmediate2 = require("babel-runtime/core-js/set-immediate");

var _setImmediate3 = _interopRequireDefault(_setImmediate2);

var _asyncToGenerator2 = require("babel-runtime/helpers/asyncToGenerator");

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _getIterator2 = require("babel-runtime/core-js/get-iterator");

var _getIterator3 = _interopRequireDefault(_getIterator2);

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
var msgpack = require('msgpack-lite');
var assert = require('assert');
var WRITER_EVENT;
(function (WRITER_EVENT) {
    WRITER_EVENT["error"] = "error";
    WRITER_EVENT["finish"] = "finish";
})(WRITER_EVENT = exports.WRITER_EVENT || (exports.WRITER_EVENT = {}));

var PackageStreamWriter = function (_events_1$EventEmitte) {
    (0, _inherits3.default)(PackageStreamWriter, _events_1$EventEmitte);

    function PackageStreamWriter() {
        (0, _classCallCheck3.default)(this, PackageStreamWriter);

        var _this = (0, _possibleConstructorReturn3.default)(this, (PackageStreamWriter.__proto__ || (0, _getPrototypeOf2.default)(PackageStreamWriter)).call(this));

        _this.m_pending = [];
        _this.m_toSendLength = 0;
        _this.m_writtenLength = 0;
        _this.m_sentLength = 0;
        return _this;
    }

    (0, _createClass3.default)(PackageStreamWriter, [{
        key: "bind",
        value: function bind(connection) {
            assert(!this.m_connection);
            if (this.m_connection) {
                return this;
            }
            this.m_connection = connection;
            this._doSend();
            return this;
        }
    }, {
        key: "clone",
        value: function clone() {
            var writer = new PackageStreamWriter();
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = (0, _getIterator3.default)(this.m_pending), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var buf = _step.value;

                    var _buf = buf;
                    writer.m_pending.push(Buffer.from(_buf.buffer, _buf.offset, _buf.length));
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

            writer.m_toSendLength = this.m_toSendLength;
            writer.m_writtenLength = 0;
            writer.m_sentLength = 0;
            writer.m_drainListener = undefined;
            return writer;
        }
    }, {
        key: "writeData",
        value: function writeData(buffer) {
            if (!buffer.length) {
                return this;
            }
            if (this.m_writtenLength + buffer.length > this.m_toSendLength) {
                return this;
            }
            this.m_writtenLength += buffer.length;
            this.m_pending.push(buffer);
            this._doSend();
            return this;
        }
    }, {
        key: "_doSend",
        value: function () {
            var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
                var _this2 = this;

                var spliceTo, buffer, sent;
                return _regenerator2.default.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                if (this.m_connection) {
                                    _context.next = 2;
                                    break;
                                }

                                return _context.abrupt("return");

                            case 2:
                                if (!this.m_drainListener) {
                                    _context.next = 4;
                                    break;
                                }

                                return _context.abrupt("return");

                            case 4:
                                spliceTo = 0;

                            case 5:
                                if (!(spliceTo < this.m_pending.length)) {
                                    _context.next = 18;
                                    break;
                                }

                                buffer = this.m_pending[spliceTo];
                                sent = this.m_connection.send(buffer);

                                this.m_sentLength += sent;

                                if (!(sent < buffer.length)) {
                                    _context.next = 15;
                                    break;
                                }

                                assert(!this.m_drainListener);
                                this.m_drainListener = function () {
                                    _this2.m_drainListener = undefined;
                                    _this2._doSend();
                                };
                                this.m_pending[spliceTo] = Buffer.from(buffer.buffer, buffer.offset + sent, buffer.length - sent);
                                this.m_connection.once('drain', this.m_drainListener);
                                return _context.abrupt("break", 18);

                            case 15:
                                ++spliceTo;
                                _context.next = 5;
                                break;

                            case 18:
                                this.m_pending.splice(0, spliceTo);
                                assert(this.m_sentLength <= this.m_toSendLength);
                                if (this.m_sentLength === this.m_toSendLength) {
                                    (0, _setImmediate3.default)(function () {
                                        _this2.emit(WRITER_EVENT.finish);
                                    });
                                }

                            case 21:
                            case "end":
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));

            function _doSend() {
                return _ref.apply(this, arguments);
            }

            return _doSend;
        }()
    }, {
        key: "close",
        value: function close() {
            if (this.m_connection && this.m_drainListener) {
                this.m_connection.removeListener('drain', this.m_drainListener);
            }
            this.removeAllListeners(WRITER_EVENT.finish);
            this.removeAllListeners(WRITER_EVENT.error);
            this.m_connection = undefined;
            this.m_drainListener = undefined;
            return;
        }
    }], [{
        key: "fromPackage",
        value: function fromPackage(cmdType, body) {
            var dataLength = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

            var writer = new PackageStreamWriter();
            var writeHeader = {
                version: 0,
                magic: package_1.Package.magic,
                flags: 0,
                bodyLength: 0,
                totalLength: 0,
                cmdType: cmdType
            };
            var bodyBuffer = null;
            writeHeader.bodyLength = 0;
            if (body) {
                bodyBuffer = msgpack.encode(body);
                writeHeader.bodyLength = bodyBuffer.length;
            }
            writeHeader.totalLength = package_1.Package.headerLength + writeHeader.bodyLength + dataLength;
            var headerBuffer = Buffer.alloc(package_1.Package.headerLength);
            var offset = 0;
            offset = headerBuffer.writeUInt16BE(writeHeader.magic, offset);
            offset = headerBuffer.writeUInt16BE(writeHeader.version, offset);
            offset = headerBuffer.writeUInt16BE(writeHeader.flags, offset);
            offset = headerBuffer.writeUInt16BE(writeHeader.cmdType, offset);
            offset = headerBuffer.writeUInt32BE(writeHeader.totalLength, offset);
            offset = headerBuffer.writeUInt32BE(writeHeader.bodyLength, offset);
            writer.m_toSendLength = writeHeader.totalLength;
            writer.m_writtenLength = package_1.Package.headerLength + writeHeader.bodyLength;
            writer.m_pending.push(headerBuffer);
            if (bodyBuffer) {
                writer.m_pending.push(bodyBuffer);
            }
            return writer;
        }
    }]);
    return PackageStreamWriter;
}(events_1.EventEmitter);

exports.PackageStreamWriter = PackageStreamWriter;