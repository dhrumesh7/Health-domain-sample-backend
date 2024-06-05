const joi = require("joi");

const loginValidation = (user) => {
    const joiSchema = joi.object({
        name: joi.string().trim(),
        loginType: joi.string().valid('google', 'facebook', 'apple', 'mobile', 'email').required(),
        loginId: joi.string().when('loginType', { is: 'email', then: joi.string().email() }).required(),
        otp: joi.number().when('loginType', { is: 'email', then: joi.number().required(), otherwise: joi.number().optional() }),
        fcm_token: joi.string().required(),
        userTime: joi.string().required(),
        water: joi.number(),
        weight: joi.number(),
        heartRate: joi.number(),
        bmi: joi.number(),
    });

    return joiSchema.validate(user);
};

const addMedicineValidation = (medicine) => {
    const joiSchema = joi.object({
        name: joi.string().trim().required(),
        frequency: joi.string().trim().required(),
        appearance: joi.string().trim().required(),
        strength: joi.number(),
        days: joi.number(),
        totalTimes: joi.number(),
        shceduleTime: joi.array(),
        utcShceduleTime: joi.array(),
        userId: joi.string().required(),
    });

    return joiSchema.validate(medicine);
};

const updateUserValidation = (user) => {
    const joiSchema = joi.object({
        name: joi.string().trim().optional(),
        fcm_token: joi.string().optional(),
        userTime: joi.string().optional(),
        water: joi.number().optional(),
        weight: joi.number().optional(),
        height: joi.number().optional(),
        heartRate: joi.number().optional(),
        bmi: joi.number().optional(),
        age: joi.number().optional(),
        userImage: joi.string().optional()
    });

    return joiSchema.validate(user);
};


const addPostValidation = (post) => {
    const joiSchema = joi.object({
        title: joi.string().trim().required(),
        description: joi.string().trim().required(),
        image: joi.string().trim(),
        userId: joi.string().required(),
        categoryId: joi.string().required(),
        comments: joi.array().optional(),
    });
    return joiSchema.validate(post);
}

const addVideoValidation = (post) => {
    const joiSchema = joi.object({
        title: joi.string().trim().required(),
        description: joi.string().trim().required(),
        video: joi.string().required(),
        thumbnail: joi.string().required(),
        comments: joi.array().optional(),
    });
    return joiSchema.validate(post);
}

const addCategoryValidation = (post) => {
    const joiSchema = joi.object({
        name: joi.string().trim().required(),
    });
    return joiSchema.validate(post);
}

const addFaqValidation = (post) => {
    const joiSchema = joi.object({
        question: joi.string().trim().required(),
        answer: joi.string().trim().required(),
        categoryId: joi.string().trim().required(),
    });
    return joiSchema.validate(post);
}



module.exports = {
    loginValidation,
    addMedicineValidation,
    updateUserValidation,
    addPostValidation,
    addVideoValidation,
    addCategoryValidation,
    addFaqValidation
}