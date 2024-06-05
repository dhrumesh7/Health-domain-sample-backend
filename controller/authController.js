const { User } = require('../models/userModel');
const { issueToken } = require('../services/jwtService');
const moment = require('moment');

const { loginValidation } = require('../services/validationService');
const { sendOtpEmail } = require('../services/emailService');
const { Otp } = require('../models/otpModel');

const login = async (req, res) => {
    try {
        const { error } = loginValidation(req.body);
        if (error)
            return res.status(422).json({ flag: false, error: error.message });

        if (req.body.loginType === 'email') {
            const otpRecord = await Otp.findOne({ email: req.body.loginId, otp: req.body.otp });
            if (!otpRecord) return res.status(401).json({
                flag: false,
                data: 'Invalid Otp!'
            });
            await otpRecord.remove();
        }

        const currentUtc = moment.utc().format('DD/MM/YYYY HH:mm:ss');
        const givenTime = moment(req.body.userTime).format('DD/MM/YYYY HH:mm:ss');

        let first, second, sign;
        if (givenTime > currentUtc) {
            first = givenTime
            second = currentUtc
            sign = "+"
        } else {
            first = currentUtc
            second = givenTime
            sign = "-"
        }

        const offset = moment.utc(moment(first, "DD/MM/YYYY HH:mm:ss").diff(moment(second, "DD/MM/YYYY HH:mm:ss"))).format("HH:mm:ss");
        const minutes = parseInt(moment.duration(offset).asMinutes());
        req.body.timeOffset = `${sign}${minutes}`

        const getUser = await User.findOneAndUpdate({ loginType: req.body.loginType, loginId: req.body.loginId }, { $set: req.body }, { upsert: true, new: true });

        const token = issueToken(getUser._id);

        return res.status(200).json({
            flag: true,
            token,
            data: getUser
        });

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            flag: false,
            message: error.message
        });
    }
}

const emailOtpSend = async (req, res) => {
    try {
        const email = req.body.email;
        const response = await sendOtpEmail(email);
        if (!response.flag)
            return res.status(500).json({
                flag: false,
                message: response.error
            });
        await Otp.findOneAndUpdate({ email }, { $set: { otp: response.otp } }, { new: true, upsert: true });

        return res.status(200).json({
            flag: true,
            message: 'Otp has been send to your email!'
        });

    } catch (error) {
        return res.status(500).json({
            flag: false,
            message: error.message
        });
    }
}

module.exports = {
    login,
    emailOtpSend
}