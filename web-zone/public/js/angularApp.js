var app = angular.module("app", ["ngRoute", "angularCSS"]);

app.config(function($routeProvider) {
    $routeProvider
    .when("/login", {
        templateUrl : "js/login/login.htm",
        controller : 'loginMTController',
        css : 'js/login/login.css'
    })
    // .when("/user", {
    //     templateUrl : "js/user/userPage.htm",
    //     controller : "userController"
    // })
    .when("/post", {
        templateUrl : "js/post/postPage.htm",
        controller : "postController",
     
    })

});


