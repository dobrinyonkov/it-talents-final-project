
(function () {
  app.controller("ProfileController", function (
    $rootScope,
    fileUpload,
    $routeParams,
    $scope,
    $controller,
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
    $scope.page = "timeline";
    $scope.isOwner = $routeParams.id == localStorage.getItem("loggedUserId")
    $scope.addPost = addPost;

    $controller('postController', { $scope: $scope });
    // console.log($scope.displayPost)
    // USER
    var userId = $routeParams.id;
    UserService.getById(userId)
      //get firend list filled
      .then(r => {
        var friendsArr = r.data[0].friends;
        friendsArr.forEach(function (friendId) {
          UserService.getById(friendId).then(function (user) {
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
        if (postIds == 'undefined') return;
        if (postIds.length == 0) return;

        //First post
        var newestPostId = postIds[postIds.length - 1];
        $scope.displayPost(newestPostId, false, $scope.posts);
      })
      .catch(err => {
        console.log(err);
        alert("We couldn't load your profile, please login again.")
      }
      );
    // SCROLL
    document
      .querySelector("#postContainer")
      .addEventListener("wheel", function (e) {
        if (this.scrollTop + this.clientHeight >= this.scrollHeight - 80) {
          if ($scope.posts.allPostsLoaded) return;
          if ($scope.posts.busy) {
            console.log("Please wait I'm already, loading a resource...");
            return;
          }
          $scope.posts.busy = true;
          var numberOfDisplayedPost = $scope.posts.displayedPosts.length;
          console.log("I have shown " + numberOfDisplayedPost + " posts..")
          if (!$scope.profile.posts) return;
          var totalNumberOfPosts = $scope.profile.posts.length;
          var position = totalNumberOfPosts - numberOfDisplayedPost - 1;
          if (position >= 0) {
            let postId = $scope.profile.posts[position];
            $scope.displayPost(postId, false, $scope.posts).then(res => {
              $scope.posts.busy = false;
            });
          } else {
            $scope.$apply(function () {
              console.log("nqma poveche");
              $scope.posts.allPostsLoaded = true;
            });
          }
        }
      });


    //ADD POST - attached to profile page
    $scope.newPost = {
      placeholder: "What are you doing",
      text: "",
      busy: false,
      photoUrl: "",
      // photoUrl:"http://en.es-static.us/upl/2018/04/moon-full-set-La-_az-city-Max-Glaser-4-30-2018-e1525172614735.jpg",
    };
    function addPost() {
      if (!$scope.newPost.text || $scope.newPost.text.trim().length < 1) {
        $scope.newPost.placeholder = "Can't post an empty post.";
        return;
      }
      PostService.addPost(
        localStorage.getItem("loggedUserId"),
        $scope.newPost.text,
        $scope.profile._id,
        $scope.newPost.photoUrl
      ).then(newPostId => {
        console.log(newPostId)
        $scope.newPost.text = "";
        if (newPostId) {
          $scope.newPost.placeholder = "Thank you for posting.";
          $scope.newPost.photoUrl = '';
          console.log("zapisah posta i id-to dojda , sq shte go pokaja " + newPostId);
          $scope.displayPost(newPostId, true, $scope.posts);
          return newPostId;
        } else {
          $scope.newPost.placeholder = 'Sorry we had an error, please try again later.'

        }
      }).catch((err) => {
        alert(err)
        console.log(err)
        alert('Sorry we had an error, please try again later.')
      })
    }
    //ADD PHOTO TO POST
    document.getElementById("file-input").
      addEventListener("change", function (event) {
        $scope.newPost.busy = true
        var file = event.target.files[0];
        console.log(file);
        fileUpload.uploadFileToUrl(file).then(r => {
          console.log(r.data.url)
          $scope.newPost.photoUrl = r.data.url;
          $scope.newPost.busy = false
        }).catch(() => { alert("We couldn't locate the resource, pleace try again a different image.") })
      });
  });
})();
