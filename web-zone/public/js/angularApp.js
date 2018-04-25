var app = angular.module("app", [
    "ngRoute",
    "angularCSS"
]);

app.config(function ($routeProvider, $httpProvider) {
    $routeProvider
        .when("/login", {
            templateUrl: "js/login/login.htm",
            controller: 'LoginController',
            css: 'js/login/login.css'
        })
        .when("/profile", {
            templateUrl : "js/profile/profile.htm",
            controller : "ProfileController",
            css: "js/profile/profile.css",
        })
        .when("/post", {
            templateUrl: "js/post/postPage.htm",
            controller: "postController",

        })
        .when("/addPost", {
            templateUrl: "js/post/addPost.htm",
            controller: "addPostController",

        })
        .when("/newsfeed", {
            templateUrl: "js/news-feed/news-feed.htm",
            controller: 'NewsFeedController',
            css: "js/news-feed/news-feed.css", 
        })


        $httpProvider.interceptors.push(function($q, $location, $window) {
            return {
                'request': function (config) {
                    config.headers = config.headers || {};
                    if ($window.localStorage.getItem('token')) {
                        config.headers.Authorization = 'Bearer ' + $window.localStorage.getItem('token');
                    }
                    return config;
                },
                'responseError': function(response) {
                    if(response.status === 401 || response.status === 403) {
                        $location.path('#!/login');
                    }
                    return $q.reject(response);
                }
            };
        });
});


