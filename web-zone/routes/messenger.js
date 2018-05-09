var express = require('express');
var router = express.Router();
var monk = require('monk')

module.exports = function (app, db) {
    var chatRoomsCollection = db.get('chatrooms');
    var userCollection = db.get('users');
    app.io.on('connection', function (socket) {
        console.log('user connetcted ' + socket.handshake.query.token);

        //get wanted chatrooms
        socket.on('rooms', function (rooms) {
            //join all socket/chat rooms
            socket.join(rooms);
            // console.log(rooms);
            //find all rooms wanted
            chatRoomsCollection.find({ _id: { $in: rooms } }, {}, function (err, docs) {
                if (err) {
                    console.log(err);
                } else {
                    //return rooms to client
                    socket.emit('rooms', docs);
                }
            })


            //receive message
            socket.on('message', function (message, chatroom) {
                //find and insert massage to chat room
                chatRoomsCollection.findOneAndUpdate(
                    { _id: chatroom._id },
                    { $push: { content: message } }
                ).then(docs => {
                    console.log(docs);
                    //emit new message to spesific chat/socket room       
                    app.io.in(chatroom._id).emit('message', docs);
                }).catch(err => {
                    console.log(err);
                })
            })

            socket.on('sendChatRoom', function (chatroom) {


                //check if chat room exist 
                chatRoomsCollection.find(
                    {
                        "user1._id": { $in: [monk.id(chatroom.user1._id), monk.id(chatroom.user2._id)] },
                        "user2._id": { $in: [monk.id(chatroom.user1._id), monk.id(chatroom.user2._id)] }
                    },
                    {}
                ).then(docs => {
                    if (docs.length > 0) {
                        console.log(chatroom.content[0]);
                        chatRoomsCollection.findOneAndUpdate({ _id: docs[0]._id }, { $push: { content: chatroom.content[0] } })
                            .then(updatedChatRoom => {
                                app.io.in(updatedChatRoom._id).emit('message', updatedChatRoom);
                            }).catch(err => {
                                res.status(500).json({
                                    data: 'Error occurred'
                                })
                            })
                    } else {
                        //insert new chat room to collection
                        chatRoomsCollection.insert(chatroom, function (err, docs) {
                            if (err) {
                                console.log(err);
                            } else {
                                //uptade user chatrooms arrays
                                Promise.all([userCollection.findOneAndUpdate(
                                    { _id: chatroom.user1._id },
                                    { $push: { chatRooms: docs._id } }

                                ),
                                // remove senderId from receivedReqeusts array at receiver user 
                                // push senderId to friends array at receiver user
                                userCollection.findOneAndUpdate(
                                    { _id: chatroom.user2._id },
                                    { $push: { chatRooms: docs._id } }
                                )
                                ])
                                    .then(function (values) {
                                        socket.join(docs._id);
                                        socket.emit('rooms', docs);
                                    })
                                    .catch(function (err) {
                                        console.log(err);
                                    });
                            }
                        })
                    }
                }).catch(err => {
                    res.status(404).json({
                        data: 'error eccorred'
                    })
                });



            });

            // app.io.in('5aec64a732840b127d02b65a').emit('big-announcement', 'the game will start soon');
        })

    })

};
