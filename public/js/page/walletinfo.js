app.controller('walletinfoController', function($scope, $http) {
    $scope.url = "/wallet/unlock";
    $scope.file = null;
    $scope.model = {
        password: '',
        sourceAddress: '',
        sourceAmount: '',
        encryptCode: '',
        cryptCode: '',
        addressQrcode: ''
    };
    $scope.query = function() {
        if ($scope.file) {
            if ($.trim($scope.model.password).length == 0) {
                util.alert('Please input your password');
                return;
            }

            var file = $scope.file;
            var reader = new FileReader(); //new一个FileReader实例
            // if (/text+/.test(file.type)) { //判断文件类型，是不是text类型
            reader.onload = function() {
                var filedata = JSON.parse(this.result);
                var wal = require("int");
                var data = new wal().decodeFromOption(filedata);
                if (data.crypto.dphertext == $scope.model.password) {
                    util.alert('Unlock Successfully');
                    $scope.model.sourceAddress = data.address;
                    $scope.model.encryptCode = data.crypto.wif;
                    $scope.model.cryptCode = data.crypto.ciphertext;
                    $scope.getbalance();
                    $scope.getqrcodeimg();
                } else {
                    util.alert('Password error, unlock fail');
                }
            }
            reader.readAsText(file);
        } else {
            util.alert('Please select wallet file');
        }
    };

    $scope.getqrcodeimg = function() {
        if ($scope.model.sourceAddress.length > 0) {
            $('#addressqrcode').qrcode({
                render: "canvas",
                width: 150,
                height: 150,
                text: $scope.model.sourceAddress
            });
            $('#addressqrcode').css('border', 'none');
        }
    };

    $scope.getbalance = function() {
        var wal = require("int");
        new wal().getaccount($scope.model.sourceAddress).then(data => {
            console.log(data);
            $scope.model.sourceAmount = JSON.parse(data).balance;
            $scope.$apply();
        });
    };
});