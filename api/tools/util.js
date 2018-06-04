'use strict'

const uuid = require("node-uuid")

class Util {
    static uuidv1() {
        let guid = uuid.v1().replace(/-/g, "");
        return guid;
    }
    static uuidv4() {
        let guid = uuid.v4().replace(/-/g, "");
        return guid;
    }
}
module.exports = Util;