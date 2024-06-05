const mongoose = require('mongoose');
let Schema = mongoose.Schema;
const mongoosePaginate = require("mongoose-paginate");

const categorySchema = new Schema(
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

const faqSchema = new Schema(
    {
        question: {
            type: String
        },
        answer: {
            type: String
        },
        categoryId: {
            type: Schema.Types.ObjectId,
            ref: 'category'
        },
    },
    {
        timestamps: true,
        versionKey: false,
    },
).plugin(mongoosePaginate);

const FAQ = mongoose.model('faq', faqSchema);
const Category = mongoose.model('category', categorySchema);

module.exports = { FAQ, Category }
