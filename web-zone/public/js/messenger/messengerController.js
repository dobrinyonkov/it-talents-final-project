(function () {
    app.controller('MessengerController', function ($location, $timeout, $rootScope, $window, $scope, UserService) {
        $scope.messageText = '';
        $scope.nameToSearch = '';
        $scope.chatRoomsIds = [];
        $scope.messengerFriends = [];
        $scope.foundUsersToChat = [];
        $scope.modalSelectedUser = null;
        $scope.tempChatRoomsObjects = [];
        $scope.chatRoomsObjects = [];
        $scope.currentChatRoom = null;
        $scope.activeChatRooms = JSON.parse($window.localStorage.getItem("activeChatRooms")) || [];
        //socket connection
        var socket = io();

        //determined wwhether messenger windows is opened so to hide active chat little windows 
        $rootScope.$on('$routeChangeStart', function () {
            $scope.inMessengerRoute = $location.absUrl().indexOf('messenger') !== -1;
            console.log($scope.inMessengerRoute);
        });

        var userId = $window.localStorage.getItem("loggedUserId");
        UserService.getById(userId)
            .then(data => {
                $rootScope.currentUser = data.data[0];

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

        //receiving new messages for currentChatRoom
        socket.on('message', function (data) {
            var audio = new Audio('/images/open-ended.mp3');
            $timeout(function () {
                $scope.$apply(function () {
                    var chat = $scope.activeChatRooms.find(ch => ch._id === data._id);
                    if (data.user1._id === $rootScope.currentUser._id) {
                        data.user1.isMe = true;
                        data.user2.isMe = false;
                    } else {
                        data.user2.isMe = true;
                        data.user1.isMe = false;
                    }
                    if (chat) {
                        var newMessage = data.content.slice().pop();
                        chat.content.push(newMessage);
                        debugger;
                        if (!(data.user1.isMe && data.user1._id === newMessage.sender)) {
                            audio.play();                    
                        }
                    } else {
                        $scope.activeChatRooms.push(data);
                    }
                    $timeout(function () {
                        $scope.$apply(function () {
                            var elements = document.querySelectorAll('direct-chat-msg');
                            elements.forEach(elem => {
                                console.log(elem);
                                elem.scrollTop = elem.scrollHeight;
                            });
                            console.log('activeRooms')
                            console.log($scope.activeChatRooms);
                            $window.localStorage.setItem("activeChatRooms", JSON.stringify($scope.activeChatRooms));
                        })
                    }, 0);
                    console.log($scope.currentChatRoom._id + ' received room id');
                    var room = $scope.chatRoomsObjects.find(c => c._id === data._id)
                    var newMessage = data.content.slice().pop();
                    room.content.push(newMessage);
                    debugger;
                    if (!(data.user1.isMe && data.user1._id === newMessage.sender)) {
                        audio.play();                    
                    }
                })
            }, 0)
        })

        //input user name event
        $scope.searchUserToChat = function (name) {


            console.log(name);
            if ((name.length !== 0)) {
                UserService.getByName(name)
                    .then(r => {
                        //store founded user to display on autocomplete div
                        $scope.foundUsersToChat = r.data;
                        $scope.foundUsersToChat = $scope.foundUsersToChat.filter(u => u.firstName !== $rootScope.currentUser.firstName);
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

        $scope.sendDouEnter = function ($event) {
            if ($event.keyCode == 13) {
                $event.preventDefault();
                $scope.sendMessage();
            }
        }

        $scope.sendMessage = function (chatRoom, textContent) {
            console.log(chatRoom, textContent);
            //getting info
            var text = textContent || $scope.messageText;

            var user = $rootScope.currentUser;
            console.log(text);
            //prepair message obj
            var message = {
                sender: user._id,
                profilePic: user.profilePic,
                name: user.firstName,
                date: new Date(),
                text: text
            }
            //clean the textaria
            $scope.messageText = '';

            //emit message to socket.io chat room
            console.log(chatRoom._id + ' sended room id');
            socket.emit('message', message, chatRoom);

        }

        $scope.closeChatWindow = function (chatRoom) {
            var index = $scope.activeChatRooms.findIndex(ch => ch._id === chatRoom._id);
            $scope.activeChatRooms.splice(index, 1);
            $window.localStorage.setItem("activeChatRooms", JSON.stringify($scope.activeChatRooms));
        }

        $scope.minimize = function ($event) {
        }

        $scope.addToAciveChats = function (chatRoom) {
            chatRoom = JSON.parse(JSON.stringify(chatRoom));
            $scope.activeChatRooms.push(chatRoom);
        }
    });
})();