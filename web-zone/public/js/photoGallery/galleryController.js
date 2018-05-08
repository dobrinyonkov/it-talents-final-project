(function() {
  app.controller("PhotoGalleryController", function(
    $routeParams,
    $scope,
    UserService,
    $timeout
  ) {
    $scope.isOwner=$routeParams.id==localStorage.getItem("loggedUserId")
    $scope.page="photos"
    $scope.displayedPhoto = { url: "", number: 1 };
    $scope.changePhoto = function(photoUrl) {
      $scope.displayedPhoto.url = photoUrl;
      $scope.displayedPhoto.number=1+$scope.profile.photos.indexOf(photoUrl)
    };
    $scope.next=function(){
        var index =$scope.profile.photos.indexOf($scope.displayedPhoto.url)
        index++
        if(index>=$scope.profile.photos.length){
            index=0
        }
        $scope.displayedPhoto.url=$scope.profile.photos[index]
        $scope.displayedPhoto.number=index+1
    }
    $scope.previous=function(){
        var index =$scope.profile.photos.indexOf($scope.displayedPhoto.url)
        index--
        if(index<0){
            index=$scope.profile.photos.length-1
        }
        $scope.displayedPhoto.url=$scope.profile.photos[index]
        $scope.displayedPhoto.number=index+1
    }

    var userId = $routeParams.id;
    UserService.getById(userId).then(r => {
      $scope.profile = r.data[0];
    });
  });
})();
