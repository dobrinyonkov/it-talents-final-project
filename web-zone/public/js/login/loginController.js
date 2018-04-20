(function (params) {

    angular
        .module('app')
        .controller('LoginController', LoginController);

    function LoginController($scope, LoginService) {
        $scope.test = 'test';
        $scope.user = {};
        $scope.signIn = signIn;

        function signIn($event) {
            // debugger;
            $event.preventDefault();
            // console.log($scope.user);
            LoginService.login($scope.user.email, $scope.user.password).then(r => {
                console.log(r);
            });
        }
    }


})();