const mainRouter = require('express').Router();

const { verifyToken } = require('../services/jwtService');
const { authRouter } = require('./authRouter');
const { userRouter } = require('./userRouter');
const { medicineRouter } = require('./medicineRouter');
const { videoRouter } = require('./videoRouter');
const { postRouter } = require('./postRouter');
const { glassRouter } = require('./glassRouter');
const { heartRouter } = require('./heartRouter');
const { adminRouter } = require('./adminRouter');


mainRouter.use('/auth', authRouter);
mainRouter.use('/user', verifyToken, userRouter);
mainRouter.use('/medicine', verifyToken, medicineRouter);
mainRouter.use('/video', videoRouter);
mainRouter.use('/post', postRouter);
mainRouter.use('/glass', verifyToken, glassRouter);
mainRouter.use('/heart', verifyToken, heartRouter);
mainRouter.use('/admin', adminRouter);


module.exports = { mainRouter };