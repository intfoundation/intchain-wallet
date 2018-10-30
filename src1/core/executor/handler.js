"use strict";

var _getIterator2 = require("babel-runtime/core-js/get-iterator");

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _map = require("babel-runtime/core-js/map");

var _map2 = _interopRequireDefault(_map);

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("babel-runtime/helpers/createClass");

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

Object.defineProperty(exports, "__esModule", { value: true });

var BaseHandler = function () {
    function BaseHandler() {
        (0, _classCallCheck3.default)(this, BaseHandler);

        this.m_txListeners = new _map2.default();
        this.m_viewListeners = new _map2.default();
        this.m_preBlockListeners = [];
        this.m_postBlockListeners = [];
    }

    (0, _createClass3.default)(BaseHandler, [{
        key: "addTX",
        value: function addTX(name, listener) {
            if (name.length > 0 && listener) {
                this.m_txListeners.set(name, listener);
            }
        }
    }, {
        key: "getListener",
        value: function getListener(name) {
            return this.m_txListeners.get(name);
        }
    }, {
        key: "addViewMethod",
        value: function addViewMethod(name, listener) {
            if (name.length > 0 && listener) {
                this.m_viewListeners.set(name, listener);
            }
        }
    }, {
        key: "getViewMethod",
        value: function getViewMethod(name) {
            return this.m_viewListeners.get(name);
        }
    }, {
        key: "addPreBlockListener",
        value: function addPreBlockListener(filter, listener) {
            this.m_preBlockListeners.push({ filter: filter, listener: listener });
        }
    }, {
        key: "addPostBlockListener",
        value: function addPostBlockListener(filter, listener) {
            this.m_postBlockListeners.push({ filter: filter, listener: listener });
        }
    }, {
        key: "getPreBlockListeners",
        value: function getPreBlockListeners(h) {
            var listeners = [];
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = (0, _getIterator3.default)(this.m_preBlockListeners), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var l = _step.value;

                    if (l.filter(h)) {
                        listeners.push(l.listener);
                    }
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

            return listeners;
        }
    }, {
        key: "getPostBlockListeners",
        value: function getPostBlockListeners(h) {
            var listeners = [];
            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = (0, _getIterator3.default)(this.m_postBlockListeners), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var l = _step2.value;

                    if (l.filter(h)) {
                        listeners.push(l.listener);
                    }
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

            return listeners;
        }
    }]);
    return BaseHandler;
}();

exports.BaseHandler = BaseHandler;