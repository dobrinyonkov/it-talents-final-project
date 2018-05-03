app.directive('navigation', function () {
    return {
        templateUrl: 'js/layout/nav/navTemplate.htm',
        // css: 'vendors/bootstrap/css/bootstrap.min.css',
        css: 'js/layout/nav/navTemplate.css',
        restrict: 'E',
        scope: {
            currentUser: '=',
            userName: '=',
            foundUsers: '=',
            selectedUserId: '=',
            sendedFriendRequests: '=',
            receivedFriendRequests: '=',
            searchUser: '&',
            logout:"&",
            selectUser: '&',
            onFirendRequests: '&',
            onConfirmFriendReuest: '&',
            onDeleteFriendReuest: '&'
        }
    };
});