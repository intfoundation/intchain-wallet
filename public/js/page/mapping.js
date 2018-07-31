app.controller('mappingController', function($scope, $http) {
	$scope.ethAddress = '';
	//0x04fa4d66a673cBf91F7cf48dfF236482495Fd49e  ng-blur="queryBalance()"
	$scope.balance = '';
	$scope.model = {
		fromAddress: '',
		toAddress: '',
		decimalAmount: '',
		decimalGas: '',
		fromAddressPrivateKey: '',
		mydata:'',
		mynonce:''
	};
	$scope.queryBalance = async function() {
		var Wal = require("int");
		var wal = new Wal;
		var data =  await wal.queryBalance($scope.model.fromAddress);
		if(data){
			if(data.status==="success"){
				$scope.model.decimalAmount = data.balance;
				$scope.model.mydata = data.mydata;
				$scope.model.mynonce = data.mynonce;
			}else{
				util.alert(data.message)
			}
		}
	}
	$scope.toMapping = async function(){
		var Wal = require("int");
		var wal = new Wal;
		var data =  await wal.burnIntOnEth($scope.model);
		if(data){
			if(data.status==="success"){
                util.alert("success")
			}else{
				util.alert(data.message)
			}
		}
	}
	// $scope.$watch("model.decimalAmount", function(n, o){
	// 	console.log($scope.model);
	// 	document.getElementById("decimalAmount").value = $scope.model.decimalAmount
	// })
	let timer = setInterval(function(){
		if($scope.model.decimalAmount||$scope.model.decimalAmount===0){
			document.getElementById("decimalAmount").value = $scope.model.decimalAmount
			//clearInterval(timer)
		}
	},500)
});