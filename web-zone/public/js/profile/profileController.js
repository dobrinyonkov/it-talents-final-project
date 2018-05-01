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

(function () {
  app.controller("ProfileController", function (
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
    $scope.posts = { displayedPosts: []};
    $scope.newPost = { placeholder: "What are you doing" };
    $scope.addPost = addPost;
    $scope.newComment = { placeholder: "Write a comment" };
    $scope.addComment = addComment;
    $scope.calculateTimeInterval = calculateTimeInterval;

  
    // scroll
    document
      .querySelector("#postContainer")
      .addEventListener("wheel", function (e) {
        if (this.scrollTop + this.clientHeight >= this.scrollHeight-10) {
          // loadMore();
          console.log("scrolling is cool!");
          // posts.displayedPosts.push()
        }
        
        // console.log(this.getBoundingClientRect())
      });

    console.log($scope.profile);

    // takes an post id loads its date and that for the associated users,
    // forms it as a post and pushes that post to $scope.posts.displayedPosts
    $scope.posts.displayPost=function(postId) {
      PostService.getPost(postId).then(post => {
        console.log(post)
        // post owner
        UserService.getById(post.ownerId).then(res => {
          // console.log(res.data[0])
          var owner = {};
          var name1 = res.data[0].firstName;
          name1 = name1.charAt(0).toUpperCase() + name1.slice(1);
          var name2 = res.data[0].lastName;
          name2 = name2.charAt(0).toUpperCase() + name2.slice(1);
          owner.name = name1 + " " + name2;
          owner.photoUrl = res.data[0].profilePic;
          post.owner = owner;
          // console.log("owner id za toz post++=="+post.ownerId)
          // console.log("lognat user===="+localStorage.getItem("loggedUserId") )
          post.canEdit =(post.ownerId== localStorage.getItem("loggedUserId"));
          // console.log("zarejdam ti sq toz post, no dali mojesh da go iztriesh--- "+post.canEdit)
          post.editMode=false ;
          // post.toggleEditMode=function(){
          //   this.editMode=!this.editMode
          // }
          // DELETING A POST
          post.delete = function() {
            if (!confirm("Are you sure you want to delete this post")) return;
            console.log("shte iztiq");
            PostService.deletePost(userId, post._id).then(response => {
              if(response.status=200){
                console.log("deleted")
                $scope.posts.displayedPosts=$scope.posts.displayedPosts.filter(p=>p!=post)
              }else{
                alert("Sorry, we expirienced a problem and couldn't delete the post, please try againg later.")
              }
            });
          };
          // LIKING A POST
          post.liked=(post.likes.indexOf(localStorage.getItem("loggedUserId"))!=-1)
          post.like=function(){
            console.log("me gusta -- "+post._id)
            PostService.likePost(localStorage.getItem("loggedUserId"),post._id).then(res=>{
              // console.log(res)
              post.likes=res.data.likes;
              console.log("toz post sega ima "+post.likes.length+" likes.")
              post.liked=!post.liked
            })
            
          }
        });

        //top comment owner
        if (post.comments && post.comments.length > 0) {
          var topComment = post.comments[0];
          UserService.getById(post.comments[0].ownerId).then(res => {
            // console.log(res.data)
            topComment.owner = {};
            var name1 = res.data[0].firstName;
            name1 = name1.charAt(0).toUpperCase() + name1.slice(1);
            var name2 = res.data[0].lastName;
            name2 = name2.charAt(0).toUpperCase() + name2.slice(1);
            topComment.owner.name = name1 + " " + name2;
            topComment.owner.photoUrl = res.data[0].profilePic;
            post.topComment = topComment;
          });
        } else {
          console.log("nqma komentari");
        }
        // console.log(JSON.stringify(post));
        $scope.posts.displayedPosts.push(post);
      });
    }



    var userId = $routeParams.id;
    UserService.getById(userId)
    //get firend list filled
      .then(r => {
        var friendsArr = r.data[0].friends;
        
        friendsArr.forEach(function (friendId) {
          UserService.getById(friendId).then(function (user) {
            $scope.profileFriends.push(user.data[0]);
          })
        })
        
        return r;
      })
      .then(r => {
         //LOADING POSTS
        $scope.profile = r.data[0];
        return r.data[0].posts;
        // $scope.profile=r 
        console.log("tuka v kontrollera ---")
        console.log(r)
        return r.posts
      })
      .then(postIds => {
        if (!postIds) {
          console.log("emi ti nqmash postove , kvo iskash da vidish");
          return;
        }
        console.log("imash " + postIds.length + " i shte ti gi dam");
        postIds.forEach((postId, index) => {
          console.log("post nomer" + index)
          $scope.posts.displayPost(postId)
          });
      })
      .catch(err => console.log(err));



    // UserService.getAndSafeLoggedUser(userId)
    //add post attached to profile page
    function addPost() {
      if (!$scope.newPost.text || $scope.newPost.text.trim().length < 2) {
        $scope.newPost.placeholder = "Can't post an empty post.";
        return;
      }
      console.log($scope.profile._id);
      PostService.addPost($scope.profile._id, $scope.newPost.text).then(res => {
        $scope.newPost.text = "";
        if (res.status == 200) {
          $scope.newPost.placeholder = "Thank you for posting.";
          console.log(res.newPostId)
          $scope.posts.displayPost(res.newPostId)
          return res.newPostId
        } else {
          $scope.newPost.placeholder =
            "Sorry we had an error, please try again later.";
        }
      });
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
      ).then(sessionStorage.clear("loggedUser"))
      
    }
  });
})();
