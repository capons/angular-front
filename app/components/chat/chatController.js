myApp.controller('chatController', ['$scope', '$http', '$interval', '$location', 'apiUrl', '$timeout', '$window', 'UserData','UsersService', 'Auth', function ($scope, $http, $interval, $location, apiUrl, $timeout, $window, UserData, UsersService, Auth) {

   $scope.chatMessage = [];
   $scope.onlineUsers = [];



   UsersService.get('chat')
       .then(function (data, status, headers, config) {
           if(data.status == 200) {
               $scope.chatMessage = data.data.body;//angular.fromJson(responseData);
               chatScollBottom($scope);
           }
       })
       ,function (error) {
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
                    //chat scroll to the bottom
                    chatScollBottom($scope);
                }
        })
            ,function (error) {
            console.log(error);

        };
    };

    $scope.selectUser = function (id) {
        console.log(id);
    };

    //add chat scroll to bottom
    var chatScollBottom = function ($scope) {
        if($scope.chatMessage) {
            var chatMessageCount = $scope.chatMessage.length;
            var chatMainBox = document.getElementById("over");
            var chatMessageBox =  $(".chatMessageBody");
            var chatWindowHeight = (50*chatMessageCount)+50;
            //add height to chat main window
            chatMessageBox.css("height", chatWindowHeight);
            //chat scroll to bottom
            chatMainBox.scrollTop = chatWindowHeight;
        }
    };
    
    
    
    
    
    //need to add service for this
    //run function to update current user online status + return all online user
    runOnlineUsers();

    var firstTime = false;
    function runOnlineUsers() {
        if(firstTime == true) {
            //every 60 seconf update user online status
            $interval(updateUserOnlineStatus, 60000);
        } else {
            firstTime = true;
            //execute function to update user online status + get all online user
            updateUserOnlineStatus();
            //recursive function call
            runOnlineUsers();
        }
    }

    function updateUserOnlineStatus() {
        var userParam = JSON.parse(Auth.isLoggedIn());
        if(userParam) {
            var data = {
                currentUser: userParam[0].id
            };
            var config = {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                }
            };
            UsersService.post('online/update', JSON.stringify(data), config)
                .then(function (data, status, headers, config) {
                    if (data.status == 200) {
                        getOnlineUser();
                    }
                })
                , function (error) {
            };
        }
    }

    function getOnlineUser() {
        var userParam = JSON.parse(Auth.isLoggedIn());
        if(userParam) {
            var data = {
                currentUser: userParam[0].id
            };
            var config = {
                headers: {
                //    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                }
            };
            UsersService.get('online/user', data, config)
                .then(function (data, status, headers, config) {
                    if (data.status !== 404) {
                        $scope.onlineUsers = data.data.body;
                    } else {
                        $scope.onlineUsers = [];
                    }
                })
                , function (error) {
            };
        }
    }
}]);