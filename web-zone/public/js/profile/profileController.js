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
    $scope.profile = {};
    $scope.editMode = false;
    $scope.profilePicUploaded = false;
    $scope.profilePicUrl = "";
    $scope.posts = [];
    $scope.newPost = { placeholder: "What are you doing" };
    $scope.addPost = addPost;
    $scope.newComment = { placeholder: "Write a comment" };
    $scope.addComment = addComment;
    $scope.calculateTimeInterval = calculateTimeInterval;
    // PostService.getPost("5ada00a6f2400423d4235f5c").then(post =>
    //   $scope.posts.push(post)
    // );
    //tuka ot user servica
    $timeout(function() {
      $scope.$apply(function() {
        console.log($scope.profile);
      });
    }, 0);

    $scope.getUserById = function() {
      return {
        name: "Hristo Ivanov",
        profilePic:
          "http://res.cloudinary.com/web-zone2/image/upload/v1524652664/profile2_gklfiw.jpg"
      };
    };

    $scope.calculateTimeInterval = calculateTimeInterval;
    console.log($scope.profile);
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
          PostService.getPost(postId).then(post => $scope.posts.push(post));
        });
      })
      .catch(err => console.log(err));

    $scope.onChangeMode = function() {
      if ($scope.editMode) {
        UserService.update($scope.profile).then(r => console.log(r));
      }
      $scope.editMode = !$scope.editMode;
    };

    $scope.saveAcount = function(user, url) {
      user.profilePic = url;
      // console.log(user);
      UserService.update(user).then(r => console.log(r));
    };
    // PROFILE PICTURE UPLOAD
    var selectedFile = document.getElementById("selectedFile");
    // console.log(selectedFile);
    selectedFile.addEventListener("change", function(event) {
      var file = event.target.files[0];
      console.log(file);
      fileUpload.uploadFileToUrl(file).then(r => {
        $scope.profilePicUploaded = true;
        $scope.profilePicUrl = r.data.url;
      });
    });
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
