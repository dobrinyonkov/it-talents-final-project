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
    $scope.posts = { displayedPosts: [], busy: false, allPostsLoaded: false };
    $scope.newPost = { placeholder: "What are you doing" };
    $scope.addPost = addPost;
    $scope.newComment = { placeholder: "Write a comment" };
    $scope.addComment = addComment;
    $scope.calculateTimeInterval = calculateTimeInterval;

  
    // SCROLL
    document
      .querySelector("#postContainer")
      .addEventListener("wheel", function(e) {
        if (this.scrollTop + this.clientHeight >= this.scrollHeight - 80) {
          if($scope.posts.allPostsLoaded)return;
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
    $scope.posts.displayPost=function(postId ,top) {
     return PostService.getPost(postId).
      then(post => {
        // POST OWNER INFO
        UserService.getById(post.ownerId).then(res => {
          var owner = {};
          var name1 = res.data[0].firstName;
          name1 = name1.charAt(0).toUpperCase() + name1.slice(1);
          var name2 = res.data[0].lastName;
          name2 = name2.charAt(0).toUpperCase() + name2.slice(1);
          owner.name = name1 + " " + name2;
          owner.photoUrl = res.data[0].profilePic;
          post.owner = owner;         
  
          // DELETING A POST
           post.canEdit =(post.ownerId== localStorage.getItem("loggedUserId"));
          post.editMode=false ;
          post.delete = function() {
            bootbox.confirm(
              "Are you sure you want to delete this post",
              res => {
                console.log(res);
                if (!res) return;
                console.log("shte iztiq");
                PostService.deletePost(userId, post._id).then(
                  response => {
                    if ((response.status = 200)) {
                      console.log("deleted");
                      $scope.posts.displayedPosts = $scope.posts.displayedPosts.filter(
                        p => p != post
                      );
                    } else {
                      alert(
                        "Sorry, we expirienced a problem and couldn't delete the post, please try againg later."
                      );
                    }
                  }
                );
              }
            );
          };
          // LIKING A POST
          post.liked=(post.likes.indexOf(localStorage.getItem("loggedUserId"))!=-1)
          post.like=function(){
            PostService.likePost(localStorage.getItem("loggedUserId"),post._id).then(res=>{
              post.likes=res.data.likes;
              console.log("toz post sega ima "+post.likes.length+" likes.")
              post.liked=!post.liked
            })
            
          }
        });

        //COMMENTS
        post.displayedComments=[]
        console.log(post)
        $scope.posts.displayNextComment(post)  
        post.displayAllComments=function($event){
          $event.preventDefault()
          console.log("shte pokaja vsichki comentari")
          // while(post.comments.length>post.displayedComments.length){
            $scope.posts.displayNextComment(post)
          // }
        }      
        // console.log(JSON.stringify(post));
        //ADDING THE POST TO THE ARRAY
        if (top) {
          $scope.posts.displayedPosts.unshift(post);
        } else {
          $scope.posts.displayedPosts.push(post);
        }
    
      });
    }
    // DISPLAY COMMENT FUNCTION
    $scope.posts.displayNextComment = function(post) {
      var totalComments=post.comments.length
      var displayedComments=post.displayedComments.length
      let position=totalComments-1-displayedComments
      
      if (post.comments && position>0) {
      console.log("Shte izkaram kometra na poziciq  "+position)
      var comment = post.comments[position];
      console.log(comment)
        UserService.getById(comment.ownerId).then(res => {
         comment.owner = {};
          var name1 = res.data[0].firstName;
          name1 = name1.charAt(0).toUpperCase() + name1.slice(1);
          var name2 = res.data[0].lastName;
          name2 = name2.charAt(0).toUpperCase() + name2.slice(1);
          comment.owner.name = name1 + " " + name2;
          comment.owner.photoUrl = res.data[0].profilePic;
          console.log("gotov comment")
          console.log(comment)
          post.displayedComments.push(comment)
        });
      } else {
        console.log("nqma komentari");
      }
    };
    // USER
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
      //LOADING NEWEST POST OF THAT USER
      .then(r => {         
        $scope.profile = r.data[0];
        return r.data[0].posts;
      })
      .then(postIds => {
        if (!postIds) {
          console.log("emi ti nqmash postove , kvo iskash da vidish");
          return;
        }
        console.log("imash " + postIds.length + " i shte ti gi dam");
        console.log("Ama edin po edin ..")
        //First post
        var newestPostId=postIds[postIds.length-1]
        $scope.posts.displayPost(newestPostId)
      })
      .catch(err => console.log(err));

    //ADD POST attached to profile page
    function addPost() {
      if (!$scope.newPost.text || $scope.newPost.text.trim().length < 2) {
        $scope.newPost.placeholder = "Can't post an empty post.";
        return;
      }
      console.log($scope.profile._id);
      PostService.addPost(localStorage.getItem("loggedUserId") , $scope.newPost.text, $scope.profile._id).then(res => {
        $scope.newPost.text = "";
        if (res.status == 200) {
          $scope.newPost.placeholder = "Thank you for posting.";
          console.log(res.newPostId)
          $scope.posts.displayPost(res.newPostId,true)
          return res.newPostId
        } else {
          $scope.newPost.placeholder =
            "Sorry we had an error, please try again later.";
        }
      });
    }
    //ADD COMMENT
    function addComment(postId) {
      if (!$scope.newComment.text || $scope.newComment.text.trim().length < 2) {
        $scope.newComment.placeholder = "Can't post an empty comment.";
        return;
      }
      PostService.addComment(
        postId,
        localStorage.getItem("loggedUserId"),
        $scope.newComment.text
      ).then(res=>{
        res=JSON.parse(res)
        var postWithSuchId=$scope.posts.displayedPosts.find(p=>p._id==postId);
        postWithSuchId.comments.push(res)
        postWithSuchId.topComment=res
        $scope.newComment.text=""
        $scope.newComment.placeholder="Thanks for the comment."
      })
      
    }
  });
})();
