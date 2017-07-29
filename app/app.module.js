
//here need to add service and factory method
var myApp = angular.module('app',['ngRoute', 'UsersService', 'ngAnimate', 'ngResource', 'ngFileUpload']);

//project const
myApp.constant('apiUrl', 'http://api/');


//watch permission route
myApp.run(['$rootScope', '$location', 'Auth', '$routeParams',function ($rootScope, $location, Auth ,$routeParams) {
    //admin permission route
    var permissionRoute = [
        'chat'
    ];
    //route change event - check if user have permission
    $rootScope.$on('$routeChangeStart', function (event) {
        var currentRoute = $location.path();
        var route = currentRoute.replace("/","");
        if(permissionRoute.indexOf(route) == 0) {
            if (!Auth.isLoggedIn()) {
                //if do not login redirect to login route
                console.log('DENY');
                //  event.preventDefault();
                $location.path('/login');
            }
            /*
            else {
                console.log('ALLOW');
                $location.path('/home');
            }
            */
        }
    });
}]);




