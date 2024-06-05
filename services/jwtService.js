const jwt = require("jsonwebtoken");
const { User } = require('../models/userModel')

// Issue JWT token
const issueToken = (userId) => {
    const token = jwt.sign(userId.toString(), process.env.JWT_TOKEN);
    return token;
};

//  Verify JWT token
const verifyToken = async (req, res, next) => {
    try {
        if (req?.headers?.authorization) {
            const token = req.headers.authorization.replace("Bearer ", "");
            const userId = jwt.verify(token, process.env.JWT_TOKEN);
            console.log('userId', userId)
            if (!userId)
                return res
                    .status(401)
                    .json({ flag: false, message: "Unauthorized request" });

            const isUserExist = await User.findById(userId);
            console.log(isUserExist)
            if (!isUserExist)
                return res
                    .status(401)
                    .json({ flag: false, message: "Unauthorized request" });

            req.user = isUserExist;
            next();
        } else {
            return res
                .status(401)
                .json({ flag: false, message: "Unauthorized request" });
        }
    } catch (error) {
        console.log(error)
        return res
            .status(401)
            .json({ flag: false, message: "Unauthorized request" });
    }
};
module.exports = {
    issueToken,
    verifyToken
};
