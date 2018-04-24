// НЕ СТАВА С ng-keydown="validate($event)"

// И ТВА НЕ СТАВА
// document.addEventListener("DOMContentLoaded", function(event) {
//     console.log("DOM fully loaded and parsed");
//    console.log( document.querySelectorAll("#registerForm") )
//   });

function validateEmail(email) {
  let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}
function validatePass(password) {
  let re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,}/;
  return re.test(String(password));
}

// ANGULAR
(function (params) {
  angular.module("app").controller("LoginController", LoginController);

  function LoginController($scope, $location, $window, LoginService) {
    const ALL_ERRORS = {
      username: "Username must be atleast two charechers long.",
      email: "Please enter a valid e-mail address.",
      pass1:
        "Password must contain minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character.",
      pass2: "Passwords should match."
    };
    $scope.user = {};
    $scope.newUser = {};
    $scope.loginErorr = '';
    $scope.signIn = signIn;
    $scope.validForm = false;
    $scope.errorMessages = [];
    $scope.signUp = signUp;


    //SIGNIN
    function signIn($event) {
      // debugger;
      $event.preventDefault();
      // console.log($scope.user);
      if (validateEmail($scope.user.email) && validatePass($scope.user.password)) {
        LoginService.login($scope.user.email, $scope.user.password).then(r => {
          $scope.loginErorr = '';
          $window.localStorage.setItem('token', r.data.token);
          window.location = "#!/profile";
        }).catch(e => {
          $scope.loginErorr = 'Wrong email or password';
        });
      } else {
        $scope.loginErorr = 'Wrong email or password';
      }
    }


    //SIGNUP
    function signUp(newUser) {
      debugger;
      //   console.log(arguments);
      //   console.log($scope.validForm);
      if (
        $scope.validForm &&
        $scope.errorMessages.length == 0 &&
        newUser.username.trim().length > 0 &&
        newUser.email.trim().length > 0 &&
        newUser.pass1.trim().length > 0 &&
        newUser.pass2.trim().length > 0
      ) {
        LoginService.create(newUser).then(r => {
          $window.localStorage.setItem('token', r.data.token);
          window.location = "#!/profile";
        });
      } else {
        console.log("oshe malko da popalnish");
      }
    }


    //ERRORS
    function displayError(el, message) {
      console.log(el);
      console.log(message);
      $scope.validForm = false;
      if ($scope.errorMessages.indexOf(message) == -1) {
        $scope.errorMessages.push(message);
      }
      el.classList.add("wrongField");
      document.getElementById("errorContainer").style.display = "block";

      el.addEventListener("input", () => {
        el.classList.remove("wrongField");
      });
    }


    // REGISTRATION FORM VALIDATION WITH DOM
    window.addEventListener("load", function (event) {
      console.log("All resources finished loading!");
      document.querySelectorAll("#registerForm > div input").forEach(el => {
        el.addEventListener("blur", event => {
          var inputType = event.target.name;
          var value = event.target.value;
          switch (inputType) {
            case "username":
              if (value.length < 2) {
                displayError(el, ALL_ERRORS.username);
              } else {
                $scope.validForm = true;
                $scope.$apply(function () {
                  $scope.errorMessages = $scope.errorMessages.filter(
                    m => m != ALL_ERRORS.username
                  );
                });
              }
              break;
            case "email":
              if (!validateEmail(value)) {
                displayError(el, ALL_ERRORS.email);
              } else {
                $scope.validForm = true;
                $scope.$apply(function () {
                  $scope.errorMessages = $scope.errorMessages.filter(
                    m => m != ALL_ERRORS.email
                  );
                });
              }
              break;
            case "pass1":
              if (!validatePass(value)) {
                displayError(el, ALL_ERRORS.pass1);
              } else {
                $scope.validForm = true;
                $scope.$apply(function () {
                  $scope.errorMessages = $scope.errorMessages.filter(
                    m => m != ALL_ERRORS.pass1
                  );
                });
              }
              break;
            case "pass2":
              var pass1 = document.querySelector(
                "#registerForm > div input[type=password]"
              ).value;
              if (pass1 !== value) {
                displayError(el, ALL_ERRORS.pass2);
              } else {
                $scope.validForm = true;
                $scope.$apply(function () {
                  $scope.errorMessages = $scope.errorMessages.filter(
                    m => m != ALL_ERRORS.pass2
                  );
                });
              }
              break;
            default:
              break;
          }
        });
      });
    });
  }
})();
