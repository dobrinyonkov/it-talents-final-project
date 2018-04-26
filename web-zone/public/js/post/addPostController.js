app.controller("addPostController", function($scope, $http, postService) {
  $scope.detectFiles = function() {
    console.log("files");
  };
  $scope.sayHi = function($event) {
    // $event.preventDefault()
    // console.log("hi");
  };

  window.addEventListener("load", function() {
       document
      .getElementById("fileInput")
      .addEventListener("change", function(e) {
        e.preventDefault();
        openFile(e); 
      });
      
    var openFile = function(event) {
      var input = event.target;
      var reader = new FileReader();
      reader.onload = function() {
        var dataURL = reader.result;
        console.log("shte si napravq edna put zaqvka");
        $.ajax({
          type: "PUT",
          url: "https://api.cloudinary.com/v1_1/web-zone2/image/upload",
          // contentType: "application/json",
          data: {
            upload_preset: "vmj68bqp",
            file: dataURL
          }
        }).done(res => {
          console.log("put zaqvkata varna neshto ");
          console.log(res);
        });
        var output = document.getElementById("output");
        output.src = dataURL;
      };
      reader.readAsDataURL(input.files[0]);
    };
  });
});
