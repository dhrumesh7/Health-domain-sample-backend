const { Heart } = require('../models/heartModel');
const moment = require('moment');

const addHeartRecord = async (req, res) => {
    try {
        const user = req.user;
        const { rate } = req.body;
        const date = moment.utc().add(Number(user.timeOffset), 'minutes').startOf('day');
        const userDate = moment.utc().add(Number(user.timeOffset), 'minutes').format();

        const heart = await Heart.findOneAndUpdate({ userId: user._id, date: { $gte: new Date(date) } }, { $set: { date: userDate, rate: rate } }, { new: true, upsert: true });

        return res.status(200).json({
            flag: true,
            data: heart
        });
    } catch (error) {
        return res.status(500).json({
            flag: false,
            message: error.message
        });
    }
}

const getHeartRecord = async (req, res) => {
    try {
        const user = req.user;

        const page = req.query.page ?? 1;
        const limit = req.query.limit ?? 7;
        const dependentId = req.query.dependentId;

        if (dependentId && user.dependents.find(u => u.userId.toString() !== dependentId?.toString())) {
            return res.status(422).json({
                flag: false,
                message: "This user is not your dependent."
            });
        }
        const record = await Heart.paginate({ userId: dependentId ? dependentId : user._id }, { page, limit, sort: { date: -1 } });

        return res.status(200).json({
            flag: true,
            data: record
        });
    } catch (error) {
        return res.status(500).json({
            flag: false,
            message: error.message
        });
    }
}

module.exports = {
    addHeartRecord,
    getHeartRecord
}