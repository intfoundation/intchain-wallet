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
                util.alert('请输入你的密码');
                return;
            }
            $.ajax({
                type: "POST",
                url: $scope.url,
                data: $scope.file,
                processData: false,
                contentType: false,
                success: function(data) {
                    console.log(data);
                    $scope.model.encryptCode = '';
                    //todo:需要改进
                    if ($scope.model.password === data.crypto.dphertext) {
                        $scope.model.sourceAddress = data.address;
                        $scope.model.encryptCode = data.crypto.wif;
                        $scope.model.cryptCode = data.crypto.ciphertext;
                        $scope.getbalance();
                        $scope.getqrcodeimg();
                    } else {
                        util.alert('密码错误');
                    }
                    $scope.$apply();
                }
            });
        } else {
            util.alert('请选择钱包文件');
        }
    };

    $scope.getqrcodeimg = function() {
        if ($scope.model.sourceAddress.length > 0) {
            $('#addressqrcode').qrcode({
                render: "canvas",
                text: $scope.model.sourceAddress
            });
        }
    };

    $scope.getbalance = function() {
        var url = "/wallet/account/query/" + $scope.model.sourceAddress;
        $http.post(url).success(function(data) {
            $scope.model.sourceAmount = data.balance;
            if (data.balance == null) {
                $scope.model.sourceAmount = 0;
            }
        });
    };

});