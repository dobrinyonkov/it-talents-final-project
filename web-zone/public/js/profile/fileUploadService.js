app.service('fileUpload', function ($http) {
    // Create a root reference

    var uploadUrl = 'https://api.cloudinary.com/v1_1/adminwebzone/image/upload';
    this.uploadFileToUrl = function (file) {
        var fd = new FormData();

        fd.append('file', file);
        fd.append('upload_preset', 'b9hkpogc');
        // formdata.append('public_id','video');
        console.log("file upload service will upload your file")
        return $http.post('https://api.cloudinary.com/v1_1/adminwebzone/image/upload', fd, {
            headers: {
                'Content-Type': undefined,
                'X-Requested-With': 'XMLHttpRequest',
                // 'Access-Control-Allow-Origin': '*',
                // "Access-Control-Allow-Credentials": "true",
                // "Access-Control-Allow-Methods": "GET,HEAD,OPTIONS,POST,PUT",
                // "Access-Control-Allow-Headers": "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers"
            }
        })
    }

});