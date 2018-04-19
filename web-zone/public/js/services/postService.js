var postService = (() => {
  function Post(ownerId, text, photo) {
    this.text = text;
    this.ownerId = ownerId;
    if (photo) {
      this.photo = photo;
    }
    this.date = new Date();
    this.comments = [{ ownerId:42,text:"nqkav komentar",date:"dneska v 6 bez 10" }];
    this.likes = []
  }
  function Comment(ownerId, text) {
    this.ownerId = ownerId;
    this.text = text;
    this.date = new Date();
  }
  //tva se vika postServices.getPost(id).then(p=>p.addComment(id,text))
  Post.prototype.addComment = function(ownerId, text) {
    // this.comments.push(new Comment(ownerId, text));
    // var newPost = this;
    // $.ajax({
    //   type: "PUT",
    //   url: "/api/posts",
    //   contentType: "application/json",
    //   data: JSON.stringify(newPost)
    // }).done(res => {
    //   console.log("put zaqvkata varna neshto ");
    //   console.log(res);
    // });
    //   return $.post("/api/posts", post).done(response => {
    //     console.log(response);
    //     return response;
    //   });
    //   var newC=new Comment(ownerId ,text)
    //   //var post=find that post from db
    //   post.comments.push(newC)
    //   //db.posts.save(post)
  };
  Post.prototype.deleteComment = function(id) {};

  var result = {};


  //ei tva moje da go npravim da raboti kato factory
  result.addPost = function(ownerId, text, photo) {
    var newP = new Post(ownerId, text, photo);
    console.log(newP);
    newP = JSON.parse(JSON.stringify(newP));
    // newR=JSON.stringify(newP)
    return $.post("http://localhost:9000/api/posts", newP).done(response => {
      console.log(response);
      return response;
    });
  };

  result.deletePost = function(id) {};

  result.getPost = function(id) {
    //teq kato gi returnvam napravo posle getPost e promise
    return $.get("/api/posts/" + id).then(postData => {
      // console.log("i sq tva api kvo vrashta")
      // console.log(postData)
      var post = Object.create(Post.prototype);
      for (const key in postData) {
        if (postData.hasOwnProperty(key)) {
          post[key] = postData[key];
        }
      }
      console.log(post);
      return post;
    });
  };

  return result;
})();
