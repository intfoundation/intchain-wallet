app.controller('sendintController', function($scope) {
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
        //钱包信息相关
    $scope.privateKey = ""
    $scope.address = ""
    $scope.balance = 0;
    $scope.toAddress;
    $scope.amount;
    $scope.limit;
    $scope.price = 0.00001;
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

    $scope.keyStoreUnlock = function() {
        var file = $scope.file;
        var reader = new FileReader();
        reader.onload = function() {
            var filedata = JSON.parse(this.result);
            var wal = require("wal");
            wal.decodeFromOption(filedata, $scope.password).then(data => {
                $scope.address = filedata.address;
                $scope.privateKey = data;
                $scope.keyStoreUnlockFail = false
                $scope.getbalance();
                $scope.getPrice()
                $scope.$apply();
            }).catch(e => {
                $scope.keyStoreUnlockFail = true
                $scope.$apply();
            })
        }
        reader.readAsText(file);

    };
    $scope.getPrice = function() {
        var wal = require("wal");
        wal.getPrice().then(data => {
            if (typeof data === 'string') {
                data = JSON.parse(data)
            }
            if (data.err) {
                modal.error({ msg: data.err })
                return;
            }
            $scope.price = (data.gasPrice / Math.pow(10, 18)).toFixed(18).replace(/\.0+$/, "").replace(/(\.\d+[1-9])0+$/, "$1")
            $scope.$apply();
        })
    }
    $scope.getLimit = function() {
        var wal = require("wal");
        wal.getLimit('transferTo', $scope.amount).then(data => {
            if (typeof data === 'string') {
                data = JSON.parse(data)
            }
            if (data.err) {
                modal.error({ msg: data.err })
                return;
            }
            $scope.limit = data.limit
            $scope.$apply();
        })
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
        } else {
            $scope.getbalance()
            $scope.getPrice()
            $scope.step = 2;
        }
        $scope.$apply();
    }
    $scope.getbalance = function() {
        var wal = require("wal");
        wal.getBalance($scope.address).then(data => {
            if (typeof data === 'string') {
                data = JSON.parse(data)
            }
            if (data.err) {
                modal.error({ msg: data.err })
                return;
            }
            $scope.balance = data.balance / Math.pow(10, 18);
            if ($scope.balance == null) {
                $scope.balance = 0;
            }
            $scope.step = 2;
            $scope.$apply();
        });
    };
    $scope.$watch('{toAddress:toAddress,amount:amount,limit:limit,price:price}', function(v) {
        if (v.toAddress && v.amount && v.limit && v.price) {
            $scope.pass = true
        } else {
            $scope.pass = false
        }
    })
    $scope.enterEvent = function(e) {
        var keycode = window.event ? e.keyCode : e.which;
        if (keycode == 13 && $scope.pass) {
            $scope.send();
        }
    }
    $scope.send = function() {
        var wal = require("wal");
        if ($scope.toAddress.length != 34) {
            modal.error({ msg: 'To address is not valid' })
            return
        }
        if (isNaN($scope.amount) || $scope.amount <= 0) {
            modal.error({ msg: 'Amount is not valid' })
            return
        }
        if (+$scope.amount >= +$scope.balance) {
            modal.error({ msg: 'Amount must be less then balance' })
            return
        }
        if (isNaN($scope.limit) || $scope.limit <= 0) {
            modal.error({ msg: 'Limit is not valid' })
            return
        }
        if (isNaN($scope.price) || $scope.price <= 0) {
            modal.error({ msg: 'Price is not valid' })
            return
        }
        wal.transfer($scope.amount, $scope.limit, $scope.price, $scope.toAddress, $scope.privateKey)
            .then(res => {
                if (res.err) {
                    modal.error({ msg: res.err })
                    return;
                }

                modal.showInfo(res.info, function() {
                    wal.sendSignedTransaction(res.renderStr).then(r => {
                        if (typeof r === 'string') {
                            r = JSON.parse(r)
                        }
                        if (r.err) {
                            modal.error({ msg: r.err })
                        } else {
                            modal.burnSuccess({ msg: 'https://explorer.intchain.io/#/blockchain/txdetail?hash=' + res.hash })

                        }
                    })
                })
            })

    }
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
                        util.alertwithtile("Transaction Hash", "Transaction Hash:" + data.hash + "<br\> You can use the transaction hash to query the transaction in the explorer.");
                    }
                });
        }
    };
});