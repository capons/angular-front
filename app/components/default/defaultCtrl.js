myApp.controller('defaultCtrl', ['$rootScope','$scope', '$http', '$interval', '$location', 'apiUrl', '$timeout', '$window', 'UserData','UsersService', 'Auth', function ($rootScope, $scope, $http, $interval, $location, apiUrl, $timeout, $window, UserData, UsersService, Auth) {
    $scope.isLoggin = true;
    $scope.logOut = function () {
        Auth.logOut();
        $window.location.href = '/home';
    };
    //listening route change and display login button or lofOut
    $rootScope.$on('$routeChangeStart', function (event) {
        (!Auth.isLoggedIn()) ? $scope.isLoggin = false :   $scope.isLoggin = true ;
    });
}]);
