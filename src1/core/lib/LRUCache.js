"use strict";

var _slicedToArray2 = require("babel-runtime/helpers/slicedToArray");

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _map = require("babel-runtime/core-js/map");

var _map2 = _interopRequireDefault(_map);

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("babel-runtime/helpers/createClass");

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

Object.defineProperty(exports, "__esModule", { value: true });

var LRUNode = function () {
    function LRUNode(value) {
        (0, _classCallCheck3.default)(this, LRUNode);

        this.m_next = null;
        this.m_prev = null;
        this.m_v = value;
    }

    (0, _createClass3.default)(LRUNode, [{
        key: "next",
        set: function set(node) {
            this.m_next = node;
        },
        get: function get() {
            return this.m_next;
        }
    }, {
        key: "prev",
        set: function set(node) {
            this.m_prev = node;
        },
        get: function get() {
            return this.m_prev;
        }
    }, {
        key: "value",
        get: function get() {
            return this.m_v;
        }
    }]);
    return LRUNode;
}();

var DLink = function () {
    function DLink() {
        (0, _classCallCheck3.default)(this, DLink);

        this.m_head = null;
        this.m_tail = null;
        this.m_count = 0;
    }

    (0, _createClass3.default)(DLink, [{
        key: "remove",
        value: function remove(node) {
            if (this.length === 0) {
                return;
            }
            var prev = node.prev;
            var next = node.next;
            if (prev) {
                prev.next = next;
            }
            if (this.m_head === node) {
                this.m_head = next;
            }
            if (next) {
                next.prev = prev;
            }
            if (this.m_tail === node) {
                this.m_tail = prev;
            }
            this.m_count--;
        }
    }, {
        key: "addToHead",
        value: function addToHead(node) {
            var head = this.m_head;
            node.next = this.m_head;
            if (this.m_head) {
                this.m_head.prev = node;
            }
            this.m_head = node;
            if (this.m_count === 0) {
                this.m_tail = node;
            }
            this.m_count++;
        }
    }, {
        key: "removeTail",
        value: function removeTail() {
            if (this.length === 0) {
                return;
            }
            this.remove(this.m_tail);
        }
    }, {
        key: "clear",
        value: function clear() {
            this.m_head = null;
            this.m_tail = null;
            this.m_count = 0;
        }
    }, {
        key: "length",
        get: function get() {
            return this.m_count;
        }
    }, {
        key: "head",
        get: function get() {
            return this.m_head;
        }
    }, {
        key: "tail",
        get: function get() {
            return this.m_tail;
        }
    }]);
    return DLink;
}();

var LRUCache = function () {
    function LRUCache(maxCount) {
        (0, _classCallCheck3.default)(this, LRUCache);

        this.m_maxCount = maxCount;
        this.m_memValue = new _map2.default();
        this.m_link = new DLink();
    }

    (0, _createClass3.default)(LRUCache, [{
        key: "set",
        value: function set(key, value) {
            if (this.m_memValue.has(key)) {
                var _m_memValue$get = this.m_memValue.get(key),
                    _m_memValue$get2 = (0, _slicedToArray3.default)(_m_memValue$get, 2),
                    _ = _m_memValue$get2[0],
                    node = _m_memValue$get2[1];

                this.m_link.remove(node);
                this.m_link.addToHead(node);
                this.m_memValue.set(key, [value, node]);
            } else {
                if (this.m_link.length >= this.m_maxCount) {
                    this.m_link.removeTail();
                }
                var _node = new LRUNode(key);
                this.m_link.addToHead(_node);
                this.m_memValue.set(key, [value, _node]);
            }
        }
    }, {
        key: "get",
        value: function get(key) {
            if (!this.m_memValue.has(key)) {
                return null;
            }

            var _m_memValue$get3 = this.m_memValue.get(key),
                _m_memValue$get4 = (0, _slicedToArray3.default)(_m_memValue$get3, 2),
                value = _m_memValue$get4[0],
                _ = _m_memValue$get4[1];

            this.set(key, value);
            return value;
        }
    }, {
        key: "remove",
        value: function remove(key) {
            if (!this.m_memValue.has(key)) {
                return;
            }

            var _m_memValue$get5 = this.m_memValue.get(key),
                _m_memValue$get6 = (0, _slicedToArray3.default)(_m_memValue$get5, 2),
                _ = _m_memValue$get6[0],
                node = _m_memValue$get6[1];

            this.m_link.remove(node);
            this.m_memValue.delete(key);
        }
    }, {
        key: "clear",
        value: function clear() {
            this.m_memValue.clear();
            this.m_link.clear();
        }
    }, {
        key: "print",
        value: function print() {
            var begin = this.m_link.head;
            while (begin) {
                var key = begin.value;

                var _m_memValue$get7 = this.m_memValue.get(key),
                    _m_memValue$get8 = (0, _slicedToArray3.default)(_m_memValue$get7, 2),
                    value = _m_memValue$get8[0],
                    _ = _m_memValue$get8[1];

                begin = begin.next;
            }
        }
    }]);
    return LRUCache;
}();

exports.LRUCache = LRUCache;
// let lru: LRUCache<number,string> = new LRUCache<number,string>(5);
// lru.set(1,'a');
// lru.print();
// lru.remove(1);
// lru.print();
// lru.set(1,'a');
// lru.set(2,'b');
// lru.set(3,'c');
// lru.set(4,'d');
// lru.set(5,'e');
// lru.print();
// let s:string|null = lru.get(3);
// lru.print();
// lru.set(6,'f');
// lru.print();