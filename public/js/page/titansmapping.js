app.controller('titansMappingController', function($scope, $http) {
    $scope.hash = '';
    $scope.pass = false;
    $scope.tokenView = false;
    $scope.model = {
        fromAddress: '',
        toAddress: 'INT1HHyjRCjXoFVYKj2kXSBBCdCqUixPfM24F',
        amount: '0',
        price: '',
        fromAddressPrivateKey: '',
        mydata: {},
        mynonce: '',
        gasLimit: 100000
    };
    $scope.totalBalance = 0;
    $scope.int3Balance = 0;
    $scope.int4Balance = 0;
    // $scope.int3Address = '';
    $scope.int4Address = '';
    // $scope.int3PrivateKey = '';
    $scope.int4PrivateKey = '';
    $scope.lan = new modal.UrlSearch().lan || 'en';
    $scope.doc = lan[$scope.lan];
    document.title = $scope.doc.mineMapping + ' | INT Chain';
    $scope.changelan = function(a) {
        $scope.doc = lan[a];
        $scope.lan = a;
        document.title = $scope.doc.mineMapping + ' | INT Chain';
    }
    $scope.$watch('{f:model.fromAddress,t:model.toAddress,g:model.price,p:model.fromAddressPrivateKey,l:model.gasLimit,b:int3Balance,a:int4Address}', function(v) {
        if (v.f && v.t && v.g && v.p && v.l && v.b && v.a) {
            $scope.pass = true
        } else {
            $scope.pass = false
        }
    })

    $scope.$watch('model.fromAddressPrivateKey', function(value) {
        if (value.indexOf("0x") === 0) {
            $scope.model.fromAddressPrivateKey = value.substr(2);
        }

        if (value === '') {
            $scope.int3Balance = 0;
            $scope.model.fromAddress = '';
        }

        if (value.length === 64) {
            var wal = require("wal");
            $scope.model.fromAddress = wal.addressFromPrivateKey(value);
            // $scope.model.toAddress = wal.addressFromPrivateKey(value);
            $scope.queryInt3Balance();
            // $scope.queryInt3Votes();
        }
    })
    $scope.$watch('int4PrivateKey', function(value) {
        if (value.indexOf("0x") !== 0 && value.length === 64) {
            $scope.int4PrivateKey = "0x" + value
        }

        if (value === '') {
            $scope.int4Balance = 0;
            $scope.int4Address = '';
        }

        if (value.length === 66) {
            var wal = require("wal");
            $scope.int4Address = wal.INT4Account.fromPrivate(value).address;
                //$scope.intPrivateKey = value
                //$scope.model.toAddress = wal.addressFromPrivateKey(value);
            $scope.queryInt4Balance();
        }
    });

    $scope.queryInt3Balance = function() {
        let wal = require("wal");
        if (!wal.isValidAddress($scope.model.fromAddress)) {
            return
        }

        wal.getBalance($scope.model.fromAddress).then(function(data) {
            if (typeof data === 'string') {
                data = JSON.parse(data)
            }
            if (data.err) {
                modal.error({ msg: data.err, title: $scope.doc.notice, okText: $scope.doc.confirm });
                return;
            }

            console.log("int3 balance",data.balance);
            $scope.int3Balance += +modal.numformat(data.balance);
            if ($scope.int3Balance == null) {
                $scope.int3Balance = 0;
            }
            $scope.$apply();
        });
    };

    // $scope.queryInt3Votes = function() {
    //     let wal = require("wal");
    //     if (!wal.isValidAddress($scope.model.fromAddress)) {
    //         return
    //     }
    //     wal.getVotes($scope.model.fromAddress).then(function(data) {
    //         if (typeof data === 'string') {
    //             data = JSON.parse(data)
    //         }
    //         if (data.err) {
    //             modal.error({ msg: data.err, title: $scope.doc.notice, okText: $scope.doc.confirm });
    //             return;
    //         }
    //
    //         console.log("int3 votes",data.stake);
    //         $scope.int3Balance += +modal.numformat(data.stake);
    //         if ($scope.int3Balance == null) {
    //             $scope.int3Balance = 0;
    //         }
    //
    //         $scope.$apply();
    //     });
    // }

    $scope.queryInt4Balance = function() {
        let wal = require("wal");
        wal.queryInt4Balance($scope.int4Address).then( function(data) {
            if (data.error) {
                modal.error({ msg: data.error, title: $scope.doc.notice, okText: $scope.doc.confirm });
                return
            }
            console.log(data);

            $scope.int4Balance = modal.numformat(data);

            $scope.$apply();
        })
    };

    $scope.getPrice = function() {
        var wal = require("wal");
        wal.getPrice().then(function(data) {
            if (typeof data === 'string') {
                data = JSON.parse(data)
            }
            if (data.err) {
                modal.error({ msg: data.err, title: $scope.doc.notice, okText: $scope.doc.confirm })
                return;
            }
            $scope.model.price = (data.gasPrice / Math.pow(10, 18)).toFixed(18).replace(/\.0+$/, "").replace(/(\.\d+[1-9])0+$/, "$1")
            $scope.$apply();
        })
    };

    $scope.getPrice();

    // $scope.getLimit = function() {
    //     var wal = require("wal");
    //     wal.getLimit('transferTo', JSON.stringify({ to: 'INT0000000000000000000000000000000000', data: $scope.model.mydata })).then(function(data) {
    //         if (typeof data === 'string') {
    //             data = JSON.parse(data)
    //         }
    //         if (data.err) {
    //             modal.error({ msg: data.err, title: $scope.doc.notice, okText: $scope.doc.confirm })
    //             return;
    //         }
    //         $scope.model.gasLimit = data.limit;
    //         $scope.$apply();
    //     })
    // }

    $scope.enterEvent = function(e) {
        var keycode = window.event ? e.keyCode : e.which;
        if (keycode == 13 && $scope.pass) {
            $scope.toMineMapping();
        }
    }
    $scope.toMineMapping = function() {
        var wal = require("wal");
        if (!wal.isValidAddress($scope.model.fromAddress)) {
            modal.error({msg: $scope.doc.int3AddressNotValid, title: $scope.doc.notice, okText: $scope.doc.confirm})
            return;
        }
        if ($scope.model.fromAddressPrivateKey.length !== 64) {
            modal.error({msg: $scope.doc.int3PriKeyNotValid, title: $scope.doc.notice, okText: $scope.doc.confirm})
            return;
        }
        if ($scope.int4PrivateKey.length !== 66) {
            modal.error({msg: $scope.doc.int4PriKeyNotValid, title: $scope.doc.notice, okText: $scope.doc.confirm})
            return;
        }
        if (!wal.isValidAddress($scope.model.toAddress)) {
            modal.error({msg: $scope.doc.int3AddressNotValid, title: $scope.doc.notice, okText: $scope.doc.confirm})
            return;
        }

        if ($scope.model.amount < 0) {
            modal.error({msg: $scope.doc.bmmz, title: $scope.doc.notice, okText: $scope.doc.confirm})
            return;
        }
        if (!$scope.model.price || isNaN($scope.model.price) || $scope.model.price <= 0) {
            modal.error({msg: $scope.doc.priceNotValid, title: $scope.doc.notice, okText: $scope.doc.confirm})
            return;
        }

        if ($scope.model.price * $scope.model.gasLimit > $scope.int3Balance) {
            let num = new wal.BigNumber($scope.model.price).multipliedBy($scope.model.gasLimit).toString()
            modal.error({
                msg: $scope.doc.int3BalanceNotEnough + num + ' INT',
                title: $scope.doc.notice,
                okText: $scope.doc.confirm
            })
            return;
        }


        $scope.model.amount = $scope.int3Balance - ($scope.model.price * $scope.model.gasLimit) * 2;

        $scope.model.mydata = {
            type: "Mapping",
            amount: $scope.model.amount,
            int3Address: $scope.model.fromAddress,
            int4Address: $scope.int4Address
        };

        // amount, limit, price, to, secret, data
        wal.transfer($scope.model.amount, $scope.model.gasLimit, $scope.model.price, $scope.model.toAddress, $scope.model.fromAddressPrivateKey, $scope.model.mydata)
            .then(function (res) {
                if (res.err) {
                    modal.error({msg: res.err, title: $scope.doc.notice, okText: $scope.doc.confirm});
                    return;
                }

                modal.showInfo(res.info, $scope.doc, function () {
                    wal.sendSignedTransaction(res.renderStr).then(function (r) {
                        if (typeof r === 'string') {
                            r = JSON.parse(r)
                        }
                        if (r.err) {
                            modal.error({msg: r.err, title: $scope.doc.notice, okText: $scope.doc.confirm})
                        } else {
                            modal.burnSuccess({
                                doc: $scope.doc,
                                msg: 'https://explorer.intchain.io/blockchain/txdetail?hash=' + r.hash
                            });
                        }
                    })
                })
            })

    };


    $scope.toMapping2 = function() {
        if ($scope.model.toAddress.length != 37 && $scope.model.toAddress.length != 36) {
            modal.error({ msg: $scope.doc.tanv, title: $scope.doc.notice, okText: $scope.doc.confirm })
            return
        }
        var wal = require("wal");
        wal.getTestCoin($scope.model.toAddress).then(function(r) {
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
