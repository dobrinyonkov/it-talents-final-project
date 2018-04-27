var express = require("express");
var router = express.Router();
var jwt = require("jsonwebtoken");

//tva dali ne se izpalnqva zaedno sonova sas id-to
router.get("/", function(req, res, next) {
  // console.log("toz get request bachka")
  var postsCollection = req.db.get("posts");
  postsCollection.find({}, {}, function(err, docs) {
    if (err) {
      res.status(500);
      res.json(err);
    } else {
      res.status(200);
      res.json(docs);
    }
  });
});
router.get("/:id", function(req, res, next) {
  var postCollection = req.db.get("posts");
  var postId = req.params.id;
  // console.log(postId)
  postCollection.findOne({ _id: postId }, {}, function(err, docs) {
    if (err) {
      // console.log("i vlezna v greshakata")
      res.status(500);
      res.json(err);
    } else {
      //  console.log("shte gi poluchish")
      res.status(200);
      res.json(docs);
    }
  });
});

router.post("/", function(req, res, next) {
  // console.log("=========toz post request bachka")
  var postsCollection = req.db.get("posts");
  var newPost = req.body;
  console.log(req.body);
  // var obj=JSON.parse(req.body)
  // console.log(obj)
  // for (const key in obj) {
  //   if (obj.hasOwnProperty(key)) {
  //     newPost=key
  //   }
  // }
  // console.log("============v post na requesta bodyto")
  // var newPost=req.query
  // console.log("======= v request-a query-to")
  // console.log(newPost)
  // res.json("chakai")
  postsCollection.insert(newPost, function(err, data) {
    if (!err) {
      res.json({ id: data._id });
    } else {
      res.status(500);
      res.json({ err: err });
    }
  });
});

router.put("/", function(req, res, next) {
  console.log("put zaqvakata bachka")
  var postsCollection = req.db.get("posts");

  var comment = req.body.newComment;
  var postId=req.body.postId;
  console.log(comment)
  console.log(postId)
  comment=JSON.parse(comment)
  postsCollection.update({ _id:postId},{ $push:{comments:comment} }, function(err, data) {
    if (!err) {
      res.json({ id: data._id });
    } else {
      res.status(500);
      res.json({ err: err });
    }
  });
});

router.delete("/:id" ,function(req,res){
  var postId= req.params.id
  // console.log("shte triq "+postId)
  // res.send("shte triq "+postId)
  var postsCollection = req.db.get("posts");
  postsCollection.remove({ _id: postId},function(err, data) {
    console.log("error with delete request "+err)
    console.log("delete request returns "+data)
    if (!err) {
      res.json({ data: data});
    } else {
      res.status(500);
      res.json({ err: err });
    }
  })
})

module.exports = router;
