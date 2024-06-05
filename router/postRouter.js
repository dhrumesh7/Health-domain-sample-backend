const postRouter = require('express').Router();

const { verifyToken } = require('../services/jwtService');
const { addPost, getPost, postLike, addComment, getComment, addPostCategory, getPostCategory } = require("../controller/postController");
const { imgUpload } = require('../services/uploadService');

postRouter.post('/',verifyToken, imgUpload.single('image'), addPost);
postRouter.get('/',verifyToken, getPost);
postRouter.post('/category', addPostCategory);
postRouter.get('/category',verifyToken, getPostCategory);
postRouter.post('/like',verifyToken, postLike);
postRouter.post('/comment',verifyToken, addComment);
postRouter.get('/comment/:postId',verifyToken, getComment);

// postRouter.get('/', verifyToken, getVideo);
// postRouter.post('/like', verifyToken, videoLike);

module.exports = { postRouter };
