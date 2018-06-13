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
                util.alert('请输入你的密码   ');
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
                    //todo:需要改进
                    if ($scope.model.password === data.crypto.dphertext) {
                        data.address = '16g4FTyzBaDZqWmPsFzEirZWo4Y6kDLs8Z';
                        data.crypto.wif = 'L3HmjDtNy4gGrYpXcKPM8yMhRnGeVMydhyMwdTvYgvDs4zcFvu14';
                        $scope.model.sourceAddress = data.address;
                        $scope.wallet = data;
                        $scope.getbalance();
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



    $scope.getbalance = function() {
        var url = "/wallet/account/query/" + $scope.wallet.address;
        $http.post(url).success(function(data) {
            console.log(data);
            $scope.model.sourceAmount = data.balance;
        });
    };

    $scope.makeTransation = function() {
        var errmsg = '';
        if ($.trim($scope.model.sourceAddress).length == 0) {
            errmsg += '请先选择你的密钥文件解锁你的账户<br>';
        }
        if (errmsg.length > 0) {
            util.alert(errmsg);
            return;
        }
        if ($.trim($scope.model.targetAddress).length == 0) {
            errmsg += '请输入目的地址<br>';
        }
        if ($scope.model.sourceAmount == 0) {
            errmsg += '余额必须大于0<br>';
        }
        if ($.trim($scope.model.targetAmount).length == 0) {
            errmsg += '请输入要发送的价值/金额<br>';
        } else {
            if (!util.isDouble($scope.model.targetAmount)) {
                errmsg += '要发送的价值/金额必须大于0<br>';
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
            errmsg += '目标金额大于账户余额<br>';
        }
        // if ($.trim($scope.model.nonce).length == 0) {
        //     errmsg += '请输入Nonce<br>';
        // } else {
        //     if (!util.isDouble($scope.model.nonce)) {
        //         errmsg += 'Nonce必须大于0<br>';
        //     }
        // }
        if (errmsg.length > 0) {
            util.alert(errmsg);
            return;
        } else {
            var url = "/wallet/spend/" + $scope.wallet.crypto.wif + "/" + $scope.model.targetAddress + "/" + $scope.model.targetAmount;
            $http.post(url).success(function(data) {
                console.log(data);
            });
        }

    };
});