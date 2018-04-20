(function () {
    
    angular
        .module('app', ['$http'])
        .factory('LoginService', LoginService);

    console.log('testloginServices')
    function LoginService($http) {
        var service = {};

        function login(email, password) {
            return $http.post(`localhost:9000/api/login`, { email: email, password: password }).then(res => {
                return res;
            });
        }
    }
})();