//global application controller
myApp.controller('applicationController', ['$scope', '$http', '$interval', '$location', 'apiUrl', '$timeout', '$window', 'UserData','UsersService','$timeout', 'AuthService', function ($scope, $http, $interval, $location, apiUrl, $timeout, $window, UserData, UsersService, USER_ROLES, AuthService) {
    //define login user object
    $scope.currentUser = null;
    $scope.userRoles = USER_ROLES;
    $scope.isAuthorized = AuthService.isAuthorized;
    $scope.setCurrentUser = function (user) {
        $scope.currentUser = user;
    };

}]);

