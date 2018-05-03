var express = require('express');
var router = express.Router();


module.exports = function (app, io, db) {
    var chatRoomsCollection = db.get('chatrooms');
    io.on('connection', function (chatroom) {
        console.log(chatroom);
        console.log('user connetcted');
        socket.on('chat room', function (chRoom) {
            io.emit('chat room', chRoom);
        });
        socket.on('disconnect', function () {
            console.log('user disconnected')
        })
    })

};
