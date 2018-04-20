(function (params) {
    console.log('test');
    angular
        .module('app')
        .controller('RegisterController', function ($scope) {
            $scope.test = {
                name : 'testTheMF'
            }
        });
})();