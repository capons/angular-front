//service example
myApp.service('UsersService',['$http', 'apiUrl', function ($http, apiUrl) {
    //to create unique contact id
    //save method create a new contact if not already exists
    //else update the existing object
    this.get = function (url,params) {
        //set up default parameter if do not need
        if(params == 'undefined'){
            params = '';
        }
        return $http({
            "url": apiUrl+'users',
            "method": 'GET',
            "params": params
            //  "cache": true
        });
    };
    this.post = function(param) {
        var param = $.param({
            data: param
        });
        var conf = {
            headers : {
                'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
            }
        };
        return $http.post(apiUrl+'users', param, conf);
    };
    this.delete = function (user_id) {
        return  $http({
            method : "DELETE",
            url : apiUrl+'users/'+user_id
        })
    }
}]);