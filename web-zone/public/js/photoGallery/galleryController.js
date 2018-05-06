(function() {
  app.controller("PhotoGalleryController", function(
    $routeParams,
    $scope,
    UserService,
    $timeout
  ) {
    $scope.isOwner=$scope.isOwner=$routeParams.id==localStorage.getItem("loggedUserId")
    $scope.page="photos"
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
