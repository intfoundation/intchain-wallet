app.controller('mainController', function($scope, $http) {
    $scope.step = 1;
    $scope.lan = new modal.UrlSearch().lan || 'en'
    $scope.doc = lan[$scope.lan]
    if ($scope.lan == "en") {
        $scope.src = "./images/helpEn.pdf"
    } else {
        $scope.src = "./images/helpZh.pdf"
    }
    document.title = $scope.doc.help + ' | INT Chain';
    $scope.changelan = function(a) {
        $scope.doc = lan[a]
        $scope.lan = a
        document.title = $scope.doc.help + ' | INT Chain';
        if ($scope.lan == "en") {
            $scope.src = "./images/helpEn.pdf"
        } else {
            $scope.src = "./images/helpZh.pdf"
        }
    }
});