app.directive('messenger', function () {
    return {
        templateUrl: 'js/layout/messengerDirective/messengerDirectiveTemplate.htm',
        css: 'js/layout/messengerDirective/messengerDirective.css',
        restrict: 'E',
        scope: {
            chatRoom: '=',
            sendMessage: '&',
            minimize: '&',
            closeChatWindow: '&'
        }
    };
});