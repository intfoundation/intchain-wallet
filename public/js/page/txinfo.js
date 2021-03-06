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
            $scope.getinfo();
        } else {
            var data = angular.fromJson($cookies.wallet);
            $scope.model.sourceAddress = data.address;
            $scope.model.encryptCode = data.crypto.wif;
            $scope.model.cryptCode = data.crypto.ciphertext;
            $scope.getbalance();
            $scope.queryTx();
        }
    };



    $scope.getinfo = function() {
        // if ($scope.file) {
        //   if ($.trim($scope.model.password).length == 0) {
        //     util.alert('Please input your password');
        //     return;
        //   }
        //   $.ajax({
        //     type: "POST",
        //     url: $scope.url,
        //     data: $scope.file,
        //     processData: false,
        //     contentType: false,
        //     success: function (data) {
        //       $scope.model.encryptCode = '';
        //       //todo:需要改进
        //       if ($scope.model.password === data.crypto.dphertext) {
        //         $scope.model.sourceAddress = data.address;
        //         $scope.model.encryptCode = data.crypto.wif;
        //         $scope.model.cryptCode = data.crypto.ciphertext;
        //         $scope.getbalance();
        //         $scope.queryTx();
        //         tidySize();
        //       } else {
        //         util.alert('Password error');
        //       }
        //       $scope.$apply();
        //     }
        //   });
        // } else {
        //   util.alert('Please select wallet file');
        // }

        if ($scope.file) {
            if ($.trim($scope.model.password).length == 0) {
                util.alert('Please input your password');
                return;
            }

            var file = $scope.file;
            var reader = new FileReader();
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
                    $scope.queryTx();
                    tidySize();
                } else {
                    util.alert('Password error, unlock fail');
                }
            }
            reader.readAsText(file);
        } else {
            util.alert('Please select wallet file');
        }
    }

    $scope.getbalance = function() {
        var wal = require("int");
        new wal().getaccount($scope.model.sourceAddress).then(data => {
            $scope.model.sourceAmount = JSON.parse(data).balance;
            if ($scope.model.sourceAmount == null) {
                $scope.model.sourceAmount = 0;
            }
            $scope.$apply();
        });
    };


    $scope.queryTx = function() {
        var url = "http://localhost:3001/query/4/" + $scope.model.sourceAddress + "/" + $scope.condition.page.pagesize + "/" + $scope.condition.page.page;
        //var url = " https://explorer.intchain.io/api/query/4/" + $scope.model.sourceAddress + "/" + $scope.condition.page.pagesize + "/" + $scope.condition.page.page;
        $http.get(url).success(function(data) {
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
})

$(function() {
    $(window).resize(function() {
        tidySize()
    })
})

var tidySize = function() {
    var txinfo = $('#txinfo');
    if (txinfo.length > 0) {
        var width = $('#content').outerWidth(true);
        var height = $('#content').outerHeight(true);
        var wrapperWidth = $('.wrapper').outerWidth(true);
        var pcWidth = $('.pc').outerWidth(true);
        var cWidth = $('.c').outerWidth(true);
        var r = (pcWidth - cWidth) / 2;
        $('#txinfo').css('background', '#fff');
        $('#txinfo').css('position', 'absolute');
        $('#txinfo').css('width', width);
        $('#txinfo').css('height', height);
        $('#txinfo').css('left', -(wrapperWidth + 10 + r));
        $('#txinfo').css('top', height - 100);
        $('#txinfo').css('min-width', '934px');
    }
}