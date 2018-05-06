app.directive('pageNavigation', function () {
    return {
        templateUrl: 'js/layout/pageNavigation/pageNavTemplate.htm',
        // css: 'js/layout/nav/navTemplate.css',
        restrict: 'E',
        scope: {
            isOwner:"=",
            profile:"=",
            page:"="
        }
    }
})