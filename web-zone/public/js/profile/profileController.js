(function () {
    app.controller('ProfileController', function ($firebaseStorage, fileUpload, $routeParams, $scope, postService, UserService) {
        $scope.currentUser = {};
        $scope.editMode = false;
        $scope.posts = [];
        postService.getPost("5ada00a6f2400423d4235f5c").then(post => $scope.posts.push(post))
        //tuka ot user servica
        $scope.getUserById = function () {
            // console.log(arguments)
            return {
                name: "Hristo Ivanov",
                profilePic: "http://res.cloudinary.com/web-zone2/image/upload/v1524652664/profile2_gklfiw.jpg",

            }
        }

        var userId = $routeParams.id;
        UserService.getById(userId).then(r => {
            $scope.currentUser = r.data[0];
            console.log($scope.currentUser.firstName);
        });

        $scope.onChangeMode = function () {
            $scope.editMode = !$scope.editMode;
        }


        $scope.onFileSelected = function (files) {
            console.log(files);
        }

        $scope.uploadFile = function () {
            var file = $scope.myFile;

            var storageRef = firebase.storage().ref('userProfiles/physicsmarie');
            var storage = $firebaseStorage(storageRef);

            var uploadTask = storage.$put(file);
        };

        var selectedFile = document.getElementById('selectedFile');
        console.log(selectedFile);
        selectedFile.addEventListener('change', function (event) {
            console.log(event);
        })
    });
})();