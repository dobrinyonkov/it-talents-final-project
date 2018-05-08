(function() {
  angular.module("app").factory("LoginService", LoginService);

    function LoginService($http, $window) {
        const API_URL = 'http://localhost:9000/';
        // const API_URL = 'http://w/eb-zone.herokuapp.com/';
        
        var service = {};

    service.login = login;
    service.create = create;
    service.logOut = logOut;

    return service;

    function changeUser(user) {
      angular.extend(currentUser, user);
    }

    function urlBase64Decode(str) {
      var output = str.replace("-", "+").replace("_", "/");
      switch (output.length % 4) {
        case 0:
          break;
        case 2:
          output += "==";
          break;
        case 3:
          output += "=";
          break;
        default:
          throw "Illegal base64url string!";
      }
      return window.atob(output);
    }

    function getUserFromToken() {
      var token = $window.localStorage.getItem("token");
      var user = {};
      if (typeof token !== "undefined") {
        var encoded = token.split(".")[1];
        user = JSON.parse(urlBase64Decode(encoded));
      }
      return user;
    }

    var currentUser = getUserFromToken();

    function login(email, password) {
      var user = {
        email: email,
        password: password
      };

      return $http({
        method: "POST",
        url: `${API_URL}api/login`,
        headers: {
          "Content-Type": "application/json"
        },
        data: user
      });
    }

    function create(user) {
      return $http.post(`${API_URL}api/signup/`, user);
    }

    function logOut(success) {
      changeUser({});
      $window.localStorage.removeItem(token);
      success();
    }
  }
})();
