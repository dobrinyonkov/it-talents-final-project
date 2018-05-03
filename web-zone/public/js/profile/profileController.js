function calculateTimeInterval(date) {
  var interval = Date.now() - Date.parse(date);
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
    $scope.profile = {};
    $scope.profileFriends = [];
    $scope.posts = { displayedPosts: [], busy: false, allPostsLoaded: false };
    $scope.newPost = { placeholder: "What are you doing" };
    $scope.addPost = addPost;
    $scope.newComment = { placeholder: "Write a comment" };
    // $scope.addComment = addComment;
    $scope.calculateTimeInterval = calculateTimeInterval;

    // SCROLL
    document
      .querySelector("#postContainer")
      .addEventListener("wheel", function(e) {
        if (this.scrollTop + this.clientHeight >= this.scrollHeight - 80) {
          if ($scope.posts.allPostsLoaded) return;
          if ($scope.posts.busy) {
            console.log("chkaj brat zaet sam");
            return;
          }
          $scope.posts.busy = true;
          var numberOfDisplayedPost = $scope.posts.displayedPosts.length;
          if (!$scope.profile.posts) return;
          var totalNumberOfPosts = $scope.profile.posts.length;
          var position = totalNumberOfPosts - numberOfDisplayedPost - 1;
          if (position >= 0) {
            let postId = $scope.profile.posts[position];
            $scope.posts.displayPost(postId).then(res => {
              $scope.posts.busy = false;
            });
          } else {
            $scope.$apply(function() {
              console.log("nqma poveche");
              $scope.posts.allPostsLoaded = true;
            });
          }
        }
      });
    // DISPLAY POST FUNCTION
    // takes an post id loads its date and that for the associated users,
    // forms it as a post and pushes that post to $scope.posts.displayedPosts
    $scope.posts.displayPost = function(postId, top) {
      return PostService.getPost(postId)
        .then(post => post.loadOwnerInfo())
        .then(post => {
          // DELETING A POST
          post.canEdit = post.ownerId == localStorage.getItem("loggedUserId");
          post.editMode = false;
          post.delete = function() {
            bootbox.confirm(
              "Are you sure you want to delete this post",
              res => {
                if (!res) return;
                console.log("shte iztiq");
                PostService.deletePost(
                  localStorage.getItem("loggedUserId"),
                  post._id
                ).catch(err => {
                  alert(
                    "We had a server error and couldn't delete the post, please try again later."
                  );
                });
              }
            );
          };
          // LIKING A POST
          post.liked =
            post.likes.indexOf(localStorage.getItem("loggedUserId")) != -1;
          post.like = post.like.bind(
            post,
            localStorage.getItem("loggedUserId")
          );
          //COMMENT
          post.displayedComments = []; //binded to view
          if (post.comments.length > 0) {
            post.loadCommentWithOwnerData(post.comments.length - 1).then(c => {
              //loading the top comment
              post.displayedComments.push(c);
            });
          }
          //ALL COMMENTS
          post.displayAllComments = function($event) {
            $event.preventDefault();
            var remaining = post.comments.length - post.displayedComments.length;
            if (remaining <= 0) return;
            return post.loadCommentWithOwnerData(remaining - 1).then(c => {
              post.displayedComments.push(c);
              post.displayAllComments($event);
            });
          };
          //ADD NEW COMMENT
          post.newComment = { placeholder: "Write a comment", text: "" };
          post.addNewComment = function() {
            if (post.newComment.text.trim().length < 2) {
              post.newComment.placeholder = "Can't post an empty comment.";
              return;
            }
            PostService.addComment(
              post._id,
              localStorage.getItem("loggedUserId"),
              post.newComment.text
            ).then(res => {
              res = JSON.parse(res);
              // var postWithSuchId=$scope.posts.displayedPosts.find(p=>p._id==postId);
              post.comments.push(res);
              post.loadCommentWithOwnerData(post.comments.length - 1).then(c => {
                post.displayedComments.unshift(c);
              });
              post.newComment.text = "";
              post.newComment.placeholder = "Thanks for the comment.";
            });
          };
          //ADDING THE POST TO THE ARRAY
          if (top) {
            $scope.posts.displayedPosts.unshift(post);
          } else {
            $scope.posts.displayedPosts.push(post);
          }
        });

    };
    // USER
    var userId = $routeParams.id;
    UserService.getById(userId)
      //get firend list filled
      .then(r => {
        var friendsArr = r.data[0].friends;
        friendsArr.forEach(function(friendId) {
          UserService.getById(friendId).then(function(user) {
            $scope.profileFriends.push(user.data[0]);
          });
        });
        return r;
      })
      //LOADING NEWEST POST OF THAT USER
      .then(r => {
        $scope.profile = r.data[0];
        return r.data[0].posts;
      })
      .then(postIds => {
        console.log(postIds);
        if (postIds.length == 0) {
          return;
        }
        // console.log("imash " + postIds.length + " i shte ti gi dam");
        // console.log("Ama edin po edin ..")
        //First post
        var newestPostId = postIds[postIds.length - 1];
        $scope.posts.displayPost(newestPostId);
      })
      .catch(err => console.log(err));

    //ADD POST - attached to profile page
    function addPost() {
      if (!$scope.newPost.text || $scope.newPost.text.trim().length < 2) {
        $scope.newPost.placeholder = "Can't post an empty post.";
        return;
      }
      console.log($scope.profile._id);
      PostService.addPost(
        localStorage.getItem("loggedUserId"),
        $scope.newPost.text,
        $scope.profile._id
      ).then(res => {
        $scope.newPost.text = "";
        if (res.status == 200) {
          $scope.newPost.placeholder = "Thank you for posting.";
          console.log(res.newPostId);
          $scope.posts.displayPost(res.newPostId, true);
          return res.newPostId;
        } else {
          $scope.newPost.placeholder =
            "Sorry we had an error, please try again later.";
        }
      });
    }
    //ADD COMMENT
    // function addComment(postId) {
    //   if (!$scope.newComment.text || $scope.newComment.text.trim().length < 2) {
    //     $scope.newComment.placeholder = "Can't post an empty comment.";
    //     return;
    //   }
    //   PostService.addComment(
    //     postId,
    //     localStorage.getItem("loggedUserId"),
    //     $scope.newComment.text
    //   ).then(res => {
    //     res = JSON.parse(res);
    //     var postWithSuchId = $scope.posts.displayedPosts.find(
    //       p => p._id == postId
    //     );
    //     postWithSuchId.comments.push(res);
    //     postWithSuchId.topComment = res;
    //     $scope.newComment.text = "";
    //     $scope.newComment.placeholder = "Thanks for the comment.";
    //   });
    // }
  });
})();
