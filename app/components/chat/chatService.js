myApp.service('chatService',['$http', '$interval', 'apiUrl', '$timeout', 'UsersService', 'Auth',function ($http, $interval, apiUrl, $timeout, UsersService, Auth) {
    this.updateUserOnlineStatus = function ($scope) {
        //get online users
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
        //update current user online status
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
                            //update current user online status
                            getOnlineUser($scope)
                        }
                    })
                    , function (error) {
                };
            }
        }


        var firstTime = false;
        function execute() {
            if(firstTime == true) {
                //every 60 second update current user online stats
                $interval(updateUserOnlineStatus, 60000);

            } else {
                firstTime = true;
                updateUserOnlineStatus();
                //recursive function call
                execute();
            }
        }

        return execute()
    };
    
    this.updateChatMessage = function ($scope) {
        function chatScollBottom() {
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

        var existIds = [];
        var  updateChatMessage = function(firstTime) {
            var param = '';
            if(existIds.length > 0) {
               // console.log('request param ' + existIds);
                var param = {'existIds[]':  existIds}
            }
            UsersService.get('chat', param)
                .then(function (data, status, headers, config) {
                    if(data.status == 200) {
                        
                            //var promise = $timeout();
                           // fruits.reverse();
                             angular.forEach(data.data.body, function (value, key) {
                                 //console.log(value.id);
                                 existIds.push(value.id);
                                 $scope.chatMessage.push(value); //unshift
                             //    console.log(value.id);
                                /*
                                 promise = promise.then(function () {
                                     $scope.chatMessage.push(value); //unshift
                                     return $timeout(500);
                                 });
                                 */
                             });
                        
                        chatScollBottom();
                    }
                })
                ,function (error) {
            };
        };

        function execute() {
            //run at first time
            updateChatMessage(true);
            //loop in second time
            $interval( function(){ updateChatMessage(false) }, 5000);

        }
        
        return execute()
    };

}]);