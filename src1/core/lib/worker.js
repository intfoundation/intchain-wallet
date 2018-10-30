"use strict";

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
var events_1 = require("events");
var child_process_1 = require("child_process");

var Worker = function (_events_1$EventEmitte) {
    (0, _inherits3.default)(Worker, _events_1$EventEmitte);

    function Worker(file, params) {
        (0, _classCallCheck3.default)(this, Worker);

        var _this = (0, _possibleConstructorReturn3.default)(this, (Worker.__proto__ || (0, _getPrototypeOf2.default)(Worker)).call(this));

        _this.file = file;
        _this.params = params;
        _this.data = '';
        return _this;
    }

    (0, _createClass3.default)(Worker, [{
        key: "run",
        value: function run() {
            var _this2 = this;

            // 1. 开一个进程，传serverPort, file, params进去
            // 2. 子进程启动，开始运行
            // 3. 函数返回后，子进程
            var bin = process.argv[0];
            var options = { stdio: 'pipe', env: process.env };
            this.child = child_process_1.spawn(bin, [this.file, this.params], options);
            this.child.on('error', function (err) {
                console.error("child process error! " + err);
                _this2.destory();
            });
            this.child.once('exit', function (code, signal) {
                _this2.emit('exit', code == null ? -1 : code, signal);
            });
            this.child.stdin.on('error', function (err) {
                console.error("child process error! " + err);
                _this2.destory();
            });
            this.child.stdout.on('error', function (err) {
                console.error("child process error! " + err);
                _this2.destory();
            });
            this.child.stderr.on('error', function (err) {
                console.error("child process error! " + err);
                _this2.destory();
            });
            this.child.stdout.on('data', function (data) {
                _this2.data += data;
            });
        }
    }, {
        key: "destory",
        value: function destory() {
            if (this.child) {
                this.child.kill('SIGTERM');
            }
        }
    }]);
    return Worker;
}(events_1.EventEmitter);

exports.Worker = Worker;