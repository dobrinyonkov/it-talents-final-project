(function () {
    app.controller('MessengerController', function ($timeout, $rootScope, $window, $scope, UserService) {

        $scope.chatRooms = [];
        $scope.messengerFriends = [];
        $scope.foundUsersToChat = [];

        // Get Currently logged user
        $timeout(function () {
            $scope.$apply(function () {
                var userId = $window.localStorage.getItem("loggedUserId");
                UserService.getById(userId)
                .then(data => {
                    $rootScope.currentUser = data.data[0];
                    var socket = io({
                        // this does not work 
                        userId: $scope.currentUser._id
                    });
                    
                    //get currently logged user chatrooms
                    $scope.chatRooms = $rootScope.currentUser.chatRooms;
                        // console.log($scope.chatRooms);
                        
                        // emit chatrooms id's to socket
                        socket.emit('getChatRooms', $scope.chatRooms);
                        
                        // get chatrooms objects
                        socket.on('getChatRooms', function (data) {
                            console.log(data);
                        })
                    })
                    .catch(err => {
                        alert(err)
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
                    var chatRoom = {
                        user1: $rootScope.currentUser._id,
                        user2: user._id,
                        content: []
                    }

                    socket.emit('sendChatRooms', chatRoom);
                }

            })
        }, 0);


    });
})();