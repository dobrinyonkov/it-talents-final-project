app.service("PostService", function($http,UserService) {
  this.greeting1 = "hi from the angular service";

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
  //COMMENT CONSTRUCTOR
  function Comment(ownerId, text) {
    this.ownerId = ownerId;
    this.text = text;
    this.date = new Date();
  }
  //ADD COMMENT  on the post for the moment
  this.addComment = function(postId, ownerId, text) {
    var newC = new Comment(ownerId, text);
    newC = JSON.stringify(newC);
    return $http.put("/api/posts/", {
      postId: postId,
      newComment: newC
    });
  };
  Post.prototype.deleteComment = function(id) {};

  // ADD POST
  this.addPost = addPost;
  function addPost(ownerId, text) {
    var newP = new Post(ownerId, text);
    console.log(newP);
    newP = JSON.stringify(newP);
    // newR=JSON.stringify(newP)
    return $http.post("http://localhost:9000/api/posts", newP).then(res => {
      var newPostId=res.data.id
      // console.log("Na noviqt post id-to" )
      // console.log(newPostId)
      return newPostId
    }).then(newPostId=>{
     return UserService.addPost(ownerId,newPostId)
    })
  }
// DELETE POST
  this.deletePost = function(id) {
    return $http.delete("http://localhost:9000/api/posts" + id);
  };
  //GET POST BY ID
  this.getPost = getPost;
  function getPost(id) {
    return $http.get("/api/posts/" + id).then(r => r.data);
    // .then(postData => {
    //   return postData

    // console.log("i sq tva api kvo vrashta")
    // console.log(postData)
    // var post = Object.create(Post.prototype);
    // for (const key in postData) {
    //   if (postData.hasOwnProperty(key)) {
    //     post[key] = postData[key];
    //   }
    // }
    // console.log(post);
    // return post;
    // });
  }
});
