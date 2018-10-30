const modal = {};
let callbak;
modal.showInfo = function(obj = {}, cal) {
    let d = document.getElementById("modal")
    if (d) document.body.removeChild(d)
    callbak = cal
    let div = document.createElement("div");
    div.setAttribute('id', 'modal')
    let dom = `<div style="position:fixed;left:0px;top:0px;width: 100%;height: 100%;z-index: 100px;background-color:rgba(0,0,0,0.3)">
    <div style="width: 700px;margin: 200px auto;z-index: 101px;border-radius: 4px">
        <div style="color:rgba(51,51,51,1);font-size:20px; width: 100%;height: 76px;line-height:
                76px;background-color:
                rgba(244,248,255,1);border-bottom: 1px solid #d7d7d7">
            <span style="margin-left: 32px">Confirm the following information</span>
        </div>
        <div style="font-size:16px;width: 100%;padding:10px 0 28px 0;background-color:
        rgba(255,255,255,1);color:rgba(102,102,102,1) ;border-bottom: 1px solid #d7d7d7">`
    for (let o in obj) {
        dom += `<div style="margin-top: 18px;margin-left:20px">
                 <div style="display: inline-block;width: 180px;text-align: left;vertical-align: top">${o}:</div>
                 <div style="display: inline-block;width: 480px;text-align: left;word-break: break-all ;vertical-align: top">
                     ${obj[o]}</div>
             </div>`
    }
    dom += `</div>
        <div style="font-size:16px;width: 100%;height: 76px;background-color:rgba(255,255,255,1)">
            <div
                    style="cursor:pointer;font-size:20px;text-align:center;color:rgba(153,153,153,1);width: 48%;height: 100%;line-height:
                    76px;display:
                    inline-block;vertical-align: top" onclick="cancel(this)">Cancel</div>
            <div    style="vertical-align:top;width:2px;border-left:1px solid rgba(204,204,204,1);height: 60px;display:
                    inline-block;margin-top: 8px"></div>
            <div style="cursor:pointer;font-size:20px;text-align:center;color:rgba(60, 49, 215, 1);width: 48%;height: 100%;line-height:
                    76px;display:
                    inline-block;vertical-align: top" onclick="confirm(this)">confirm</div>
        </div>
    </div>
</div>`
    div.innerHTML = dom;
    document.body.appendChild(div)
}

modal.error = function(obj, cal) {
    callbak = cal
    let d = document.getElementById("modal")
    if (d) document.body.removeChild(d)
    let title = obj.title || 'Notice';
    let msg = obj.msg;
    let okText = obj.okText || 'confirm'
    let div = document.createElement("div");
    div.setAttribute('id', 'modal')
    let dom = `<div
        style="
        position:fixed;left:0px;top:0px;width: 100%;height: 100%;z-index: 100px;background-color:rgba(0,0,0,0.3)">
    <div
            style="margin:300px auto;
            background-color:rgba(255, 255, 255, 1);width: 420px;vertical-align: middle;padding: 10px 15px;z-index: 101px;border-radius: 4px">
            <span style="font-size: 18px;color: #303133">${title}</span>
            <div style="margin-top:20px;font-size: 14px;color: #606266" >
                <img style="display: inline-block;vertical-align: top" height="20"
                     src="./images/error.png"
                     alt="">
                <span style="margin-left:10px;width:380px;display:inline-block;vertical-align: top">
                ${msg}
                </span>
            </div>

            <div    onclick="Ok()"
                    style="padding:0 10px;margin-top: 20px;cursor: pointer;
                    float: right;text-align:center;line-height:30px;border-radius:3px;background-color:#409eff;color:rgba(255, 255,255, 1)"
                    >
					${okText}
                
            </div>
            <div style="height: 50px"></div>
    </div>
</div>`
    div.innerHTML = dom;
    document.body.appendChild(div)

}

modal.success = function(obj, cal) {
    let d = document.getElementById("modal")
    if (d) document.body.removeChild(d)
    let title = obj.title || 'Notice';
    let msg = obj.msg;
    let okText = obj.okText || 'confirm'
    let div = document.createElement("div");
    div.setAttribute('id', 'modal')
    let dom = `<div
        style="
        position:fixed;left:0px;top:0px;width: 100%;height: 100%;z-index: 100px;background-color:rgba(0,0,0,0.3)">
    <div
            style="margin:300px auto;
            background-color:rgba(255, 255, 255, 1);width: 420px;vertical-align: middle;padding: 10px 15px;z-index: 101px;border-radius: 4px">
            <span style="font-size: 18px;color: #303133">${title}</span>
            <div style="margin-top:20px;font-size: 14px;color: #606266" >
            	         <img style="display: inline-block;vertical-align: top" height="20"
                     src="./images/success.png"
                     alt="">  	   
                <span style="margin-left:10px;width:380px;display:inline-block;vertical-align: top">
                You can use the transaction hash to query the transaction in the explorer.<br>
	                <span style="word-wrap:break-word">
	                hash:${msg}
					</span>                
                </span>
            </div>

            <div    onclick="Ok()"
                    style="padding:0 10px;margin-top: 20px;cursor: pointer;
                    float: right;text-align:center;line-height:30px;border-radius:3px;background-color:#409eff;color:rgba(255, 255,255, 1)"
                    >
					${okText}
            </div>
            <div style="height: 50px"></div>
    </div>
</div>`
    div.innerHTML = dom;
    document.body.appendChild(div)
}
modal.burnSuccess = function(obj, cal) {
    let d = document.getElementById("modal")
    if (d) document.body.removeChild(d)
    let title = obj.title || 'Notice';
    let msg = obj.msg;
    let okText = obj.okText || 'confirm'
    let div = document.createElement("div");
    div.setAttribute('id', 'modal')
    let dom = `<div
        style="
        position:fixed;left:0px;top:0px;width: 100%;height: 100%;z-index: 100px;background-color:rgba(0,0,0,0.3)">
    <div
            style="margin:300px auto;
            background-color:rgba(255, 255, 255, 1);width: 420px;vertical-align: middle;padding: 10px 15px;z-index: 101px;border-radius: 4px">
            <span style="font-size: 18px;color: #303133">${title}</span>
            <div style="margin-top:20px;font-size: 14px;color: #606266" >
            	         <img style="display: inline-block;vertical-align: top" height="20"
                     src="./images/success.png"
                     alt="">  	   
                <span style="margin-left:10px;width:380px;display:inline-block;vertical-align: top">
                Operation success, click the URL below to view the results.<br>
	                <span onClick="toEth(this)" style="word-wrap:break-word;cursor: pointer;">
                    ${msg}
					</span>                
                </span>
            </div>
            <div    onclick="Ok()"
                    style="padding:0 10px;margin-top: 20px;cursor: pointer;
                    float: right;text-align:center;line-height:30px;border-radius:3px;background-color:#409eff;color:rgba(255, 255,255, 1)"
                    >
					${okText}
            </div>
            <div style="height: 50px"></div>
    </div>
</div>`
    div.innerHTML = dom;
    document.body.appendChild(div)
}

modal.prompt = function(cal) {
    callbak = cal
    let d = document.getElementById("modal")
    if (d) document.body.removeChild(d)
    let div = document.createElement("div");
    div.setAttribute('id', 'modal')
    let dom = `
    <div style="
    position:fixed;left:0px;top:0px;width: 100%;height: 100%;z-index: 100px;background-color:rgba(0,0,0,0.3)">
        <div style="margin:300px auto;
    background-color:rgba(255, 255, 255, 1);width: 420px;vertical-align: middle;padding: 10px 15px;z-index: 101px;border-radius: 4px">
            <span style="font-size: 18px;color: #303133">Please Enter Password</span>
            <div style="margin-top:20px;font-size: 14px;color: #606266">
                <div class="in-box">
                    <input id='unViewPwd' onpropertychange="pwdChange(this.value)" oninput="pwdChange(this.value)" type="password"  placeholder="Enter your wallet password">
                    <input id='viewPwd' style='display:none' onpropertychange="pwdChange(this.value)" oninput="pwdChange(this.value)" type="text"      placeholder="Enter your wallet password">
                    <img id='open' style='display:none' src="./images/eyeopen.png" onClick="openClick()" >
                    <img id='close' src="./images/eyeclose.png" onClick="closeClick()">
                </div>
                <div id="warnTip" style="display:none;position:absolute;padding-top:5px;color: rgba(215, 49, 111, 1);font-size: 12px">Your password must be at least 9 characters</div>
            </div>

            <div onClick="download()" style="padding:0 10px;margin-top: 30px;cursor:pointer;
    float: right;text-align:center;line-height:30px;border-radius:3px;background-color:#409eff;color:rgba(255, 255,255, 1)">

                confirm
            </div>
            <div onClick="cancel()" style="padding:0 10px;margin-top: 30px;margin-right: 20px;cursor:pointer;
    float: right;text-align:center;line-height:30px;border-radius:3px;    border: 1px solid #dcdfe6;color: #606266;">

                cancel
            </div>
            <div style="height: 65px"></div>
        </div>
    </div>`
    div.innerHTML = dom;
    document.body.appendChild(div)

}

function confirm() {
    callbak()
    let dom = document.getElementById("modal")
    document.body.removeChild(dom)
    callbak = null;
}

function cancel() {
    let dom = document.getElementById("modal")
    document.body.removeChild(dom)
}

function Ok() {
    if (callbak) callbak()
    let dom = document.getElementById("modal")
    document.body.removeChild(dom)
}


function pwdChange(e) {
    document.getElementById('unViewPwd').value = e;
    document.getElementById('viewPwd').value = e;
    if (e.length >= 9 && document.getElementById('warnTip').style.display == 'block') {
        document.getElementById('warnTip').style.display = 'none'
    }
}

function openClick() {
    document.getElementById('unViewPwd').style.display = 'inline';
    document.getElementById('viewPwd').style.display = 'none'
    document.getElementById('open').style.display = 'none'
    document.getElementById('close').style.display = 'inline'
}

function closeClick() {
    document.getElementById('unViewPwd').style.display = 'none';
    document.getElementById('viewPwd').style.display = 'inline'
    document.getElementById('open').style.display = 'inline'
    document.getElementById('close').style.display = 'none'
}

function download() {
    let pwd = document.getElementById('unViewPwd').value;
    if (pwd.length < 9) {
        document.getElementById('warnTip').style.display = 'block'
        return
    }
    callbak(pwd)
    let dom = document.getElementById("modal")
    document.body.removeChild(dom)
}

function cancel() {
    let dom = document.getElementById("modal")
    document.body.removeChild(dom)
}

function toEth(e) {
    console.log(e.innerText)
    window.open(e.innerText)
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
}