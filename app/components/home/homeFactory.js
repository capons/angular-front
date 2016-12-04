var UserService = angular.module('UserService', []);
//app.module -> all constant
UserService.factory('UserData', ['$http','apiUrl', function ($http,apiUrl) {
    var UserData = {};
    /* this methid remove to service
    UserData.getUser = function () {
        return $http.get(apiUrl+'users',{
            header: {
                'Access-Control-Allow-origin': '*',
                'Content-Type': 'application/json'

            }
        });
    };
    */
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
        return $http.post(apiUrl+'users', param, conf);
    };
    UserData.deleteUser = function (user_id){

        return  $http({
            method : "DELETE",
            //url : apiUrl+'users/'+user_id+"/remove"
            url : apiUrl+'users/'+user_id
        })
    };
    return UserData;
}]);