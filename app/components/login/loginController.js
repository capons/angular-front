myApp.controller('loginController', ['$scope', '$http', 'Auth',  function ($scope, $http, Auth) {

   // var user = [user = ['user data']];
    //login
    //Auth.setUser(user);
    //logOut
    //Auth.logOut();
    console.log('login controller');
    $scope.login = function () {
        // Ask to the server, do your job and THEN set the user
        var user = [user = ['user data']];
        Auth.setUser(user); //Update the state of the user in the app
    };
      
    
}]);