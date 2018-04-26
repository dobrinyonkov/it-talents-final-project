app.service('fileUpload', function ($http) {
    // Create a root reference




    var uploadUrl = 'https://api.cloudinary.com/v1_1/web-zone2/image/upload';
    this.uploadFileToUrl = function (file) {
        var fd = new FormData();
        fd.append('file', file);
        return $http.post(uploadUrl, fd, {
            transformRequest: angular.identity,
            headers: {}
        });
    }
});