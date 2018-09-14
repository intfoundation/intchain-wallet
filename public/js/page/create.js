app.controller('mainController', function($scope, $http) {
    $scope.password = '';
    $scope.makefile = function() {
        //正则表达式
        var password = $.trim($scope.password);
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