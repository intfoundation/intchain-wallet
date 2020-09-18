app.controller('exchangeController', function ($scope, $http) {
    $scope.pass = true
    $scope.direction = 'INT->ETH';
    $scope.fromCoin = 'INT';
    $scope.toCoin = 'INT_ETH';
    $scope.exchangeDirection = function () {
        $scope.direction = $scope.direction == 'INT->ETH' ? 'ETH->INT' : 'INT->ETH';
        let coin = $scope.fromCoin;
        $scope.fromCoin = $scope.toCoin;
        $scope.toCoin = coin;
        $scope.intPrivateKey = '';
        $scope.ethPrivateKey = '';
        $scope.balance = '';
        $scope.toAddress = '';
    };
    $scope.intPrivateKey = '';
    $scope.ethPrivateKey = '';
    $scope.ethNonce = '';
    $scope.ethGasPrice = '';
    $scope.balance = '';
    $scope.ethBalance = '';
    $scope.toAddress = '';
    $scope.exchangeAmount = '';

    $scope.$watch('{ip:intPrivateKey,ep:ethPrivateKey,t:toAddress,e:exchangeAmount,b:balance}', function (v) {
        if ((v.ip || v.ep) && v.t && v.e && v.b) {
            $scope.pass = true
        } else {
            $scope.pass = false
        }
    })

    $scope.$watch('intPrivateKey', function (value) {
        if ($scope.direction == 'INT->ETH' && $scope.fromCoin == 'INT' && $scope.toCoin == 'INT_ETH') {
            let intPrivateKey = value
            if (value.indexOf("0x") === 0) {
                intPrivateKey = value.substr(2);
            }
            if (intPrivateKey.length == 64) {
                var wal = require("wal");
                let intAddress = wal.addressFromPrivateKey(intPrivateKey);
                $scope.queryIntBalance(intAddress);
            }
        }
    })

    $scope.$watch('ethPrivateKey', function (value) {
        if ($scope.direction == 'ETH->INT' && $scope.fromCoin == 'INT_ETH' && $scope.toCoin == 'INT') {
            let ethPrivateKey = value;
            if (value.indexOf("0x") === 0) {
                ethPrivateKey = value.substr(2);
            }
            if (ethPrivateKey.length == 64) {
                var wal = require("wal");
                let ethAddress = wal.ethPrivateKeyToAccount(ethPrivateKey);
                $scope.queryINTonETHBalance(ethAddress);
            }
        }
    })

    $scope.queryINTonETHBalance = function (ethAddress) {
        var wal = require("wal");
        wal.queryBalance(ethAddress).then(function (data) {
            if (typeof data === 'string') {
                data = JSON.parse(data)
            }
            if (data.err) {
                modal.error({ msg: data.err, title: $scope.doc.notice, okText: $scope.doc.confirm });
                return;
            }
            $scope.balance = +modal.numformat(data.balance);
            $scope.ethBalance = +modal.numformat(data.ethBalance);
            $scope.ethNonce = data.nonce;
            $scope.ethGasPrice = data.gasPrice;
            if ($scope.balance == null) {
                $scope.balance = 0;
            }
            $scope.$apply();
        })
    }

    $scope.queryIntBalance = function (intAddress) {
        let wal = require("wal");
        if (!wal.isValidAddress(intAddress)) {
            return
        }

        wal.getBalance(intAddress).then(function (data) {
            if (typeof data === 'string') {
                data = JSON.parse(data)
            }
            if (data.err) {
                modal.error({ msg: data.err, title: $scope.doc.notice, okText: $scope.doc.confirm });
                return;
            }
            $scope.balance = +modal.numformat(data.balance);

            if ($scope.balance == null) {
                $scope.balance = 0;
            }
            $scope.$apply();
        });
    };
    $scope.toExchange = function () {
        if ($scope.direction == 'INT->ETH' && $scope.fromCoin == 'INT' && $scope.toCoin == 'INT_ETH') {
            $scope.INTToINT_ETH()
        } else if ($scope.direction == 'ETH->INT' && $scope.fromCoin == 'INT_ETH' && $scope.toCoin == 'INT') {
            $scope.INT_ETHtoINT()
        }
    }
    $scope.INT_ETHtoINT = function () {
        var wal = require("wal");
        if (!wal.isValidAddress($scope.toAddress)) {
            modal.error({ msg: $scope.doc.intAddressNotValid, title: $scope.doc.notice, okText: $scope.doc.confirm })
            return;
        }
        if (!$scope.exchangeAmount || isNaN($scope.exchangeAmount) || $scope.exchangeAmount < 0) {
            modal.error({ msg: $scope.doc.exchangeAmountNotValid, title: $scope.doc.notice, okText: $scope.doc.confirm })
            return;
        }
        if (+$scope.exchangeAmount > +$scope.balance) {
            modal.error({ msg: $scope.doc.exchangeAmountCanNotGtBalance, title: $scope.doc.notice, okText: $scope.doc.confirm })
            return;
        }
        if (+$scope.ethBalance < +(($scope.ethGasPrice * 100000 * 2) / Math.pow(10, 18))) {
            modal.error({ msg: 'ETH' + $scope.doc.balanceNotEnough, title: $scope.doc.notice, okText: $scope.doc.confirm })
            return;
        }
        let privateKey = $scope.ethPrivateKey;
        if (privateKey.indexOf("0x") === 0) {
            privateKey = privateKey.substr(2);
        }

        wal.intOnEthToInt({
            nonce: $scope.ethNonce,
            gasPrice: $scope.ethGasPrice,
            toAddress: '0x1c703d0DCE1f8709d329e27e5b527D830D1Bf4e6',
            amount: $scope.exchangeAmount,
            ethPrivateKey: privateKey,
            intAddress: $scope.toAddress
        }).then(function (r) {
            if (typeof r === 'string') {
                r = JSON.parse(r)
            }
            if (r.err) {
                modal.error({ msg: r.err, title: $scope.doc.notice, okText: $scope.doc.confirm })
            } else {
                modal.burnSuccess({ doc: $scope.doc, msg: 'https://etherscan.io/tx/' + r.hash })
                $scope.ethNonce = 2 + +$scope.ethNonce
                //$scope.timeGetBalance()
            }
        })

    }
    $scope.INTToINT_ETH = function () {
        var wal = require("wal");
        if (!wal.isEthAddress($scope.toAddress)) {
            modal.error({ msg: $scope.doc.ethAddressNotValid, title: $scope.doc.notice, okText: $scope.doc.confirm })
            return;
        }
        if (!$scope.exchangeAmount || isNaN($scope.exchangeAmount) || $scope.exchangeAmount < 0) {
            modal.error({ msg: $scope.doc.exchangeAmountNotValid, title: $scope.doc.notice, okText: $scope.doc.confirm })
            return;
        }
        if (+$scope.exchangeAmount > +$scope.balance) {
            modal.error({ msg: $scope.doc.exchangeAmountCanNotGtBalance, title: $scope.doc.notice, okText: $scope.doc.confirm })
            return;
        }
        if (+$scope.exchangeAmount + 0.02 > +$scope.balance) {
            modal.error({ msg: 'INT' + $scope.doc.balanceNotEnough, title: $scope.doc.notice, okText: $scope.doc.confirm })
            return;
        }
        let data = {
            type: 'exchange',
            toCoin: 'INT_ETH',
            toAddress: $scope.toAddress
        }
        let privateKey = $scope.intPrivateKey;
        if (privateKey.indexOf("0x") === 0) {
            privateKey = privateKey.substr(2);
        }
        wal.transfer($scope.exchangeAmount, 100000, 0.0000002, 'INT1HzJLY8Z4uwTgYvPY2sjvQnf8JKzRSfdwF', privateKey, data)

            .then(function (res) {
                if (res.err) {
                    modal.error({ msg: res.err, title: $scope.doc.notice, okText: $scope.doc.confirm })
                    return;
                }

                //modal.showInfo(res.info, $scope.doc, function () {
                wal.sendSignedTransaction(res.renderStr).then(function (r) {
                    if (typeof r === 'string') {
                        r = JSON.parse(r)
                    }
                    if (r.err) {
                        modal.error({ msg: r.err, title: $scope.doc.notice, okText: $scope.doc.confirm })
                    } else {
                        modal.burnSuccess({ doc: $scope.doc, msg: 'https://explorer.intchain.io/blockchain/txdetail?hash=' + r.hash })
                        //$scope.timeGetBalance()
                    }
                })
                //})
            })

    }




    $scope.ethAddress = '';
    //0x04fa4d66a673cBf91F7cf48dfF236482495Fd49e  ng-blur="queryBalance()"
    $scope.hash = '';
    $scope.pass = false;
    $scope.tokenView = false
    $scope.model = {
        fromAddress: '',
        toAddress: '',
        decimalAmount: '',
        decimalGas: '',
        fromAddressPrivateKey: '',
        mydata: '',
        mynonce: '',
        gasLimit: 100000
    };
    $scope.ethBalance = ''
    $scope.intPrivateKey = '';
    $scope.lan = new modal.UrlSearch().lan || 'en'
    $scope.doc = lan[$scope.lan]
    document.title = $scope.doc.crossChainAssetExchange + ' | INT Chain';
    $scope.changelan = function (a) {
        $scope.doc = lan[a]
        $scope.lan = a
        document.title = $scope.doc.crossChainAssetExchange + ' | INT Chain';
    }
    // $scope.$watch('{f:model.fromAddress,t:model.toAddress,g:model.decimalGas,p:model.fromAddressPrivateKey}', function (v) {
    //     if (v.f && v.t && v.g && v.p) {
    //         $scope.pass = true
    //     } else {
    //         $scope.pass = false
    //     }
    // })

    // $scope.$watch('intPrivateKey', function (value) {
    //     if (value.length === 64) {
    //         var wal = require("wal");
    //         $scope.model.toAddress = wal.addressFromPrivateKey(value);
    //         $scope.$apply();
    //     }
    // })
    // $scope.$watch('model.fromAddressPrivateKey', function (value) {
    //     if (value.indexOf("0x") == 0) {
    //         $scope.model.fromAddressPrivateKey = value.substr(2)

    //     }
    //     if (value.length === 64) {
    //         var wal = require("wal");
    //         $scope.model.fromAddress = wal.ethPrivateKeyToAccount(value)
    //         //$scope.intPrivateKey = value
    //         //$scope.model.toAddress = wal.addressFromPrivateKey(value);
    //         $scope.queryBalance();
    //     }
    // })

    // $scope.queryBalance = function () {
    //     //$scope.model.decimalAmount = 0.998;
    //     if ($scope.model.fromAddress.length != 42) {
    //         //modal.error({ msg: 'ETH wallet address is not is not valid' })
    //         return;
    //     }
    //     var wal = require("wal");
    //     wal.queryBalance($scope.model.fromAddress).then(function (data) {
    //         if (data) {
    //             if (data.status === "success") {
    //                 $scope.model.decimalAmount = data.balance
    //                 $scope.ethBalance = modal.numformat(data.ethBalance)
    //                 $scope.model.mydata = data.mydata;
    //                 $scope.model.mynonce = data.mynonce;
    //                 $scope.model.decimalGas = (data.gasPrice / Math.pow(10, 18)).toFixed(18).replace(/\.0+$/, "").replace(/(\.\d+[1-9])0+$/, "$1")
    //                 $scope.$apply();
    //             } else {
    //                 util.alert(data.message)
    //             }
    //         }
    //     })
    // }
    $scope.enterEvent = function (e) {
        var keycode = window.event ? e.keyCode : e.which;
        if (keycode == 13 && $scope.pass) {
            $scope.toMapping();
        }
    }
    $scope.toMapping = function () {
        var wal = require("wal");
        if ($scope.model.fromAddress.length != 42) {
            modal.error({ msg: $scope.doc.ethAddressNotValid, title: $scope.doc.notice, okText: $scope.doc.confirm })
            return;
        }
        if ($scope.model.fromAddressPrivateKey.length != 64) {
            modal.error({ msg: $scope.doc.ethPriKeyNotValid, title: $scope.doc.notice, okText: $scope.doc.confirm })
            return;
        }
        if ($scope.intPrivateKey.length != 64) {
            modal.error({ msg: $scope.doc.intPriKeyNotValid, title: $scope.doc.notice, okText: $scope.doc.confirm })
            return;
        }
        if (!wal.isValidAddress($scope.model.toAddress)) {
            modal.error({ msg: $scope.doc.intAddressNotValid, title: $scope.doc.notice, okText: $scope.doc.confirm })
            return;
        }

        if ($scope.model.decimalAmount == 0) {
            modal.error({ msg: $scope.doc.bmmz, title: $scope.doc.notice, okText: $scope.doc.confirm })
            return;
        }
        if (!$scope.model.decimalGas || isNaN($scope.model.decimalGas) || $scope.model.decimalGas <= 0) {
            modal.error({ msg: $scope.doc.priceNotValid, title: $scope.doc.notice, okText: $scope.doc.confirm })
            return;
        }
        if ($scope.model.decimalGas * $scope.model.gasLimit * 2 > $scope.ethBalance) {
            let num = new wal.BigNumber($scope.model.decimalGas).multipliedBy($scope.model.gasLimit).multipliedBy(2).toString()
            modal.error({ msg: $scope.doc.ethNotEnough + num + ' ETH', title: $scope.doc.notice, okText: $scope.doc.confirm })
            return;
        }
        let obj = { ...$scope.model }
        obj.decimalAmount = new wal.BigNumber(obj.decimalAmount).minus(0.000001).toString()

        wal.burnIntOnEth(obj, $scope.doc).then(function (data) {
            if (data) {
                if (data.error) {
                    modal.error({ mas: data.message, title: $scope.doc.notice, okText: $scope.doc.confirm })
                } else {
                    modal.showInfo(data.info, $scope.doc, function () {
                        wal.sendBurn(data.data).then(function (r) {
                            if (typeof r === 'string') {
                                r = JSON.parse(r)
                            }
                            if (r.status == 'error') {
                                modal.error({ msg: r.message, title: $scope.doc.notice, okText: $scope.doc.confirm })
                            } else {
                                // modal.burnSuccess({ msg: r.hash })
                                modal.burnSuccess({ doc: $scope.doc, msg: 'https://etherscan.io/tx/' + r.hash }, function () {
                                    window.location.reload()
                                })

                            }
                        })
                    })
                }
            }
        })

    }
    // $scope.toResult = function() {
    //     window.open(`https://etherscan.io/tx/${$scope.hash}`)
    // }


    $scope.toMapping2 = function () {
        if ($scope.model.toAddress.length != 37 && $scope.model.toAddress.length != 36) {
            modal.error({ msg: $scope.doc.tanv, title: $scope.doc.notice, okText: $scope.doc.confirm })
            return
        }
        var wal = require("wal");
        wal.getTestCoin($scope.model.toAddress).then(function (r) {
            if (typeof r === 'string') {
                r = JSON.parse(r)
            }
            if (r.err) {
                modal.error({ msg: r.err, title: $scope.doc.notice, okText: $scope.doc.confirm })
            }
            if (r.status == 'error') {
                modal.error({ msg: r.message, title: $scope.doc.notice, okText: $scope.doc.confirm })
            } else {
                // modal.burnSuccess({ msg: r.hash })
                modal.burnSuccess({ doc: $scope.doc, msg: 'https://test.explorer.intchain.io/blockchain/txdetail?hash=' + r.hash })

            }
        })
    }
});