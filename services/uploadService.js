const AWS = require("aws-sdk");
const multer = require("multer");
const multerS3 = require("multer-s3");

AWS.config.update({
    accessKeyId: process.env.S3_KEY,
    secretAccessKey: process.env.S3_SECRET
});

const s3 = new AWS.S3();

const fileFilterImage = (req, file, cb) => {
    console.log("in filter");
    if (file.mimetype === "image/png" || file.mimetype === "image/jpeg") {
        cb(null, true);
    } else {
        cb(new Error("Invalid file type, only PNG is allowed!"), false);
    }
};
const fileFilterVideo = (req, file, cb) => {
    console.log("in filter");
    if (file.mimetype === "image/mp4" || file.mimetype === "image/mov") {
        cb(null, true);
    } else {
        cb(new Error("Invalid file type, only PNG is allowed!"), false);
    }
};

// Video upload to S3
const vidUpload = multer({
    // fileFilter: fileFilterImage,
    storage: multerS3({
        acl: "public-read",
        s3,
        bucket: process.env.S3_VIDEO_BUCKET,
        metadata: function (req, file, cb) {
            console.log("filed name: ");
            console.log(file.fieldname);
            cb(null, { fieldName: file.fieldname });
        },
        key: function (req, file, cb) {
            cb(null, Date.now().toString() + "." + file.mimetype.split("/")[1]);
        }
    })
});

// Image upload to S3
const imgUpload = multer({
    // fileFilter: fileFilterImage,
    storage: multerS3({
        acl: "public-read",
        s3,
        bucket: process.env.S3_POST_BUCKET,
        metadata: function (req, file, cb) {
            console.log("filed name: ");
            console.log(file.fieldname);
            cb(null, { fieldName: file.fieldname });
        },
        key: function (req, file, cb) {
            cb(null, Date.now().toString() + "." + file.mimetype.split("/")[1]);
        }
    })
});

// User profile image upload to S3
const userImgUpload = multer({
    // fileFilter: fileFilterImage,
    storage: multerS3({
        acl: "public-read",
        s3,
        bucket: process.env.S3_USER_IMAGE_BUCKET,
        metadata: function (req, file, cb) {
            console.log("filed name: ");
            console.log(file.fieldname);
            cb(null, { fieldName: file.fieldname });
        },
        key: function (req, file, cb) {
            cb(null, Date.now().toString() + "." + file.mimetype.split("/")[1]);
        }
    })
});

module.exports = { vidUpload, imgUpload, userImgUpload }


