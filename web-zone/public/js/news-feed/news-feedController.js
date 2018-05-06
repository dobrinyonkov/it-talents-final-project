(function() {
  app.controller("NewsFeedController", function(
    $routeParams,
    $scope,
    $controller,
    UserService,
    $timeout
  ) {
    $controller("postController", { $scope: $scope });
    $scope.isOwner = true;
    $scope.page = "newsfeed";
    $scope.posts = {
      allFriendsPosts: [],
      displayedPosts: [],
      busy: false,
      allPostsLoaded: false
    };
    var userId = localStorage.getItem("loggedUserId");
    UserService.getAndSafeLoggedUser(userId) //loads logged user data
      .then(user => {
        $scope.profile = user;
        return $scope.profile.friends;
      })
      .then(friendIds => {
        //loads all friends of logged user
        return friendIds.reduce((promise, id, index) => {
          return promise
            .then(result => {
              console.log(`id of friend number ${index} -- ${id}`);
              return UserService.getById(id).then(response => {
                var friend = response.data[0];
                $scope.posts.allFriendsPosts = $scope.posts.allFriendsPosts.concat(
                  friend.posts
                );
                return $scope.posts.allFriendsPosts;
              });
            })
            .catch(console.error);
        }, Promise.resolve());
      })
      .then(() => { //displays top post
        console.log($scope.posts.allFriendsPosts)
        var postId=$scope.posts.allFriendsPosts[0]
        $scope.displayPost(postId, false, $scope.posts)
      });

    
    // SCROLL
    document
      .querySelector("#postContainer")
      .addEventListener("wheel", function(e) {
        if (this.scrollTop + this.clientHeight >= this.scrollHeight - 80) {
          if ($scope.posts.allPostsLoaded) return;
          if ($scope.posts.busy) {
            console.log("Please wait I'm already, loading a resource...");
            return;
          }
          $scope.posts.busy = true;
          var numberOfDisplayedPost = $scope.posts.displayedPosts.length;
          console.log("I have shown " + numberOfDisplayedPost + " posts..");
          if (!$scope.profile.posts) return;
          var totalNumberOfPosts = $scope.posts.allFriendsPosts.length;
          var position = totalNumberOfPosts - numberOfDisplayedPost - 1;
          if (position >= 0) {
            let postId = $scope.posts.allFriendsPosts[position];
            $scope.displayPost(postId, false, $scope.posts).then(res => {
              $scope.posts.busy = false;
            });
          } else {
            $scope.$apply(function() {
              console.log("no more posts");
              $scope.posts.allPostsLoaded = true;
            });
          }
        }
      });
  });
})();
