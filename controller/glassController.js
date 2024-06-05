const { Glass } = require('../models/glassModel');
const moment = require('moment');

const addGlassRecord = async (req, res) => {
    try {
        const user = req.user;
        const { type, quantity } = req.body;
        const date = moment.utc().add(Number(user.timeOffset), 'minutes').startOf('day');
        const userDate = moment.utc().add(Number(user.timeOffset), 'minutes').format();
        const waterType = {}
        waterType[type] = quantity;

        const glass = await Glass.findOneAndUpdate({ userId: user._id, date: { $gte: new Date(date) } }, { $set: { date: userDate }, $inc: waterType }, { new: true, upsert: true });

        return res.status(200).json({
            flag: true,
            data: glass
        });
    } catch (error) {
        return res.status(500).json({
            flag: false,
            message: error.message
        });
    }
}

const getGlassRecord = async (req, res) => {
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
        const record = await Glass.paginate({ userId: dependentId ? dependentId : user._id }, { page, limit, sort: { date: -1 } });

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
    addGlassRecord,
    getGlassRecord
}