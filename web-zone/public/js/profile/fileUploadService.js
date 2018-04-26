app.service('fileUpload', function ($http) {
    // Create a root reference

    var uploadUrl = 'https://api.cloudinary.com/v1_1/adminwebzone/image/upload';
    this.uploadFileToUrl = function (file) {
        var fd = new FormData();

        fd.append('file', file);
        fd.append('upload_preset', 'b9hkpogc');
        // formdata.append('public_id','video');
        return $http.post('https://api.cloudinary.com/v1_1/adminwebzone/image/upload', fd, {
            headers: {
                'Content-Type': undefined,
                'X-Requested-With': 'XMLHttpRequest'
            }
        })
    }

});