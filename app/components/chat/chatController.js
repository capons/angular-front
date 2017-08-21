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


    $scope.submitPublicMessage = function (message) {
        // If form is invalid, return and let AngularJS show validation errors.
        if (message.$invalid) {
            //enable form button
            $scope.formButton = false;
            return;
        }
        
        var data = {
            message: $scope.publicMessage.message
        };
        var config = {
            headers : {
                'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
            }
        };
        UsersService.post('chat/message', JSON.stringify(data), config)
            .then(function (data, status, headers, config) {
                if(data.status) {
                    //if error do not exist add object to dom
                    $scope.chatMessage.push(data.data.body);
                }
        })
            ,function (error) {
            console.log(error);

        };
    };



    $scope.selectUser = function (id) {
        console.log(id);
    };




    

}]);