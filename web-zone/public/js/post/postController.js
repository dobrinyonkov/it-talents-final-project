app.controller("postController", function($scope, postService) {


  postService.getPost("5ad89f57ee0c5a17321e044a").then(r => {
    // console.log("taz zaqvka se sluchi");
    $scope.postInfo = r;
  });

  $scope.postPost=postService.addPost
  // $scope.testAddingAComment=postService.addComment

});
