app.service("PostService", function($http,UserService) {
  function mergeNames(name1, name2){
    name1 = name1.charAt(0).toUpperCase() + name1.slice(1);
    name2 = name2.charAt(0).toUpperCase() + name2.slice(1);
    return name1 + " " + name2
  }
//constuctors dont have methots because their instances are passed to a db
  // POST CONSTRUCTOR
  function Post(ownerId, text, photo) {
    this.text = text;
    this.ownerId = ownerId;
    if (photo) {
      this.photo = photo;
    }
    this.date = new Date();
    this.comments = [];
    this.likes = [];
  }
  //Load owner info needed displaying the post 
  Post.prototype.loadOwnerInfo=function(){
    var post=this
    return UserService.getById(post.ownerId).then(res => {
      var owner = {};      
      owner.name = mergeNames(res.data[0].firstName,res.data[0].lastName)
      owner.photoUrl = res.data[0].profilePic;
      post.owner = owner; 
      return post
    })
  }
  Post.prototype.loadCommentWithOwnerData=function(position){
    var post=this
    if (position<0||position>post.comments.length)return;
    var comment= JSON.parse(JSON.stringify(post.comments[position])) 
    return UserService.getById(comment.ownerId).then(res => {
      var owner = {};  
      owner.name = mergeNames(res.data[0].firstName,res.data[0].lastName)
      owner.photoUrl = res.data[0].profilePic;
      comment.owner = owner; 
      return comment
    })    
  }
  Post.prototype.like = function(userId) {
    var post = this;
    return $http
      .put("http://localhost:9000/api/posts/like", {
        userId: userId,
        postId: post._id
      })
      .then(res => {
        if (res.status == 200) {
          post.likes = res.data.likes;
          return post;
        } else {
          return new Error({ mess: "server error" });
        }
      });
  };
  // Post.prototype.addComment=function(ownerId,text){
  //   var post=this
  //   var newC = new Comment(ownerId, text);
  //   newC = JSON.stringify(newC);
  //   return $http.put("/api/posts/", {
  //     postId: post._id,
  //     newComment: newC
  //   })
  //   .then(res=>{
  //     return newC
  //   });
  // }
  //COMMENT CONSTRUCTOR
  function Comment(ownerId, text) {
    this.ownerId = ownerId;
    this.text = text;
    this.date = new Date();
  }

  // ADD COMMENT  on the post for the moment
  this.addComment = function(postId, ownerId, text) {
    var newC = new Comment(ownerId, text);
    newC = JSON.stringify(newC);
    return $http.put("/api/posts/", {
      postId: postId,
      newComment: newC
    })
    .then(res=>{
      return newC
    });
  };
  // ADD POST
  this.addPost = addPost;
  function addPost(ownerId, text, friendId) {
    var newP = new Post(ownerId, text);
    console.log(newP);
    newP = JSON.stringify(newP);
    // newR=JSON.stringify(newP)
    return $http
      .post("http://localhost:9000/api/posts", newP)
      .then(res => {
        var newPostId = res.data.id;
        // console.log("Na noviqt post id-to" )
        // console.log(newPostId)
        return newPostId;
      })
      .then(newPostId => {
        if (friendId) {
          return UserService.addPost(friendId, newPostId);
        } else {
          return UserService.addPost(ownerId, newPostId);
        }
      });
  }
  // DELETE POST
  this.deletePost = function( userId,postId) {
    // deleting from the post data collection
    console.log("post services poluchi zaqvka za triene nat toz post--"+postId+" na toz user "+ userId)
    $http.delete("http://localhost:9000/api/posts/" + postId);
    //updating the user
     return UserService.deletePost(userId,postId)
  };
  //GET POST BY ID
  this.getPost = getPost;
  function getPost(id) {
    return $http
      .get("/api/posts/" + id)
      .then(r => r.data)
      .then(post => {
        console.log("post data given from db ");
        console.log(post);
        p = new Post();
        for (var prop in post) {
          p[prop] = post[prop];
        }
        console.log(p)
        return p;
      });
  }
});
