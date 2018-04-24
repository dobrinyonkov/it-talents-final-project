app.directive('navigation', function () {
    return {
        templateUrl: 'js/layout/nav/navTemplate.htm',
        css: 'js/login/login.css',
        restrict: 'E',
        scope: {
            user: '='
        }
    };
});