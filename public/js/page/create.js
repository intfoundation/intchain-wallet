app.controller('mainController', function($scope, $http) {
    $scope.password = '';
    $scope.password2 = '';
    $scope.pwdType = 'password'
    $scope.pwdTip = false
    $scope.rePwdTip = false
    $scope.pwdView = false
    $scope.rePwdView = false
    $scope.voteTabView = false
    $scope.tokenView = false
    $scope.lanView = false
    $scope.step = 1
    $scope.data = {}
    $scope.lan = new modal.UrlSearch().lan || 'en'
    $scope.doc = lan[$scope.lan]
    document.title = $scope.doc.newWallet + '| INT Chain';
    $scope.changelan = function(a) {
        $scope.doc = lan[a]
        $scope.lan = a
        document.title = $scope.doc.newWallet + '| INT Chain';
    }


    $scope.pwdBlur = function() {
        if ($scope.password.length < 9) {
            $scope.pwdTip = true
        } else {
            $scope.pwdTip = false
        }
    }
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
    $scope.rePwdBlur = function() {
        if ($scope.password != $scope.password2) {
            $scope.rePwdTip = true
        } else {
            $scope.rePwdTip = false
        }
    }
    $scope.rePwdChange = function() {
        if (!$scope.rePwdTip) {
            return
        }
        if ($scope.password != $scope.password2) {
            $scope.rePwdTip = true
        } else {
            $scope.rePwdTip = false
        }
    }
    $scope.enterEvent = function(e) {
        var keycode = window.event ? e.keyCode : e.which;
        if (keycode == 13) {
            $scope.create();
        }
    }
    $scope.create = function() {
        if ($scope.password.length < 9) {
            $scope.pwdTip = true
            modal.error({ msg: $scope.doc.nine, title: $scope.doc.notice, okText: $scope.doc.confirm })
            return
        }
        if ($scope.password != $scope.password2) {
            $scope.rePwdTip = true
            return
        }
        var password = $.trim($scope.password);
        if (password != $scope.password) {
            modal.error({
                msg: $scope.doc.noSpace,
                title: $scope.doc.notice,
                okText: $scope.doc.confirm
            })
            return
        }
        var wal = require("wal");
        var data = wal.makeWalletAccount(password);
        $scope.data = data;
        $scope.privateKey = data.privateKey;
        $scope.step = 2
    }
    $scope.downFile = function() {
        var wal = require("wal");
        //var data = wal.makeWalletAccount($.trim($scope.password));
        var data = $scope.data
        var filename = $scope.data.json.address + ".json";
        var fdata = JSON.stringify(data.json);
        var blob = new Blob([fdata], { type: "application/octet-stream" });
        var objectUrl = URL.createObjectURL(blob);
        var aForExcel = $("<a><span class='forjson'>下载excel</span></a>").attr("download", filename).attr("href", objectUrl);
        $("body").append(aForExcel);
        $(".forjson").click();
        aForExcel.remove();
    }
    $scope.makefile = function() {

        //正则表达式

        if ($.trim($scope.password).length == 0) {
            util.alert('Please input the password');
        } else if (password.length < 9) {
            util.alert('Invalid password,please try again.');
        } else {
            makefile($scope);
        }
    }
    var makefile = function($scope) {
        var wal = require("wal");
        var data = wal.makeWalletAccount($.trim($scope.password));
        var filename = data.address + ".json";
        var fdata = JSON.stringify(data);
        var blob = new Blob([fdata], { type: "application/octet-stream" });
        var objectUrl = URL.createObjectURL(blob);
        var aForExcel = $("<a><span class='forjson'>下载excel</span></a>").attr("download", filename).attr("href", objectUrl);
        $("body").append(aForExcel);
        $(".forjson").click();
        aForExcel.remove();
        $scope.password = '';
    }
});