const mongoose = require('mongoose');
let Schema = mongoose.Schema;
const moment = require('moment');
const mongoosePaginate = require("mongoose-paginate");

const reminderSchema = new Schema(
    {
        title: {
            type: String
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
        versionKey: false,
    },
).plugin(mongoosePaginate);

const Reminder = mongoose.model('reminder', reminderSchema);
module.exports = { Reminder }
