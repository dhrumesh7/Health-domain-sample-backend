const { Post, Comment, PostCategory } = require('../models/postModel');
const { User } = require('../models/userModel')

const { addPostValidation } = require('../services/validationService');

const addPost = async (req, res) => {
    try {

        req.body.image = req?.file?.key;
        req.body.userId = req.user._id.toString();
        req.body.categoryId = req?.body?.categoryId?.toString();

        const { error } = addPostValidation(req.body);
        if (error)
            return res.status(422).json({ flag: false, error: error.message });

        const post = new Post(req.body);

        await post.save()
        return res.status(200).json({
            flag: true,
            data: post
        });
    } catch (error) {
        return res.status(500).json({
            flag: false,
            message: error.message
        });
    }
}

const getPost = async (req, res) => {
    try {
        const user = req.user;
        const page = req.query.page ?? 1;
        const limit = req.query.limit ?? 10;
        const sorting = req.query.latest == 'true' ? -1 : false;
        const categoryId = req.query.categoryId;

        const dbQuery = categoryId ? {categoryId: categoryId}: {};

        const posts = await Post.paginate(dbQuery, { page, limit, sort: { createdAt: sorting }, populate: 'userId' });

        const updated = posts?.docs?.map(post => {
            const postCopy = JSON.parse(JSON.stringify(post));
            postCopy.isLiked = user?.likedPost?.includes(post._id)
            postCopy.userId = { name: post.userId.name, userImage: post.userId.userImage }
            return postCopy
        });

        return res.status(200).json({
            flag: true,
            data: updated
        });
    } catch (error) {
        return res.status(500).json({
            flag: false,
            message: error.message
        });
    }
}

const addPostCategory = async (req, res) => {
    try {
        const categoryData = new PostCategory(req.body);
        const catgory = await categoryData.save();

        return res.status(200).json({
            flag: true,
            data: catgory
        });
    } catch (error) {
        return res.status(500).json({
            flag: false,
            message: error.message
        });
    }
}

const getPostCategory = async (req, res) => {
    try {
        const categories = await PostCategory.find({});

        return res.status(200).json({
            flag: true,
            data: categories
        });
    } catch (error) {
        return res.status(500).json({
            flag: false,
            message: error.message
        });
    }
}


const postLike = async (req, res) => {
    try {
        const user = req.user;
        const { postId, type } = req.body;
        if (user?.likedPost?.find(id => id.toString() === postId) && type === 'like') return res.status(409).json({
            flag: false,
            message: 'This post already liked!'
        });

        if (!user?.likedPost?.find(id => id.toString() === postId) && type !== 'like') return res.status(409).json({
            flag: false,
            message: 'This post already not liked!'
        });
        const userAction = type === 'like' ? { $push: { likedPost: postId } } : { $pull: { likedPost: postId } };
        const postAction = type === 'like' ? { $inc: { likes: 1 } } : { $inc: { likes: -1 } };

        await User.findOneAndUpdate({ _id: user._id }, userAction, { new: true });
        const post = await Post.findOneAndUpdate({ _id: postId, $gte: 0 }, postAction, { new: true });

        return res.status(200).json({
            flag: true,
            data: post
        });
    } catch (error) {
        return res.status(500).json({
            flag: false,
            message: error.message
        });
    }
}

const addComment = async (req, res) => {
    try {
        req.body.userId = req.user._id;

        const comment = new Comment(req.body);

        const savedComment = await comment.save();

        await Post.findOneAndUpdate({ _id: req.body.postId }, { $push: { comments: savedComment._id } }, { new: true });

        return res.status(200).json({
            flag: true,
            data: savedComment
        });
    } catch (error) {
        return res.status(500).json({
            flag: false,
            message: error.message
        });
    }
}

const getComment = async (req, res) => {
    try {
        const comments = await Comment.find({ postId: req.params.postId }).sort({ createdAt: -1 }).populate('userId', 'name userImage');

        return res.status(200).json({
            flag: true,
            data: comments
        });
    } catch (error) {
        return res.status(500).json({
            flag: false,
            message: error.message
        });
    }
}

module.exports = {
    addPost,
    getPost,
    getPostCategory,
    postLike,
    addComment,
    getComment,
    addPostCategory
}