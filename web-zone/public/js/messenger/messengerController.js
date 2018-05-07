(function () {
    app.controller('MessengerController', function ($timeout, $rootScope, $window, $scope, UserService) {

        $scope.chatRoomsIds = [];
        $scope.messengerFriends = [];
        $scope.foundUsersToChat = [];
        $scope.modalSelectedUser = null;
        $scope.tempChatRoomsObjects = [];
        $scope.chatRoomsObjects = [];
        $scope.currentChatRoom = null;

        //socket connection
        var socket = io();

        var userId = $window.localStorage.getItem("loggedUserId");
        UserService.getById(userId)
            .then(data => {
                $rootScope.currentUser = data.data[0];
                console.log($rootScope.currentUser);

                //get currently logged user chatrooms
                $scope.chatRoomsIds = $rootScope.currentUser.chatRooms;

                //ask form all chat rooms and join your socket/chat rooms
                socket.emit('rooms', $scope.chatRoomsIds);

                //get all chat rooms you are member in
                socket.on('rooms', function (rooms) {
                    //spoting user 'me' and user 'you'
                    if (rooms.length >= 0) {
                        rooms.forEach(element => {
                            if (element.user1._id === $rootScope.currentUser._id) {
                                element.user1.isMe = true;
                                element.user2.isMe = false;
                            } else {
                                element.user2.isMe = true;
                                element.user1.isMe = false;
                            }
                        })
                        $timeout(function () {
                            //get a copy of the rooms on the app memory
                            $scope.chatRoomsObjects = rooms.slice();

                            //get your last chat room
                            $scope.currentChatRoom = rooms.pop();
                        })
                    } else {
                        if (rooms.user1._id === $rootScope.currentUser._id) {
                            rooms.user1.isMe = true;
                            rooms.user2.isMe = false;
                        } else {
                            rooms.user2.isMe = true;
                            rooms.user1.isMe = false;
                        }
                        $timeout(function () {
                            //push a single chatroom to the array 
                            $scope.chatRoomsObjects.push(rooms);

                            //get your last chat room
                            $scope.currentChatRoom = rooms;
                        })
                    }

                });
            })
            .catch(err => {
                alert(err)
            });

        socket.on('big-announcement', function (data) {
            console.log(data);
        })

        //receiving new messages for currentChatRoom
        socket.on('message', function (data) {
            $timeout(function () {
                $scope.$apply(function () {
                    console.log($scope.currentChatRoom._id + ' received room id');
                    var room = $scope.chatRoomsObjects.find(c => c._id === data._id)
                    room.content.push(data.content.pop());
                })
            }, 0)
        })

        //input user name event
        $scope.searchUserToChat = function () {

            var name = $scope.nameToSearch;

            if ((name.length !== 0)) {
                UserService.getByName(name)
                    .then(r => {
                        //store founded user to display on autocomplete div
                        $scope.foundUsersToChat = r.data;
                    })
                    .catch(err => console.log(err));
            }

        }

        $scope.selectUserToChat = function (user) {
            //name to fill the input field
            $scope.nameToSearch = user.firstName + ' ' + user.lastName;

            //empty the array so autocomplete div hides
            $scope.foundUsersToChat = [];

            //store the selected user
            $scope.modalSelectedUser = user;

        }

        // send message button on modal / creates new chat room 
        $scope.sendModalMessage = function () {


            var user = $scope.modalSelectedUser;

            //prepair new chat room to emit to socket.io
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

            //prepair message obj
            var message = {
                sender: $rootScope.currentUser._id,
                profilePic: $rootScope.currentUser.profilePic,
                name: $rootScope.currentUser.firstName,
                date: new Date(),
                text: $scope.modalMessageToSend
            }

            //add first message to chat room
            chatRoom.content.push(message);

            socket.emit('sendChatRoom', chatRoom);
        }

        $scope.changeCurrentChatRoom = function (chatRoom) {
            $scope.currentChatRoom = chatRoom;
        }

        $scope.sendMessage = function () {
            //getting info
            var text = $scope.messageText;
            var user = $rootScope.currentUser;

            //prepair message obj
            var message = {
                sender: user._id,
                profilePic: user.profilePic,
                name: user.firstName,
                date: new Date(),
                text: text
            }

            //emit message to socket.io chat room
            console.log($scope.currentChatRoom._id + ' sended room id');
            socket.emit('message', message, $scope.currentChatRoom);

            //clean the textaria
            $scope.messageText = '';
        }

    });
})();