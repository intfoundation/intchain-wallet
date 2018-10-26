"use strict";

var _promise = require("babel-runtime/core-js/promise");

var _promise2 = _interopRequireDefault(_promise);

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("babel-runtime/helpers/createClass");

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

Object.defineProperty(exports, "__esModule", { value: true });

var ClassNotfiy = function () {
    function ClassNotfiy(resolve, reject) {
        (0, _classCallCheck3.default)(this, ClassNotfiy);

        this.m_resolve = resolve;
        this.m_reject = reject;
    }

    (0, _createClass3.default)(ClassNotfiy, [{
        key: "resolve",
        get: function get() {
            return this.m_resolve;
        }
    }, {
        key: "reject",
        get: function get() {
            return this.m_reject;
        }
    }]);
    return ClassNotfiy;
}();

var Lock = function () {
    function Lock() {
        (0, _classCallCheck3.default)(this, Lock);

        this.m_busy = false;
        this.m_list = [];
    }

    (0, _createClass3.default)(Lock, [{
        key: "enter",
        value: function enter() {
            var _this = this;

            if (this.m_busy) {
                return new _promise2.default(function (resolve, reject) {
                    _this.m_list.push(new ClassNotfiy(resolve, reject));
                });
            }
            this.m_busy = true;
            return _promise2.default.resolve(true);
        }
    }, {
        key: "leave",
        value: function leave() {
            this.m_busy = false;
            if (this.m_list.length === 0) {
                return;
            }
            var notifyObj = this.m_list.shift();
            this.m_busy = true;
            notifyObj.resolve(true);
        }
    }, {
        key: "destory",
        value: function destory() {
            while (this.m_list.length > 0) {
                this.m_list.shift().reject(false);
            }
        }
    }]);
    return Lock;
}();

exports.Lock = Lock;