(function (params) {
    app.controller('NavigationController', function ($window, $routeParams, $scope, $timeout, $location, UserService) {
        // $scope.currentUser = {};
        $scope.foundUsers = [];
        $scope.selectedUserId = '';
        $scope.userName;

        $scope.onConfirmFriendReuest = function ($event, sender, receiver) {
            console.log(sender);
            console.log(receiver);
            $event.stopPropagation();
            $event.preventDefault();
            UserService.friendsRequests.confirm(sender, receiver).then(r => {
                var index = $scope.receivedFriendRequests.findIndex(u => u._id === receiver._id);
                var user = $scope.receivedFriendRequests.find(u => u._id === receiver._id);
                $scope.receivedFriendRequests.splice(index, 1);
                // $scope.friendsRequestSended = false;
                // $scope.areFriends = null;
            }).catch(err => {
                console.log(err);
            });
        }

        $scope.onDeleteFriendReuest = function ($event, sender, receiverId) {
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

        $scope.searchUser = function (userName) {
            console.log(userName);
            if ((userName.trim().length !== 0)) {
                UserService.getByName(userName)
                    .then(r => {
                        //store founded user to display on autocomplete div
                        $scope.foundUsers = r.data;
                        console.log($scope.foundUsers)
                    })
                    .catch(err => console.log(err));
            } else {
                $scope.foundUsers = [];
            }

        }

        $scope.selectUser = function (foundUser) {
            console.log(foundUser);

            //name to fill the input field
            $scope.userName = foundUser.firstName + ' ' + foundUser.lastName;

            //empty the array so autocomplete div hides
            $scope.foundUsers = [];

            $window.location = `#!/profile/${foundUser._id}`;

        }
        $scope.logout = function ($event) {
            $event.preventDefault();
            localStorage.clear();
            $window.location = `#!/login`;
        };
    });
})();