app.service("postService", function($http ) {

  this.greeting1="hi from the angular service"  ;

  // POST CONSTRUCTOR
  function Post(ownerId, text, photo) {
    this.text = text;
    this.ownerId = ownerId;
    if (photo) {
      this.photo = photo;
    }
    this.date = new Date();
    this.comments = [
      { ownerId: 42, text: "nqkav komentar", date: "dneska v 6 bez 10" }
    ];
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
    //find that post  in db

    //push the new comment
     
    //update in db
    this.comments.push(new Comment(ownerId, text));
    var newPost = this;
    $.ajax({
      type: "PUT",
      url: "/api/posts",
      contentType: "application/json",
      data: JSON.stringify(newPost)
    }).done(res => {
      console.log("put zaqvkata varna neshto ");
      console.log(res);
    });
      return $.post("/api/posts", post).done(response => {
        console.log(response);
        return response;
      });
      var newC=new Comment(ownerId ,text)
      //var post=find that post from db
      post.comments.push(newC)
      //db.posts.save(post)
  };
  Post.prototype.deleteComment = function(id) {};

// ADD POST
  this.addPost = function(ownerId, text) {
    var newP = new Post(ownerId, text);
    console.log(newP);
    newP = JSON.stringify(newP);
    // newR=JSON.stringify(newP)
    return $http.post("http://localhost:9000/api/posts", newP)
    // .done(response => {
    //   console.log(response);
    //   return response;
    // });
  };

  this.deletePost = function(id) {};
//GET POST BY ID
  this.getPost = function(id) {

  //  return $http.get('https://restcountries.eu/rest/v2/all')

    return $http.get("/api/posts/" + id).then(r=>r.data)
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
  };


});
