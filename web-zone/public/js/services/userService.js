var userService = (function (params) {
    
    function User(firstName, lastName, email, birthDay, intrestes, password) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.password = password;
        this.birthDay = birthDay;
        this.sendedFriendRequests = [];
        this.receivedFriendRequests = [];
    }

    function getUserById(id) {
        return $.get(`http://localhost:9000/api/users/${id}`).then(user => {
            return user;
        })
    }
    
    User.prototype.login = function (email, password) {
        
    }

    User.prototype.register = function (email, password, birthDay, gender) {
        
    }

    User.prototype.sendFriendRequest = function (userId) {
        this.sendedFriendRequests.push(userId);
    }

    User.prototype.receiveFriendRequest = function (userId) {
        this.receivedFriendRequests.push(userId);
    }

    function UserService() {

    }

    UserService.prototype.sendFriendRequest = function (userId) {
        var self = this;
        User.prototype.sendFriendRequest.call(this.currentlyLogged, userId);
        getUserById(userId).then(user => User.prototype.receiveFriendRequest.call(user, self.currentlyLogged._id))
    }

    return new UserService();
    
})();