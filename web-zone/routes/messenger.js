var express = require('express');
var router = express.Router();


module.exports = function (app, db) {
    var chatRoomsCollection = db.get('chatrooms');
    var userCollection = db.get('users');
    app.io.on('connection', function (socket) {
        console.log('user connetcted ' + socket.handshake.query.token);


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
            chatRoomsCollection.insert(data, function (err, docs) {
                if (err) {
                    console.log(err);
                } else {
                    Promise.all([userCollection.findOneAndUpdate(
                        { _id: data.user2._id },
                        { $push: { chatRooms: docs._id } }

                    ),
                    // remove senderId from receivedReqeusts array at receiver user 
                    // push senderId to friends array at receiver user
                    userCollection.findOneAndUpdate(
                        { _id: data.user1._id },
                        { $push: { chatRooms: docs._id } }
                    )
                    ])
                        .then(function (values) {
                            socket.emit('getChatRooms', docs);
                        })
                        .catch(function (err) {
                            console.log(err);
                        });
                }
            })

        });

        socket.on('sendMessage', function (message, chatRoomId) {
            console.log(message);
            console.log(chatRoomId);
            chatRoomsCollection.findOneAndUpdate(
                { _id: chatRoomId },
                { $push: { content: message } }
            ).then(docs => {
                socket.emit('sendMessage', docs);
                socket.emit('getChatRooms', docs);
                socket.emit('getChatRooms', docs);
            }).catch(err => {
                console.log(err);
            })
        });

    })

};
