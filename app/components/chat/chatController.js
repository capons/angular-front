myApp.controller('chatController', ['$scope', '$http', '$interval', '$location', 'apiUrl', '$timeout', '$window', 'UserData','UsersService', 'Auth', 'chatService', function ($scope, $http, $interval, $location, apiUrl, $timeout, $window, UserData, UsersService, Auth, chatService) {

    $scope.chatMessage = [];
    $scope.onlineUsers = [];
    
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
                    //clear input
                    $scope.publicMessage.message = null;
                    //if error do not exist add object to dom
                    //do not update chat with my message, global chat update loop will do it
                   // $scope.chatMessage.push(data.data.body);
                    //chat scroll to the bottom
                    chatScollBottom($scope);
                }
        })
            ,function (error) {
           // console.log(error);

        };
    };

    var chatScollBottom = function () {
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
    }

    $scope.selectUser = function (id) {
        //console.log(id);
    };


    chatService.updateChatMessage($scope);
    chatService.updateUserOnlineStatus($scope);


}]);