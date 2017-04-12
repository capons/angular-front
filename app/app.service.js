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
            "url": apiUrl+url,//'users'
            "method": 'GET',

            headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'}
            //  "cache": true
        });
    };
    this.post = function(url,param) {

        var conf = {
            headers : {
                'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
             //   'Content-Type': 'multipart/form-data'

            }
            /*
            transformRequest: function (data, headersGetter) {
                var formData = new FormData();
                angular.forEach(data, function (value, key) {
                    formData.append(key, value);
                });

                var headers = headersGetter();
                delete headers['Content-Type'];

                return formData;
            }
            */

        };
        return $http.post(apiUrl+url, param, conf);
    };
    this.delete = function (user_id) {
        var conf = {
            headers : {
                'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
            }
        };
        return  $http.delete(apiUrl+'users/'+user_id, param = null, conf)
    }
}]);