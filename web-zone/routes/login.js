var express = require('express');
var router = express.Router();
var sha1 = require('sha1');

/* post login page. */
router.post('/', function (req, res, next) {

    // var user = JSON.parse(req.body)
    console.log(req.body);
    var email = req.body.email;
    var password = sha1(req.body.password);
    console.log(email, password);
    var userCollection = req.db.get('users');

    userCollection.find({ email: email, password: password }, {}, function (err, docs) {
        console.log(docs);
        if (docs.length > 0) {
            req.session.userId = docs[0]._id;
            console.log(req.session);
            res.status(200);
            res.redirect('/home');
        } else {
            res.status(401);
            res.json('No such user');
        }
    })
});

module.exports = router;
