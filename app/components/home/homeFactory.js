var UsersService = angular.module('UsersService', []);
//app.module -> all constant
UsersService.factory('UserData', ['$http', 'apiUrl', function ($http,apiUrl) {
    //object return with service
    var UserData = {};

    //update form fields
    UserData.clearField = function (scope){
        scope.user.name = '';
        scope.user.address = '';
        scope.user.email = '';
        scope.user.country = '';
        angular.element("input[type='file']").val(null);
    };
    return UserData;
}]);