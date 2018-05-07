(function() {
  app.controller("NewsFeedController", function(
    $routeParams,
    $scope,
    $controller,
    UserService,
    NewsService,
    $timeout
  ) {
    const NEWS_PROBABILITY=0.4
    $controller("postController", { $scope: $scope });
    $scope.isOwner = true;
    $scope.page = "newsfeed";
    $scope.posts = {
      allFriendsPosts: [],
      displayedPosts: [],
      numberOfDisplayedPosts:0,
      news:0,
      busy: false,
      allPostsLoaded: false
    };
    $scope.news = [];
    NewsService.getNews("Sofia").then(result => {
      $scope.posts.displayedPosts.push(result)
    });
    var userId = localStorage.getItem("loggedUserId");
    UserService.getAndSafeLoggedUser(userId) 
      .then(user => {//loads logged user data
        $scope.profile = user;
        return $scope.profile.friends;
      })
      .then(friendIds => { //loads all friends of logged user
       
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
      .then(() => {//sorting posts
        // console.log("before sorting")
        // console.log($scope.posts.allFriendsPosts)
        $scope.posts.allFriendsPosts = $scope.posts.allFriendsPosts.sort(
          (p1, p2) => {
            //retrieving date from the mongodb object id, and sorting posts by date
            var date1 = new Date(parseInt(p1.substring(0, 8), 16) * 1000);
            var date2 = new Date(parseInt(p2.substring(0, 8), 16) * 1000);
            // console.log(date1 - date2);
            return date2 - date1;
          }
        );
        // console.log("after sorting")
        console.log($scope.posts.allFriendsPosts)
        // $scope.posts.allFriendsPosts.forEach(p=>{
        //   console.log(new Date(parseInt(p.substring(0, 8), 16) * 1000))
        // })
      })
      .then(() => {//displaying top post
        if ($scope.posts.allFriendsPosts.length > 0) {
          var postId = $scope.posts.allFriendsPosts[0];
          $scope.displayPost(postId, false, $scope.posts).then(() => {
            console.log($scope.posts.displayedPosts[0]);
            $scope.posts.numberOfDisplayedPosts++
          });
        }
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
        
          console.log("I have shown " + $scope.posts.numberOfDisplayedPosts + " posts..");
          if (!$scope.profile.posts) return;
          //loads some news article instead of a post with some probability
          if (Math.random() < NEWS_PROBABILITY) {
            console.log("shte zaredq novini");
            NewsService.getNews().then(result => {
              $scope.posts.displayedPosts.push(result)
              $scope.posts.busy = false;
            });
          } else {
            var totalNumberOfPosts = $scope.posts.allFriendsPosts.length;
            var position = totalNumberOfPosts - $scope.posts.numberOfDisplayedPosts - 1;
            if (position >= 0) {
              let postId = $scope.posts.allFriendsPosts[position];
              $scope
                .displayPost(postId, false, $scope.posts)
                .then(res => {
                  $scope.posts.busy = false;
                  $scope.posts.numberOfDisplayedPosts++
                });
            } else {
              $scope.$apply(function() {
                console.log("no more posts");
                $scope.posts.allPostsLoaded = true;
              });
            }
          }
          
        }
      });
  });
})();
