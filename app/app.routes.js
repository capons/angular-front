
//app routes
myApp.config(['$routeProvider','$locationProvider', function ($routeProvider,$locationProvider) {
    $locationProvider.html5Mode(true); //help to remove # from URL
    $routeProvider.
    when('/home', {
        templateUrl: 'app/components/home/homeView.html',
        controller:'homeController'
    }).
    when('/sale', {
        templateUrl: 'app/components/sale/saleView.html',
        controller: 'saleController'
    }).
    when('/login', {
        templateUrl: 'app/components/login/loginView.html',
        controller: 'loginController'
    }).
    when('/chat', {
        templateUrl: 'app/components/chat/index.html',
        controller: 'loginController',
        


    }).
    otherwise({ redirectTo: '/home' });

}]);

