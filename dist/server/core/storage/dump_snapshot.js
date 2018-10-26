"use strict";

var _regenerator = require("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require("babel-runtime/helpers/asyncToGenerator");

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("babel-runtime/helpers/createClass");

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs-extra");
var error_code_1 = require("../error_code");
var digest = require('../lib/digest');

var StorageDumpSnapshot = function () {
    function StorageDumpSnapshot(blockHash, filePath) {
        (0, _classCallCheck3.default)(this, StorageDumpSnapshot);

        this.m_blockHash = blockHash;
        this.m_filePath = filePath;
    }

    (0, _createClass3.default)(StorageDumpSnapshot, [{
        key: "exists",
        value: function exists() {
            return fs.existsSync(this.m_filePath);
        }
    }, {
        key: "messageDigest",
        value: function () {
            var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
                var buf, hash;
                return _regenerator2.default.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                _context.next = 2;
                                return fs.readFile(this.m_filePath);

                            case 2:
                                buf = _context.sent;
                                hash = digest.hash256(buf).toString('hex');
                                return _context.abrupt("return", { err: error_code_1.ErrorCode.RESULT_OK, value: hash });

                            case 5:
                            case "end":
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));

            function messageDigest() {
                return _ref.apply(this, arguments);
            }

            return messageDigest;
        }()
    }, {
        key: "remove",
        value: function remove() {
            if (fs.existsSync(this.filePath)) {
                fs.removeSync(this.filePath);
                return error_code_1.ErrorCode.RESULT_OK;
            }
            return error_code_1.ErrorCode.RESULT_NOT_FOUND;
        }
    }, {
        key: "blockHash",
        get: function get() {
            return this.m_blockHash;
        }
    }, {
        key: "filePath",
        get: function get() {
            return this.m_filePath;
        }
    }]);
    return StorageDumpSnapshot;
}();

exports.StorageDumpSnapshot = StorageDumpSnapshot;