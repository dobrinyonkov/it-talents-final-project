(function () {
    app.controller('MessengerController', function ($timeout, $rootScope, $window, $scope, UserService) {

        $scope.chatRooms = [];
        $scope.messengerFriends = [];
        $scope.foundUsersToChat = [];
        $scope.modalSelectedUser = null;
        $scope.tempChatRoomsObjects = [];
        $scope.chatRoomsObjects = [];
        $scope.currentChatRoom = null;
        var socket = io();

        // Get Currently logged user
        $timeout(function () {
            $scope.$apply(function () {
                var userId = $window.localStorage.getItem("loggedUserId");
                UserService.getById(userId)
                    .then(data => {
                        $rootScope.currentUser = data.data[0];

                        //get currently logged user chatrooms
                        $scope.chatRooms = $rootScope.currentUser.chatRooms;
                        // console.log($scope.chatRooms);

                        // emit chatrooms id's to socket
                        socket.emit('getChatRooms', $scope.chatRooms);

                        // get chatrooms objects
                        socket.on('getChatRooms', function (data) {
                            console.log(data);
                            if (data.length >= 0) {
                                $scope.tempChatRoomsObjects = [];
                                data.forEach(element => {
                                    $scope.$apply(function () {
                                        if (element.user1._id === $scope.currentUser._id) {
                                            element.user1.isMe = true;
                                            element.user2.isMe = false;
                                        } else {
                                            element.user2.isMe = true;
                                            element.user1.isMe = false;
                                        }
                                        $scope.tempChatRoomsObjects.push(element);
                                    })
                                });
                            } else {
                                $scope.$apply(function () {
                                    if (data.user1._id === $scope.currentUser._id) {
                                        data.user1.isMe = true;
                                        data.user2.isMe = false;
                                    } else {
                                        data.user2.isMe = true;
                                        data.user1.isMe = false;
                                    }
                                    $scope.tempChatRoomsObjects.push(data);
                                })
                            }
                            $timeout(function () {
                                $scope.$apply(function () {
                                    $scope.chatRoomsObjects = $scope.tempChatRoomsObjects;
                                    $scope.currentChatRoom = $scope.tempChatRoomsObjects[$scope.tempChatRoomsObjects.length - 1];
                                });
                            });
                            console.log($scope.currentChatRoom);
                        })
                    })
                    .catch(err => {
                        alert(err)
                    });
            })
        });

        $scope.searchUserToChat = function () {
            var name = $scope.nameToSearch;
            if ((name.length !== 0)) {
                UserService.getByName(name)
                    .then(r => {
                        console.log(r.data);
                        $scope.foundUsersToChat = r.data;
                    })
                    .catch(err => console.log(err));
            }

        }

        $scope.selectUserToChat = function (user) {

            $scope.nameToSearch = user.firstName + ' ' + user.lastName;
            $scope.foundUsersToChat = [];
            $scope.modalSelectedUser = user;

        }

        $scope.sendModalMessage = function () {
            var user = $scope.modalSelectedUser;

            var chatRoom = {
                user1: {
                    name: $rootScope.currentUser.firstName + ' ' + $rootScope.currentUser.lastName,
                    profilePic: $rootScope.currentUser.profilePic,
                    _id: $rootScope.currentUser._id
                },
                user2: {
                    name: user.firstName + ' ' + user.lastName,
                    profilePic: user.profilePic,
                    _id: user._id
                },
                content: []
            }

            var message = {
                user: {
                    name: $rootScope.currentUser.firstName + ' ' + $rootScope.currentUser.lastName,
                    profilePic: $rootScope.currentUser.profilePic,
                    _id: $rootScope.currentUser._id
                },
                message: $scope.modalMessageToSend
            }

            chatRoom.content.push(message);

            socket.emit('sendChatRooms', chatRoom);
        }


        $scope.changeCurrentChatRoom = function (chatRoom) {
            $scope.currentChatRoom = chatRoom;
        }

        $scope.sendMessage = function () {
            var message = {
                user: {
                    name: $rootScope.currentUser.firstName + ' ' + $rootScope.currentUser.lastName,
                    profilePic: $rootScope.currentUser.profilePic,
                    _id: $rootScope.currentUser._id
                },
                message: $scope.messageText
            }

            socket.emit('sendMessage', message, $scope.currentChatRoom._id);
        }

        socket.on('sendMessage', function (data) {
            $scope.$apply(function () {
                $scope.currentChatRoom.content.push(data.content.pop());
            })
        });
    });
})();