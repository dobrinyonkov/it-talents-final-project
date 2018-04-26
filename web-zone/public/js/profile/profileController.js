function calculateTimeInterval(date){
    var interval=Date.now()-Date.parse(date)
    // console.log(interval)
    
    if(interval<5000)return "just now";
    interval=Math.floor(interval/1000)
    if(interval<60)return interval+" seconds ago";
    interval=Math.floor(interval/60);
    if(interval<2)return "1 minute ago";
    if(interval<60)return interval+" minutes ago";
    interval=Math.floor(interval/60);
    if(interval<2)return "1 hour ago";
    if(interval<24)return interval+" hours ago";
    interval=Math.floor(interval/24);
    if(interval<2)return "yesterday";
    return interval+" days ago"
}
// console.log(new Date)
// console.log(calculateTimeInterval("2018-04-25T21:47:01.544Z"))

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