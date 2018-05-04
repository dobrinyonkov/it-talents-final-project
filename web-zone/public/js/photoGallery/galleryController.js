(function() {
  app.controller("PhotoGalleryController", function(
    // $window,
    // $rootScope,
    // fileUpload,
    $routeParams,
    $scope,
    // $apply,
    // PostService,
    UserService,
    $timeout
  ) {
    $scope.displayedPhoto = "";
    $scope.changePhoto = function(photo) {
      $scope.displayedPhoto = photo;
    };
    $scope.next=function(){
        var index =$scope.profile.photos.indexOf($scope.displayedPhoto)
        index++
        if(index>=$scope.profile.photos.length){
            index=0
        }
        $scope.displayedPhoto=$scope.profile.photos[index]
    }
    $scope.previous=function(){
        var index =$scope.profile.photos.indexOf($scope.displayedPhoto)
        index--
        if(index<0){
            index=$scope.profile.photos.length-1
        }
        $scope.displayedPhoto=$scope.profile.photos[index]
    }

    var userId = $routeParams.id;
    UserService.getById(userId).then(r => {
      console.log(r);
      $scope.profile = r.data[0];
    });
  });
})();
