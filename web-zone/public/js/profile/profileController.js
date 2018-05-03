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
    $scope.posts = {
      displayedPosts: [],
      busy: false,
      allPostsLoaded: false
    };

 
    $scope.addPost = addPost;
    $scope.calculateTimeInterval = calculateTimeInterval;
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
        if (postIds.length == 0) {
          return;
        }
        //First post
        var newestPostId = postIds[postIds.length - 1];
        $scope.posts.displayPost(newestPostId);
      })
      .catch(err =>
        alert("We couldn't load your profile, please login again.")
      );
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
            var remaining =
              post.comments.length - post.displayedComments.length;
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
              post.comments.push(res);
              post
                .loadCommentWithOwnerData(post.comments.length - 1)
                .then(c => {
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
    $scope.newPost = { placeholder: "What are you doing",
    text:"",
    busy:false,
    photoUrl:"",
    // photoUrl:"http://en.es-static.us/upl/2018/04/moon-full-set-La-_az-city-Max-Glaser-4-30-2018-e1525172614735.jpg",
   };
    //ADD POST - attached to profile page
    function addPost() {
      if (!$scope.newPost.text || $scope.newPost.text.trim().length < 1) {
        $scope.newPost.placeholder = "Can't post an empty post.";
        return;
      }
      console.log($scope.profile._id);
      PostService.addPost(
        localStorage.getItem("loggedUserId"),
        $scope.newPost.text,
        $scope.profile._id,
        $scope.newPost.photoUrl
      ).then(res => {
        $scope.newPost.text = "";
        if (res.status == 200) {
          $scope.newPost.placeholder = "Thank you for posting.";
          $scope.newPost.photoUrl='';
          console.log(res.newPostId);
          $scope.posts.displayPost(res.newPostId, true);
          return res.newPostId;
        } else {
          $scope.newPost.placeholder =
            "Sorry we had an error, please try again later.";
        }
      });
    }
    //ADD PHOTO TO POST
    document.getElementById("file-input").
    addEventListener("change", function (event) {
      $scope.newPost.busy=true
        var file = event.target.files[0];        
        console.log(file);
        fileUpload.uploadFileToUrl(file).then(r => {
          console.log(r.data.url)
          $scope.newPost.photoUrl= r.data.url;
          $scope.newPost.busy=false
        }).catch(()=>{alert("We couldn't locate the resource, pleace try again a different image.")})
    });
  });
})();
