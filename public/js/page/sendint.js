app.controller('sendintController', function($scope) {
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

    $scope.unlock1 = function() {
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
                    $scope.wallet = data;
                    $scope.getbalance();
                } else {
                    util.alert('Password error, unlock fail');
                }
            }
            reader.readAsText(file);
        } else {
            util.alert('Please select wallet file');
        }
    };

    $scope.unlock = function() {
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
                var wal = require("wal");
                wal.decodeFromOption(filedata, $scope.model.password).then(data => {
                    if (data) {
                        $scope.model.sourceAddress = filedata.address;
                        $scope.wallet.privateKey = data;
                        $scope.getbalance();
                    } else {
                        util.alert('Password error, unlock fail');
                    }
                })

            }
            reader.readAsText(file);
        } else {
            util.alert('Please select wallet file');
        }
    };

    $scope.getbalance = function() {
        var wal = require("wal");
        wal.getBalance($scope.model.sourceAddress).then(data => {
            if (typeof data === 'string') {
                data = JSON.parse(data)
            }
            if (data.err) {
                util.alert(data.err)
                return;
            }
            $scope.model.sourceAmount = data.balance;
            if ($scope.model.sourceAmount == null) {
                $scope.model.sourceAmount = 0.0;
            }
            util.alert('Unlock Successfully');
            $scope.$apply();
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
        if ($scope.model.gasPrice == 0) {
            errmsg += 'The gas price must be more than 0<br>';
            util.alert(errmsg);
            errmsg = '';
            return;
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
        if (+$scope.model.sourceAmount <= +$scope.model.targetAmount) {
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
            var wal = require("wal");
            var outarray = [{ address: $scope.model.targetAddress, amount: $scope.model.targetAmount }];
            wal.transfer($scope.model.targetAmount, $scope.model.gasPrice, $scope.model.targetAddress, $scope.wallet.privateKey).then(
                data => {
                    if (typeof data === 'string') {
                        data = JSON.parse(data)
                    }
                    if (data.err) {
                        util.alert(data.err)
                    } else {
                        util.alertwithtile("Transaction Hash", "Transaction Hash:" + data.hash + "<br\> You can use your hash in explorer to search your transaction");
                    }
                });
        }
    };
});