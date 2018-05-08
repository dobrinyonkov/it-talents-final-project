app.controller("postController", function($scope, PostService) {
  // DISPLAY POST FUNCTION
  $scope.calculateTimeInterval=function(date) {
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
  
  $scope.displayPost = function(postId, top, posts) {
    return PostService.getPost(postId)
      .then(post => post.loadOwnerInfo())
      .then(post => {
        // DELETING A POST
        post.canEdit = post.ownerId == localStorage.getItem("loggedUserId");
        post.editMode = false;
        post.delete = function() {
          bootbox.confirm("Are you sure you want to delete this post", res => {
            if (!res) return;
            PostService.deletePost(
              localStorage.getItem("loggedUserId"),
              post._id
            ).then(() => {
                posts.displayedPosts = posts.displayedPosts.filter(
                  p => p._id !== post._id
                );
              })
              .catch(err => {
                console.log(err);
                alert(
                  "We had a server error and couldn't delete the post, please try again later."
                );
              });
          });
        };
        // LIKING A POST
        post.liked =
          post.likes.indexOf(localStorage.getItem("loggedUserId")) != -1;
        post.like = post.like.bind(post, localStorage.getItem("loggedUserId"));
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
            post.comments.push(res);
            post.loadCommentWithOwnerData(post.comments.length - 1).then(c => {
              post.displayedComments.unshift(c);
            });
            post.newComment.text = "";
            post.newComment.placeholder = "Thanks for the comment.";
          }).catch(err=>{
            alert("We couldn't process this comment, please try again later.")
          })
        };
        //ADDING THE POST TO THE ARRAY
        if (top) {
          posts.displayedPosts.unshift(post);
        } else {
          posts.displayedPosts.push(post);
        }
      }).catch(err=>{console.log("We couldn't load your post, please try again later.")})
  };
});
