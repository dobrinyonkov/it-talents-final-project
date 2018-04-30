// handle friend requests 

var express = require('express');
var router = express.Router();


router.put('/send', function (req, res) {
    var ids = req.body.ids;
    var senderId = ids[0];
    var receiverId = ids[1];
    var userCollection = req.db.get('users');

    // update sendedRequest array with reciverId at sender user 
    Promise.all([userCollection.findOneAndUpdate(
        { _id: senderId },
        { $push: { sendedReqeusts: receiverId } }
    ),
    // update receivedReqeusts array with senderID at reciever user 
    userCollection.findOneAndUpdate(
        { _id: receiverId },
        { $push: { receivedReqeusts: senderId } }
    )
    ])
        .then(function (values) {
            res.status(200).json(values);
        })
        .catch(function (err) {
            res.status(404).json(err);
        });


});

router.delete('/delete', function (req, res) {
    var ids = req.body.ids;
    var senderId = ids[0];
    var receiverId = ids[1];
    var userCollection = req.db.get('users');


    // remove reciverId sendedRequest array at sender user 
    Promise.all([userCollection.findOneAndUpdate(
        { _id: senderId },
        { $pull: { sendedReqeusts: receiverId } }
    ),
    // remove senderId receivedReqeusts array at receiver user     
    userCollection.findOneAndUpdate(
        { _id: receiverId },
        { $pull: { receivedReqeusts: senderId } }
    )
    ])
        .then(function (values) {
            res.status(200).json(values);
        })
        .catch(function (err) {
            res.status(404).json(err);
        });
});

router.put('/confirm', function (req, res) {
    var ids = req.body.ids;
    var senderId = ids[0];
    var receiverId = ids[1];
    var userCollection = req.db.get('users');

    // remove reciverId from sendedRequest array at sender user 
    // push receiverId to friends array at sender user
    Promise.all([userCollection.findOneAndUpdate(
        { _id: senderId },
        { $push: { friends: receiverId } },
        { $pull: { sendedReqeusts: receiverId } }
    ),
    // remove senderId from receivedReqeusts array at receiver user 
    // push senderId to friends array at receiver user
    userCollection.findOneAndUpdate(
        { _id: receiverId },
        { $push: { friends: senderId } },
        { $pull: { receivedReqeusts: senderId } }
    )
    ])
        .then(function (values) {
            res.status(200).json(values);
        })
        .catch(function (err) {
            res.status(404).json(err);
        });
});

// use /delete
router.delete('/cancel', function (req, res) {
    var ids = req.body.ids;
    var senderId = ids[0];
    var receiverId = ids[1];
    var userCollection = req.db.get('users');

    Promise.all([userCollection.findOneAndUpdate(
        { _id: senderId },
        { $pull: { sendedReqeusts: receiverId } }
    ),
    userCollection.findOneAndUpdate(
        { _id: receiverId },
        { $pull: { receivedReqeusts: senderId } }
    )
    ])
        .then(function (values) {
            res.status(200).json(values);
        })
        .catch(function (err) {
            res.status(404).json(err);
        });
});

router.put('/unfriend', function (req, res) {
    var ids = req.body.ids;
    var senderId = ids[0];
    var receiverId = ids[1];
    var userCollection = req.db.get('users');

    // remove receiverId from friends array at sender user
    Promise.all([userCollection.findOneAndUpdate(
        { _id: senderId },
        { $pull: { friends: receiverId } },
    ),
    // remove senderId from friends array at receiver user
    userCollection.findOneAndUpdate(
        { _id: receiverId },
        { $pull: { friends: senderId } },
    )
    ])
        .then(function (values) {
            res.status(200).json(values);
        })
        .catch(function (err) {
            res.status(404).json(err);
        });
});

module.exports = router;
