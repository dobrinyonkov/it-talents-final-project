var express = require('express');
var router = express.Router();
var sha1 = require('sha1');
var jwt = require('jsonwebtoken');

const JWT_SECRET = 'abcd1234';

/* post login page. */
router.put('/', function (req, res, next) {
    var email = req.body.email;
    var password = sha1(req.body.password);
    // console.log(email, password);
    var userCollection = req.db.get('users');

    userCollection.find({ email: email, password: password })
        .then(docs => {
            if (docs.length > 0) {
                docs[0].token = jwt.sign({
                    exp: Math.floor(Date.now() / 1000) + (60 * 60),
                    data: docs[0]
                }, JWT_SECRET);
                userCollection.update({ _id: docs[0]._id }, { $set: docs[0] })
                    .then(r => {
                        res.json({
                            type: true,
                            data: docs[0],
                            token: docs[0].token
                        });
                    }).catch(err => {
                        res.status(503).json({
                            data: 'Error during new token generation'
                        })
                    })
            } else {
                res.json({
                    type: false,
                    data: "Incorrect email/password"
                });
            }

        }).catch(err => {
            console.log(err);
            res.json({
                type: false,
                data: "Error occured: " + err
            });
        })


});

module.exports = router;
