const { Category, FAQ } = require('../models/faqModel');
const { addCategoryValidation, addFaqValidation } = require('../services/validationService')

const addCategory = async (req, res) => {
    try {
        const { error } = addCategoryValidation(req.body);
        if (error)
            return res.status(422).json({ flag: false, error: error.message });

        const category = new Category(req.body);

        const savedCategory = await category.save();

        return res.status(200).json({
            flag: true,
            data: savedCategory
        });
    } catch (error) {
        return res.status(500).json({
            flag: false,
            message: error.message
        });
    }
}

const addFaq = async (req, res) => {
    try {
        const { error } = addFaqValidation(req.body);
        if (error)
            return res.status(422).json({ flag: false, error: error.message });

        const faq = new FAQ(req.body);

        const savedFaq = await faq.save();

        return res.status(200).json({
            flag: true,
            data: savedFaq
        });
    } catch (error) {
        return res.status(500).json({
            flag: false,
            message: error.message
        });
    }
}

const getAllCategory = async (req, res) => {
    try {

        const categories = await Category.find({});

        return res.status(200).json({
            flag: true,
            data: categories
        });
    } catch (error) {
        return res.status(500).json({
            flag: false,
            message: error.message
        });
    }
}

const getFaq = async (req, res) => {
    try {
        const categoryId = req?.params?.categoryId;

        const faqs = await FAQ.find({ categoryId });

        return res.status(200).json({
            flag: true,
            data: faqs
        });
    } catch (error) {
        return res.status(500).json({
            flag: false,
            message: error.message
        });
    }
}
module.exports = {
    addCategory,
    addFaq,
    getAllCategory,
    getFaq
}