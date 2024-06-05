const adminRouter = require('express').Router();

const { addCategory, addFaq, getAllCategory, getFaq } = require("../controller/adminController");

adminRouter.post('/category', addCategory);
adminRouter.post('/faq', addFaq);
adminRouter.get('/category', getAllCategory);
adminRouter.get('/faq/:categoryId', getFaq);

module.exports = { adminRouter };
