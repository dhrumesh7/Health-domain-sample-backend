const mongoose = require('mongoose');
let Schema = mongoose.Schema;

const userSchema = new Schema(
    {
        name: {
            type: String,
        },
        loginType: {
            type: String,
            enum: ['google', 'apple', 'facebook', 'mobile']
        },
        loginId: {
            type: String,
            unique: true
        },
        userImage: {
            type: String,
        },
        medicines: [{
            type: Schema.Types.ObjectId,
            ref: 'medicine'
        }],
        water: {
            type: Number,
        },
        weight: {
            type: Number,
            default: 0
        },
        height: {
            type: Number,
        },
        heartRate: {
            type: Number,
        },
        bmi: {
            type: Number,
            default: 0
        },
        age: {
            type: Number,
        },
        userTime: {
            type: Date
        },
        timeOffset: {
            type: String
        },
        fcm_token: {
            type: String
        },
        profileSet: {
            type: Boolean,
            default: false
        },
        likedVideo: [{
            type: Schema.Types.ObjectId,
            ref: 'video'
        }],
        likedPost: [{
            type: Schema.Types.ObjectId,
            ref: 'post'
        }],
        posts: [{
            type: Schema.Types.ObjectId,
            ref: 'post'
        }],
        requests: [{
            type: Schema.Types.ObjectId,
            ref: 'dependent'
        }],
        dependents: [{
            relation: {
                type: String
            },
            userId: {
                type: Schema.Types.ObjectId,
                ref: 'user'
            }
        }]
    },
    {
        timestamps: true,
        versionKey: false,
    },
);

const User = mongoose.model('user', userSchema);
module.exports = { User }
