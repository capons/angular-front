//here need to add service and factory method
var myApp = angular.module('app',['ngRoute','UserService','ngAnimate','ngResource']);

//project const
myApp.constant('apiUrl', 'http://api/');

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
        controller: 'saleController' }).
    otherwise({ redirectTo: '/home' });


}]);



myApp.controller('homeController', ['$scope', '$http', '$interval', '$location', 'apiUrl', '$timeout', '$window', 'UserData','UsersService', function ($scope, $http, $interval, $location, apiUrl, $timeout, $window, UserData, UsersService) {
    //display all user




    $scope.users = [];
    //ajax loader
    $scope.loading = true;
    //load service method getUser() -> factory UserService ->  object UserData
    UsersService.get()
        .success(function (data, status, headers, config) {
            //console.log(data.body);
            console.log(data);
            $scope.users = data;//angular.fromJson(responseData);
            //  angular.forEach(data.data, function(item){
            //  });
            //ajax loader off
            $scope.loading = false;
        })
        .error(function (data, status, header, config) {
            console.log(data);
            console.log(status);
            console.log(header);
            console.log(config);

        });









    //add upload file to array ->> need to send file in request
    $scope.setFiles = function (element) {
        $scope.$apply(function (scope) {
            $scope.files = [];
            for (var i = 0; i < element.files.length; i++) {
                $scope.files.push(element.files[i])
            }
        });
    };
        //registration form validation
        $scope.regForm = function(isValid) {
        // check to make sure the form is completely valid
        if (isValid) {
            //user data
            $scope.master = {};
            //save user
            $scope.update = function(user) {
                //load upload file service
                uploadPhoto();
                function uploadPhoto() {
                    UserData.uploadPhoto($scope.files,$scope.master,user)
                        .success(function (data, status, headers, config) {

                            //add new user to scope -> to see changes

                            $scope.master = angular.copy(user);
                            //add file upload path to user data
                            $scope.master['file_path'] = data;
                            console.log($scope.master);
                            //load addUser service

                            addUser();
                            function addUser() {
                                UserData.addUser($scope.master)
                                    .success(function (data, status, headers, config) {
                                        //add new user to scope -> to see changes
                                        $scope.users.push(data);
                                        //upload photo
                                    })
                                    .error(function (data, status, header, config) {
                                        //Если пользователь не сохранился то нужно удалить картинкку которую мы загрузили перед тем как отправили даные пользователя
                                        console.log(data);
                                        console.log(status);
                                        console.log(header);
                                        console.log(config);
                                    });
                            }
                        })
                        .error(function (data, status, header, config) {
                            //Если пользователь не сохранился то нужно удалить картинкку которую мы загрузили перед тем как отправили даные пользователя
                            console.log(data);
                            console.log(status);
                            console.log(header);
                            console.log(config);
                        });
                }
            };
        }
    };



    //delete user
    $scope.delete = function (user_id,item) {
        deleteUser();
        function deleteUser() {
            UserData.deleteUser(user_id)
                .success(function (data) {
                    //remove element from users scope
                    var index = $scope.users.indexOf(item);
                    $scope.users.splice(index, 1);
                })
                .error(function (data, status, header, config) {
                    //Если пользователь не сохранился то нужно удалить картинкку которую мы загрузили перед тем как отправили даные пользователя
                    console.log(data);
                    console.log(status);
                    console.log(header);
                    console.log(config);
                });

        }


    };







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

var UserService = angular.module('UserService', []);
//app.module -> all constant
UserService.factory('UserData', ['$http','apiUrl', function ($http,apiUrl) {

    var UserData = {};
    /* this methid remove to service
    UserData.getUser = function () {
        return $http.get(apiUrl+'users',{
            header: {
                'Access-Control-Allow-origin': '*',
                'Content-Type': 'application/json'

            }
        });
    };
    */

    UserData.uploadPhoto = function (files,master,user){
        var fd = new FormData();
        for (var i in files) {
            //get file name to send in API server
            fd.append("uploadedFile", files[i])
        }
        //upload user photo

        return $http.post("photo.php", fd, {
            withCredentials: false,
            headers: {
                'Content-Type': undefined
            },
            transformRequest: angular.identity,
            params: {
                fd: fd
            }
        });
    };

    UserData.addUser = function (user){
        var param = $.param({
            data: user
        });
        var conf = {
            headers : {
                'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
            }
        };
        return $http.post(apiUrl+'users', param, conf);
    };
    UserData.deleteUser = function (user_id){

        return  $http({
            method : "GET",
            url : apiUrl+'users/'+user_id+"/remove"
        })
    };
    return UserData;
}]);




//service example
myApp.service('UsersService',['$http', 'apiUrl', function ($http, apiUrl) {
    //to create unique contact id


    //save method create a new contact if not already exists
    //else update the existing object
    this.get = function () {
        return $http.get(apiUrl+'users',{
            header: {
                'Access-Control-Allow-origin': '*',
                'Content-Type': 'application/json'
            }
        });
    };
}]);



myApp.controller('saleController', ['$scope', '$interval', '$location', function ($scope, $interval, $location) {
   console.log('sale controller');
}]);
/**
 * Created by User on 11/11/2016.
 */


myApp.directive('activeLink', ['$location', function (location) {
    //create menu active links
    return {
        restrict: 'A',
        link: function(scope, element, attrs, controller) {
            var clazz = attrs.activeLink;
            var path = attrs.href;
            scope.location = location;
            scope.$watch('location.path()', function (newPath) {

                if (path === newPath) {
                    element.addClass(clazz);
                } else {
                    element.removeClass(clazz);
                }
            });
        }
    };
}]);

