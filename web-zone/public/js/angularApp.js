var myAngularApp = angular.module("myAngularApp", ["ngRoute"]);

myAngularApp.config(function($routeProvider) {
    $routeProvider
    .when("/", {
        templateUrl : "login.html"
    })
    .when("/login", {
        templateUrl : "login.html"
    })
    .when("/user", {
        templateUrl : "js/user/userPage.htm",
        controller : "userController"
    })
    .when("/post", {
        templateUrl : "js/post/postPage.htm",
        controller : "postController",
     
    })

});


