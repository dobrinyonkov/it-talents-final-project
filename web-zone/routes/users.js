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

router.put('/addpost', function (req, res, next) {
  console.log("taz zaqvka hvashta tekish")
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
        userCollection.findOneAndUpdate({ _id: userId }, { $push: { posts: postId } }, function (err, docs) {
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


module.exports = router;
