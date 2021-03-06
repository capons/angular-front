
//here need to add service and factory method
var myApp = angular.module('app',['ngRoute', 'UsersService', 'ngAnimate', 'ngResource', 'ngFileUpload']);

//project const
myApp.constant('apiUrl', 'http://api/');


//watch permission route
myApp.run(['$rootScope', '$location', 'Auth', '$routeParams',function ($rootScope, $location, Auth ,$routeParams) {
    //admin permission route
    var permissionRoute = [
        'chat'
    ];
    //route change event - check if user have permission
    $rootScope.$on('$routeChangeStart', function (event) {
        var currentRoute = $location.path();
        var route = currentRoute.replace("/","");
        if(permissionRoute.indexOf(route) == 0) {
            if (!Auth.isLoggedIn()) {
                //if do not login redirect to login route
                console.log('DENY');
                //  event.preventDefault();
                $location.path('/login');
            }
            /*
            else {
                console.log('ALLOW');
                $location.path('/home');
            }
            */
        }
    });
}]);





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
        getUser : function () {
           return  angular.fromJson($window.localStorage.getItem(key));
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
}]);

//app routes
myApp.config(['$routeProvider','$locationProvider', function ($routeProvider,$locationProvider) {
    $locationProvider.html5Mode(true); //help to remove # from URL
    $routeProvider.
    when('/home', {
        templateUrl: 'app/components/home/homeView.html',
        controller:'homeController'
    }).
    when('/sale', {
        templateUrl: 'app/components/sale/saleView.html',
        controller: 'saleController'
    }).
    when('/login', {
        templateUrl: 'app/components/login/loginView.html',
        controller: 'loginController'
    }).
    when('/chat', {
        templateUrl: 'app/components/chat/index.html',
        controller: 'chatController'
    }).
    otherwise({ redirectTo: '/home' })
}]);


//global application controller
myApp.controller('applicationController', ['$scope', '$http', '$interval', '$location', 'apiUrl', '$timeout', '$window', 'UserData','UsersService','$timeout', 'AuthService', function ($scope, $http, $interval, $location, apiUrl, $timeout, $window, UserData, UsersService, USER_ROLES, AuthService) {
    //define login user object
    $scope.currentUser = null;
    $scope.userRoles = USER_ROLES;
    $scope.isAuthorized = AuthService.isAuthorized;
    $scope.setCurrentUser = function (user) {
        $scope.currentUser = user;
    };

}]);


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
myApp.controller('defaultCtrl', ['$rootScope','$scope', '$http', '$interval', '$location', 'apiUrl', '$timeout', '$window', 'UserData','UsersService', 'Auth', function ($rootScope, $scope, $http, $interval, $location, apiUrl, $timeout, $window, UserData, UsersService, Auth) {
    $scope.isLoggin = true;
    $scope.logOut = function () {
        Auth.logOut();
        $window.location.href = '/home';
    };
    //listening route change and display login button or lofOut
    $rootScope.$on('$routeChangeStart', function (event) {
        (!Auth.isLoggedIn()) ? $scope.isLoggin = false :   $scope.isLoggin = true ;
        //check user authentication
        checkLogin();
    });
    
    //check login
    function checkLogin() {
        var authUserParam = Auth.getUser();
        var param = $.param({email: authUserParam[0].email});
        var config = {
            headers : {
                'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
            }
        };
        UsersService.post('login/confirm', param, config)
            .then(function (data) {
                //if user check status == false -> remove auth session and redirect user
                if(data.status == false) {
                    //add login user parameter to auth session
                    Auth.logOut();
                    $window.location.href = '/';
                }
            })
            ,function (error) {
         
            //  console.log(status);
            //  console.log(header);
            //  console.log(config);
        };
    }
}]);



myApp.controller('homeController', ['$scope', '$http', '$interval', '$location', 'apiUrl', '$timeout', '$window', 'UserData','UsersService','$timeout', function ($scope, $http, $interval, $location, apiUrl, $timeout, $window, UserData, UsersService) {
    //display all user
    $scope.users = [];
    //ajax loader
    $scope.loading = true;

    UsersService.get('users')
        .then(function (data, status, headers, config) {
            console.log(data);
            if(data.data.body.length > 0) {
                $scope.users = data.data.body;//angular.fromJson(responseData);
            }
            $scope.loading = false;
        })
        ,function (error) {
            console.log(error);

        };
    //pagination users data //pagination filter "startFrom"
    $scope.currentPage = 0;
    //number of item in one page
    $scope.pageSize = 4;
   // $scope.data = [];
    $scope.numberOfPages=function(){
        return Math.ceil($scope.users.length/$scope.pageSize);
    };

    //some click loader function display animation
    $scope.loader = function(){
        $scope.loading = true;
        $timeout(function () {
            $scope.loading = false;
        }, 500);
    };

    //add upload file to array ->> need to send file in request
    $scope.setFiles = function (element) {
        $scope.$apply(function (scope) {
            $scope.files = [];
            for (var i = 0; i < element.files.length; i++) {
                $scope.files.push(element.files[i])
            }
        });
    };

    //submit register form
    $scope.submit = function(user) {
        //disable form button
        $scope.formButton = true;
        // Trigger validation flag.
        //flag to display error message
        $scope.submitted = true;
        // If form is invalid, return and let AngularJS show validation errors.
        if (user.$invalid) {
            //enable form button
            $scope.formButton = false;
            return;
        }
        $scope.master = {};
        //save user

        $scope.master = angular.copy(user);
        //add file upload path to user data
       // $scope.master['file_path'] = data;

        //user param
        uploadBar($scope); //$scope.files, $scope.user

    };


    //delete user
    $scope.delete = function (user_id,item) {
        UsersService.delete(user_id,item)
            .then(function (data) {
                //remove element from users scope
                var index = $scope.users.indexOf(item);
                $scope.users.splice(index, 1);
              //  console.log(data);
            })
            ,function (error) {
              //  console.log(error);
              //  console.log(status);
              //  console.log(header);
              //  console.log(config);
            };

    };

    //send registration form with file and show upload bar
    function uploadBar($scope) { //file, user
        //for if need upload multiple files
      //  for (var i in file) {
            var form = new FormData();
            var xhr = new XMLHttpRequest;
            // Additional POST variables required by the API script
            form.append('file', $scope.files[0]);
            form.append('name', $scope.user.name);
            form.append('email', $scope.user.email);
            form.append('country', $scope.user.country);
            form.append('address',$scope.user.address);


            $scope.uploadProgressBar = true;
            xhr.upload.onprogress = function(e) {
                // Event listener for when the file is uploading
                $scope.$apply(function() {
                    var percentCompleted;
                    if (e.lengthComputable) {
                        percentCompleted = Math.round(e.loaded / e.total * 100);
                        if (percentCompleted < 1) {
                            // .uploadStatus will get rendered for the user via the template
                            $scope.files[0].uploadStatus = 'Uploading...';
                            $scope.progressStyle = {'width':percentCompleted+'%'};
                        } else if (percentCompleted == 100) {
                            $scope.files[0].uploadStatus = 'Saving...';
                            $scope.progressStyle = {'width':100+'%'};
                            console.log('save');
                        } else {
                            console.log(percentCompleted);
                            $scope.files[0].uploadStatus = percentCompleted + '%';
                        }
                    }
                });
            };
            xhr.upload.onload = function(e) {
                // Event listener for when the file completed uploading
                $scope.$apply(function() {
                    $scope.files[0].uploadStatus = 'Uploaded!';
                    setTimeout(function() {
                        $scope.$apply(function() {
                            $scope.files[0].uploadStatus = '';
                        });
                    }, 4000);
                });
            };
            xhr.onreadystatechange = function() {
                if (xhr.readyState == XMLHttpRequest.DONE) {
                    UserData.clearField($scope);
                    //enable form button
                    $scope.formButton = false;
                    //pars json from API
                    var response = JSON.parse(xhr.responseText);
                    if(response.status) {
                        //if error do not exist add object to dom
                        $scope.users.unshift(response.body);
                    } else {
                        //display error
                        $scope.errorMessage = true;
                        $scope.errors = response.error;
                    }
                    //after form submitted turn false error flag for message
                    $scope.submitted = false;
                    //disabled progress bar
                    $scope.uploadProgressBar = false;
                    // $scope.errorMessage = false;
                }
            };
            xhr.open('POST', apiUrl+'users', true);
          //  xhr.setRequestHeader('Content-Type', 'multipart/form-data');
            xhr.send(form);
      //  }
    }


    //hide error message if exist
    $scope.$watch('errorMessage', function(newValue, oldValue) {
        if (newValue !== oldValue) {
            $timeout(function () {
                $scope.errorMessage = false;
            }, 5000);
        }
    });
    





















        /*

        function WorkoutPlan(args) {
            this.exercises = [];
            this.name = args.name;
            this.title = args.title;
            this.restBetweenExercise = args.restBetweenExercise;
        };

        function Exercise(args) {
            this.name = args.name;
            this.title = args.title;
            this.description = args.description;
            this.instructions = args.instructions;
            this.image = args.image;
            this.related = {};
            this.related.videos = args.videos;
            this.related.variations = args.variations;
            this.nameSound = args.Sound;
        }

        var restExercise;
        var workoutPlan;
        var startWorkout = function () {
            workoutPlan = createWorkout();
            restExercise = {
                exercise: new Exercise({
                    name: "rest",
                    title: "Rest",
                    description: "Discription about resting :)",
                    image: "img/rest.png",

                }),
                duration: workoutPlan.restBetweenExercise
            };
            startExercise(workoutPlan.exercises.shift());
        };



        var startExercise = function (exercisePlan) {
            console.log('starting exercise:' + exercisePlan.exercise.name);
            $scope.currentExercise = exercisePlan;
            $scope.currentExerciseDuration = 0;
            $interval(function () {
                $scope.currentExerciseDuration = $scope.currentExerciseDuration + 1;
            }, 1000, $scope.currentExercise.duration)
                .then(function () {
                    var nextPlan = getNextExercise(exercisePlan);
                    if (nextPlan) {
                        startExercise(nextPlan);
                    }
                    else {
                        workoutComplete();
                    }
                });
        };

        var getNextExercise = function (currentExercisePlan) {
            var nextExercise = null;
            if (currentExercisePlan === restExercise) {
                nextExercise = workoutPlan.exercises.shift();
            }
            else {
                if (workoutPlan.exercises.length != 0) {
                    nextExercise = restExercise;
                }
            }
            return nextExercise;
        };
        //$scope.$watch('currentExerciseDuration', function (newValue, oldValue) {
        //    if (newValue && newValue != oldValue) {
        //        if (newValue == $scope.currentExercise.duration) {
        //            var nextExercise = null;
        //            if ($scope.currentExercise === restExercise) {
        //                nextExercise = $scope.workoutPlan.exercises.shift();
        //            }
        //            else {
        //                if ($scope.workoutPlan.exercises.length == 0) {
        //                    $scope.workoutComplete = true;
        //                }
        //                else {
        //                    nextExercise = restExercise;
        //                }
        //            }
        //            $scope.currentExercise = nextExercise;
        //        }
        //    }
        //});

        var workoutComplete = function () {
            $location.path('/finish');
        };

        var createWorkout = function () {
            var workout = new WorkoutPlan({
                name: "7minWorkout",
                title: "7 Minute Workout",
                restBetweenExercise: 10
            });

            workout.exercises.push({
                exercise: new Exercise({
                    name: "jumpingJacks",
                    title: "Jumping Jacks",
                    description: "Jumping Jacks.",
                    image: "img/JumpingJacks.png",
                    videos: [],
                    variations: [],
                    procedure: ""
                }),
                duration: 30
            });
            workout.exercises.push({
                exercise: new Exercise({
                    name: "wallSit",
                    title: "Wall Sit",
                    description: "Wall Sit.",
                    image: "img/wallsit.png",
                    videos: [],
                    variations: [],

                }),
                duration: 30
            });
            workout.exercises.push({
                exercise: new Exercise({
                    name: "pushUp",
                    title: "Push Up",
                    description: "Discription about pushup.",
                    image: "img/pushup.png",
                    videos: ["https://www.youtube.com/watch?v=Eh00_rniF8E", "https://www.youtube.com/watch?v=ZWdBqFLNljc", "https://www.youtube.com/watch?v=UwRLWMcOdwI", "https://www.youtube.com/watch?v=ynPwl6qyUNM", "https://www.youtube.com/watch?v=OicNTT2xzMI"],
                    variations: ["Planche push-ups", "Knuckle push-ups", "Maltese push-ups", "One arm versions"],
                    procedure: ""
                }),
                duration: 30
            });
            workout.exercises.push({
                exercise: new Exercise({
                    name: "crunches",
                    title: "Abdominal Crunches",
                    description: "Abdominal Crunches.",
                    image: "img/crunches.png",
                    videos: [],
                    variations: [],
                    procedure: ""
                }),
                duration: 30
            });
            workout.exercises.push({
                exercise: new Exercise({
                    name: "stepUpOntoChair",
                    title: "Step Up Onto Chair",
                    description: "Step Up Onto Chair.",
                    image: "img/stepUpOntoChair.jpeg",
                    videos: [],
                    variations: [],
                    procedure: ""
                }),
                duration: 30
            });
            workout.exercises.push({
                exercise: new Exercise({
                    name: "squat",
                    title: "Squat",
                    description: "Squat.",
                    image: "img/squat.png",
                    videos: [],
                    variations: [],
                    procedure: ""
                }),
                duration: 30
            });
            workout.exercises.push({
                exercise: new Exercise({
                    name: "tricepdips",
                    title: "Tricep Dips On Chair",
                    description: "Tricep Dips On Chair.",
                    image: "img/tricepdips.jpg",
                    videos: [],
                    variations: [],
                    procedure: ""
                }),
                duration: 30
            });
            workout.exercises.push({
                exercise: new Exercise({
                    name: "plank",
                    title: "Plank",
                    description: "Plank.",
                    image: "img/plank.png",
                    videos: [],
                    variations: [],
                    procedure: ""
                }),
                duration: 30
            });
            workout.exercises.push({
                exercise: new Exercise({
                    name: "highKnees",
                    title: "High Knees",
                    description: "High Knees.",
                    image: "img/highknees.png",
                    videos: [],
                    variations: [],
                    procedure: ""
                }),
                duration: 30
            });
            workout.exercises.push({
                exercise: new Exercise({
                    name: "lunges",
                    title: "Lunges",
                    description: "Lunges.",
                    image: "img/lunges.png",
                    videos: [],
                    variations: [],
                    procedure: ""
                }),
                duration: 30
            });
            workout.exercises.push({
                exercise: new Exercise({
                    name: "pushupNRotate",
                    title: "Pushup And Rotate",
                    description: "Pushup And Rotate.",
                    image: "img/pushupNRotate.jpg",
                    videos: [],
                    variations: [],
                    procedure: ""
                }),
                duration: 30
            });
            workout.exercises.push({
                exercise: new Exercise({
                    name: "sidePlank",
                    title: "Side Plank",
                    description: "Side Plank.",
                    image: "img/sideplank.png",
                    videos: [],
                    variations: [],
                    procedure: ""
                }),
                duration: 30
            });
            return workout;
        };

        var init = function () {
            startWorkout();
        };

        init();
        */
    }]);

var UsersService = angular.module('UsersService', []);
//app.module -> all constant
UsersService.factory('UserData', ['$http', 'apiUrl', function ($http,apiUrl) {
    //object return with service
    var UserData = {};

    //update form fields
    UserData.clearField = function (scope){
        scope.user.name = '';
        scope.user.address = '';
        scope.user.email = '';
        scope.user.country = '';
        angular.element("input[type='file']").val(null);
    };
    return UserData;
}]);
//pagination filter
myApp.filter('startFrom', function() {
    return function(input, start) {
        start = +start; //parse to int
        return input.slice(start);
    }
});

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
                        //add login user parameter to auth session
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


myApp.controller('saleController', ['$scope', '$interval', '$location', function ($scope, $interval, $location) {
   console.log('sale controller');
}]);
/**
 * Created by User on 11/11/2016.
 */
