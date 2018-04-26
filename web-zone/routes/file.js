
var express = require('express');
var router = express.Router();
var cloudinary = require('cloudinary');
var multer = require('multer');
var upload = multer({ dest: './uploads/' });


/* GET users listing. */
router.post('/upload', upload.single('avatar'), function (req, res) {
    try {
        console.log(req.file);

    } catch (err) {
        res.sendStatus(400);
    }
})

module.exports = router;
