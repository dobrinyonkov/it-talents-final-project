app.controller("postController", function($scope, PostService) {


  PostService.getPost("5ad89f57ee0c5a17321e044a").then(r => {
    // console.log("taz zaqvka se sluchi");
    $scope.postInfo = r;
  });

  $scope.postPost=PostService.addPost
  // $scope.testAddingAComment=PostService.addComment

});
