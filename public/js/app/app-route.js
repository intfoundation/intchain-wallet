app.config(function($routeProvider, $controllerProvider) {
    $routeProvider.when('/', {
        templateUrl: 'tpl/create.html',
        controller: 'mainController'
    }).when('/index', {
        templateUrl: 'tpl/create.html',
        controller: 'mainController'
    }).when('/sendint', {
        templateUrl: 'tpl/sendint.html',
        controller: 'sendintController'
    }).when('/sendoffline', {
        templateUrl: 'tpl/sendoffline.html',
        controller: 'sendofflineController'
    }).when('/viewWalletInfo', {
        templateUrl: 'tpl/viewWalletInfo.html',
        controller: 'walletinfoController'
    });
});