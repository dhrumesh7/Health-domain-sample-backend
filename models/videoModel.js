const mongoose = require('mongoose');
let Schema = mongoose.Schema;
const mongoosePaginate = require("mongoose-paginate");

const videoSchema = new Schema(
    {
        title: {
            type: String
        },
        description: {
            type: String
        },
        thumbnail: {
            type: String
        },
        video: {
            type: String
        },
        likes: {
            type: Number,
            default: 0
        }
    },
    {
        timestamps: true,
        versionKey: false,
    },
).plugin(mongoosePaginate);

const Video = mongoose.model('video', videoSchema);
module.exports = { Video }
