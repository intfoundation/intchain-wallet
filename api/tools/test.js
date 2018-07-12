var code = require('punycode');

function punycode(txt) {
    var reg = /^xn--/i;
    var r = reg.test(txt) ? code.toUnicode(txt) : code.toASCII(txt);
    return r;
}
module.exports = punycode;