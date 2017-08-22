myApp.controller('loginController', ['$window','$scope', '$http', 'Auth',  'UsersService', 'apiUrl', function ($window, $scope, $http, Auth, UsersService, apiUrl) {
    //submit login form
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
            UsersService.post('login', param, config)
                .then(function (data) {
                    //return data from API
                    console.log(data);
                    if(data.status !== false) {
                        var user = [data.data.body];
                        Auth.setUser(user);
                        $scope.formButton = false;
                        $window.location.href = '/chat';
                    } else {
                        console.log('not ok');
                    }
                })
                ,function (error) {
                      console.log(error);
                //  console.log(status);
                //  console.log(header);
                //  console.log(config);
            };
    };
    
    
    
    
    
    
    
    console.log('login controller');
    $scope.login = function () {
        // Ask to the server, do your job and THEN set the user
        var user = [user = ['user data']];
        Auth.setUser(user); //Update the state of the user in the app
    };
      
    
}]);