var postServices = () => {

  function Post(ownerId, text, photo) {
    this.text = text;
    this.ownerId = owner;
   // this.photo=???tva url li e
   this.date=new Date();
   this.comments=[]
   this.likes=[]//masiv ot idta na tiq det sa go haresali 

  }
  function Comment(ownerId ,text){
      this.ownerId=ownerKId
      this.text=text
      this.date=new Date()
  } 

  Post.prototype.addComment=function(postId,ownerId,text){
      var newC=new Comment(ownerId ,text)
      //var post=find that post from db
      post.comments.push(newC)
      //db.posts.save(post)
  }


  var result={}
  //dali v toz method sa zapazvat vav bazata ili oshte vav Post constructora ,che da moje da im vzemem id-to
  result.addPost=function(owner,text,photo){
      var newP= new Post(owner,text,photo)

      //da go nahaka v bazata
      //db.post.insert(JSON.stringyfy(newP))

      //da varne id-to
      return //db.posts.find({owner:owner,text:text,photo:photo})._id
  }
  result.getPost=function(id){
    
    //var post=db.post.find({_id=id})
    // vse edno post.__proto__=Post.prototype , maj behse s Object.create
    return post
  }
  
  return result 
};
