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

        var service = {};

        service.getAll = getAll;
        service.getById = getById;
        service.getByName = getByName;
        service.create = create;
        service.update = update;
        service.remove = remove;

        return service;

        function getAll() {
            return $http.get(`api/users`)
                .then(res => {
                    return res;
                })
                .catch(err => {
                    return err;
                });
        }

        function getById(id) {
            return $http.get(`http://localhost:9000/api/users/${id}`)
                .then(res => {
                    return res;
                })
                .catch(err => {
                    return err;
                });
        }

        function getByName(name) {
            return $http.get(`api/users/${name}`)
                .then(res => {
                    return res;
                })
                .catch(err => {
                    return err;
                });
        }

        function create(user) {
            return $http.post(`http://localhost:9000/api/users/`, user)
                .then(res => {
                    return res;
                })
                .catch(err => {
                    return err;
                });
        }

        function update(user) {
            return $http.put(`api/users/`, user._id, user)
                .then(res => {
                    return res;
                })
                .catch(err => {
                    return err;
                });
        }

        function remove(id) {
            return $http.delete(`api/users/${id}`)
                .then(res => {
                    return res;
                })
                .catch(err => {
                    return err;
                });
        }

    }

})();