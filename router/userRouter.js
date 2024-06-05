const userRouter = require('express').Router();

const { getUser, updateUser, searchUser, sendRequest, acceptRequest, rejectRequest, getAllDependents, getMyRequests, getReminders } = require("../controller/userController");
const { userImgUpload } = require("../services/uploadService")

userRouter.get('/', getUser);
userRouter.put('/', userImgUpload.single('userImage'), updateUser);
userRouter.get('/search', searchUser);
userRouter.post('/send-request', sendRequest);
userRouter.post('/accept-request', acceptRequest);
userRouter.post('/reject-request', rejectRequest);
userRouter.get('/dependents', getAllDependents);
userRouter.get('/my-requests', getMyRequests);
userRouter.get('/reminders', getReminders);

module.exports = { userRouter };
