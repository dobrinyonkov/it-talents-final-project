(function () {
    angular
        .module('app')
        .controller('RootController', function ($window, $routeParams, $scope, $timeout, $location, UserService) {
            $scope.currentUser = {};
            $scope.foundUsers = [];
            $scope.selectedUserId = '';
            $scope.userName;
            $scope.isLogged = $location.url().split('/').indexOf('login') === -1;


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

            // $timeout(function () {
            //     $scope.$apply(function () {
                    var userId = $window.localStorage.getItem("loggedUserId");
                    UserService.getById(userId).then(data => {
                        console.log(data.data[0]);
                        $scope.currentUser = data.data[0];
                        

                    });
            //     })
            // }, 0);
        });
})();