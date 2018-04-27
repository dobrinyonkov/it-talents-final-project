function calculateTimeInterval(date) {
    var interval = Date.now() - Date.parse(date)
    // console.log(interval)

    if (interval < 5000) return "just now";
    interval = Math.floor(interval / 1000)
    if (interval < 60) return interval + " seconds ago";
    interval = Math.floor(interval / 60);
    if (interval < 2) return "1 minute ago";
    if (interval < 60) return interval + " minutes ago";
    interval = Math.floor(interval / 60);
    if (interval < 2) return "1 hour ago";
    if (interval < 24) return interval + " hours ago";
    interval = Math.floor(interval / 24);
    if (interval < 2) return "yesterday";
    return interval + " days ago"
}


(function () {
    app.controller('ProfileController', function ($rootScope, fileUpload, $routeParams, $scope, postService, UserService) {
        $scope.editMode = false;
        $scope.profilePicUploaded = false;
        $scope.profilePicUrl = '';
        $scope.posts = [];
        postService.getPost("5ada00a6f2400423d4235f5c").then(post => $scope.posts.push(post))
        //tuka ot user servica

        $scope.getUserById = function () {
            return {
                name: "Hristo Ivanov",
                profilePic: "http://res.cloudinary.com/web-zone2/image/upload/v1524652664/profile2_gklfiw.jpg",

            }
        }

        $scope.calculateTimeInterval = calculateTimeInterval

        var userId = $routeParams.id;
        // UserService.getById(userId)
        // .then(r => {
        //     $rootScope.currentUser = r.data[0];
        // })
        // .catch(err => console.log(err));

        $scope.onChangeMode = function () {
            if ($scope.editMode) {
                UserService.update($scope.currentUser).then(r => console.log(r));
            }
            $scope.editMode = !$scope.editMode;
        }

        $scope.saveAcount = function (user, url) {
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