const mongoose = require('mongoose');
let Schema = mongoose.Schema;
const moment = require('moment');
const mongoosePaginate = require("mongoose-paginate");

const heartSchema = new Schema(
    {
        rate: {
            type: Number,
            default: 0
        },
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'user'
        },
        date: {
            type: Date,
            default: moment(new Date()).format("YYYY-MM-DD[T]HH:mm:ss")
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
).plugin(mongoosePaginate);

const Heart = mongoose.model('heart', heartSchema);
module.exports = { Heart }
