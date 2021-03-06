

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