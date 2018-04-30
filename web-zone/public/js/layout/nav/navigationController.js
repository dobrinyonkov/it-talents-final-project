(function (params) {
    app.controller('NavigationController', function ($window, $routeParams, $scope, $timeout, $location, UserService) {
        // $scope.currentUser = {};
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
    });
})();