app.directive('pageNavigation', function () {
    return {
        templateUrl: 'js/layout/pageNavigation/pageNavTemplate.htm',
        css: 'js/layout/pageNavigation/pageNavigation.css',
        restrict: 'E',
        scope: {
            isOwner:"=",
            profile:"=",
            page:"="
        }
    }
})