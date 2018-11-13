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
        var file = $scope.file;
        var reader = new FileReader();
        reader.onload = function() {
            var filedata = JSON.parse(this.result);
            var wal = require("wal");
            wal.decodeFromOption(filedata, $scope.password).then(function(data) {
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
        }
        reader.readAsText(file);

    };
    $scope.getVotes = function() {
        var wal = require("wal");
        wal.getVotes($scope.address).then(function(data) {
            if (typeof data === 'string') {
                data = JSON.parse(data)
            }
            if (data.err) {
                modal.error({ msg: data.err })
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
                modal.error({ msg: data.err })
                return;
            }
            for (let i in data.data.tokenList) {
                data.data.tokenList[i].balance = (+data.data.tokenList[i].balance).toFixed(5)
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
                modal.error({ msg: data.err })
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
        modal.prompt(pwd => {
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

// app.controller('walletinfoController', function($scope, $http) {
//     $scope.url = "/wallet/unlock";
//     $scope.file = null;
//     $scope.model = {
//         password: '',
//         sourceAddress: '',
//         sourceAmount: '',
//         encryptCode: '',
//         cryptCode: '',
//         addressQrcode: ''
//     };
//     $scope.query1 = function() {
//         if ($scope.file) {
//             if ($.trim($scope.model.password).length == 0) {
//                 util.alert('Please input your password');
//                 return;
//             }

//             var file = $scope.file;
//             var reader = new FileReader(); //new一个FileReader实例
//             // if (/text+/.test(file.type)) { //判断文件类型，是不是text类型
//             reader.onload = function() {
//                 var filedata = JSON.parse(this.result);
//                 var wal = require("int");
//                 var data = new wal().decodeFromOption(filedata);
//                 if (data.crypto.dphertext == $scope.model.password) {
//                     util.alert('Unlock Successfully');
//                     $scope.model.sourceAddress = data.address;
//                     $scope.model.encryptCode = data.crypto.wif;
//                     $scope.model.cryptCode = data.crypto.ciphertext;
//                     $scope.getbalance();
//                     $scope.getqrcodeimg();
//                 } else {
//                     util.alert('Password error, unlock fail');
//                 }
//             }
//             reader.readAsText(file);
//         } else {
//             util.alert('Please select wallet file');
//         }
//     };

//     $scope.query = function() {
//         if ($scope.file) {
//             if ($.trim($scope.model.password).length == 0) {
//                 util.alert('Please input your password');
//                 return;
//             }

//             var file = $scope.file;
//             var reader = new FileReader(); //new一个FileReader实例
//             // if (/text+/.test(file.type)) { //判断文件类型，是不是text类型
//             reader.onload = function() {
//                 var filedata = JSON.parse(this.result);
//                 var wal = require("wal");
//                 wal.decodeFromOption(filedata, $scope.model.password).then(data => {
//                     if (data) {
//                         util.alert('Unlock Successfully');
//                         $scope.model.sourceAddress = filedata.address;
//                         $scope.model.encryptCode = data;
//                         $scope.getbalance();
//                         $scope.getqrcodeimg();
//                     } else {
//                         util.alert('Password error, unlock fail');
//                     }
//                 })

//             }
//             reader.readAsText(file);
//         } else {
//             util.alert('Please select wallet file');
//         }
//     };

//     $scope.getqrcodeimg = function() {
//         if ($scope.model.sourceAddress.length > 0) {
//             $('#addressqrcode').remove()
//             $('#qrcode-box').append('<div id="addressqrcode"></div>')
//             $('#addressqrcode').qrcode({
//                 render: "canvas",
//                 width: 150,
//                 height: 150,
//                 text: $scope.model.sourceAddress
//             });
//             $('#addressqrcode').css('border', 'none');
//         }
//     };

//     $scope.getbalance = function() {
//         var wal = require("wal");
//         wal.getBalance($scope.model.sourceAddress).then(data => {
//             console.log(data);
//             $scope.model.sourceAmount = JSON.parse(data).balance;
//             if ($scope.model.sourceAmount == null) {
//                 $scope.model.sourceAmount = 0;
//             }
//             $scope.$apply();
//         });
//     };
// });