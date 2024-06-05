const mongoose = require('mongoose');
let Schema = mongoose.Schema;
const moment = require('moment');
const mongoosePaginate = require("mongoose-paginate");

const recordSchema = new Schema(
    {
        medicineId: {
            type: Schema.Types.ObjectId,
            ref: 'medicine'
        },
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'user'
        },
        doses: Array,
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

const Record = mongoose.model('record', recordSchema);
module.exports = { Record }
