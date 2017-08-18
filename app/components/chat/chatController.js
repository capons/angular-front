myApp.controller('chatController', ['$scope', '$http', '$interval', '$location', 'apiUrl', '$timeout', '$window', 'UserData','UsersService', 'Auth', function ($scope, $http, $interval, $location, apiUrl, $timeout, $window, UserData, UsersService, Auth) {

   $scope.chatMessage = [];

   UsersService.get('chat')
       .then(function (data, status, headers, config) {
          $scope.chatMessage = data.data.body;//angular.fromJson(responseData);
         // $scope.loading = false;
          console.log($scope.chatMessage);
       })
       ,function (error) {
      console.log(error);

   };




    /*//login permission check in current controller
    Auth.setUser({user:'test'});
    $scope.$watch(Auth.isLoggedIn, function (value, oldValue) {
        console.log(oldValue);
        if(!value && !oldValue) {
            console.log("Disconnect");
            $location.path('/login');
        }

        if(value) {
            console.log("Connect");
            //Do something when the user is connected
        }

    }, true);
    */

}]);