var express = require('express');
var router = express.Router();
var sha1 = require('sha1');

/* post login page. */
router.post('/', function (req, res, next) {

    var email = req.body.email;
    var password = sha1(req.body.password);
    console.log(email, password);
    var userCollection = req.db.get('users');

    userCollection.find({ email: email, password: password }, {}, function (err, docs) {
        if (err) {
            res.json({
                type: false,
                data: "Error occured: " + err
            });
        } else {
            if (docs.length > 0) {
               res.json({
                    type: true,
                    data: docs[0],
                    token: docs[0].token
                }); 
            } else {
                res.json({
                    type: false,
                    data: "Incorrect email/password"
                });    
            }
        }
    })
});

module.exports = router;
