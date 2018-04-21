(function () {
    angular
        .module('app')
        .factory('LoginService', LoginService);

    function LoginService($http) {
        var service = {};

        service.login = login;

        return service;

        function login(email, password) {
            var user = {
                email: email,
                password: password
            };


            return $http({
                    method: 'POST',
                    url: 'http://localhost:9000/api/login',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    data: user
                });
        }
    }
})();