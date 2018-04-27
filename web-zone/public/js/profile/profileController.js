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
// console.log(new Date)
// console.log(calculateTimeInterval("2018-04-25T21:47:01.544Z"))

(function() {
  app.controller("ProfileController", function(
    fileUpload,
    $routeParams,
    $scope,
    PostService,
    UserService
  ) {
    $scope.currentUser = {};
    $scope.editMode = false;
    $scope.profilePicUploaded = false;
    $scope.profilePicUrl = "";
    $scope.posts = [];
    $scope.newPost = { placeholder: "What are you doing" };
    $scope.addPost = addPost;
    $scope.newComment = { placeholder: "Write a comment" };
    $scope.addComment = addComment;
    $scope.calculateTimeInterval = calculateTimeInterval;
    console.log($scope.currentUser)
    PostService.getPost("5ada00a6f2400423d4235f5c").then(post =>
      $scope.posts.push(post)
    );
    //tuka ot user servica
    // $scope.sayhi=function(name){return "hellllo "+name}
    $scope.getUserById = function() {
      // console.log(arguments)
      return {
        name: "Hristo Ivanov",
        profilePic:
          "http://res.cloudinary.com/web-zone2/image/upload/v1524652664/profile2_gklfiw.jpg"
      };
    };


    var userId = $routeParams.id;
    UserService.getById(userId)
      .then(r => {
        $scope.currentUser = r.data[0];
      })
      .catch(err => console.log(err));

    $scope.onChangeMode = function() {
      $scope.editMode = !$scope.editMode;
    };

    $scope.saveProfilePic = function(user, url) {
      user.profilePic = url;
      console.log(user);
      UserService.update(user).then(r => console.log(r));
    };

    var selectedFile = document.getElementById("selectedFile");
    console.log(selectedFile);

    $scope.onChangeContact = function() {
      $scope.changeTriggered = !$scope.changeTriggered;
    };

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
      // console.log($scope.currentUser)
      // console.log( $scope.currentUser._id+"  "+$scope.newPost.text)
      PostService.addPost($scope.currentUser._id, $scope.newPost.text).then(
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
      PostService.addComment(postId,$scope.currentUser._id, $scope.newComment.text)
    }
  });
})();
