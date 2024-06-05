const nodemailer = require('nodemailer');
// const fileLogService = require('./logService');

function otpGenerator() {
  var otp = Math.random();
  otp = otp * 1000000;
  otp = parseInt(otp);
  return otp
}

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.HOST_EMAIL,
    pass: process.env.HOST_EMAIL_PASS
  }
});

// Send OTP via email
const sendOtpEmail = async (email) => {
  // const fileLogger = fileLogService.init({ filename: 'emails.log' });

  const otp = otpGenerator();

  const mailTo = email;

  const mailOPtions = {
    from: process.env.HOST_EMAIL,
    to: mailTo,
    subject: 'test',
    html: "<h3>OTP for account verification is </h3>" + "<h1 style='font-weight:bold;'>" + otp + "</h1>"
  }
  try {
    const sendMail = await transporter.sendMail(mailOPtions);
    return { flag: true, otp };
  } catch (error) {
    return { falg: false, error };
  }
};

module.exports = {
  sendOtpEmail
}

