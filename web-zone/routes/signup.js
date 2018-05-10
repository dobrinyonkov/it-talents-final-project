function validateEmail(email) {
  let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

function validatePass(password) {
  let re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,}/;
  return re.test(String(password));
}

function User(user) {
  this.email = user.email;
  this.password = sha1(user.pass1);
  this.firstName = user.firstName;
  this.lastName = user.lastName;
  this.passToReturn = user.pass1;
  this.profilePic = 'http://res.cloudinary.com/adminwebzone/image/upload/v1525103035/noprofile_nniohu.png';
  this.coverPhoto = "http://webzonenepal.com/new/images/webzone_logo.jpg";
  this.sendedReqeusts = [];
  this.receivedReqeusts = [];
  this.friends = [];
  this.chatRooms = [];
  this.posts = []; 
  this.photos = [];
  this.token = jwt.sign({
    exp: Math.floor(Date.now() / 1000) + (60 * 60),
    data: user
  }, JWT_SECRET);
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

  var userToDb = new User(user);

  userCollection.find({ email: userToDb.email, password: userToDb.password }, function (err, docs) {
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
        userCollection.insert(userToDb, function (err, user) {
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
