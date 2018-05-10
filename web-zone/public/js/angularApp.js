var app = angular.module("app", [
    "ngRoute",
    "angularCSS",
]);

app.constant("API_URL",'/');
// app.constant("API_URL",'http://localhost:9000/');

app.config(function ($routeProvider, $httpProvider) {

    
    $routeProvider
        .when("/login", {
            templateUrl: "js/login/login.htm",
            controller: 'LoginController',
            css: 'js/login/login.css'
        })
        .when("/", {
            templateUrl: "js/login/login.htm",
            controller: 'LoginController',
            css: 'js/login/login.css'
        })
        .when("/profile/:id", {
            templateUrl: "js/profile/profile.htm",
            controller: "ProfileController",
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
        .when("/gallery/:id", {
            templateUrl: "js/photoGallery/photoGallery.htm",
            controller: 'PhotoGalleryController',
            css: "js/photoGallery/photoGallery.css"
        })
        .when("/friends/:id", {
            templateUrl: "js/friendsPage/friends.htm",
            controller: 'Friends',
            css: "js/friendsPage/friends.css"
        })
        .when("/messenger", {
            templateUrl: "js/messenger/messenger.htm",
            // controller: 'MessengerController',
            css: "js/messenger/messenger.css",
        })

    $httpProvider.interceptors.push(function ($q, $location, $window) {
        return {
            'request': function (config) {
                config.headers = config.headers || {};
                if ($window.localStorage.getItem('token')) {
                    config.headers.Authorization = 'Bearer ' + $window.localStorage.getItem('token');
                }
                return config;
            },
            'responseError': function (response) {
                if (response.status === 401 || response.status === 403 || response.status === 403)  {
                    alert('Your session has expired');
                    $location.path('/login');
                }
                return $q.reject(response);
            }
        };
    });
});


