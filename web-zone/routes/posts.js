var express = require("express");
var router = express.Router();

//tva dali ne se izpalnqva zaedno sonova sas id-to
router.get("/", function(req, res, next) {
    console.log("toz get request bachka")
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

router.post("/", function(req, res, next) {
    console.log("=========toz post request bachka")
    var postsCollection = req.db.get('posts');
    var newPost = "koko"
    console.log(req.body)
    // var obj=JSON.parse(req.body)
    // console.log(obj)
    // for (const key in obj) {
    //   if (obj.hasOwnProperty(key)) {
    //     newPost=key        
    //   }
    // }
    console.log("============v post na requesta bodyto")
    // var newPost=req.query
    // console.log("======= v request-a query-to")
    console.log(newPost)
    // res.json("chakai")
      postsCollection.insert(newPost, function (err, data) {
        if (!err) {
          res.json({ id: data._id });
        } else {
          res.status(500);
          res.json({ err: err });
        }
      });
});


router.put("/",function(req,res,next){
    console.log("put zaqvakata bachka")
    var postsCollection = req.db.get('posts');
    var oldPost = req.body;
    console.log(oldPost)
    postsCollection.update({ _id: newUser._id },oldPost, function (err, data) {
        if (!err) {
          res.json({ id: data._id });
        } else {
          res.status(500);
          res.json({ err: err });
        }
      });
})

router.get('/:id', function(req, res, next) {
    var postCollection = req.db.get('posts');
    var postId = req.params.id;
    console.log(postId)
    postCollection.findOne({_id: postId}, {}, function (err, docs) {
      if (err) {
          console.log("i vlezna v greshakata")
        res.status(500);
        res.json(err);
      } else {
         console.log("shte gi poluchish")
        res.status(200);
        res.json(docs);
      }
    })
  });

module.exports = router;
