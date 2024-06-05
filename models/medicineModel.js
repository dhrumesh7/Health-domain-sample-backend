const mongoose = require('mongoose');
let Schema = mongoose.Schema;

const medicineSchema = new Schema(
    {
        name: {
            type: String,
        },
        strength: {
            type: Number,
        },
        days: {
            type: Number,
        },
        appearance: {
            type: String,
        },
        frequency: {
            type: String,
        },
        totalTimes: {
            type: Number,
        },
        shceduleTime: {
            type: Array,
        },
        utcShceduleTime: {
            type: Array,
        },
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'user'
        }
    },
    {
        timestamps: true,
        versionKey: false,
    },
);

const Medicine = mongoose.model('medicine', medicineSchema);
module.exports = { Medicine }
