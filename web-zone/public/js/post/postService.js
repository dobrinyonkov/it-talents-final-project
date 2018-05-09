app.service("PostService", function(API_URL, $http, UserService) {
  function mergeNames(name1, name2) {
    name1 = name1.charAt(0).toUpperCase() + name1.slice(1);
    name2 = name2.charAt(0).toUpperCase() + name2.slice(1);
    return name1 + " " + name2;
  }

  // POST CONSTRUCTOR
  this.Post = Post;
  function Post(ownerId, text, photo) {
    this.text = text;
    this.ownerId = ownerId;
    if (photo) {
      this.photoUrl = photo;
    }
    this.date = new Date();
    this.comments = [];
    this.likes = [];
  }
  Post.prototype.loadOwnerInfo = function() {
    var post = this;
    if (this.isNews) {
      return UserService.getById(post.ownerId).then(res => {
        var whoShared = {};
        whoShared.name = mergeNames(
          res.data[0].firstName,
          res.data[0].lastName
        );
        whoShared.photoUrl = res.data[0].profilePic;
        post.whoShared = whoShared;
        return post;
      });
    }
    return UserService.getById(post.ownerId).then(res => {
      var owner = {};
      owner.name = mergeNames(res.data[0].firstName, res.data[0].lastName);
      owner.photoUrl = res.data[0].profilePic;
      post.owner = owner;
      return post;
    });
  };
  Post.prototype.like = function(userId) {
    var post = this;
    return $http
      .put(`${API_URL}api/posts/like`, {
        userId: userId,
        postId: post._id
      })
      .then(res => {
        if (res.status == 200) {
          post.likes = res.data.likes;
          post.liked = !post.liked;
          return post;
        } else {
          return new Error({ mess: "server error" });
        }
      });
  };
  Post.prototype.loadCommentWithOwnerData = function(position) {
    var post = this;
    if (position < 0 || position > post.comments.length) return;
    var comment = JSON.parse(JSON.stringify(post.comments[position]));
    return UserService.getById(comment.ownerId).then(res => {
      var owner = {};
      owner.name = mergeNames(res.data[0].firstName, res.data[0].lastName);
      owner.photoUrl = res.data[0].profilePic;
      comment.owner = owner;
      return comment;
    });
  };
  //COMMENT CONSTRUCTOR
  function Comment(ownerId, text) {
    this.ownerId = ownerId;
    this.text = text;
    this.date = new Date();
  }

  //ADD COMMENT  on the post 
  this.addComment = function(postId, ownerId, text) {
    var newC = new Comment(ownerId, text);
    newC = JSON.stringify(newC);
    return $http
      .put(`${API_URL}api/posts/`, {
        postId: postId,
        newComment: newC
      })
      .then(res => {
       if (res.status!=200){
         return new Error (res)
       }
        return newC;
      });
  };
  // ADD POST
  this.addPost = addPost;
  function addPost(ownerId, text, friendId, photoUrl) {
    // console.log("ot servica --" + photoUrl);
    var newP = new Post(ownerId, text, photoUrl);
    newP = JSON.stringify(newP);
    return $http
      .post(`${API_URL}api/posts`, newP)
      .then(res => {
        var newPostId = res.data.id;
        return newPostId;
      })
      .then(newPostId => {
        // console.log(res)
        if (photoUrl.length > 0) {
          console.log("Ohhhooo i snimka daje");
          return UserService.addPhoto(ownerId, photoUrl).then(responce => {
            if(responce.status!=200){
              return new Error("Image upload failed.")
            }
            return newPostId;
          });
        } else {
          return newPostId;
        }
      })
      .then(newPostId => {
        console.log("zapisah posta sq chte go dobavq i na " + friendId);
        return UserService.addPost(friendId, newPostId).then(() => newPostId);
      });
  }
  // DELETE POST 
  this.deletePost = function(userId, postId,deleterId) {
    var post = {};
    //post needed to delete associated photo from the user's photo array
    
  return  $http.get("/api/posts/" + postId)
  .then(res=>res.data.photoUrl)
  .then(photoUrl=>{
      if(photoUrl&&photoUrl.trim().length>0){  
        console.log("shte triq i snimki")     
       return UserService.deletePhoto(deleterId,photoUrl).then(res=>{console.log(res)})
      }
    }).then(()=>{
      console.log("shte triq ot masiva na ")
      console.log(userId)
      $http
      .post(`${API_URL}api/users/deletepost`, {
        postId: postId,
        userId: userId,
        deleterId:deleterId
      })
      .then(() => {
        console.log("shte iztriq i samiq post")
        //  throw new Error("")<<--error catched succesufully
        return $http.delete(`${API_URL}api/posts/` + postId);
      });
    }) 
  };
  //GET POST BY ID
  this.getPost = getPost;
  function getPost(id) {
    return $http.get("/api/posts/" + id).then(r => r.data);
  }
  // LIKE POST
  this.getPost = getPost;
  function getPost(id) {
    return $http
      .get("/api/posts/" + id)
      .then(r => r.data)
      .then(post => {
        p = new Post();
        for (var prop in post) {
          p[prop] = post[prop];
        }
        return p;
      });
  }
});
