
var express = require('express');
var router = express.Router();

router.put('/send', function (req, res) {
    var ids = req.body.ids;
    var senderId = ids[0];
    var receiverId = ids[1];
    var userCollection = req.db.get('users');
 
    Promise.all([userCollection.findOneAndUpdate({ _id: senderId }, { $push: { sendedReqeusts: receiverId } }), 
        userCollection.findOneAndUpdate({ _id: receiverId }, { $push: { receivedReqeusts: senderId } })])
        .then(function (values) {
        console.log(values);
    });


});

router.delete('/delete', function (req, res) {

});

router.put('/confirm', function (req, res) {

});

router.delete('/cancel', function (req, res) {

});

module.exports = router;
