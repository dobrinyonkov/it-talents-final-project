var app = angular.module('app', ['ngRoute', 'angularCSS', 'LoginService']);

app.config(function ($routeProvider) {
    $routeProvider
    .when("/", {
        templateUrl : "js/login/login.htm",
        controller : "LoginController",
        css : 'js/login/login.css'
    })
});



