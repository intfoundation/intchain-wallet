app.controller('sendofflineController', function($scope, $http, FileUploader) {
    $scope.url = "/wallet/unlock";
    $scope.file = null;
    $scope.model = {
        password: '',
        sourceAddress: '',
        sourceAmount: '',
        targetAddress: '',
        targetAmount: '',
        gesLimit: '',
        gesPrice: '',
        nonce: ''
    };

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
                    //todo:需要改进
                    if ($scope.model.password === data.crypto.dphertext) {
                        $scope.model.sourceAddress = data.address;
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

    $scope.makeTransation = function() {

    };
});