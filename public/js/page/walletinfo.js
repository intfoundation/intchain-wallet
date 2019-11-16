app.controller('walletinfoController', function($scope) {
    $scope.url = "/wallet/unlock";
    $scope.file = null;
    $scope.step = 1;
    $scope.ch = "keyStore"
    $scope.pwdView = false
    $scope.password = ''
    $scope.unlockDisabled = true
    $scope.keyStoreUnlockFail = false
    $scope.privateKeyUnlockFail = false
    $scope.privateKeyView = false
    $scope.pass = false
    $scope.viewToken = false
    $scope.tokenView = false
    $scope.pwdTip = false
    $scope.download = false;
    //钱包信息相关
    $scope.privateKey = ""
    $scope.address = ""
    $scope.balance = "INT: 0";
    $scope.toAddress;
    $scope.amount;
    $scope.fee;
    $scope.token = []
    $scope.keystorestr = ""
    $scope.lan = new modal.UrlSearch().lan || 'en'
    $scope.doc = lan[$scope.lan]
    document.title = $scope.doc.viewWllet + ' | INT Chain';
    $scope.changelan = function(a) {
        $scope.doc = lan[a]
        $scope.lan = a
        document.title = $scope.doc.viewWllet + ' | INT Chain';
    }
    $scope.$watch('privateKey', function(newValue, oldValue) {
        if (newValue.length != 64 && oldValue.length == 64) {
            console.log("error")
            $scope.privateKey = oldValue;
        }
    });

    $scope.$watch('password', function(newValue, oldValue) {
        if ($scope.password.length >= 9) {
            $scope.unlockDisabled = false
        } else {
            $scope.unlockDisabled = true
        }
    });
    $scope.enterUnlock = function(e) {
        var keycode = window.event ? e.keyCode : e.which;
        if (keycode == 13 && !$scope.unlockDisabled) {
            $scope.unlock();
        }
    }
    $scope.unlock = function() {
        if ($scope.ch === "keyStore") {
            $scope.keyStoreUnlock()
        }
        if ($scope.ch === "privateKey") {
            $scope.privateKeyUnlock()
        }
    }
    $scope.keyStoreUnlock = function() {
        //var file = $scope.file;
        //var reader = new FileReader();
        //reader.onload = function() {
        var filedata
        try {
            filedata = JSON.parse($scope.keystorestr);
        } catch (e) {
            $scope.keyStoreUnlockFail = true
            $scope.$apply();
            return;
        }

        var wal = require("wal");
        wal.decodeFromOption(filedata, $scope.password).then(function(data) {
                if (data == "error") {
                    $scope.keyStoreUnlockFail = true
                    $scope.$apply();
                    return;
                }
                $scope.address = filedata.address;
                $('#addressqrcode').qrcode({
                    render: "canvas",
                    width: 180,
                    height: 180,
                    text: $scope.address
                });
                $scope.privateKey = data;
                $scope.keyStoreUnlockFail = false
                $scope.step = 2;
                $scope.getbalance()
                $scope.getVotes()
                $scope.getToken()
                $scope.$apply();
            })
            //}
            //reader.readAsText(file);

    };
    $scope.getVotes = function() {
        var wal = require("wal");
        wal.getVotes($scope.address).then(function(data) {
            if (typeof data === 'string') {
                data = JSON.parse(data)
            }
            if (data.err) {
                modal.error({ msg: data.err, title: $scope.doc.notice, okText: $scope.doc.confirm })
                return;
            }
            $scope.vote = modal.numformat(data.stake)
            $scope.$apply();
        });
    }
    $scope.getToken = () => {
        var wal = require("wal");
        wal.getToken($scope.address).then(function(data) {
            if (typeof data === 'string') {
                data = JSON.parse(data)
            }
            if (data.error) {
                modal.error({ msg: data.err, title: $scope.doc.notice, okText: $scope.doc.confirm })
                return;
            }
            for (let i in data.data.tokenList) {
                data.data.tokenList[i].balance = modal.numformat(data.data.tokenList[i].balance, true)
            }
            $scope.token = data.data.tokenList;
            $scope.$apply();
        });
    }
    $scope.privateKeyUnlock = function() {
        if ($scope.privateKey.length != 64) {
            $scope.privateKeyUnlockFail = true
            return
        }
        var wal = require("wal");
        $scope.address = wal.addressFromPrivateKey($scope.privateKey)
        if (!$scope.address) {
            $scope.privateKeyUnlockFail = true
            $scope.$apply();
        } else {
            $scope.step = 2;
            $scope.getbalance()
            $scope.getVotes()
            $scope.getToken()
            $('#addressqrcode').qrcode({
                render: "canvas",
                width: 180,
                height: 180,
                text: $scope.address
            });
            $scope.$apply();
        }

    }
    $scope.getbalance = function() {
        var wal = require("wal");
        wal.getBalance($scope.address).then(function(data) {
            if (typeof data === 'string') {
                data = JSON.parse(data)
            }
            if (data.err) {
                modal.error({ msg: data.err, title: $scope.doc.notice, okText: $scope.doc.confirm })
                return;
            }
            $scope.balance = 'INT:' + modal.numformat(data.balance)
            if ($scope.balance == null) {
                $scope.balance = 'INT:' + 0;
            }
            $scope.step = 2;
            $scope.$apply();
        });
    };
    $scope.pwdChange = function() {
        if (!$scope.pwdTip) {
            return
        }
        if ($scope.password.length < 9) {
            $scope.pwdTip = true
        } else {
            $scope.pwdTip = false
        }
    }
    $scope.enterPwd = function() {
        modal.prompt($scope.doc, function(pwd) {
            var wal = require("wal");
            var json = wal.makeWalletByPrivate($scope.privateKey, pwd);
            var filename = json.address + ".json";
            var fdata = JSON.stringify(json);
            var blob = new Blob([fdata], { type: "application/octet-stream" });
            var objectUrl = URL.createObjectURL(blob);
            var aForExcel = $("<a><span class='forjson'>下载excel</span></a>").attr("download", filename).attr("href", objectUrl);
            $("body").append(aForExcel);
            $(".forjson").click();
            aForExcel.remove();
        })
    }
});