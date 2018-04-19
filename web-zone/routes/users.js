var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
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

router.get('/:id', function(req, res, next) {
  var userCollection = req.db.get('users');
  var userId = req.params.id;
  userCollection.find({_id: userId}, {}, function (err, docs) {
    if (err) {
      res.status(500);
      res.json(err);
    } else {
      res.status(200);
      res.json(docs);
    }
  })
});

router.post('/', function(req, res, next) {
  var userCollection = req.db.get('users');
  var user = req.body;
  userCollection.insert(user);
});

module.exports = router;
