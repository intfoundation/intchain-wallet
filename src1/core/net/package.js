"use strict";

var _getIterator2 = require("babel-runtime/core-js/get-iterator");

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("babel-runtime/helpers/createClass");

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

Object.defineProperty(exports, "__esModule", { value: true });

var Package = function () {
    function Package() {
        (0, _classCallCheck3.default)(this, Package);

        this.m_header = {
            magic: Package.magic,
            version: 0,
            flags: 0,
            cmdType: 0,
            totalLength: 0,
            bodyLength: 0
        };
        this.m_body = {};
        this.m_data = [];
    }

    (0, _createClass3.default)(Package, [{
        key: "copyData",
        value: function copyData() {
            var buffer = new Buffer(this.dataLength);
            var copyStart = 0;
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = (0, _getIterator3.default)(this.data), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var data = _step.value;

                    data.copy(buffer, copyStart);
                    copyStart += data.length;
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

            return buffer;
        }
    }, {
        key: "header",
        get: function get() {
            return this.m_header;
        }
    }, {
        key: "body",
        get: function get() {
            return this.m_body;
        }
    }, {
        key: "data",
        get: function get() {
            return this.m_data;
        }
    }, {
        key: "dataLength",
        get: function get() {
            var header = this.m_header;
            return header.totalLength - Package.headerLength - header.bodyLength;
        }
    }]);
    return Package;
}();

Package.headerLength = 16;
Package.magic = 0x8083;
exports.Package = Package;