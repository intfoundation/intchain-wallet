/** **********通用js************** */
var util = {};
util.query = function(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null)
        return decodeURIComponent(r[2]);
    return null;
};

util.confirm = function(item, fn) {
    layer.confirm('确定删除吗？', {
        time: 0,
        title: "提示信息",
        offset: '100px',
        btn: ['确定', '取消'],
        yes: function() {
            fn(item);
            layer.closeAll();
        },
        no: function() {
            layer.closeAll();
        }
    });
};
util.confirmTop = function(item, fn) {
    layer.confirm('确定置顶吗？', {
        time: 0,
        title: "提示信息",
        offset: '100px',
        btn: ['确定', '取消'],
        yes: function() {
            fn(item);
            layer.closeAll();
        },
        no: function() {
            layer.closeAll();
        }
    });
};
util.confirmCheckHand = function(item, fn) {
    layer.confirm('确定复核吗？', {
        time: 0,
        title: "提示信息",
        offset: '100px',
        btn: ['确定', '取消'],
        yes: function() {
            fn(item);
            layer.closeAll();
        },
        no: function() {
            layer.closeAll();
        }
    });
};
util.confirmNotTop = function(item, fn) {
    layer.confirm('确定取消置顶吗？', {
        time: 0,
        title: "提示信息",
        offset: '100px',
        btn: ['确定', '取消'],
        yes: function() {
            fn(item);
            layer.closeAll();
        },
        no: function() {
            layer.closeAll();
        }
    });
};
util.confirmdo = function(msg, fn) {
    layer.confirm(msg, {
        time: 0,
        title: "提示信息",
        offset: '100px',
        btn: ['确定', '取消'],
        yes: function() {
            fn();
            layer.closeAll();
        },
        no: function() {
            layer.closeAll();
        }
    });
};
util.confirmMsg = function(msg, item, fn) {
    layer.confirm(msg, {
        time: 20000,
        title: "提示信息",
        offset: '100px',
        btn: ['确定', '取消'],
        yes: function() {
            fn(item);
            layer.closeAll();
        },
        no: function() {
            layer.closeAll();
        }
    });
};
/**
 * 
 * @param {} msg 
 */
util.alert = function(msg) {
    layer.alert(msg, {
        time: 0,
        closeBtn: 0,
        offset: '100px',
    });
};
util.alertback = function(msg) {
    layer.alert(msg, {
        time: 0,
        closeBtn: 0,
        offset: '100px',
        end: function() {
            back();
        }
    });
};
util.alertbacktoUrl = function(msg, url) {
    layer.alert(msg, {
        time: 0,
        closeBtn: 0,
        offset: '100px',
        end: function() {
            backtoUrl(url);
        }
    });
};
util.alertdoornot = function(msg, fn) {
    layer.alert(msg, {
        time: 0,
        closeBtn: 0,
        offset: '100px',
        btn: ['确定', '取消'],
        yes: function() {
            fn();
        },
        no: function() {
            layer.closeAll();
        }
    });
};
util.alertdo = function(msg, fn) {
    layer.alert(msg, {
        time: 0,
        closeBtn: 0,
        offset: '100px',
        end: function() {
            fn();
        }
    });
};

util.getDateDiff = function(dateTimeStamp) {
    var minute = 1000 * 60;
    var hour = minute * 60;
    var day = hour * 24;
    var halfamonth = day * 15;
    var month = day * 30;
    var now = new Date().getTime();
    var diffValue = now - dateTimeStamp;
    if (diffValue < 0) {
        return;
    }
    var monthC = diffValue / month;
    var dayC = Math.round(diffValue / day);
    var hourC = diffValue / hour;
    var minC = diffValue / minute;
    if (monthC > 1) {
        result = moment(dateTimeStamp).format('YYYY-MM-DD')
    } else if (monthC == 1) {
        result = "" + parseInt(monthC) + "月前";
    } else if (dayC >= 1) {
        result = "" + parseInt(dayC) + "天前";
    } else if (hourC >= 1) {
        result = "" + parseInt(hourC) + "小时前";
    } else if (minC >= 1) {
        result = "" + parseInt(minC) + "分钟前";
    } else {
        result = "刚刚"
    };
    return result;
}

util.addcookie = function(key, value) {
    $.cookie(key, value);
};

util.getcookie = function(key) {
    $.cookie(key);
};

function back() {
    window.history.go(-1);
};

function backtoUrl(url) {
    window.location.href = rootpath + url + window.location.search;
};

function backforUrl(url) {
    window.history.go(url);
};
util.myKeyup = function(e, fn) {
    var keycode = window.event ? e.keyCode : e.which;
    if (keycode == 13) {
        fn();
    }
};
util.toUrl = function(url, params) {
    var paramsArr = [];
    if (params) {
        for (prop in params) {
            var val = params[prop];
            if (typeof(val) != "function") {
                paramsArr.push(prop + '=' + val);
            }
        }
        if (url.search(/\?/) === -1) {
            url += '?' + paramsArr.join('&');
        } else {
            url += '&' + paramsArr.join('&');
        }
        return url;
    }
};

function phoneOnKeyUp(obj) {
    //	var reg = /^1[3|4|5|7|8][0-9]{9}$/; //验证规则
    //	var reg = /^((13[0-9])|(14[5,7])|(15[0-3,5-9])|(17[0,3,5-8])|(18[0-9])|(147))\\d{8}$/;
    var reg = /^(0|86|17951)?(13[0-9]|15[012356789]|16[0-9]|17[0-9]|18[0-9]|14[57])[0-9]{8}$/;
    /*if (obj.value.length == 1) {
    if (!!obj.value.match(/[^1-9]/g)) {
    obj.value = '';
    }*/
    if (!!obj.value.match(/[^0-9]/g)) {
        obj.value = '';
    } else if (obj.value.length > 11) {
        obj.value = obj.value.substring(0, 11);
        /*if(obj.value=="88888888888"){
        } else */
        if (!reg.test(obj.value) && obj.value != "88888888888") {
            obj.value = '';
            util.alert("请输入正确的手机号码");
        }
    } else if (obj.value.length == 11) {
        /*if(obj.value=="88888888888"){
        } else*/
        if (!reg.test(obj.value) && obj.value != "88888888888") {
            obj.value = '';
            util.alert("请输入正确的手机号码");
        }
    } else {
        if (!!obj.value.match(/\D/g)) {
            obj.value = '';
        }
    }
};

function GuHuaOnBlur(obj) {

    if (!/^(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14}$/.test(obj.value)) {
        obj.value = '';
    }
}

function checkFixedLinePhone(obj) {
    if (isNaN(obj.value)) {
        obj.value = '';
        util.alert("请输入数字");
    }
    if (obj.value.trim().length > 8) {
        obj.value = obj.value.substring(0, 8);
    }
}

function ChuanZhenOnBlur(obj) {
    var checkFax = /^(\d{3,4}-)?\d{7,8}$/;
    if (!checkFax.test(obj.value)) {
        obj.value = '';
    }
}

function weiXinOnKeyUp(obj) {
    //	var reg = /^[a-zA-Z]{1}[-_a-zA-Z0-9]{5,19}$/;
    var reg2 = "^[\u4e00-\u9fa5]+$";
    var regChinese = /.*[\u4e00-\u9fa5]+.*/;
    //	var regSpecialStr ="[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]";
    var regSpecialStr = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]")
        //	var reg = /^[-0-9a-zA-Z]+$/;
    var reg = "^[a-zA-Z]{1}[-_a-zA-Z0-9]{5,19}$";
    if (regChinese.test(obj.value)) {
        obj.value = '';
        util.alert("微信不能含有中文");
    } else if (regSpecialStr.test(obj.value)) {
        obj.value = '';
        util.alert("不能含有特殊字符");
    } else if (reg.test(obj.value)) {
        obj.value = '';
    } else if (obj.value.length > 20) {
        obj.value = obj.value.substring(0, 20)
    } else if (obj.value.trim() == "") {
        obj.value = "";
    }
}

function QQOnKeyUp(obj) {
    var QQ = RegExp(/^[1-9][0-9]{4,9}$/);
    if (isNaN(obj.value)) {
        obj.value = '';
        util.alert("请输入正确的qq号");
    } else if (obj.value.length > 10) {
        obj.value = obj.value.substring(0, 10)
        if (obj.value.trim() == "") {
            obj.value = "";
        }
    } else if (obj.value.trim() == "") {
        obj.value = "";
    }
}

function emailOnkeyUp(obj) {
    var email = RegExp(/^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/);
    var regChinese = /.*[\u4e00-\u9fa5]+.*/;
    if (regChinese.test(obj.value)) {
        obj.value = '';
        util.alert("邮箱不能含有中文");
    } else if (obj.value.trim() == "") {
        obj.value = "";
    } else if (obj.value.length > 40) {
        obj.value = obj.value.substring(0, 40)
    }
}

function emailOnBlur(obj) {
    var email = RegExp(/^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/);
    if (obj.value.trim() != "" && obj.value.trim().length > 3) {
        if (!email.test(obj.value)) {
            obj.value = '';
            util.alert("请输入正确的邮箱");
        }
    }
}

function dateOnKeyUp(obj) {
    if (obj.value.length == 1) {
        if (!!obj.value.match(/[^1-9]/g)) {
            obj.value = '';
        }
    } else if (obj.value.length == 5) {
        if (obj.value.charAt(4) != '-') {
            obj.value = obj.value.substr(0, 4);
        }
    } else if (obj.value.length == 8) {
        if (obj.value.charAt(7) != '-') {
            obj.value = obj.value.substr(0, 7);
        }
    } else {
        if (!!obj.value.match(/\D\-/g)) {
            obj.value = '';
        }
    }
};


util.confirmEnding = function(str, target) {
    if (str.endsWith(target)) {
        return true;
    }
    return false;
}

util.browser = {
    versions: function() {
            var u = navigator.userAgent,
                app = navigator.appVersion;
            return { //移动终端浏览器版本信息
                trident: u.indexOf('Trident') > -1, //IE内核
                presto: u.indexOf('Presto') > -1, //opera内核
                webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
                gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
                mobile: !!u.match(/AppleWebKit.*Mobile.*/) || !!u.match(/AppleWebKit/), //是否为移动终端
                ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
                android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或者uc浏览器
                iPhone: u.indexOf('iPhone') > -1 || u.indexOf('Mac') > -1, //是否为iPhone或者QQHD浏览器
                iPad: u.indexOf('iPad') > -1, //是否iPad
                webApp: u.indexOf('Safari') == -1 //是否web应该程序，没有头部与底部
            };
        }
        (),
    language: (navigator.browserLanguage || navigator.language).toLowerCase()
}

util.linkbarToUrl = function(url, name) {
    var filter = '#linkbar [tag="' + url + '"]';
    if ($(filter).length == 0) {
        addlink(url);
        addlinkbar(url, name);
    } else {
        if (url == 'useraudit/list') {
            var rurl = url;
            var xfilter = '#linkbar [tag="' + rurl + '"]';
            $(xfilter).attr('willclose', "1");
            var linkprev = $(xfilter).prev();
            $(xfilter).remove();
            var xpfilter = '#page-content [tag="' + rurl + '"]';
            $(xpfilter).remove();
            $(xpfilter).attr('willclose', "1");
            linkbarclick($(linkprev));
            addlink(url);
            addlinkbar(url, name);
        } else if (url == "report/index") {
            var rurl = url;
            var xfilter = '#linkbar [tag="' + rurl + '"]';
            $(xfilter).attr('willclose', "1");
            var linkprev = $(xfilter).prev();
            $(xfilter).remove();
            var xpfilter = '#page-content [tag="' + rurl + '"]';
            $(xpfilter).remove();
            $(xpfilter).attr('willclose', "1");
            linkbarclick($(linkprev));
            addlink(url);
            addlinkbar(url, name);
        } else {
            selectlinkbar(url);
            selectlink(url);
        }

    }
};

/**
 * 检查字符串是否为合法QQ号码
 * @param {String} 字符串
 * @return {bool} 是否为合法QQ号码
 */
util.isQQ = function(aQQ) {
    var bValidate = RegExp("[1-9][0-9]{4,14}").test(aQQ);
    if (bValidate) {
        return true;
    } else
        return false;
};
/**
 * 检查字符串是否为合法手机号码
 * @param {String} 字符串
 * @return {bool} 是否为合法手机号码
 */
util.isPhone = function(aPhone) {

    //	var bValidate = RegExp(/^(0|86|17951)?(13[0-9]|15[012356789]|18[0-9]|14[57])[0-9]{8}$/).test(aPhone);
    var bValidate = RegExp("^((13[0-9])|(14[5,7])|(15[0-3,5-9])|(17[0,3,5-8])|(18[0-9])|(147))\\d{8}$").test(aPhone);
    if (bValidate) {
        return true;
    } else {
        return false;
    }
};

util.isTexPhone = function(aPhone) {
    var bValidate = RegExp(/[0-9]{1,}$/).test(aPhone);
    if (bValidate) {
        return true;
    } else
        return false;
};

//
util.isWeiXin = function(weixin) {
    var bValidate = RegExp("^[a-zA-Z]{1}[-_a-zA-Z0-9]{5,19}$").test(weixin);
    var tellPhone = RegExp("^(0|86|17951)?(13[0-9]|15[012356789]|16[0-9]|17[0-9]|18[0-9]|14[57])[0-9]{8}$").test(weixin);
    if (bValidate) {
        return true;
    } else if (tellPhone) {
        return true;
    } else {
        return false;
    }
};

/**
 * 检查字符串是否为合法email地址
 * @param {String} 字符串
 * @return {bool} 是否为合法email地址
 */
util.isEmail = function(aEmail) {
    var bValidate = RegExp(/^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/).test(aEmail);
    if (bValidate) {
        return true;
    } else
        return false;
};
util.isInt = function(str) {
    if (str.length > 15) {
        return false;
    }
    var g = /^(0|[1-9][0-9]*)$/;
    return g.test(str);
}
util.isDouble = function(str) {
    var g = /^[+-]?(0|([1-9]\d*))(\.\d+)?$/g;
    var b = g.test(str);
    return b;
}

util.isDate = function(str) {
    var g = /(([0-9]{3}[1-9]|[0-9]{2}[1-9][0-9]{1}|[0-9]{1}[1-9][0-9]{2}|[1-9][0-9]{3})-(((0[13578]|1[02])-(0[1-9]|[12][0-9]|3[01]))|((0[469]|11)-(0[1-9]|[12][0-9]|30))|(02-(0[1-9]|[1][0-9]|2[0-8]))))|((([0-9]{2})(0[48]|[2468][048]|[13579][26])|((0[48]|[2468][048]|[3579][26])00))-02-29)/;
    return g.test(str);
}

util.isProductVersion = function(str) {
    //	var g = /\d+(\.\d+){2}$/;
    var g = /^\d+\.\d+\.\d+$/;
    var b = g.test(str);
    return b;
}

util.compareVersion = function(curV, reqV) {
    if (curV && reqV) {
        //将两个版本号拆成数字
        var arr1 = curV.split('.'),
            arr2 = reqV.split('.');
        var minLength = Math.min(arr1.length, arr2.length),
            position = 0,
            diff = 0;
        //依次比较版本号每一位大小，当对比得出结果后跳出循环（后文有简单介绍）
        while (position < minLength && ((diff = parseInt(arr1[position]) - parseInt(arr2[position])) == 0)) {
            position++;
        }
        diff = (diff != 0) ? diff : (arr1.length - arr2.length);
        //若curV大于reqV，则返回true
        return diff > 0;
    } else {
        //输入为空
        console.log("版本号不能为空");
        return false;
    }
}

// 比较日期
util.compareDate = function(d1, d2) {
    var arrayD1 = d1.split("-");
    var date1 = new Date(arrayD1[0], arrayD1[1], arrayD1[2]);
    var arrayD2 = d2.split("-");
    var date2 = new Date(arrayD2[0], arrayD2[1], arrayD2[2]);
    if (date1 <= date2) {
        return true;
    } else {
        return false;
    }
}