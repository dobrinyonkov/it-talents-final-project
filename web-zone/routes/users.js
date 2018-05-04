// import { request } from 'https';

const JWT_SECRET = 'abcd1234';

var express = require('express');
var router = express.Router();
var sha1 = require("sha1");
var jwt = require("jsonwebtoken");

/* GET users listing. */
router.get('/', function (req, res, next) {
  var userCollection = req.db.get('users');

  userCollection.find({}, {}, function (err, docs) {
    if (err) {
      res.status(500);
      res.json(err);
    } else {
      res.status(200);
      res.json(docs);
    }
  })
});

router.get('/:id', function (req, res, next) {
  var userCollection = req.db.get('users');
  var userId = req.params.id;
  userCollection.find({ _id: userId }, {}, function (err, docs) {
    if (err) {
      res.status(500);
      res.json(err);
    } else {
      res.status(200);
      // delete docs[0].password
      res.json(docs);
    }
  })
});

router.get('/:id/friends', function (req, res, next) {
  var userCollection = req.db.get('users');
  var userId = req.params.id;
  userCollection.find({ _id: userId }, {}, function (err, docs) {
    if (err) {
      res.status(500);
      res.json(err);
    } else {
      userCollection.find({ _id: { $in: docs[0].friends } }, {}, function (err, docs) {
        if (err) {
          res.status(500);
          res.json(err);
        } else {
          res.status(200);
          res.json(docs);
        }
      })
    }
  })
});

router.get('/name/:name', function (req, res, next) {
  var userCollection = req.db.get('users');
  var name = req.params.name;
  console.log(name);
  userCollection.find({ "firstName": {$regex : `.*${name}.*`}}, {}, function (err, docs) {
    if (err) {
      res.status(500);
      res.json(err);
    } else {
      res.status(200);
      res.json(docs);
    }
  })
});

router.put('/update/:id', function (req, res, next) {
  var user = req.body;
  var userCollection = req.db.get('users');

  userCollection.find({ _id: user._id }, {}, function (err, docs) {
    if (err) {
      res.status(404).send({
        message: "Not Found"
      })
    } else {
      if (docs[0].token !== req.token) {
        res.status(403).send({
          message: 'Not Authorized'
        });
      } else {
        userCollection.findOneAndUpdate({ _id: user._id }, { $set: user }, function (err, docs) {
          if (err) {
            res.status(500);
            res.json(err);
          } else {
            res.status(200);
            res.json(docs);
          }
        })
      }
    }
  })
});
// ADD POST
router.put("/addpost", function(req, res, next) {
  var postId = req.body.postId;
  var userId = req.body.userId;
  var userCollection = req.db.get("users");

  userCollection.findOneAndUpdate(
    { _id: userId },
    { $push: { posts: postId } },
    function(err, docs) {
      if (err) {
        res.status(500);
        res.json(err);
      } else {
        res.status(200);
        res.json(docs);
      }
    }
  );
});
//ADD PHOTO
router.put("/addphoto", function(req, res, next) {
  var photoUrl = req.body.photoUrl;
  var userId = req.body.userId;
  var userCollection = req.db.get("users");
  userCollection.find({ _id: userId }, {}, function(err, docs) {
    if (err) {
      res.status(404).send({
        message: "Not Found"
      });
    } else {
      if (docs[0].token !== req.token) {
        res.status(403).send({
          message: "Not Authorized"
        });
      } else {
        var user = docs[0];
        if (user.photos.indexOf(photoUrl)) {
          res.json({ message: "Already have such photo." });
        } else {
          userCollection.findOneAndUpdate(
            { _id: userId },
            { $push: { photos: photoUrl } },
            function(err, docs) {
              if (err) {
                res.status(500);
                res.json(err);
              } else {
                res.status(200);
                res.json(docs);
              }
            }
          );
        }
      }
    }
  });
});
//DELETE POST
router.post("/deletepost",function(req,res,next){
  var postId = req.body.postId;
  var userId = req.body.userId;
  var userCollection = req.db.get('users');
  userCollection.find({ _id: userId }, {}, function (err, docs) {
    if (err) {
      res.status(404).send({
        message: "Not Found"
      })
    } else {
      if (docs[0].token !== req.token) {
        res.status(403).send({
          message: 'Not Authorized'
        });
      } else {
        var user =docs[0]

        var index=user.posts.indexOf(postId)
        user.posts.splice(index,1)

        userCollection.findOneAndUpdate({ _id: userId }, { $set: user }, function (err, docs) {
          if (err) {
            res.status(500);
            res.json(err);
          } else {
            res.status(200);
            res.json(docs);
          }
        })
      
      }
    }
  })

})

module.exports = router;
