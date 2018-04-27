(function () {
    angular
        .module('app')
        .controller('RootController', function ($routeParams, $scope, $timeout, $location, UserService) {
            $scope.currentUser = {};
            $scope.isLogged = $location.url().split('/').indexOf('login') === -1;

            $scope.searchUser = function () {
                $timeout(function () {
                    $scope.$apply(function () {
                        console.log($scope.userName);
                    })
                }, 0);
            }
            $timeout(function () {
                $scope.$apply(function () {
                    UserService.getById($routeParams.id).then(data => {
                        console.log(data.data[0]);
                        $scope.currentUser = data.data[0];
                    });
                })
            });
        });
})();