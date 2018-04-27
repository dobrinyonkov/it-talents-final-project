app.directive('post', function () {
    return {
        templateUrl: 'js/post/postTemplate.htm',
        restrict: 'E',
        scope: {
            post: '=',
            newcomment: '=',
            getuser: '&',
            addcomment:'&',
            calculatetime:'&'

        }
    };
});