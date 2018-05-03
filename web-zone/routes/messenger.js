var express = require('express');
var router = express.Router();


module.exports = function (app, db) {
    var chatRoomsCollection = db.get('chatrooms');
    var userCollection = db.get('users');
    app.io.on('connection', function (socket) {
        console.log('user connetcted' + socket.userId);


        socket.on('getChatRooms', function (data) {
            console.log(data);
            chatRoomsCollection.find({ _id: { $in: data } }, {}, function (err, docs) {
                if (err) {
                    console.log(err);
                } else {
                    socket.emit('getChatRooms', docs);
                }
            })
        });

        socket.on('sendChatRooms', function (data) {
            console.log(data);
            chatRoomsCollection.insert(data, function (err, docs) {
                if (err) {
                    console.log(err);
                } else {
                    console.log(docs);
                    console.log(data.user1);
                    Promise.all([userCollection.findOneAndUpdate(
                        { _id: data.user2 },
                        { $push: { chatRooms: docs._id } }
        
                    ),
                    // remove senderId from receivedReqeusts array at receiver user 
                    // push senderId to friends array at receiver user
                    userCollection.findOneAndUpdate(
                        { _id: data.user1 },
                        { $push: { chatRooms: docs._id } }
                    )
                    ])
                        .then(function (values) {
                            console.log(values);
                        })
                        .catch(function (err) {
                            console.log(err);
                        });
                }
            })
            
        });

    })

};
