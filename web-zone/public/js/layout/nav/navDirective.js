app.directive('navigation', function () {
    return {
        templateUrl: 'js/layout/nav/navTemplate.htm',
        css: 'js/layout/nav/navTemplate.css',
        restrict: 'E',
        scope: {
            user: '='
        }
    };
});