app.controller("addPostController", function($scope, postService) {
  $scope.detectFiles = function() {
    console.log("files");
  };
  $scope.sayHi = function($event) {
    // $event.preventDefault()
    // console.log("hi");
  };
});
