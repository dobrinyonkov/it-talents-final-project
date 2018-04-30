function calculateTimeInterval(date) {
  var interval = Date.now() - Date.parse(date);
  // console.log(interval)

  if (interval < 5000) return "just now";
  interval = Math.floor(interval / 1000);
  if (interval < 60) return interval + " seconds ago";
  interval = Math.floor(interval / 60);
  if (interval < 2) return "1 minute ago";
  if (interval < 60) return interval + " minutes ago";
  interval = Math.floor(interval / 60);
  if (interval < 2) return "1 hour ago";
  if (interval < 24) return interval + " hours ago";
  interval = Math.floor(interval / 24);
  if (interval < 2) return "yesterday";
  return interval + " days ago";
}

(function() {
  app.controller("ProfileController", function(
    $rootScope,
    fileUpload,
    $routeParams,
    $scope,
    PostService,
    UserService,
    $timeout
  ) {
    // $scope.sayHi=function(e){
    //   console.log("hiii")
    //   console.log(this)
    // }
    $scope.profile = {};
    $scope.posts = {
      displayedPosts:[],
      busy:false,
      // nextPost:function() {
      //   if(!$scope.profile)return;
      //   //show message -- please wait
      //   if (this.busy) return;
      //   this.busy = true;
      //   var totalPosts=$scope.profile.postIds.length;
      //   var currentPosts=posts.displayedPosts.length    
      //   if(currentPosts==totalPosts)return;
      //   //show message -- no more posts
      //   PostService.getPost($scope.profile.postIds[currentPosts])
      //   .then(post => $scope.posts.displayedPosts.push(post));
      //     this.busy = false;
        
      // }
    }
    $scope.newPost = { placeholder: "What are you doing" };
    $scope.addPost = addPost;
    $scope.newComment = { placeholder: "Write a comment" };
    $scope.addComment = addComment;
    $scope.calculateTimeInterval = calculateTimeInterval;
    // $timeout(function() {
    //   $scope.$apply(function() {
    //     console.log($scope.profile);
    //   });
    // }, 0);
    //"5ae2f232f3a16839ca78f4e2"
    //Za toz kojto e kachil posta(v posta se pazi samo id )
// $scope.getUserById=UserService.getById()
    $scope.getUserById = function() {
      return {
        name: "Hristo Ivanov",
        profilePic:
          "http://res.cloudinary.com/web-zone2/image/upload/v1524652664/profile2_gklfiw.jpg"
      };
    };
// scroll
document.querySelector("#postContainer").addEventListener("mousewheel", function(e) {
  console.log("scrolling is cool!");
  console.log(this.getBoundingClientRect())
});
console.log(document.querySelector("body"))

    console.log($scope.profile);
    // Zarejdane na postove
    var userId = $routeParams.id;
    UserService.getById(userId)
      .then(r => {
        $scope.profile = r.data[0];
        return r.data[0].posts;
      })
      .then(postIds => {
        if (!postIds) {
          console.log("emi ti nqmash postove , kvo iskash da vidish");
          return;
        }
        console.log("imash "+postIds.length+" i shte ti go dam")
        postIds.forEach(postId => {
          PostService.getPost(postId).then(post => $scope.posts.displayedPosts.push(post));
        });
      })
      .catch(err => console.log(err));

    //add post attached to profile page
    function addPost() {
      if (!$scope.newPost.text || $scope.newPost.text.trim().length < 2) {
        $scope.newPost.placeholder = "Can't post an empty post.";
        return;
      }
      console.log($scope.profile._id);
      PostService.addPost($scope.profile._id, $scope.newPost.text).then(
        res => {
          $scope.newPost.text = "";
          if (res.status == 200) {
            $scope.newPost.placeholder = "Thank you for posting.";
          } else {
            $scope.newPost.placeholder =
              "Sorry we had an error, please try again later.";
          }
        }
      );
    }
    function addComment(postId) {
      if (!$scope.newComment.text || $scope.newComment.text.trim().length < 2) {
        $scope.newComment.placeholder = "Can't post an empty comment.";
        return;
      }
      PostService.addComment(
        postId,
        $scope.profile._id,
        $scope.newComment.text
      );
    }
  });
})();
