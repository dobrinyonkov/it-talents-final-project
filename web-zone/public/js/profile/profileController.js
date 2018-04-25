(function () {
    app.controller('ProfileController', function ($scope, postService) {
        // $scope.currentUser=
        $scope.posts=[]
        postService.getPost("5ada00a6f2400423d4235f5c").then(post=>$scope.posts.push(post))
        //tuka ot user servica
        $scope.getUserById=function(){
            console.log(arguments)
            return{            
            name:"Hristo Ivanov",
            profilePic:"http://res.cloudinary.com/web-zone2/image/upload/v1524652664/profile2_gklfiw.jpg",

        }}
    
    });
})();