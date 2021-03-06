const multer = require('multer');
const path = require('path')
const crypto = require('crypto')
const aws = require('aws-sdk')
const multerS3 = require('multer-s3')

const storageTypes = {
    local: multer.diskStorage({
        destination: (_req, _file, cb) => {
            cb(null, path.resolve(__dirname, "..", "..", "tmp", "upload"));
        },
        filename: (_req, file, cb) => {
            crypto.randomBytes(16, (err, hash) => {
                if (err) cb(err);

                file.key = `${hash.toString('hex')}-${file.originalname}`;

                cb(null, file.key);
            })
        }
    }),
    s3: multerS3({
        s3: new aws.S3(),
        bucket: process.env.BUCKET_NAME,
        contentType: multerS3.AUTO_CONTENT_TYPE,
        acl: "public-read",
        key: (_req, file, cb) => {
            crypto.randomBytes(16, (err, hash) => {
                if (err) cb(err);

                file.key = `${hash.toString('hex')}-${file.originalname}`;

                cb(null, file.key);
            })
        }
    })
}

module.exports = {
    dest: path.resolve(__dirname, "..", "..", "tmp", "upload"),
    storage: storageTypes.s3,
    limits: {
        fileSize: 2 * 1024 * 1024
    },
    fileFilter: (req, file, cb) => {
        const allowedMimes = [
            "image/jpeg",
            "image/png",
            "image/gif",
            "image/pjpeg",
        ]

        if (allowedMimes.includes(file.mimetype)) {
            cb(null, true)
        } else {
            cb(new Error("Invalid file type."))
        }
    }
}