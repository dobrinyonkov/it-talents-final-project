var express = require('express');
var router = express.Router();
var sha1 = require('sha1');

/* post login page. */
router.post('/', function (req, res, next) {
    var email = req.body.email;
    var password = sha1(req.body.password);

    var userCollection = req.db.get('users');
    userCollection.find({ email: email, password: password }, {}, function (err, docs) {
        if (docs.length > 0) {
            req.session.userId = docs[0]._id;
            console.log(req.session);
            res.redirect('/');
        } else {
            res.redirect('login.html');
        }
    })
});

module.exports = router;
