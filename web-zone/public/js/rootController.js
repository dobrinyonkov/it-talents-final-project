(function () {
    angular
        .module('app')
        .controller('RootController', function ($rootScope, $window, $routeParams, $scope, $timeout, $location, UserService) {
            $rootScope.currentUser = {};
            $scope.foundUsers = [];
            $scope.selectedUserId = '';
            $scope.userName;
            $timeout(function () {
                $scope.$apply(function () {
                    $scope.isLogged = $window.localStorage.getItem("loggedUserId") !== null;
                })
            }, 0)
            $scope.sendedFriendRequests = [];
            $scope.receivedFriendRequests = [];
            $scope.friendsRequestSended = false;
            $scope.areFriends = null;

            if ($scope.isLogged) {


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



                $timeout(function () {
                    $scope.$apply(function () {
                        var userId = $window.localStorage.getItem("loggedUserId");
                        UserService.getById(userId).then(data => {
                            // console.log(data.data[0]);
                            $timeout(function () {
                                $scope.$apply(function () {
                                    $rootScope.currentUser = data.data[0];
                                    $rootScope.currentUser.receivedReqeusts.forEach(userId => {
                                    })
                                }, 0);
                                // UserService.getById(userId).then(data => {
                                //     $scope.sendedFriendRequests.push(data.data[0]);
                                //     console.log($scope.sendedFriendRequests);
                                // });
                                UserService.getById(userId).then(data => {
                                    $scope.receivedFriendRequests.push(data.data[0]);
                                    console.log($scope.receivedFriendRequests);
                                });
                            });
                            // $rootScope.currentUser.sendedReqeusts.forEach(userId => {
                            //     UserService.getById(userId).then(data => {
                            //         $scope.sendedFriendRequests.push(data.data[0]);
                            //         console.log($scope.sendedFriendRequests);
                            //     });
                            //     // UserService.getById(userId).then(data => {
                            //     //     $scope.receivedFriendRequests.push(data.data[0]);
                            //     //     console.log($scope.receivedFriendRequests);
                            //     // });
                            // });
                        });
                    })
                }, 0);
            }
        });

})();