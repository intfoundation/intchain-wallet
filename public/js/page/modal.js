"use strict";

var modal = {};
var callbak = void 0;
modal.showInfo = function() {
    var obj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var cal = arguments[1];

    var d = document.getElementById("modal");
    if (d) document.body.removeChild(d);
    callbak = cal;
    var div = document.createElement("div");
    div.setAttribute('id', 'modal');
    var dom = "<div style=\"position:fixed;left:0px;top:0px;width: 100%;height: 100%;z-index: 100px;background-color:rgba(0,0,0,0.3)\">\n    <div style=\"width: 700px;margin: 100px auto;z-index: 101px;border-radius: 4px\">\n        <div style=\"color:rgba(51,51,51,1);font-size:20px; width: 100%;height: 76px;line-height:\n                76px;background-color:\n                rgba(244,248,255,1);border-bottom: 1px solid #d7d7d7\">\n            <span style=\"margin-left: 32px\">Confirm the following information</span>\n        </div>\n        <div style=\"font-size:16px;width: 100%;padding:10px 0 28px 0;background-color:\n        rgba(255,255,255,1);color:rgba(102,102,102,1) ;border-bottom: 1px solid #d7d7d7\">";
    for (var o in obj) {
        dom += "<div style=\"margin-top: 18px;margin-left:20px\">\n                 <div style=\"display: inline-block;width: 180px;text-align: left;vertical-align: top\">" + o + ":</div>\n                 <div style=\"display: inline-block;width: 480px;text-align: left;word-break: break-all ;vertical-align: top\">\n                     " + obj[o] + "</div>\n             </div>";
    }
    dom += "</div>\n        <div style=\"font-size:16px;width: 100%;height: 76px;background-color:rgba(255,255,255,1)\">\n            <div\n                    style=\"cursor:pointer;font-size:20px;text-align:center;color:rgba(153,153,153,1);width: 48%;height: 100%;line-height:\n                    76px;display:\n                    inline-block;vertical-align: top\" onclick=\"cancel(this)\">Cancel</div>\n            <div    style=\"vertical-align:top;width:2px;border-left:1px solid rgba(204,204,204,1);height: 60px;display:\n                    inline-block;margin-top: 8px\"></div>\n            <div style=\"cursor:pointer;font-size:20px;text-align:center;color:rgba(60, 49, 215, 1);width: 48%;height: 100%;line-height:\n                    76px;display:\n                    inline-block;vertical-align: top\" onclick=\"confirm(this)\">Confirm</div>\n        </div>\n    </div>\n</div>";
    div.innerHTML = dom;
    document.body.appendChild(div);
};

modal.error = function(obj, cal) {
    callbak = cal;
    var d = document.getElementById("modal");
    if (d) document.body.removeChild(d);
    var title = obj.title || 'Notice';
    var msg = obj.msg;
    var okText = obj.okText || 'Confirm';
    var div = document.createElement("div");
    div.setAttribute('id', 'modal');
    var dom = "<div\n        style=\"\n        position:fixed;left:0px;top:0px;width: 100%;height: 100%;z-index: 100px;background-color:rgba(0,0,0,0.3)\">\n    <div\n            style=\"margin:300px auto;\n            background-color:rgba(255, 255, 255, 1);width: 420px;vertical-align: middle;padding: 10px 15px;z-index: 101px;border-radius: 4px\">\n            <span style=\"font-size: 18px;color: #303133\">" + title + "</span>\n            <div style=\"margin-top:20px;font-size: 14px;color: #606266\" >\n                <img style=\"display: inline-block;vertical-align: top\" height=\"20\"\n                     src=\"./images/error.png\"\n                     alt=\"\">\n                <span style=\"margin-left:10px;width:380px;display:inline-block;vertical-align: top\">\n                " + msg + "\n                </span>\n            </div>\n\n            <div    onclick=\"Ok()\"\n                    style=\"padding:0 10px;margin-top: 20px;cursor: pointer;\n                    float: right;text-align:center;line-height:30px;border-radius:3px;background-color:#409eff;color:rgba(255, 255,255, 1)\"\n                    >\n\t\t\t\t\t" + okText + "\n                \n            </div>\n            <div style=\"height: 50px\"></div>\n    </div>\n</div>";
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
    var dom = "<div\n        style=\"\n        position:fixed;left:0px;top:0px;width: 100%;height: 100%;z-index: 100px;background-color:rgba(0,0,0,0.3)\">\n    <div\n            style=\"margin:300px auto;\n            background-color:rgba(255, 255, 255, 1);width: 420px;vertical-align: middle;padding: 10px 15px;z-index: 101px;border-radius: 4px\">\n            <span style=\"font-size: 18px;color: #303133\">" + title + "</span>\n            <div style=\"margin-top:20px;font-size: 14px;color: #606266\" >\n            \t         <img style=\"display: inline-block;vertical-align: top\" height=\"20\"\n                     src=\"./images/success.png\"\n                     alt=\"\">  \t   \n                <span style=\"margin-left:10px;width:380px;display:inline-block;vertical-align: top\">\n                You can use the transaction hash to query the transaction in the explorer.<br>\n\t                <span style=\"word-wrap:break-word\">\n\t                hash:" + msg + "\n\t\t\t\t\t</span>                \n                </span>\n            </div>\n\n            <div    onclick=\"Ok()\"\n                    style=\"padding:0 10px;margin-top: 20px;cursor: pointer;\n                    float: right;text-align:center;line-height:30px;border-radius:3px;background-color:#409eff;color:rgba(255, 255,255, 1)\"\n                    >\n\t\t\t\t\t" + okText + "\n            </div>\n            <div style=\"height: 50px\"></div>\n    </div>\n</div>";
    div.innerHTML = dom;
    document.body.appendChild(div);
};
modal.burnSuccess = function(obj, cal) {
    var d = document.getElementById("modal");
    if (d) document.body.removeChild(d);
    var title = obj.title || 'Notice';
    var msg = obj.msg;
    var okText = obj.okText || 'Confirm';
    var div = document.createElement("div");
    div.setAttribute('id', 'modal');
    var dom = "<div\n        style=\"\n        position:fixed;left:0px;top:0px;width: 100%;height: 100%;z-index: 100px;background-color:rgba(0,0,0,0.3)\">\n    <div\n            style=\"margin:300px auto;\n            background-color:rgba(255, 255, 255, 1);width: 420px;vertical-align: middle;padding: 10px 15px;z-index: 101px;border-radius: 4px\">\n            <span style=\"font-size: 18px;color: #303133\">" + title + "</span>\n            <div style=\"margin-top:20px;font-size: 14px;color: #606266\" >\n            \t         <img style=\"display: inline-block;vertical-align: top\" height=\"20\"\n                     src=\"./images/success.png\"\n                     alt=\"\">  \t   \n                <span style=\"margin-left:10px;width:380px;display:inline-block;vertical-align: top\">\n                Operation success, click the URL below to view the results.<br>\n\t                <span onClick=\"toEth(this)\" style=\"word-wrap:break-word;cursor: pointer;\">\n                    " + msg + "\n\t\t\t\t\t</span>                \n                </span>\n            </div>\n            <div    onclick=\"Ok()\"\n                    style=\"padding:0 10px;margin-top: 20px;cursor: pointer;\n                    float: right;text-align:center;line-height:30px;border-radius:3px;background-color:#409eff;color:rgba(255, 255,255, 1)\"\n                    >\n\t\t\t\t\t" + okText + "\n            </div>\n            <div style=\"height: 50px\"></div>\n    </div>\n</div>";
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

modal.numformat = function(val) {
    if (val == 0) {
        return 0;
    }
    val = val / Math.pow(10, 18)
    if (val.toString().indexOf('e') > -1 && val.toString().indexOf('-') > -1) {
        val = val.toFixed(18)
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
    callbak(pwd);
    var dom = document.getElementById("modal");
    document.body.removeChild(dom);
}

function cancel() {
    var dom = document.getElementById("modal");
    document.body.removeChild(dom);
}

function toEth(e) {
    console.log(e.innerText);
    window.open(e.innerText);
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