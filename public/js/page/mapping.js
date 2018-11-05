app.controller('mappingController', function($scope, $http) {
    $scope.ethAddress = '';
    //0x04fa4d66a673cBf91F7cf48dfF236482495Fd49e  ng-blur="queryBalance()"
    $scope.hash = '';
    $scope.pass = false;
    $scope.model = {
        fromAddress: '',
        toAddress: '',
        decimalAmount: '',
        decimalGas: '',
        fromAddressPrivateKey: '',
        mydata: '',
        mynonce: '',
        gasLimit: 40000
    };
    $scope.$watch('{f:model.fromAddress,t:model.toAddress,g:model.decimalGas,p:model.fromAddressPrivateKey}', function(v) {
        if (v.f && v.t && v.g && v.p) {
            $scope.pass = true
        } else {
            $scope.pass = false
        }
    })
    $scope.$watch('model.fromAddressPrivateKey', function(value) {
        if (value.length === 64) {
            var wal = require("wal");
            $scope.model.toAddress = wal.addressFromPrivateKey(value);
        }
    })
    $scope.queryBalance = function() {
        //$scope.model.decimalAmount = 0.998;
        if ($scope.model.fromAddress.length != 42) {
            //modal.error({ msg: 'ETH wallet address is not is not valid' })
            return;
        }
        var wal = require("wal");
        wal.queryBalance($scope.model.fromAddress).then(function(data) {
            if (data) {
                if (data.status === "success") {
                    $scope.model.decimalAmount = data.balance;
                    $scope.model.mydata = data.mydata;
                    $scope.model.mynonce = data.mynonce;
                    $scope.model.decimalGas = (data.gasPrice / Math.pow(10, 18)).toFixed(18).replace(/\.0+$/, "").replace(/(\.\d+[1-9])0+$/, "$1")
                    $scope.$apply();
                } else {
                    util.alert(data.message)
                }
            }
        })
    }
    $scope.enterEvent = function(e) {
        var keycode = window.event ? e.keyCode : e.which;
        if (keycode == 13 && $scope.pass) {
            $scope.toMapping();
        }
    }
    $scope.toMapping = function() {
            if ($scope.model.fromAddress.length != 42) {
                modal.error({ msg: 'ETH wallet address is not is not valid' })
                return;
            }
            if ($scope.model.fromAddressPrivateKey.length != 64) {
                modal.error({ msg: 'ETH wallet private key is not is not valid' })
                return;
            }

            if ($scope.model.toAddress.length != 34 && $scope.model.toAddress.length != 33) {
                modal.error({ msg: 'INT wallet address is not is not valid' })
                return;
            }

            if (!$scope.model.decimalGas || isNaN($scope.model.decimalGas) || $scope.model.decimalGas <= 0) {
                modal.error({ msg: 'Gas price is not is not valid' })
                return;
            }
            var wal = require("wal");
            wal.burnIntOnEth($scope.model).then(function(data) {
                if (data) {
                    if (data.error) {
                        modal.error({ mas: data.message })
                    } else {
                        modal.showInfo(data.info, function() {
                            wal.sendBurn(data.data).then(function(r) {
                                if (typeof r === 'string') {
                                    r = JSON.parse(r)
                                }
                                if (r.status == 'error') {
                                    modal.error({ msg: r.message })
                                } else {
                                    // modal.burnSuccess({ msg: r.hash })
                                    modal.burnSuccess({ msg: 'https://etherscan.io/tx/' + r.hash })

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
});