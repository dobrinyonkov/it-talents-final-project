(function() {
  app.controller("ProfileController", function(
    $rootScope,
    fileUpload,
    $routeParams,
    $scope,
    $controller,
    PostService,
    UserService,
    $timeout
  ) {
    //initializing the postController (responsible for adding and binding view data to the model)
    $controller('postController', {$scope: $scope}); 
    $scope.profile = {};
    $scope.profileFriends = [];
    $scope.posts = {
      displayedPosts: [],
      busy: false,
      allPostsLoaded: false
    };   
    $scope.addPost = addPost;
    //passed to the page navigation directive
    $scope.page = "timeline";
    
    $scope.isOwner = $routeParams.id == localStorage.getItem("loggedUserId")
    //LOADING USER DATA-can be logged user looking his own profile or another's profile
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
          if (!$scope.profile.posts) return;
          var totalNumberOfPosts = $scope.profile.posts.length;
          var position = totalNumberOfPosts - numberOfDisplayedPost - 1;
          if (position >= 0) {
            let postId = $scope.profile.posts[position];
            console.log(postId)
            $scope.displayPost(postId, false, $scope.posts).then(res => {
              $scope.posts.busy = false;
            });
          } else {
            $scope.$apply(function () {
              //and after that the scroll event just returns
              $scope.posts.allPostsLoaded = true;
            });
          }
        }
      });
    
    //ADD POST - attached to profile page
    $scope.newPost = { placeholder: "What are you doing",
    text:"",
    busy:false,
    photoUrl:"",
     };
    function addPost($event) {
      if (!$scope.newPost.text || $scope.newPost.text.trim().length < 1) {
        $scope.newPost.placeholder = "Can't post an empty post.";
        var btn=angular.element($event.target)
        btn.addClass('btn-error')
        btn.attr("title","Can't post an empty post.")
        $timeout(()=>{btn.removeClass('btn-error')},1600)
        $timeout(()=>{btn.attr("title","")},8000)
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
          $scope.newPost.photoUrl='';
          $scope.displayPost(newPostId, true , $scope.posts);
          return newPostId;
        } else {
          $scope.newPost.placeholder ='Sorry we had an error, please try again later.'            
        }
      }).catch((err) => {
   
        console.log(err)
        alert('Sorry we had an error, please try again later.')
      })
    }
    //ADD PHOTO TO POST
    document
      .getElementById("file-input")
      .addEventListener("change", function(event) {
        $scope.newPost.busy = true;
        var file = event.target.files[0];
        var allowedExtensions = /(\.jpg|\.jpeg|\.png|\.gif)$/i;
        if (!allowedExtensions.exec(file.name)) {
          alert(
            "Please upload file having extensions .jpeg/.jpg/.png/.gif only."
          );
          file = null;
          return false;
        } else {
          fileUpload
            .uploadFileToUrl(file)
            .then(r => {
              console.log(r.data.url);
              $scope.newPost.photoUrl = r.data.url;
              $scope.newPost.busy = false;
            })
            .catch(err => {
              console.log(err);
              alert(
                "We couldn't locate the resource, pleace try again a different image."
              );
            });
        }
      });
  });
})();
