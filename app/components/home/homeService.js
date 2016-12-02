



//service example
myApp.service('UsersService',['$http', 'apiUrl', function ($http, apiUrl) {
    //to create unique contact id


    //save method create a new contact if not already exists
    //else update the existing object
    this.get = function () {

        return $http.get(apiUrl+'users',{
            header: {
       //         'Access-Control-Allow-origin': '*',
       //         'Content-Type': 'application/json'
            }
        });


    };
}]);
