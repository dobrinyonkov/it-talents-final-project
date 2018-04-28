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

//     function getUserById(id) {
//         return $.get(`http://localhost:9000/api/users/${id}`).then(user => {
//             return user;
//         })
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

        const API_URL = 'http://localhost:9000/';
        // const API_URL = 'https://web-zone.herokuapp.com/';
        var service = {};

        service.getAll = getAll;
        service.getById = getById;
        service.getByName = getByName;
        service.addPost=addPost;
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

        function getById(id) {
            return $http.get(`${API_URL}api/users/${id}`)
                .then(res => {
                    return res;
                })
                .catch(err => {
                    return err;
                });
        }

        function getByName(name) {
            console.log(name);
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
            console.log(user);
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

        function addPost(userId, postId) {
            console.log("prashtam put zaqvka s user "+ userId+" za post "+postId)
            return $http.put(`${API_URL}api/users/addpost`, {"postId":postId,"userId":userId})
            .then(res => {
                return res;
            })
            .catch(err => {
                return err;
            });
        }

    }

})();