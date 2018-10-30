"use strict";

var _stringify = require("babel-runtime/core-js/json/stringify");

var _stringify2 = _interopRequireDefault(_stringify);

var _typeof2 = require("babel-runtime/helpers/typeof");

var _typeof3 = _interopRequireDefault(_typeof2);

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("babel-runtime/helpers/createClass");

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

Object.defineProperty(exports, "__esModule", { value: true });
var worker_1 = require("./worker");
var error_code_1 = require("../error_code");

var Workpool = function () {
    function Workpool(workerfile, size) {
        (0, _classCallCheck3.default)(this, Workpool);

        this.file = workerfile;
        this.size = size;
        this.workers = new Array(this.size);
    }

    (0, _createClass3.default)(Workpool, [{
        key: "push",
        value: function push(params, callback) {
            var _this = this;

            var _loop = function _loop(index) {
                if (!_this.workers[index]) {
                    //run for worker
                    var workerParam = (0, _stringify2.default)(params);
                    _this.workers[index] = new worker_1.Worker(_this.file, workerParam);
                    _this.workers[index].on('exit', function (code, signal) {
                        callback(code, signal, _this.workers[index].data);
                        _this.workers[index] = undefined;
                    });
                    _this.workers[index].run();
                    return {
                        v: error_code_1.ErrorCode.RESULT_OK
                    };
                }
            };

            //找一个空闲的worker
            for (var index = 0; index < this.workers.length; index++) {
                var _ret = _loop(index);

                if ((typeof _ret === "undefined" ? "undefined" : (0, _typeof3.default)(_ret)) === "object") return _ret.v;
            }
            return error_code_1.ErrorCode.RESULT_NOT_FOUND;
        }
    }, {
        key: "stop",
        value: function stop() {
            for (var index = 0; index < this.workers.length; index++) {
                if (this.workers[index]) {
                    this.workers[index].destory();
                    //this.workers[index] = undefined;
                }
            }
        }
    }]);
    return Workpool;
}();

exports.Workpool = Workpool;