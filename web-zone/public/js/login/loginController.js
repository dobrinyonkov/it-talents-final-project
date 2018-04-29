function validateEmail(email) {
  let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}
function validatePass(password) {
  let re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,}/;
  return re.test(String(password));
}

// ANGULAR
(function(params) {
  angular.module("app").controller("LoginController", LoginController);

  function LoginController($rootScope, $scope, $location, $window, LoginService, $timeout) {
    $scope.user = {};
    $scope.newUser = {};
    $scope.loginErorr = "";
    $scope.signIn = signIn;
    //[fistaName , lastName, email, pass1, pass2, singUp without filling the form]
    $scope.errors = [false, false, false, false, false, false];
    $scope.hasErrors = $scope.errors.some(err => err);
    $scope.signUp = signUp;

    //SIGNIN
    function signIn($event) {
      // debugger;
      $event.preventDefault();
      // console.log($scope.user);
      if (
        validateEmail($scope.user.email) &&
        validatePass($scope.user.password)
      ) {
        LoginService.login($scope.user.email, $scope.user.password)
          .then(r => {
            console.log(r);
            $scope.loginErorr = "";
            $window.localStorage.setItem("token", r.data.token);
            $window.localStorage.setItem("loggedUserId", r.data.data._id);            
            $window.location = `#!/profile/${r.data.data._id}`;
            $rootScope.isLogged = true;
          })
          .catch(e => {
            $scope.loginErorr = "Wrong email or password";
          });
      } else {
        $scope.loginErorr = "Wrong email or password";
      }
    }

    //SIGNUP
    function signUp(newUser) {
      if (
        $scope.errors.every(err => !err) &&
        newUser.firstName.trim().length > 0 &&
        newUser.lastName.trim().length > 0 &&
        newUser.email.trim().length > 0 &&
        newUser.pass1.trim().length > 0 &&
        newUser.pass2.trim().length > 0
      ) {
        LoginService.create(newUser).then(r => {
          $window.localStorage.setItem("token", r.data.token);
          window.location = `#!/profile/${r.data.data._id}`;
          $rootScope.isLogged = true;          
        });
      } else {
        $scope.errors[5] = true;
        $timeout(() => {
          $scope.errors[5] = false;
        }, 2500);
      }
    }

    //ERRORS
    $scope.validate = function(input) {
      // console.log("validating " + input);
      switch (input) {
        case "firstName":
          var name = $scope.newUser.firstName;
          $scope.errors[0] = name.length < 2;
          break;
        case "lastName":
          var name = $scope.newUser.lastName;
          $scope.errors[1] = name.length < 2;
          break;
        case "email":
          var email = $scope.newUser.email;
          $scope.errors[2] = !validateEmail(email);
          break;
        case "pass1":
          var pass1 = $scope.newUser.pass1;
          $scope.errors[3] = !validatePass(pass1);
          break;
        case "pass2":
          var pass1 = $scope.newUser.pass1;
          var pass2 = $scope.newUser.pass2;
          $scope.errors[4] = pass1 != pass2;
          break;
        default:
          break;
      }
      $scope.hasErrors = $scope.errors.some(err => err);
    };
  }
})();
