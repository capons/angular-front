var UserService = angular.module('UserService', []);
//app.module -> all constant
UserService.factory('UserData', ['$http', 'apiUrl', function ($http,apiUrl) {
    //object return with service
    var UserData = {};
    //upload user photo
    UserData.uploadPhoto = function (files,master,user){
        var fd = new FormData();
        for (var i in files) {
            //get file name to send in API server
            fd.append("uploadedFile", files[i])
        }
        //upload user photo

        return $http.post("photo.php", fd, { //photo.php
            withCredentials: false,
            headers: {
                'Content-Type': undefined
            },
            transformRequest: angular.identity,
            params: {
                fd: fd
            }
        });
    };
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