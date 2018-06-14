app.controller('txinfoController', function($scope, $http) {
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
    $scope.txlst = [];
    $scope.condition = {
        page: {
            pagesize: 20,
            page: 1,
            size: 0
        }
    }
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
                        $scope.queryTx();
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
        var url = "/wallet/account/query/" + $scope.model.sourceAddress;
        $http.post(url).success(function(data) {
            console.log(data);
            $scope.model.sourceAmount = data.balance;
            if (data.balance == null) {
                $scope.model.sourceAmount = 0;
            }
        });
    };


    $scope.queryTx = function() {
        var url = "/wallet/transation/" + $scope.model.sourceAddress + "/" + $scope.condition.page.pagesize + "/" + $scope.condition.page.page;
        $http.post(url).success(function(data) {
            console.log(data);
            if (data != null) {
                if (data.data.length > 0) {
                    $scope.condition.page.size = data.page.all;
                    $scope.txlst = data.data;
                    $.each($scope.txlst, function(i, item) {
                        item.incomaddress = item.txs.inputs[0].address;
                        item.time = moment(item.time * 1000).format('YYYY-MM-DD HH:mm:ss');
                        var x = 0.0;
                        $.each(item.txs.outputs, function(s, sitem) {
                            x += sitem.value;
                        })
                        item.incomvalue = x.toFixed(6);
                    })
                }
            }

        });
    }

});