const { User } = require('../models/userModel');
const { Request } = require('../models/requestModel');

const { updateUserValidation } = require('../services/validationService');
const { Reminder } = require('../models/reminderModel');



const getUser = async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.user._id }).populate('medicines')
        console.log(user)
        if (!user) return res.status(400).json({
            flag: false,
            message: 'User not found.'
        });

        return res.status(200).json({
            flag: true,
            data: user
        });
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            flag: false,
            message: error.message
        });
    }
}

const updateUser = async (req, res) => {
    try {

        const { error } = updateUserValidation(req.body);
        if (error)
            return res.status(422).json({ flag: false, error: error.message });

        if (req?.file?.key) {
            req.body.userImage = req.file.key;
            req.body.profileSet = true;
        }

        const user = await User.findOneAndUpdate({ _id: req.user._id }, { $set: req.body }, { new: true });

        if (!user) return res.status(400).json({
            flag: false,
            message: 'User not found.'
        });

        return res.status(200).json({
            flag: true,
            data: user
        });
    } catch (error) {
        return res.status(500).json({
            flag: false,
            message: error.message
        });
    }
}

const searchUser = async (req, res) => {
    try {
        const regex = new RegExp(req.query.text);

        const users = await User.find({ name: { $regex: regex, $options: "i" } }, { name: 1, _id: 1, userImage: 1 });

        if (!users) return res.status(400).json({
            flag: false,
            message: 'User not found.'
        });

        return res.status(200).json({
            flag: true,
            data: users
        });
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            flag: false,
            message: error.message
        });
    }
}

const sendRequest = async (req, res) => {
    try {
        const user = req.user;
        const sendTo = req.body.userId;
        const relation = req.body.relation;

        if (user._id.toString() === sendTo) return res.status(400).json({
            flag: false,
            data: 'You can not send request to yourself.'
        });
        if (user?.dependents?.find(dependent => dependent?.userId?.toString() === sendTo)) {
            return res.status(409).json({
                flag: false,
                data: 'This user is already in your dependent list.'
            });
        }
        const request = new Request({
            requestor: user._id,
            recipient: sendTo,
            relation
        });

        const savedRequest = await request.save();

        await User.updateMany({ _id: { $in: [user._id, sendTo] } }, { $push: { requests: savedRequest._id } }, { new: true });

        return res.status(200).json({
            flag: true,
            data: 'Request sent successfully!'
        });
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            flag: false,
            message: error.message
        });
    }
}

const acceptRequest = async (req, res) => {
    try {
        const user = req.user;
        const acceptOf = req.body.userId;

        const requestRecord = await Request.findOne({ requestor: acceptOf, recipient: user._id });

        if (!requestRecord) return res.status(200).json({
            flag: true,
            data: 'This user have not sent any request to you.'
        });

        const dependentData = {
            userId: user._id,
            relation: requestRecord.relation
        }
        await User.findOneAndUpdate({ _id: acceptOf }, { $pull: { requests: requestRecord._id }, $push: { dependents: dependentData } }, { new: true });
        await User.findOneAndUpdate({ _id: user._id }, { $pull: { requests: requestRecord._id } }, { new: true });

        await requestRecord.remove();

        return res.status(200).json({
            flag: true,
            data: 'Request accepted successfully!'
        });
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            flag: false,
            message: error.message
        });
    }
}

const rejectRequest = async (req, res) => {
    try {
        const user = req.user;
        const rejectOf = req.body.userId;

        const requestRecord = await Request.findOne({ requestor: rejectOf, recipient: user._id });

        if (!requestRecord) return res.status(200).json({
            flag: true,
            data: 'This user have not sent any request to you.'
        });

        await User.updateMany({ _id: { $in: [user._id, rejectOf] } }, { $pull: { requests: requestRecord._id } }, { new: true });

        await requestRecord.remove();

        return res.status(200).json({
            flag: true,
            data: 'Request rejected successfully!'
        });
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            flag: false,
            message: error.message
        });
    }
}

const getRequests = async (req, res) => {
    try {

        const user = await User.findOne({ _id: req.user._id }).populate('requests');
        console.log(user)
        if (!user) return res.status(400).json({
            flag: false,
            message: 'User not found.'
        });

        return res.status(200).json({
            flag: true,
            data: user
        });
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            flag: false,
            message: error.message
        });
    }
}

const getAllDependents = async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.user._id }, { _id: 1, name: 1, 'dependents.relation': 1 }).populate('dependents.userId')
        console.log(user)
        if (!user) return res.status(400).json({
            flag: false,
            message: 'User not found.'
        });

        return res.status(200).json({
            flag: true,
            data: user
        });
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            flag: false,
            message: error.message
        });
    }
}

const getMyRequests = async (req, res) => {
    try {
        const user = req.user;
        const requests = await Request.find({ recipient: user._id }).populate('requestor', 'name userImage');

        return res.status(200).json({
            flag: true,
            data: requests
        });
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            flag: false,
            message: error.message
        });
    }
}

const getReminders = async (req, res) => {
    try {
        const user = req.user;
        const pagination = { sort: { createdAt: -1 } };
        if (req.query.page) pagination['page'] = Number(req.query.page);
        if (req.query.limit) pagination['limit'] = Number(req.query.limit);

        const reminders = await Reminder.paginate({ userId: user._id }, pagination);

        return res.status(200).json({
            flag: true,
            data: reminders
        });
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            flag: false,
            message: error.message
        });
    }
}

module.exports = {
    getUser,
    updateUser,
    searchUser,
    sendRequest,
    acceptRequest,
    rejectRequest,
    getAllDependents,
    getRequests,
    getMyRequests,
    getReminders
}