var UserService = angular.module('UserService', []);
//app.module -> all constant
UserService.factory('UserData', ['$http','apiUrl', function ($http,apiUrl) {
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

        return $http.post("photo.php", fd, {
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
    return UserData;
}]);