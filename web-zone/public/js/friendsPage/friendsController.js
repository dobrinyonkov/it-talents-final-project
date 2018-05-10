(function() {
  app.controller("Friends", function(
    $routeParams,
    $scope,
    $controller,
    UserService,
    NewsService,
    $timeout
  ) {
    $scope.friends = [];
    $scope.profile={};
    var userId = $routeParams.id;
    UserService.getAllFriends(userId).then(res => {
      console.log(res);
    });
    UserService.getById(userId)
      .then(r => {
        //   console.log(r)
          console.log(r.data[0])
          $scope.profile=r.data[0]

        
       
        return r;
      });
  });
})();
