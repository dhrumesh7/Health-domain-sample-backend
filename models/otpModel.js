const mongoose = require('mongoose');
let Schema = mongoose.Schema;
const moment = require('moment');

const otpSchema = new Schema(
    {
        email: {
            type: String,
            unique: true
        },
        otp: {
            type: String
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

otpSchema.index({ createdAt: 1 }, { expireAfterSeconds: 3600 });
const Otp = mongoose.model('otp', otpSchema);
module.exports = { Otp }
