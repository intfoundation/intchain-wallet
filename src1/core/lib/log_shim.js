'use strict';

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _get = require('babel-runtime/core-js/reflect/get');

var _get2 = _interopRequireDefault(_get);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var assert = require('assert');

var BLOG_STACK_EXP = /^\s*at .*(\S+\:\d+|\(native\))/m;
var BLOG_LINE_EXP = /(.+?)(?:\:(\d+))?(?:\:(\d+))?$/;

var BLogStackHelper = function () {
    function BLogStackHelper() {
        (0, _classCallCheck3.default)(this, BLogStackHelper);
    }

    (0, _createClass3.default)(BLogStackHelper, null, [{
        key: '_extractLocation',
        value: function _extractLocation(urlLike) {
            // Fail-fast but return locations like '(native)'
            if (urlLike.indexOf(':') === -1) {
                return [urlLike];
            }

            var parts = BLOG_LINE_EXP.exec(urlLike.replace(/[\(\)]/g, ''));
            return [parts[1], parts[2] || undefined, parts[3] || undefined];
        }
    }, {
        key: '_parseStackString',
        value: function _parseStackString(stackString) {
            var filtered = stackString.split('\n').filter(function (line) {
                return !!line.match(BLOG_STACK_EXP);
            });

            return filtered.map(function (line) {
                if (line.indexOf('(eval ') > -1) {
                    // Throw away eval information until we implement stacktrace.js/stackframe#8
                    line = line.replace(/eval code/g, 'eval').replace(/(\(eval at [^\()]*)|(\)\,.*$)/g, '');
                }
                var tokens = line.replace(/^\s+/, '').replace(/\(eval code/g, '(').split(/\s+/).slice(1);
                var locationParts = BLogStackHelper._extractLocation(tokens.pop());
                var functionName = tokens.join(' ') || undefined;
                var fileName = ['eval', '<anonymous>'].indexOf(locationParts[0]) > -1 ? undefined : locationParts[0];

                return {
                    functionName: functionName,
                    fileName: fileName,
                    lineNumber: locationParts[1],
                    columnNumber: locationParts[2],
                    source: line
                };
            });
        }
    }, {
        key: '_getStackString',
        value: function _getStackString(info) {
            var stack = void 0;
            try {
                throw new Error(info);
            } catch (e) {
                stack = e.stack;
            }

            return stack;
        }
    }, {
        key: 'baseName',
        value: function baseName(path) {
            return path.split(/[\\/]/).pop();
        }
        /*
            info = {
                frame : [integer],
                pos : [boolean],
                stack : [boolean],
            }*/

    }, {
        key: 'getStack',
        value: function getStack(info) {
            var stackString = BLogStackHelper._getStackString('prepare stack');

            var stack = BLogStackHelper._parseStackString(stackString);
            if (info.pos) {
                var frameIndex = info.frame + 3;
                info.pos = null;
                if (stack && stack.length > 0 && frameIndex < stack.length) {
                    var frame = stack[frameIndex];
                    info.pos = {
                        'line': frame.lineNumber,
                        'file': frame.fileName,
                        'func': frame.functionName
                    };

                    if (info.pos.file && !info.fullpath) {
                        info.pos.file = BLogStackHelper.baseName(info.pos.file);
                    }
                }
            }

            if (info.stack) {
                if (stack && stack.length > 0) {
                    info.stack = '';
                    for (var index = info.frame + 3; index < stack.length; ++index) {
                        var _frame = stack[index];
                        info.stack += 'at ' + _frame.functionName + ' (' + _frame.fileName + ':' + _frame.lineNumber + ':' + _frame.columnNumber + ')\n';
                    }
                } else {
                    info.stack = stackString;
                }
            }
        }
    }]);
    return BLogStackHelper;
}();

// log中间层，用以增加下述功能:
// 1. 增加新的日志头和日志尾
// 2. 支持输出行号和堆栈
// 3. 支持trace，fatal等函数，兼容blog

var LogShim = function () {
    function LogShim(log, options) {
        var _this = this;

        (0, _classCallCheck3.default)(this, LogShim);

        this.m_preHeaders = [];
        this.m_postHeaders = [];
        this.m_log = log;

        // LogShim支持嵌套，用以标识层级
        this.m_nestLevel = log.__nestlevel == null ? 0 : log.__nestlevel + 1;

        this.m_options = this._defaultOptions();
        for (var key in options) {
            this.m_options[key] = options[key];
        }

        this.m_callOptions = null;

        this.m_extProp = {
            'shim': this,
            'LogShim': LogShim,
            '__nestlevel': this.m_nestLevel,
            'with': function _with(options) {
                _this.m_callOptions = options;
                return _this.log;
            }
        };

        this.m_logFuncs = ['silly', 'debug', 'verbose', 'info', 'warn', 'error'];
        this.m_handler = {
            get: function get(target, key, receiver) {
                if (typeof key === 'string') {
                    if (_this.m_extProp.hasOwnProperty(key)) {
                        return _this.m_extProp[key];
                    }

                    if (key === 'trace') {
                        key = 'verbose';
                    } else if (key === 'fatal') {
                        key = 'error';
                    }

                    if (_this.m_logFuncs.indexOf(key) < 0) {
                        return (0, _get2.default)(target, key, receiver);
                    }

                    return function () {
                        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                            args[_key] = arguments[_key];
                        }

                        var callOptions = _this.m_callOptions;
                        _this.m_callOptions = null;

                        var fullArgs = [].concat((0, _toConsumableArray3.default)(_this.m_preHeaders), args, (0, _toConsumableArray3.default)(_this.m_postHeaders));

                        // 多层Shim嵌套，只有最内层输出pos
                        if (target.__nestlevel == null) {
                            fullArgs.push(_this._pos(callOptions ? callOptions.frame : 1));
                        }

                        if (target.__nestlevel != null) {
                            var _target$with;

                            var nestOptions = {};
                            nestOptions.frame = callOptions ? callOptions.frame + 1 : 2;
                            return (_target$with = target.with(nestOptions))[key].apply(_target$with, (0, _toConsumableArray3.default)(fullArgs));
                        } else {
                            return target[key].apply(target, (0, _toConsumableArray3.default)(fullArgs));
                        }
                    };
                } else {
                    if (key === require('util').inspect.custom) {
                        return function () {
                            return { packageInfo: _this.m_packageInfo, moduleName: _this.m_moduleName };
                        };
                    }
                    return (0, _get2.default)(target, key, receiver);
                }
            },
            ownKeys: function ownKeys() {
                return [];
            }
        };

        this.m_proxy = new Proxy(this.m_log, this.m_handler);
    }

    (0, _createClass3.default)(LogShim, [{
        key: '_defaultOptions',
        value: function _defaultOptions() {
            return {
                pos: true,
                stack: false,
                fullpath: false
            };
        }
    }, {
        key: '_pos',
        value: function _pos(frame) {
            assert(frame >= 1);
            var info = {
                frame: frame,
                pos: this.m_options.pos,
                fullpath: this.m_options.fullpath,
                stack: this.m_options.stack
            };
            BLogStackHelper.getStack(info);

            var pos = info.pos;
            if (pos.file == null) {
                pos.file = '[unknown]';
            }

            return pos.file + ':' + pos.line;
        }
    }, {
        key: 'bind',
        value: function bind(header, pre) {
            if (pre) {
                this.m_preHeaders.push(header);
            } else {
                this.m_postHeaders.push(header);
            }

            return this;
        }
    }, {
        key: 'log',
        get: function get() {
            return this.m_proxy;
        }
    }]);
    return LogShim;
}();

module.exports.LogShim = LogShim;