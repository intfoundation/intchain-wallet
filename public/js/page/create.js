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
        var data = new WalletAccount().makeWalletAccount($scope.password);
        console.log(data);
        // var url = 'wallet/make';
        // $http.post(url, { pwd: $scope.password }, { responseType: 'arraybuffer' }).success(function(data, status, headers) {
        //     console.log(headers());
        //     var headers = headers();
        //     var blob = new Blob([data], { type: "application/octet-stream" });
        //     var objectUrl = URL.createObjectURL(blob);
        //     var aForExcel = $("<a><span class='forjson'>下载excel</span></a>").attr("download", headers.jsonfilename).attr("href", objectUrl);
        //     $("body").append(aForExcel);
        //     $(".forjson").click();
        //     aForExcel.remove();
        //     $scope.password = '';
        // }).error(function() {

        // });
    }
});