"use strict";

var modal = {};
var callbak = void 0;
var info = [
    [1, '失败', 'failed'],
    [2, '等待初始化', 'wait init'],
    [3, '错误的状态', 'error state'],
    [4, '无效的类型', 'invalid type'],
    [5, '脚本错误', 'script error'],
    [6, '没有执行', 'no implemention'],
    [8, '需要先同步', 'need sync'],
    [9, '没有找到', 'not found'],
    [11, '无效的参数', 'invalid parameter'],
    [12, '解析错误', 'parse error'],
    [13, '请求错误', 'request error'],
    [15, '超时', 'timeout'],
    [17, '无效的格式', 'invalid format'],
    [18, '不明数值', 'unknown value'],
    [19, '无效的token', 'invalid token'],
    [21, '无效的会话', 'invalid session'],
    [24, '交易池满了', 'tx pool is full'],
    [25, '无效的状态', 'invalid state'],
    [26, '余额不足', 'balance is not enough'],
    [27, '交易nonce错误', 'transaction nonce error'],
    [28, '无效的区块', 'invalid block'],
    [29, '操作取消', 'operation canceled'],
    [30, '交易费过小', 'fee too small'],
    [31, '此项只读', 'read only'],
    [34, '交易已存在', 'transaction exist'],
    [35, '版本不支持', 'version not support'],
    [36, '执行出错', 'execute error'],
    [37, '验证不匹配', 'verify as invalid'],
    [38, '交易类型不存在', 'tx type not exist'],
    [39, '交易费不足', 'tx fee not enough'],
    [40, '已跳过', 'skipped'],
    [41, '发起交易过于频繁', 'add tx too frequent'],
    [50, '检测到分叉', 'fork detected'],
    [10000, '用户定义的错误码', 'user defined errorcode'],
    [10011, '没有权限', 'have no permission'],
    [10012, '账户已冻结', 'address is frozen'],
    [10013, '无效的地址', 'invalid address'],
    [10021, 'limit值不够', 'limit not enough'],
    [10022, 'limit值过大', 'limit too big'],
    [10023, 'limit过小', 'limit too small'],
    [10024, 'block limit值过大', 'block limit too big'],
    [10025, 'price值过大', 'price too big'],
    [10026, 'price值过小', 'price too small'],
    [10027, '不是bignumber对象', 'not bignumber'],
    [10028, '不能小于0', 'can not be less than zero'],
    [10030, '不是整数', 'not integer'],
    [10031, '超过最大值，大于1e+18', 'out of range, greater than 1e+18'],
    [10032, '解锁的金额为0', 'unlock 0 INT'],
    [10040, '找不到keystore', 'address not exist'],
    [10041, 'keystore错误', 'keystore error']
]

modal.nodeList = function(obj, doc, cal) {
    callbak = cal
    let okText = obj.okText || 'Confirm';
    let time = obj.time;
    let nodes = obj.nodes;
    let div = document.createElement("div");
    div.setAttribute('id', 'modal')
    let dom = '';
    if (nodes && nodes.length) {
        dom = '<div style="position:fixed;left:0px;top:0px;width: 100%;height: 100%;z-index: 100px;background-color:rgba(0,0,0,0.3)">' +
            '<div style="width: 455px;margin: 200px auto;z-index: 101px;border-radius: 4px">' +
            '<div style="color:rgba(51,51,51,1);font-size:20px; width: 100%;height: 76px;line-height:' +
            '76px;background-color:' +
            'rgba(244,248,255,1);border-bottom: 1px solid #d7d7d7">' +
            '<span style="margin-left: 32px">' + time + ' (UCT+8)</span>' +
            '</div>' +
            '<div style="font-size:16px;width: 100%;padding:10px 0 28px 0;background-color:' +
            'rgba(255,255,255,1);color:rgba(102,102,102,1);overflow-y:auto;max-height:190px ;border-bottom: 1px solid #d7d7d7">'
        for (var i = 0; i < nodes.length; i++) {
            dom += '<div style="margin-top: 18px;margin-left:20px">' +
                '<div style="display: inline-block;text-align: left;vertical-align: top">' + (+i + 1) + '. ' + nodes[i] + '</div>' +
                '</div>'
        }
    } else {
        dom = '<div style="position:fixed;left:0px;top:0px;width: 100%;height: 100%;z-index: 100px;background-color:rgba(0,0,0,0.3)">' +
            '<div style="width: 410px;margin: 200px auto;z-index: 101px;border-radius: 4px">' +
            // '<div style="color:rgba(51,51,51,1);font-size:20px; width: 100%;height: 76px;line-height:' +
            // '76px;background-color:' +
            // 'rgba(244,248,255,1);border-bottom: 1px solid #d7d7d7">' +
            // '<span style="margin-left: 32px">' + time + '</span>' +
            // '</div>' +
            '<div style="font-size:16px;width: 100%;padding:10px 0 28px 0;background-color:' +
            'rgba(255,255,255,1);color:rgba(102,102,102,1) ;border-bottom: 1px solid #d7d7d7">'
            // for (var i = 0; i < nodes.length; i++) {
        dom += '<div style="margin-top: 18px">' +
            '<div style="display: inline-block;width: 100%;text-align: center;vertical-align: top">' + doc.noData + '</div>' +
            '</div>'
            // }
    }

    dom += '</div>' +
        '<div style="font-size:16px;width: 100%;height: 76px;background-color:rgba(255,255,255,1)">' +
        // '<div' +
        // 'style="cursor:pointer;font-size:20px;text-align:center;color:rgba(153,153,153,1);width: 48%;height: 100%;line-height:' +
        // '76px;display:' +
        // 'inline-block;vertical-align: top" onclick="cancel(this)">Cancel</div>' +
        '<div    style="vertical-align:top;width:2px;border-left:1px solid rgba(204,204,204,1);height: 60px;display:' +
        'inline-block;margin-top: 8px"></div>' +
        '<div style="cursor:pointer;font-size:20px;text-align:center;color:#cd222d;width: 99%;height: 100%;line-height:' +
        '76px;display:' +
        'inline-block;vertical-align: top" onclick="Ok(this)">' + okText + '</div>' +
        '</div>' +
        '</div>' +
        '</div>'
    div.innerHTML = dom;
    document.body.appendChild(div)
}
modal.showInfo = function() {
    var obj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var doc = arguments[1]
        // var okText = arguments[2]
        // var cancel = arguments[3]
    var cal = arguments[2];

    var d = document.getElementById("modal");
    if (d) document.body.removeChild(d);
    callbak = cal;
    var div = document.createElement("div");
    div.setAttribute('id', 'modal');
    var dom = "<div style=\"position:fixed;left:0px;top:0px;width: 100%;height:100%;z-index: 1000;background-color:rgba(0,0,0,0.3)\">\n    <div style=\"width: 700px;margin: 100px auto 0 auto;border-radius: 4px\">\n        <div style=\"color:rgba(51,51,51,1);font-size:20px; width: 100%;height: 76px;line-height:\n                76px;background-color:\n                rgba(244,248,255,1);border-bottom: 1px solid #d7d7d7\">\n            <span style=\"margin-left: 32px\">" + doc.cfi + "</span>\n        </div>\n        <div style=\"font-size:16px;width: 100%;max-height:300px;overflow:auto;padding:10px 0 28px 0;background-color:\n        rgba(255,255,255,1);color:rgba(102,102,102,1) ;border-bottom: 1px solid #d7d7d7\">";
    for (var o in obj) {
        dom += "<div style=\"margin-top: 18px;margin-left:20px\">\n                 <div style=\"display: inline-block;width: 180px;text-align: left;vertical-align: top\">" + o + ":</div>\n                 <div style=\"display: inline-block;width: 480px;text-align: left;word-break: break-all ;vertical-align: top\">\n                     " + obj[o] + "</div>\n             </div>";
    }
    dom += "</div>\n        <div style=\"font-size:16px;width: 100%;height: 76px;background-color:rgba(255,255,255,1)\">\n            <div\n                    style=\"cursor:pointer;font-size:20px;text-align:center;color:rgba(153,153,153,1);width: 48%;height: 100%;line-height:\n                    76px;display:\n                    inline-block;vertical-align: top\" onclick=\"cancel(this)\">" + doc.cancel + "</div>\n            <div    style=\"vertical-align:top;width:2px;border-left:1px solid rgba(204,204,204,1);height: 60px;display:\n                    inline-block;margin-top: 8px\"></div>\n            <div style=\"cursor:pointer;font-size:20px;text-align:center;color:rgba(60, 49, 215, 1);width: 48%;height: 100%;line-height:\n                    76px;display:\n                    inline-block;vertical-align: top\" onclick=\"confirm(this)\">" + doc.confirm + "</div>\n        </div>\n    </div>\n</div>";
    div.innerHTML = dom;
    document.body.appendChild(div);
};

modal.error = function(obj, cal) {
    callbak = cal;
    var d = document.getElementById("modal");
    if (d) document.body.removeChild(d);
    var title = obj.title || 'Notice';
    var msg = obj.msg;
    if (!isNaN(msg)) {
        for (let inf of info) {
            if (msg == inf[0]) {
                if (title == 'Notice') {
                    msg = inf[2]
                } else {
                    msg = inf[1]
                }
            }
        }
    }
    var okText = obj.okText || 'Confirm';
    var div = document.createElement("div");
    div.setAttribute('id', 'modal');
    var dom = "<div\n        style=\"\n        position:fixed;left:0px;top:0px;width: 100%;height: 100%;z-index: 100px;background-color:rgba(0,0,0,0.3)\">\n    <div\n            style=\"margin:300px auto;\n            background-color:rgba(255, 255, 255, 1);width: 420px;vertical-align: middle;padding: 10px 15px;z-index: 101px;border-radius: 4px\">\n            <span style=\"font-size: 18px;color: #303133\">" + title + "</span>\n            <div style=\"margin-top:20px;font-size: 14px;color: #606266\" >\n                <img style=\"display: inline-block;vertical-align: top\" height=\"20\"\n                     src=\"./images/error.png\"\n                     alt=\"\">\n                <span style=\"margin-left:10px;width:340px;display:inline-block;vertical-align: top\">\n " + msg + "\n                </span>\n            </div>\n\n            <div    onclick=\"Ok()\"\n                    style=\"padding:0 10px;margin-top: 20px;cursor: pointer;\n                    float: right;text-align:center;line-height:30px;border-radius:3px;background-color:#409eff;color:rgba(255, 255,255, 1)\"\n                    >\n\t\t\t\t\t" + okText + "\n                \n            </div>\n            <div style=\"height: 50px\"></div>\n    </div>\n</div>";
    div.innerHTML = dom;
    document.body.appendChild(div);
};

modal.success = function(obj, cal) {
    var d = document.getElementById("modal");
    if (d) document.body.removeChild(d);
    var title = obj.title || 'Notice';
    var msg = obj.msg;
    var okText = obj.okText || 'Confirm';
    var div = document.createElement("div");
    div.setAttribute('id', 'modal');
    var dom = "<div\n        style=\"\n        position:fixed;left:0px;top:0px;width: 100%;height: 100%;z-index: 100px;background-color:rgba(0,0,0,0.3)\">\n    <div\n            style=\"margin:300px auto;\n            background-color:rgba(255, 255, 255, 1);width: 420px;vertical-align: middle;padding: 10px 15px;z-index: 101px;border-radius: 4px\">\n            <span style=\"font-size: 18px;color: #303133\">" + title + "</span>\n            <div style=\"margin-top:20px;font-size: 14px;color: #606266\" >\n            \t         <img style=\"display: inline-block;vertical-align: top\" height=\"20\"\n                     src=\"./images/success.png\"\n                     alt=\"\">  \t   \n                <span style=\"margin-left:10px;width:340px;display:inline-block;vertical-align: top\">\n                You can use the transaction hash to query the transaction in the explorer.<br>\n\t                <span style=\"word-wrap:break-word\">\n\t                hash:" + msg + "\n\t\t\t\t\t</span>                \n                </span>\n            </div>\n\n            <div    onclick=\"Ok()\"\n                    style=\"padding:0 10px;margin-top: 20px;cursor: pointer;\n                    float: right;text-align:center;line-height:30px;border-radius:3px;background-color:#409eff;color:rgba(255, 255,255, 1)\"\n                    >\n\t\t\t\t\t" + okText + "\n            </div>\n            <div style=\"height: 50px\"></div>\n    </div>\n</div>";
    div.innerHTML = dom;
    document.body.appendChild(div);
};
modal.burnSuccess = function(obj, cal) {
    callbak = cal
    var d = document.getElementById("modal");
    if (d) document.body.removeChild(d);
    var title = obj.title || 'Notice';
    var msg = obj.msg;
    var okText = obj.okText || 'Confirm';
    var div = document.createElement("div");
    div.setAttribute('id', 'modal');
    var dom = "<div\n        style=\"\n        position:fixed;left:0px;top:0px;width: 100%;height: 100%;z-index: 100px;background-color:rgba(0,0,0,0.3)\">\n    <div\n            style=\"margin:300px auto;\n            background-color:rgba(255, 255, 255, 1);width: 420px;vertical-align: middle;padding: 10px 15px;z-index: 101px;border-radius: 4px\">\n            <span style=\"font-size: 18px;color: #303133\">" + title + "</span>\n            <div style=\"margin-top:20px;font-size: 14px;color: #606266\" >\n            \t         <img style=\"display: inline-block;vertical-align: top\" height=\"20\"\n                     src=\"./images/success.png\"\n                     alt=\"\">  \t   \n                <span style=\"margin-left:10px;width:340px;display:inline-block;vertical-align: top\">\n                " + obj.doc.success + "<br>\n\t                <span onClick=\"toEth(this)\" style=\"word-wrap:break-word;cursor: pointer;\">\n                    " + msg + "\n\t\t\t\t\t</span>                \n                </span>\n            </div>\n            <div    onclick=\"Ok()\"\n                    style=\"padding:0 10px;margin-top: 20px;cursor: pointer;\n                    float: right;text-align:center;line-height:30px;border-radius:3px;background-color:#409eff;color:rgba(255, 255,255, 1)\"\n                    >\n\t\t\t\t\t" + okText + "\n            </div>\n            <div style=\"height: 50px\"></div>\n    </div>\n</div>";
    div.innerHTML = dom;
    document.body.appendChild(div);
};

modal.prompt = function(doc, cal) {
    callbak = cal;
    var d = document.getElementById("modal");
    if (d) document.body.removeChild(d);
    var div = document.createElement("div");
    div.setAttribute('id', 'modal');
    var dom = "\n    <div style=\"\n    position:fixed;left:0px;top:0px;width: 100%;height: 100%;z-index: 100px;background-color:rgba(0,0,0,0.3)\">\n        <div style=\"margin:300px auto;\n    background-color:rgba(255, 255, 255, 1);width: 420px;vertical-align: middle;padding: 10px 15px;z-index: 101px;border-radius: 4px\">\n            <span style=\"font-size: 18px;color: #303133\">" + doc.epn + "</span>\n            <div style=\"margin-top:20px;font-size: 14px;color: #606266\">\n                <div class=\"in-box\">\n                    <input id='unViewPwd' onpropertychange=\"pwdChange(this.value)\" oninput=\"pwdChange(this.value)\" type=\"password\"  placeholder=\"" + doc.epn + "\">\n                    <input id='viewPwd' style='display:none' onpropertychange=\"pwdChange(this.value)\" oninput=\"pwdChange(this.value)\" type=\"text\"      placeholder=\"" + doc.epn + "\">\n                    <img id='open' style='display:none' src=\"./images/eyeopen.png\" onClick=\"openClick()\" >\n                    <img id='close' src=\"./images/eyeclose.png\" onClick=\"closeClick()\">\n                </div>\n                <div id=\"warnTip\" style=\"width:412px;word-break:keep-all;position:absolute;padding-top:5px;color: rgba(215, 49, 111, 1);font-size: 12px\">" + doc.nineSpace + "</div>\n            </div>\n\n            <div onClick=\"download()\" style=\"padding:0 10px;margin-top: 40px;cursor:pointer;\n    float: right;text-align:center;line-height:30px;border-radius:3px;background-color:#409eff;color:rgba(255, 255,255, 1)\">\n\n                " + doc.confirm + "\n            </div>\n            <div onClick=\"cancel()\" style=\"padding:0 10px;margin-top: 40px;margin-right: 20px;cursor:pointer;\n    float: right;text-align:center;line-height:30px;border-radius:3px;    border: 1px solid #dcdfe6;color: #606266;\">\n\n                " + doc.cancel + "\n            </div>\n            <div style=\"height: 75px\"></div>\n        </div>\n    </div>";
    div.innerHTML = dom;
    document.body.appendChild(div);
};

modal.numformat = function(val, flag) {
    if (val == 0) {
        return 0;
    }
    if (!flag) {
        var wal = require("wal");
        val = new wal.BigNumber(val).dividedBy(Math.pow(10, 18)).toString()
    }
    if (val.toString().indexOf('e') > -1 && val.toString().indexOf('-') > -1) {
        val = (+val).toFixed(18)
        for (var i = val.length - 1; i >= 0; i--) {
            if (val[i] != 0) {
                return val.substr(0, i + 1)
            }
        }
    }
    if (val.toString().indexOf('e') > -1 && val.toString().indexOf('+') > -1) {
        return Number(val).toLocaleString().replace(/,/g, '')
    }
    return val
}

function confirm() {
    callbak();
    var dom = document.getElementById("modal");
    document.body.removeChild(dom);
    callbak = null;
}

function cancel() {
    var dom = document.getElementById("modal");
    document.body.removeChild(dom);
}

function Ok() {
    if (callbak) callbak();
    var dom = document.getElementById("modal");
    document.body.removeChild(dom);
}

function pwdChange(e) {
    document.getElementById('unViewPwd').value = e;
    document.getElementById('viewPwd').value = e;
    if (e.length >= 9 && document.getElementById('warnTip').style.display == 'block') {
        document.getElementById('warnTip').style.display = 'none';
    }
}

function openClick() {
    document.getElementById('unViewPwd').style.display = 'inline';
    document.getElementById('viewPwd').style.display = 'none';
    document.getElementById('open').style.display = 'none';
    document.getElementById('close').style.display = 'inline';
}

function closeClick() {
    document.getElementById('unViewPwd').style.display = 'none';
    document.getElementById('viewPwd').style.display = 'inline';
    document.getElementById('open').style.display = 'inline';
    document.getElementById('close').style.display = 'none';
}

function download() {
    var pwd = document.getElementById('unViewPwd').value;
    if (pwd.length < 9) {
        document.getElementById('warnTip').style.display = 'block';
        return;
    }
    if (pwd != $.trim(pwd)) {
        document.getElementById('warnTip').style.display = 'block';
        return;
    }

    callbak(pwd);
    var dom = document.getElementById("modal");
    document.body.removeChild(dom);
}

function cancel() {
    var dom = document.getElementById("modal");
    document.body.removeChild(dom);
}

function toEth(e) {
    let index = e.innerText.indexOf('tokenid');
    if (index > 0) {
        window.open(e.innerText.substr(0, index - 1));
    } else {
        window.open(e.innerText);
    }
}
modal.UrlSearch = function() {
    var name, value;
    var str = location.href;
    var num = str.indexOf("?");
    str = str.substr(num + 1);
    var arr = str.split("&");
    for (var i = 0; i < arr.length; i++) {
        num = arr[i].indexOf("=");
        if (num > 0) {
            name = arr[i].substring(0, num);
            value = arr[i].substr(num + 1);
            this[name] = value;
        }
    }
};
modal.sortNum = function(a, b) {
    return b.num - a.num;
}

modal.isValidAddress = function(address) {
        let subAddress = address.slice(3);
        try {
            let buf = base58.decode(subAddress);
            if (buf.length !== 25) {
                return false;
            }
            let br = new client_1.BufferReader(buf);
            br.readU8();
            br.readBytes(20);
            br.verifyChecksum();
        } catch (error) {
            return false;
        }
        return true;
    }
    //return true;
    //}