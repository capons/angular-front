myApp.controller('defaultCtrl', ['$rootScope','$scope', '$http', '$interval', '$location', 'apiUrl', '$timeout', '$window', 'UserData','UsersService', 'Auth', function ($rootScope, $scope, $http, $interval, $location, apiUrl, $timeout, $window, UserData, UsersService, Auth) {
    $scope.isLoggin = true;
    $scope.logOut = function () {
        Auth.logOut();
        $window.location.href = '/home';
    };
    //listening route change and display login button or lofOut
    $rootScope.$on('$routeChangeStart', function (event) {
        (!Auth.isLoggedIn()) ? $scope.isLoggin = false :   $scope.isLoggin = true ;
        //check user authentication
        checkLogin();
    });
    
    //check login
    function checkLogin() {
        var authUserParam = Auth.getUser();
        var param = $.param({email: authUserParam[0].email});
        var config = {
            headers : {
                'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
            }
        };
        UsersService.post('login/confirm', param, config)
            .then(function (data) {
                //if user check status == false -> remove auth session and redirect user
                if(data.status == false) {
                    //add login user parameter to auth session
                    Auth.logOut();
                    $window.location.href = '/';
                }
            })
            ,function (error) {
         
            //  console.log(status);
            //  console.log(header);
            //  console.log(config);
        };
    }
}]);
