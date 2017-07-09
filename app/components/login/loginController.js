myApp.controller('loginController', ['$scope', '$http', 'Auth',  'UsersService', 'apiUrl', function ($scope, $http, Auth, UsersService, apiUrl) {

   // var user = [user = ['user data']];
    //login
    //Auth.setUser(user);
    //logOut
    //Auth.logOut();
    //submit register form
    $scope.submit = function(login) {

        //disable form button
        $scope.formButton = true;
        // Trigger validation flag.
        //flag to display error message
        // If form is invalid, return and let AngularJS show validation errors.
        if (login.$invalid) {
            //enable form button
            $scope.formButton = false;
            return;
        }
        var config = {
            headers : {
                'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
            }
        };
        var param = $.param({email: $scope.customer.email, password: $scope.customer.pass});
     

        //user param
        //uploadBar($scope); //$scope.files, $scope.user
        //delete user
      //  $scope.delete = function (user_id,item) {

        
            UsersService.post('login', param, config)
                .then(function (data) {

                      console.log(data);
                })
                ,function (error) {
                      console.log(error);
                //  console.log(status);
                //  console.log(header);
                //  console.log(config);
            };
            

     //   };

    };
    
    
    
    
    
    
    
    console.log('login controller');
    $scope.login = function () {
        // Ask to the server, do your job and THEN set the user
        var user = [user = ['user data']];
        Auth.setUser(user); //Update the state of the user in the app
    };
      
    
}]);