(function () {
    app.controller("ProfileInfoController", function (
        $rootScope,
        fileUpload,
        $routeParams,
        $scope,
        PostService,
        UserService,
        $timeout
    ) {
        // $scope.profile = {};
        $scope.editMode = false;
        $scope.profilePicUploaded = false;
        $scope.profilePicUrl = "";
        
        var userId = $routeParams.id;
        // UserService.getById(userId)
        //     .then(r => {
        //         $scope.profile = r.data[0];
        //         return r.data[0].posts;
        //     })
            
        $scope.onChangeMode = function () {
            if ($scope.editMode) {
                UserService.update($scope.profile).then(r => console.log(r));
            }
            $scope.editMode = !$scope.editMode;
        };

        $scope.saveAcount = function (user, url) {
            user.profilePic = url;
            // console.log(user);
            UserService.update(user).then(r => console.log(r));
        };
        // PROFILE PICTURE UPLOAD
        var selectedFile = document.getElementById("selectedFile");
        selectedFile.addEventListener("change", function (event) {
            var file = event.target.files[0];
            console.log(file);
            fileUpload.uploadFileToUrl(file).then(r => {
                $scope.profilePicUploaded = true;
                $scope.profilePicUrl = r.data.url;
            });
        });

        //friendReuests
        //send

        console.log(UserService);

        $scope.sendFriendRequest = function (senderId, receiverId) {
            console.log(senderId,receiverId);
            UserService.friendsRequests.send(senderId, receiverId)
            .then(r => console.log(r))
            .catch(err => console.log(err));
        }
    });
})();
