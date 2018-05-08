function validateEmail(email) {
  let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

function validatePass(password) {
  let re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,}/;
  return re.test(String(password));
}

const JWT_SECRET = 'abcd1234';


var express = require('express');
var router = express.Router();
var sha1 = require("sha1");
var jwt = require("jsonwebtoken");

/* post login page. */
router.post('/', function (req, res, next) {
  var userCollection = req.db.get('users');
  var user = req.body;
  // validate email and password
  if(!(validateEmail(user.email) || validatePass(user.pass1))) {
    res.status(406).json({
      data: 'Not Acceptable Email or Password'
    })
  }

  // prepare user info
  user.password = sha1(user.pass1);
  // delete user.pass1;
  // delete user.pass2;
  var passToReturn = user.pass1;
  user.profilePic = 'http://res.cloudinary.com/adminwebzone/image/upload/v1525103035/noprofile_nniohu.png';
  user.coverPhoto = "http://webzonenepal.com/new/images/webzone_logo.jpg";
  user.sendedReqeusts = [];
  user.receivedReqeusts = [];
  user.friends = [];
  user.chatRooms = [];
  user.posts = [];
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
