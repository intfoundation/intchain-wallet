app.controller('sendintController', function($scope, $http, FileUploader) {
    $scope.url = "/wallet/unlock";
    $scope.file = null;
    $scope.wallet = {};
    $scope.model = {
        password: '',
        sourceAddress: '',
        sourceAmount: '',
        targetAddress: '',
        targetAmount: '',
        gasLimit: '',
        gasPrice: '',
        nonce: ''
    };
    $scope.unlock = function() {
        if ($scope.file) {
            if ($.trim($scope.model.password).length == 0) {
                util.alert('Please input your password');
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
                    //todo:需要改进（解锁次数限制）
                    if ($scope.model.password === data.crypto.dphertext) {
                        util.alert('Unlock Successfully');
                        $scope.model.sourceAddress = data.address;
                        $scope.wallet = data;
                        $scope.getbalance();
                    } else {
                        util.alert('Password error, unlock fail');
                    }
                    $scope.$apply();
                }
            });
        } else {
            util.alert('Please select wallet file');
        }
    };



    $scope.getbalance = function() {
        var url = "/wallet/account/query/" + $scope.wallet.address;
        $http.post(url).success(function(data) {
            $scope.model.sourceAmount = data.balance;
        });
    };

    $scope.makeTransation = function() {
        var errmsg = '';
        if ($.trim($scope.model.sourceAddress).length == 0) {
            errmsg += 'Please select your key file to unlock your account<br>';
            util.alert(errmsg);
            errmsg = '';
            return;
        }
        // if (errmsg.length > 0) {
        //     util.alert(errmsg);
        //     return;
        // }
        if ($.trim($scope.model.targetAddress).length == 0) {
            errmsg += 'Please enter the destination address<br>';
            util.alert(errmsg);
            errmsg = '';
            return;
        }
        // if (errmsg.length > 0) {
        //   util.alert(errmsg);
        //   return;
        // }
        if ($scope.model.sourceAmount == 0) {
            errmsg += 'The balance must be more than 0<br>';
            util.alert(errmsg);
            errmsg = '';
            return;
        }
        if ($.trim($scope.model.targetAmount).length == 0) {
            errmsg += 'Please enter the value / amount to be sent.<br>';
            util.alert(errmsg);
            errmsg = '';
            return;
        } else {
            if (!util.isDouble($scope.model.targetAmount)) {
                errmsg += 'The value / amount to be sent must be more than 0<br>';
                util.alert(errmsg);
                errmsg = '';
                return;
            }
        }
        // if ($.trim($scope.model.gasLimit).length == 0) {
        //     errmsg += '请输入Gas限制<br>';
        // } else {
        //     if (!util.isDouble($scope.model.gasLimit)) {
        //         errmsg += 'Gas限制必须大于0<br>';
        //     }
        // }
        // if ($.trim($scope.model.gasPrice).length == 0) {
        //     errmsg += '请输入Gas价格<br>';
        // } else {
        //     if (!util.isDouble($scope.model.gasPrice)) {
        //         errmsg += 'Gas价格大于0<br>';
        //     }
        // }
        if ($scope.model.sourceAmount <= $scope.model.targetAmount) {
            errmsg += 'The target amount is greater than the balance of the account<br>';
            util.alert(errmsg);
            errmsg = '';
            return;
        }
        // if ($.trim($scope.model.nonce).length == 0) {
        //     errmsg += '请输入Nonce<br>';
        // } else {
        //     if (!util.isDouble($scope.model.nonce)) {
        //         errmsg += 'Nonce必须大于0<br>';
        //     }
        // }
        else {
            var url = "/wallet/spend/" + $scope.wallet.crypto.wif + "/" + $scope.model.targetAddress + "/" + $scope.model.targetAmount;
            $http.post(url).success(function(data) {
                console.log('111')
                console.log(data);
            });
        }

    };
});