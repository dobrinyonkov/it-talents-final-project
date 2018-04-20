app.controller("postController", function($scope, postService) {
  $scope.greeting2 = "hello from the post controller";
  $scope.greeting1 = postService.greeting1;


  postService.getPost("5ad89f57ee0c5a17321e044a").then(r => {
    console.log("taz zaqvka se sluchi");
    $scope.postInfo = r;
  });


  $scope.postPost=postService.addPost

});
