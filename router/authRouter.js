const authRouter = require('express').Router();

const { login, emailOtpSend } = require("../controller/authController");

// authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.post('/email-otp', emailOtpSend);

module.exports = { authRouter };
