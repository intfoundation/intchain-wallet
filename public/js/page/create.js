app.controller('mainController', function($scope, $http) {
    $scope.password = '';
    $scope.makefile = function() {
        //正则表达式
        var password = $.trim($scope.password);
        if ($.trim($scope.password).length == 0) {
            util.alert('Please input the password');
        } else if (password.length < 9) {
            util.alert('密码格式不对，请重新输入');
        } else {
            makefile($scope);
        }
    }
    var makefile = function($scope) {
        console.log($scope.password);
        var wal = require("int");
        var data = new wal().makeWalletAccount($scope.password);
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