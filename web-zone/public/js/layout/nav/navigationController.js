(function (params) {
    app.controller('NavigationController', function ($window, $routeParams, $scope, $timeout, $location, UserService) {
        // $scope.currentUser = {};
        $scope.foundUsers = [];
        $scope.selectedUserId = '';
        $scope.userName;

        $scope.onConfirmFriendReuest = function ($event, senderId, receiverId) {
            console.log(senderId);
            console.log(receiverId);
            $event.stopPropagation();
            $event.preventDefault();
            UserService.friendsRequests.confirm(senderId, receiverId).then(r => {
                var index = $scope.receivedFriendRequests.findIndex(u => u._id === receiverId);
                var user = $scope.receivedFriendRequests.find(u => u._id === receiverId);
                $scope.receivedFriendRequests.splice(index, 1);
                // $scope.friendsRequestSended = false;
                // $scope.areFriends = null;
            }).catch(err => {
                console.log(err);
            });
        }

        $scope.onDeleteFriendReuest = function ($event, senderId, receiverId) {
            $event.stopPropagation();
            $event.preventDefault();
            UserService.friendsRequests.deleteFR(senderId, receiverId).then(r => {
                $scope.friendsRequestSended = false;
                $scope.areFriends = true;
                var index = $scope.receivedFriendRequests.findIndex(u => u._id === receiverId);
                $scope.receivedFriendRequests.splice(index, 1);
            }).catch(err => {
                console.log(err);
            });
        }

        $scope.searchUser = function () {
            $timeout(function () {
                $scope.$apply(function () {
                    var name = $scope.userName;
                    if ((name.length !== 0)) {
                        UserService.getByName(name)
                            .then(r => {
                                console.log(r.data);
                                $scope.foundUsers = r.data;
                            })
                            .catch(err => console.log(err));
                    }
                })
            }, 0);
        }

        $scope.selectUser = function () {
            $timeout(function () {
                $scope.$apply(function () {
                    $window.location = `#!/profile/${$scope.selectedUserId}`;
                })
            }, 0);
        }
    });
})();