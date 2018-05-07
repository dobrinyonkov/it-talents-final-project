// var userService = (function (params) {

//     function User(firstName, lastName, email, birthDay, intrestes, password) {
//         this.firstName = firstName;
//         this.lastName = lastName;
//         this.email = email;
//         this.password = password;
//         this.birthDay = birthDay;
//         this.sendedFriendRequests = [];
//         this.receivedFriendRequests = [];
//     }



//     User.prototype.login = function (email, password) {

//     }

//     User.prototype.register = function (email, password, birthDay, gender) {

//     }

//     User.prototype.sendFriendRequest = function (userId) {
//         this.sendedFriendRequests.push(userId);
//     }

//     User.prototype.receiveFriendRequest = function (userId) {
//         this.receivedFriendRequests.push(userId);
//     }

//     function UserService() {

//     }

//     UserService.prototype.sendFriendRequest = function (userId) {
//         var self = this;
//         User.prototype.sendFriendRequest.call(this.currentlyLogged, userId);
//         getUserById(userId).then(user => User.prototype.receiveFriendRequest.call(user, self.currentlyLogged._id))
//     }

//     return new UserService();

// })();

(function () {

    angular
        .module('app')
        .factory('UserService', UserService);

    function UserService($http) {

        // const API_URL = 'http://localhost:9000/';
        const API_URL = 'http://web-zone.herokuapp.com/';

        var service = {};

        var friendsRequests = {};
        friendsRequests.send = send;
        friendsRequests.deleteFR = deleteFR;
        friendsRequests.confirm = confirm;
        friendsRequests.unfriend = unfriend;

        service.friendsRequests = friendsRequests;


        service.getAll = getAll;
        service.getById = getById;
        service.getAllFriends = getAllFriends;
        service.getAndSafeLoggedUser = getAndSafeLoggedUser
        service.getByName = getByName;
        service.addPost = addPost;
        service.addPhoto=addPhoto;
        // service.deletePost = deletePost;
        service.create = create;
        service.update = update;
        service.remove = remove;

        return service;

        function getAll() {
            return $http.get(`${API_URL}api/users`)
                .then(res => {
                    return res;
                })
                .catch(err => {
                    return err;
                });
        }

        function getAllFriends(id) {
            return $http.get(`${API_URL}api/users/${id}/friends`)
                .then(res => {
                    return res;
                })
                .catch(err => {
                    return err;
                });
        }

        function getById(id) {
            return $http.get(`${API_URL}api/users/${id}`)
                .then(res => {
                    return res;
                })
                .catch(err => {
                    return err;
                });
        }

        function getAndSafeLoggedUser(id) {
            var loggedUser = null;
            if (sessionStorage.getItem("loggedUser")) {
                loggedUser = JSON.parse(sessionStorage.getItem("loggedUser"));
            }
            console.log("nova funkciq ama kat starata");
            console.log(loggedUser)
            if (loggedUser && loggedUser._id == id) {
                console.log("logged user data already fetched");
                return new Promise(function (resolve, reject) {
                    resolve(loggedUser);
               
                });
            }
            if (loggedUser) return new Error("Someone else has already logged ?!?");
            return getById(id).then(res => {
                console.log(res.data);
                loggedUser = res.data[0];
                sessionStorage.setItem("loggedUser", JSON.stringify(loggedUser));
                return loggedUser;
            });
        }


        function getByName(name) {
            return $http.get(`${API_URL}api/users/name/${name}`)
                .then(res => {
                    return res;
                })
                .catch(err => {
                    return err;
                });
        }

        function create(user) {
            return $http.post(`${API_URL}api/users/`, user)
                .then(res => {
                    return res;
                })
                .catch(err => {
                    return err;
                });
        }

        function update(user) {
            return $http.put(`${API_URL}api/users/update/${user._id}`, user)
                .then(res => {
                    return res;
                })
                .catch(err => {
                    return err;
                });
        }

        function remove(id) {
            return $http.delete(`${API_URL}api/users/${id}`)
                .then(res => {
                    return res;
                })
                .catch(err => {
                    return err;
                });
        }

        // friend request AJAX's
        function send(senderId, receiverId) {
            var arr = [senderId, receiverId];
            return $http.put(`${API_URL}api/friends/send`, { ids: arr })
                .then(res => {
                    return res;
                })
                .catch(err => {
                    return err;
                });
        }

        function deleteFR(senderId, receiverId) {
            var arr = [senderId, receiverId];
            console.log(arr);
            return $http.delete(`${API_URL}api/friends/delete/${senderId}/${receiverId}`)
                .then(res => {
                    return res;
                })
                .catch(err => {
                    return err;
                });
        }

        function confirm(senderId, receiverId) {
            var arr = [senderId, receiverId];
            return $http.put(`${API_URL}api/friends/confirm`, { ids: arr })
                .then(res => {
                    return res;
                })
                .catch(err => {
                    return err;
                });
        }

        function unfriend(senderId, receiverId) {
            var arr = [senderId, receiverId];
            console.log(arr);
            return $http.delete(`${API_URL}api/friends/unfriend/${senderId}/${receiverId}`, )
                .then(res => {
                    return res;
                })
                .catch(err => {
                    return err;
                });
        }


        function remove(id) {
            return $http
                .delete(`${API_URL}api/users/${id}`)
                .then(res => {
                    return res;
                })
                .catch(err => {
                    return err;
                });
        }

        // friend request AJAX's
        function send(senderId, receiverId) {
            var arr = [senderId, receiverId];
            return $http
                .put(`${API_URL}api/friends/send`, { ids: arr })
                .then(res => {
                    return res;
                })
                .catch(err => {
                    return err;
                });
        }

        function deleteFR(senderId, receiverId) {
            var arr = [senderId, receiverId];
            console.log(arr);
            return $http
                .delete(`${API_URL}api/friends/delete/${senderId}/${receiverId}`)
                .then(res => {
                    return res;
                })
                .catch(err => {
                    return err;
                });
        }

        function confirm(senderId, receiverId) {
            var arr = [senderId, receiverId];
            return $http
                .put(`${API_URL}api/friends/confirm`, { ids: arr })
                .then(res => {
                    return res;
                })
                .catch(err => {
                    return err;
                });
        }

        function unfriend(senderId, receiverId) {
            var arr = [senderId, receiverId];
            return $http
                .delete(`${API_URL}api/friends/unfriend/${senderId}/${receiverId}`)
                .then(res => {
                    return res;
                })
                .catch(err => {
                    return err;
                });
        }

    function addPost(userId, postId) {
      return $http
        .put(`${API_URL}api/users/addpost`, { postId: postId, userId: userId })
        .then(res => {
            res.newPostId=postId
          return res;
        })
        .catch(err => {
          return err;
        });
    }
    function addPhoto(userId, photoUrl) {
        console.log("na toz "+userId+"  shte mu kacha taz snimka "+photoUrl)
        return $http
          .put(`${API_URL}api/users/addphoto`, {  userId: userId,photoUrl:photoUrl })
        //   .then(res => {
        //       res.newPostId=postId
        //     return res;
        //   })
        //   .catch(err => {
        //     return err;
        //   });
      }

    }
})();
