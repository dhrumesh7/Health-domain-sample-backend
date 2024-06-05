const mongoose = require('mongoose');
let Schema = mongoose.Schema;

const requestSchema = new Schema(
    {
        requestor: {
            type: Schema.Types.ObjectId,
            ref: 'user'
        },
        recipient: {
            type: Schema.Types.ObjectId,
            ref: 'user'
        },
        relation: {
            type: String
        }
    },
    {
        timestamps: true,
        versionKey: false,
    },
);

const Request = mongoose.model('request', requestSchema);
module.exports = { Request }
