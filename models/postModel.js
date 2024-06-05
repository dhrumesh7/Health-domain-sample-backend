const mongoose = require('mongoose');
let Schema = mongoose.Schema;
const mongoosePaginate = require("mongoose-paginate");

const postSchema = new Schema(
    {
        title: {
            type: String
        },
        description: {
            type: String
        },
        image: {
            type: String
        },
        likes: {
            type: Number,
            default: 0
        },
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'user'
        },
        categoryId: {
            type: Schema.Types.ObjectId,
            ref: 'postcategory'
        },
        comments: [{
            type: Schema.Types.ObjectId,
            ref: 'comment'
        }],
    },
    {
        timestamps: true,
        versionKey: false,
    },
).plugin(mongoosePaginate);

const commentSchema = new Schema(
    {
        text: {
            type: String
        },
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'user'
        },
        postId: {
            type: Schema.Types.ObjectId,
            ref: 'post'
        },
    },
    {
        timestamps: true,
        versionKey: false,
    },
);

const postCategorySchema = new Schema(
    {
        name: {
            type: String,
            unique: true
        }
    },
    {
        timestamps: true,
        versionKey: false,
    },
).plugin(mongoosePaginate);

const Post = mongoose.model('post', postSchema);
const Comment = mongoose.model('comment', commentSchema);
const PostCategory = mongoose.model('postcategory', postCategorySchema);

module.exports = { Post, Comment, PostCategory }
