angular
    .module('app', [])
    .controller('LoginController', function ($scope) {
        var vm = this;
        vm.login = login;

        function login($event) {
            $event.preventDefault();
            vm.dataLoading = true;
            LoginService.login(vm.email, vm.password).then(res => {
                console.log(res);
            })
        }
    });