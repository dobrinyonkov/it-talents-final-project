(function () {
    angular
        .module('app')
        .factory('LoginService', LoginService);

    function LoginService($http) {
        var service = {};

        service.login = login;

        return service;

        function login(email, password) {
            return $http.post('localhost:9000/api/login', { email: email, password: password });
        }
    }
})();