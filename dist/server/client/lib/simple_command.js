"use strict";

var _map = require("babel-runtime/core-js/map");

var _map2 = _interopRequireDefault(_map);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

Object.defineProperty(exports, "__esModule", { value: true });
function parseCommand(argv) {
    if (argv.length < 3) {
        console.log('no enough command');
        return;
    }
    var command = { options: new _map2.default() };
    var start = 2;
    var firstArg = argv[2];
    if (!firstArg.startsWith('--')) {
        command.command = firstArg;
        start = 3;
    }
    var curKey = void 0;
    while (start < argv.length) {
        var arg = argv[start];
        if (arg.startsWith('--')) {
            // if (curKey) {
            //     command.options.set(curKey, true);
            // }
            curKey = arg.substr(2);
            command.options.set(curKey, true);
        } else {
            if (curKey) {
                command.options.set(curKey, arg);
                curKey = undefined;
            } else {
                console.error("error command " + arg + ", key must start with --");
                return undefined;
            }
        }
        ++start;
    }
    return command;
}
exports.parseCommand = parseCommand;