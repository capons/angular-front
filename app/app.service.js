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
            "params":  params

        //  headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'}
            //  "cache": true
        });
    };
    this.post = function(url, param, header) {
         return $http.post(apiUrl+url, param, header)

    };
    this.delete = function (user_id) {
        var conf = {
            headers : {
                'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
            }
        };
        return  $http.delete(apiUrl+'users/'+user_id, param = null, conf)
    };

}]);

//permission factory
myApp.factory('Auth',['$window', function($window){
    // localStorage key
    var key = 'loginParam';

    return{
        setUser : function(user){
            $window.localStorage.setItem(key,JSON.stringify(user));
           // user = aUser;
        },
        isLoggedIn : function(){
           // return(user)? user : false;
            var loginParam = $window.localStorage.getItem(key);
            return(loginParam)? loginParam : false ;
        },
        //logOut
        logOut: function () {
            $window.localStorage.removeItem(key)
        }
    }
}]);;