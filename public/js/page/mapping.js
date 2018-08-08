app.controller('mappingController', function($scope, $http) {
    $scope.ethAddress = '';
    //0x04fa4d66a673cBf91F7cf48dfF236482495Fd49e  ng-blur="queryBalance()"
    $scope.hash = '';
    $scope.model = {
        fromAddress: '',
        toAddress: '',
        decimalAmount: '',
        decimalGas: '',
        fromAddressPrivateKey: '',
        mydata: '',
        mynonce: ''
    };
    $scope.queryBalance = async function() {
        //$scope.model.decimalAmount = 0.998;
        if (!$scope.model.fromAddress) {
            return;
        }
        var Wal = require("int");
        var wal = new Wal;
        var data = await wal.queryBalance($scope.model.fromAddress, $scope);
        if (data) {
            if (data.status === "success") {
                $scope.model.decimalAmount = data.balance;
                $scope.model.mydata = data.mydata;
                $scope.model.mynonce = data.mynonce;
            } else {
                util.alert(data.message)
            }
        }
    }
    $scope.toMapping = async function() {
        if (!$scope.model.fromAddress) {
            util.alert("fromAddress must be not empty")
            return;
        }
        var Wal = require("int");
        var wal = new Wal;
        $scope.model
        var data = await wal.burnIntOnEth($scope.model);
        if (data) {
            if (data.status === "success") {
                document.getElementById("mp-result").style.display = "block"
                $scope.hash = data.hash
                util.alert("success")
            } else {
                util.alert(data.message)
            }
        }
    }
    $scope.toResult = function() {
        window.open(`https://etherscan.io/tx/${$scope.hash}`)
    }
    let timer = setInterval(function() {
        if ($scope.model.decimalAmount || $scope.model.decimalAmount === 0) {
            document.getElementById("decimalAmount").value = $scope.model.decimalAmount
        }
    }, 100)
});