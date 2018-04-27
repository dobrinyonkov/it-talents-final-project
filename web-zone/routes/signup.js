const JWT_SECRET = 'abcd1234';

var express = require('express');
var router = express.Router();
var sha1 = require("sha1");
var jwt = require("jsonwebtoken");

/* post login page. */
router.post('/', function (req, res, next) {
  var userCollection = req.db.get('users');
  var user = req.body;
  user.password = sha1(user.pass1);
  delete user.pass1;
  delete user.pass2;
  var passToReturn = user.pass1;
  user.token = jwt.sign({
    exp: Math.floor(Date.now() / 1000) + (60 * 60),
    data: user
  }, JWT_SECRET);

  userCollection.find({ email: user.email, password: user.password }, function (err, docs) {
    if (err) {
      res.json({
        type: false,
        data: "Error occured: " + err
      });
    } else {
      if (docs.length > 0) {
        res.json({
          type: false,
          data: "User already exists!"
        });
      } else {
        userCollection.insert(user, function (err, user) {
          if (err) {
            res.json({
              type: false,
              data: "Error occured: " + err
            })
          } else {
            res.json({
              type: true,
              data: user,
              token: user.token
            });
          }
        })
      }
    }
  });
});


module.exports = router;
