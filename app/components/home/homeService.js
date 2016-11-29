var UserService = angular.module('UserService', []);
//app.module -> all constant
UserService.factory('UserData', ['$http','apiUrl', function ($http,apiUrl) {

    var UserData = {};
    UserData.getUser = function () {
        return $http.get(apiUrl+'user');
    };

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

    UserData.addUser = function (user){
        var param = $.param({
            data: user
        });
        var conf = {
            headers : {
                'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
            }
        };
        return $http.post(apiUrl+'user/', param, conf);
    };
    UserData.deleteUser = function (user_id){



       // return $http.get(apiUrl+'user/delete/'+user_id);
        return $http({
            method: 'DELETE',
            url: apiUrl+'user/'+user_id,
            headers: {
                'Content-Type': 'application/json'
            }
        })
    };
    return UserData;
}]);