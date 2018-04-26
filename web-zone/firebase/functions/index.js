const functions = require('firebase-functions');
var gcs = require("@google-cloud/storage")();
const cors = require('cors')({ origin: true });
var Busboy = require("busboy");
var os = require('os');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.uploadFile = functions.https.onRequest()((req, res) => {
    cors(req, res, () => {
        if (req.method !== 'POSR') {
            return res.status(500).json({
                message: 'Not allowed'
            });
        }

        const busboy = new Busboy({ headers: request.headers });
        let uploadData = null;

        busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
            const filepath = path.join(os.tmpdir(), file);
            uploadData = { file: filepath, type: mimetype };
        });

        busboy.on('finish', () => {
            const bucket = gcs.bucket('web-zone-99e64.appspot.com');
            bucket.upload(uploadData.file, {
                uploadType: 'media', 
                metadata: {
                    metadata: {
                        contentType: uploadData.type
                    }
                }
            }).then(function (err, uploadFile) {
                if (err) {
                    return res.status(500).json({
                         error: err
                    });
                }
                res.status(200).json({
                    message: 'works'
                })
            })
        });
    });
})


