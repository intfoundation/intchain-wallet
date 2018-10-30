"use strict";

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("babel-runtime/helpers/createClass");

var _createClass3 = _interopRequireDefault(_createClass2);

var _create = require("babel-runtime/core-js/object/create");

var _create2 = _interopRequireDefault(_create);

var _keys = require("babel-runtime/core-js/object/keys");

var _keys2 = _interopRequireDefault(_keys);

var _set = require("babel-runtime/core-js/set");

var _set2 = _interopRequireDefault(_set);

var _slicedToArray2 = require("babel-runtime/helpers/slicedToArray");

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _getIterator2 = require("babel-runtime/core-js/get-iterator");

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _map = require("babel-runtime/core-js/map");

var _map2 = _interopRequireDefault(_map);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

Object.defineProperty(exports, "__esModule", { value: true });
var writer_1 = require("./lib/writer");
var writer_2 = require("./lib/writer");
exports.BufferWriter = writer_2.BufferWriter;
var reader_1 = require("./lib/reader");
exports.BufferReader = reader_1.BufferReader;
var error_code_1 = require("./error_code");
var error_code_2 = require("./error_code");
exports.ErrorCode = error_code_2.ErrorCode;
var encoding_1 = require("./lib/encoding");
var digest = require("./lib/digest");
var bignumber_js_1 = require("bignumber.js");
var util_1 = require("util");
function MapToObject(input) {
    if (!(input instanceof _map2.default)) {
        throw new Error('input MUST be a Map');
    }
    var ret = {};
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = (0, _getIterator3.default)(input), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var _step$value = (0, _slicedToArray3.default)(_step.value, 2),
                k = _step$value[0],
                v = _step$value[1];

            if (!util_1.isString(k)) {
                throw new Error('input Map`s key MUST be string');
            }
            ret[k] = v;
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

    return ret;
}
exports.MapToObject = MapToObject;
function SetToArray(input) {
    if (!(input instanceof _set2.default)) {
        throw new Error('input MUST be a Set');
    }
    var ret = new Array();
    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
        for (var _iterator2 = (0, _getIterator3.default)(input), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var item = _step2.value;

            ret.push(item);
        }
    } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion2 && _iterator2.return) {
                _iterator2.return();
            }
        } finally {
            if (_didIteratorError2) {
                throw _iteratorError2;
            }
        }
    }

    return ret;
}
exports.SetToArray = SetToArray;
function SetFromObject(input) {
    if (!util_1.isObject(input)) {
        throw new Error('input MUST be a Object');
    }
    var ret = new _set2.default();
    do {
        var item = input.shift();
        ret.add(item);
    } while (input.length > 0);
    return ret;
}
exports.SetFromObject = SetFromObject;
function MapFromObject(input) {
    if (!util_1.isObject(input)) {
        throw new Error('input MUST be a Object');
    }
    var ret = new _map2.default();
    var _iteratorNormalCompletion3 = true;
    var _didIteratorError3 = false;
    var _iteratorError3 = undefined;

    try {
        for (var _iterator3 = (0, _getIterator3.default)((0, _keys2.default)(input)), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
            var k = _step3.value;

            ret.set(k, input[k]);
        }
    } catch (err) {
        _didIteratorError3 = true;
        _iteratorError3 = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion3 && _iterator3.return) {
                _iterator3.return();
            }
        } finally {
            if (_didIteratorError3) {
                throw _iteratorError3;
            }
        }
    }

    return ret;
}
exports.MapFromObject = MapFromObject;
function deepCopy(o) {
    if (util_1.isUndefined(o) || util_1.isNull(o)) {
        return o;
    } else if (util_1.isNumber(o) || util_1.isBoolean(o)) {
        return o;
    } else if (util_1.isString(o)) {
        return o;
    } else if (o instanceof bignumber_js_1.BigNumber) {
        return new bignumber_js_1.BigNumber(o);
    } else if (util_1.isBuffer(o)) {
        return Buffer.from(o);
    } else if (util_1.isArray(o) || o instanceof Array) {
        var s = [];
        var _iteratorNormalCompletion4 = true;
        var _didIteratorError4 = false;
        var _iteratorError4 = undefined;

        try {
            for (var _iterator4 = (0, _getIterator3.default)(o), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                var e = _step4.value;

                s.push(deepCopy(e));
            }
        } catch (err) {
            _didIteratorError4 = true;
            _iteratorError4 = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion4 && _iterator4.return) {
                    _iterator4.return();
                }
            } finally {
                if (_didIteratorError4) {
                    throw _iteratorError4;
                }
            }
        }

        return s;
    } else if (o instanceof _map2.default) {
        var _s = new _map2.default();
        var _iteratorNormalCompletion5 = true;
        var _didIteratorError5 = false;
        var _iteratorError5 = undefined;

        try {
            for (var _iterator5 = (0, _getIterator3.default)(o.keys()), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
                var k = _step5.value;

                _s.set(k, deepCopy(o.get(k)));
            }
        } catch (err) {
            _didIteratorError5 = true;
            _iteratorError5 = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion5 && _iterator5.return) {
                    _iterator5.return();
                }
            } finally {
                if (_didIteratorError5) {
                    throw _iteratorError5;
                }
            }
        }

        return _s;
    } else if (util_1.isObject(o)) {
        var _s2 = (0, _create2.default)(null);
        var _iteratorNormalCompletion6 = true;
        var _didIteratorError6 = false;
        var _iteratorError6 = undefined;

        try {
            for (var _iterator6 = (0, _getIterator3.default)((0, _keys2.default)(o)), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
                var _k = _step6.value;

                _s2[_k] = deepCopy(o[_k]);
            }
        } catch (err) {
            _didIteratorError6 = true;
            _iteratorError6 = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion6 && _iterator6.return) {
                    _iterator6.return();
                }
            } finally {
                if (_didIteratorError6) {
                    throw _iteratorError6;
                }
            }
        }

        return _s2;
    } else {
        throw new Error('not JSONable');
    }
}
exports.deepCopy = deepCopy;
function toStringifiable(o) {
    var parsable = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

    if (util_1.isUndefined(o) || util_1.isNull(o)) {
        return o;
    } else if (util_1.isNumber(o) || util_1.isBoolean(o)) {
        return o;
    } else if (util_1.isString(o)) {
        return parsable ? 's' + o : o;
    } else if (o instanceof bignumber_js_1.BigNumber) {
        return parsable ? 'n' + o.toString() : o.toString();
    } else if (util_1.isBuffer(o)) {
        return parsable ? 'b' + o.toString('hex') : o.toString('hex');
    } else if (util_1.isArray(o) || o instanceof Array) {
        var s = [];
        var _iteratorNormalCompletion7 = true;
        var _didIteratorError7 = false;
        var _iteratorError7 = undefined;

        try {
            for (var _iterator7 = (0, _getIterator3.default)(o), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
                var e = _step7.value;

                s.push(toStringifiable(e, parsable));
            }
        } catch (err) {
            _didIteratorError7 = true;
            _iteratorError7 = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion7 && _iterator7.return) {
                    _iterator7.return();
                }
            } finally {
                if (_didIteratorError7) {
                    throw _iteratorError7;
                }
            }
        }

        return s;
    } else if (o instanceof _map2.default) {
        throw new Error("use MapToObject before toStringifiable");
    } else if (o instanceof _set2.default) {
        throw new Error("use SetToArray before toStringifiable");
    } else if (util_1.isObject(o)) {
        var _s3 = (0, _create2.default)(null);
        var _iteratorNormalCompletion8 = true;
        var _didIteratorError8 = false;
        var _iteratorError8 = undefined;

        try {
            for (var _iterator8 = (0, _getIterator3.default)((0, _keys2.default)(o)), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
                var k = _step8.value;

                _s3[k] = toStringifiable(o[k], parsable);
            }
        } catch (err) {
            _didIteratorError8 = true;
            _iteratorError8 = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion8 && _iterator8.return) {
                    _iterator8.return();
                }
            } finally {
                if (_didIteratorError8) {
                    throw _iteratorError8;
                }
            }
        }

        return _s3;
    } else {
        throw new Error('not JSONable');
    }
}
exports.toStringifiable = toStringifiable;
function fromStringifiable(o) {
    // let value = JSON.parse(o);
    function __convertValue(v) {
        if (util_1.isString(v)) {
            if (v.charAt(0) === 's') {
                return v.substring(1);
            } else if (v.charAt(0) === 'b') {
                return Buffer.from(v.substring(1), 'hex');
            } else if (v.charAt(0) === 'n') {
                return new bignumber_js_1.BigNumber(v.substring(1));
            } else {
                throw new Error("invalid parsable value " + v);
            }
        } else if (util_1.isArray(v) || v instanceof Array) {
            for (var i = 0; i < v.length; ++i) {
                v[i] = __convertValue(v[i]);
            }
            return v;
        } else if (util_1.isObject(v)) {
            var _iteratorNormalCompletion9 = true;
            var _didIteratorError9 = false;
            var _iteratorError9 = undefined;

            try {
                for (var _iterator9 = (0, _getIterator3.default)((0, _keys2.default)(v)), _step9; !(_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done); _iteratorNormalCompletion9 = true) {
                    var k = _step9.value;

                    v[k] = __convertValue(v[k]);
                }
            } catch (err) {
                _didIteratorError9 = true;
                _iteratorError9 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion9 && _iterator9.return) {
                        _iterator9.return();
                    }
                } finally {
                    if (_didIteratorError9) {
                        throw _iteratorError9;
                    }
                }
            }

            return v;
        } else {
            return v;
        }
    }
    return __convertValue(o);
}
exports.fromStringifiable = fromStringifiable;

var SerializableWithHash = function () {
    function SerializableWithHash() {
        (0, _classCallCheck3.default)(this, SerializableWithHash);

        this.m_hash = encoding_1.Encoding.NULL_HASH;
    }

    (0, _createClass3.default)(SerializableWithHash, [{
        key: "_encodeHashContent",
        value: function _encodeHashContent(writer) {
            return error_code_1.ErrorCode.RESULT_OK;
        }
    }, {
        key: "_decodeHashContent",
        value: function _decodeHashContent(reader) {
            return error_code_1.ErrorCode.RESULT_OK;
        }
    }, {
        key: "encode",
        value: function encode(writer) {
            // writer.writeHash(this.hash);
            return this._encodeHashContent(writer);
        }
    }, {
        key: "decode",
        value: function decode(reader) {
            // this.m_hash = reader.readHash('hex');
            var err = this._decodeHashContent(reader);
            this.updateHash();
            return err;
        }
    }, {
        key: "updateHash",
        value: function updateHash() {
            this.m_hash = this._genHash();
        }
    }, {
        key: "_genHash",
        value: function _genHash() {
            var contentWriter = new writer_1.BufferWriter();
            this._encodeHashContent(contentWriter);
            var content = contentWriter.render();
            return digest.hash256(content).toString('hex');
        }
    }, {
        key: "_verifyHash",
        value: function _verifyHash() {
            return this.hash === this._genHash();
        }
    }, {
        key: "stringify",
        value: function stringify() {
            return { hash: this.hash };
        }
    }, {
        key: "hash",
        get: function get() {
            return this.m_hash;
        }
    }]);
    return SerializableWithHash;
}();

exports.SerializableWithHash = SerializableWithHash;