(function () {
    app.controller('ProfileController', function (fileUpload, $routeParams, $scope, postService, UserService) {
        $scope.currentUser = {};
        $scope.editMode = false;
        $scope.profilePicUploaded = false;
        $scope.profilePicUrl = '';
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
        }).catch(err => console.log(err));

        $scope.onChangeMode = function () {
            $scope.editMode = !$scope.editMode;
        }

        $scope.saveProfilePic = function (user, url) {
            user.profilePic = url;
            console.log(user);
            UserService.update(user).then(r => console.log(r));
        }

        var selectedFile = document.getElementById('selectedFile');
        console.log(selectedFile);

        selectedFile.addEventListener('change', function (event) {
            var file = event.target.files[0];
            console.log(file);
            fileUpload.uploadFileToUrl(file).then(r => {
                $scope.profilePicUploaded = true;
                $scope.profilePicUrl = r.data.url;
            });
        });
    });
})();