app.directive('post', function () {
    return {
        templateUrl: 'js/post/postTemplate.htm',
        css: 'js/post/post.css',
        restrict: 'E',
        scope: {
            post: '=',
            newcomment: '=',
            addcomment:'&',
            calculatetime:'&'

        }
    };
});