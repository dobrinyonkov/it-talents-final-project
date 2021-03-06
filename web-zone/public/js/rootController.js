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


            var userId = $window.localStorage.getItem("loggedUserId");
            UserService.getById(userId).then(data => {
                $timeout(function () {
                    $scope.$apply(function () {
                        $rootScope.currentUser = data.data[0];
                        $rootScope.currentUser.receivedReqeusts.forEach(userId => {
                            UserService.getById(userId).then(data => {
                                $scope.receivedFriendRequests.push(data.data[0]);
                                console.log($scope.receivedFriendRequests);
                            });
                        })
                    }, 0);
                    // UserService.getById(userId).then(data => {
                    //     $scope.sendedFriendRequests.push(data.data[0]);
                    //     console.log($scope.sendedFriendRequests);
                    // });

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

        });

})();