(function () {
    app.controller("ProfileInfoController", function (
        $window,
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
        $scope.newProfilePic={
            url:"",
            uplpoaded:false,
            busy:false
        }
        // $scope.profilePicUploaded = false;
        // $scope.profilePicUrl = "";
        $scope.isOnwer = $window.localStorage.getItem("loggedUserId") == $routeParams.id;
        console.log("profile info controller")
        // $timeout(function () {
        //     $scope.$apply(function () {
        //         var recievId = $scope.profile._id;
        //         $scope.friendsRequestSended = $rootScope.currentUser.sendedReqeusts.indexOf(recievId) !== -1;
        //         console.log($scope.profile._id);
        //         console.log($rootScope.currentUser.friends.indexOf($scope.profile._id));
        //         $scope.areFriends = $rootScope.currentUser.friends.indexOf($scope.profile._id) !== -1;
        //         console.log($scope.areFriends);
        //     });
        // }, 2000);

        var userId = $routeParams.id;
        UserService.getById(userId)
            .then(r => {
                $scope.profile = r.data[0];
                var userId = $window.localStorage.getItem("loggedUserId");
                UserService.getById(userId)
                    .then(r => {
                        console.log(r)
                        $rootScope.currentUser = r.data[0];
                        var recievId = $scope.profile._id;
                        $scope.friendsRequestSended = $rootScope.currentUser.sendedReqeusts.indexOf(recievId) !== -1;
                        console.log($scope.profile._id);
                        console.log($rootScope.currentUser.friends.indexOf($scope.profile._id));
                        $scope.areFriends = $rootScope.currentUser.friends.indexOf($scope.profile._id) !== -1;
                        console.log($scope.areFriends);
                    })
            })
            .catch(err => {
                console.log(err)
                alert("Sorry we couldn't load your profile, please try again later.");
            });

        // EDIT PERSONAL INFORMATION
        $scope.onChangeMode = function () {
            if ($scope.editMode) {
                UserService.update($scope.profile)
                    .then(r => console.log(r))
                    .catch(err => alert(err));
            }
            $scope.editMode = !$scope.editMode;
        };

        $scope.saveAcount = function(user, url) {
          user.profilePic = url;
          UserService.update(user)
            .then(r => {
              console.log(r);
              $scope.newProfilePic.uploaded = false;
            })
            .catch(err => {
                console.log(err)
                alert("We couldn't save your profile settings please try again later.")
            });
        };

        // PROFILE PICTURE UPLOAD
        var selectedFile = document.getElementById("selectedFile");
        selectedFile.addEventListener("change", function (event) {
            var file = event.target.files[0];
            var allowedExtensions = /(\.jpg|\.jpeg|\.png|\.gif)$/i;
            console.log(file);
            if (!allowedExtensions.exec(file.name)) {
                alert('Please upload file having extensions .jpeg/.jpg/.png/.gif only.');
                file = null;
                return false;
            } else {
                // console.log(file);
                console.log("dobre taz snimka iskash shte opitam da q kacha")
                $scope.newProfilePic.busy=true
                fileUpload.uploadFileToUrl(file)
                    .then(r => {
                        console.log("kacih q snimkata, gotov si ")
                        $scope.profile.profilePic = r.data.url;
                        $scope.newProfilePic.uploaded = true;
                        $scope.newProfilePic.url = r.data.url;
                        $scope.newProfilePic.busy =false
                    })
                    .catch(err => {
                        console.log(err)
                        alert("We coudn't upload this image, please try again later, or with a different image.")
                    });
            }
        });

        // SEND FRIEND REQUEST, CANCEL FRIEND REQUEST, UNFRIEND
        $scope.sendFriendRequest = function (senderId, receiverId) {
            console.log(senderId, receiverId);
            if (!$scope.areFriends && !$scope.friendsRequestSended) {
                UserService.friendsRequests.send(senderId, receiverId)
                    .then(r => {
                        if (r.status == '409') {
                            alert(r.data.data);
                        }
                        $scope.friendsRequestSended = true;
                        $scope.sendedFriendRequests.push(r.data[1]);
                    })
                    .catch(err => alert(err));
            } else {
                if ($scope.friendsRequestSended && !$scope.areFriends) {
                    UserService.friendsRequests.deleteFR(senderId, receiverId)
                        .then(r => {
                            $scope.friendsRequestSended = false;
                            var index = $scope.sendedFriendRequests.findIndex(function (user) {
                                return user._id === senderId;
                            });
                            $scope.sendedFriendRequests.splice(index, 1);
                        })
                        .catch(err => alert(err));
                } else {
                    UserService.friendsRequests.unfriend(senderId, receiverId)
                        .then(r => {
                            $scope.areFriends = false;
                            $scope.friendsRequestSended = false;
                            var index = $rootScope.currentUser.friends.findIndex(function (user) {
                                return user._id === senderId;
                            });
                        })
                        .catch(err => alert(err));
                }
                // console.log(senderId, receiverId);
                // Promise.all([UserService.friendsRequests.unfriend(senderId, receiverId), UserService.friendsRequests.deleteFR(senderId, receiverId)])
                //     .then(function (data) {
                //         console.log(data);
                //     })
                //     .catch(function (err) {
                //         console.log(err);
                //     })
            }

        }
        //LOGOUT
        $scope.logout = function ($event) {
            $event.preventDefault();
            localStorage.clear();
            $window.location = `#!/login`;
        };
    });
})();
