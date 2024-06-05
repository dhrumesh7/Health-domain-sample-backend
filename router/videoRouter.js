const videoRouter = require('express').Router();

const { verifyToken } = require('../services/jwtService');
const { addVideo, getVideo, videoLike } = require("../controller/videoController");
const { vidUpload } = require('../services/uploadService');

videoRouter.post('/', vidUpload.fields([{ name: 'thumbnail', maxCount: 1 }, { name: 'video', maxCount: 1 }]), addVideo);
videoRouter.get('/', verifyToken, getVideo);
videoRouter.post('/like', verifyToken, videoLike);

module.exports = { videoRouter };
