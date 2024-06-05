const { Medicine } = require('../models/medicineModel');
const { Record } = require('../models/recordModel');
const { User } = require('../models/userModel');

const { addMedicineValidation } = require('../services/validationService');


const moment = require('moment');

const addMedicine = async (req, res) => {
    try {

        const user = req.user;
        req.body.userId = req.user._id.toString();

        req.body.utcShceduleTime = req.body.shceduleTime.map(time => {
            return moment(time, 'HH:mm').utc().format('HH:mm');
        });

        const { error } = addMedicineValidation(req.body);
        if (error)
            return res.status(422).json({ flag: false, error: error.message });

        const medicineData = new Medicine(req.body);

        const medicine = await medicineData.save();

        await User.findOneAndUpdate({ _id: user._id }, { $push: { medicines: medicine._id } }, { new: true })

        return res.status(200).json({
            flag: true,
            data: medicine
        });
    } catch (error) {
        return res.status(500).json({
            flag: false,
            message: error.message
        });
    }
}

const getAllMedicines = async (req, res) => {
    try {
        const medicines = await Medicine.find().distinct('name');

        return res.status(200).json({
            flag: true,
            data: medicines
        });
    } catch (error) {
        return res.status(500).json({
            flag: false,
            message: error.message
        });
    }
}

const deleteMedicines = async (req, res) => {
    try {
        const medicineId = req.params.medicineId;
        await Medicine.remove({ _id: medicineId });
        await Record.remove({ medicineId: medicineId });

        return res.status(200).json({
            flag: true,
            data: 'Medicine removed successfully.'
        });
    } catch (error) {
        return res.status(500).json({
            flag: false,
            message: error.message
        });
    }
}

const addMedicineRecord = async (req, res) => {
    try {
        const user = req.user;
        const { medicineId, doses } = req.body;
        const date = moment.utc().add(Number(user.timeOffset), 'minutes').startOf('day');
        const userDate = moment.utc().add(Number(user.timeOffset), 'minutes').format();

        const record = await Record.findOneAndUpdate({ medicineId, date: { $gte: new Date(date) } }, { $addToSet: { doses: { "$each": doses } }, $set: { date: userDate, userId: user._id } }, { new: true, upsert: true });

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

const getMedicineRecord = async (req, res) => {
    try {
        const user = req.user;
        const page = req.query.page ?? 0;
        const limit = req.query.limit ?? 7;
        const dependentId = req.query.dependentId;

        if (dependentId && !user.dependents.find(u => u.userId.toString() === dependentId?.toString())) {
            return res.status(422).json({
                flag: false,
                message: "This user is not your dependent."
            });
        }

        const minusDay = Number(page * limit);
        const date = moment().add(Number(user.timeOffset), 'minutes').add(-minusDay, 'days').format('YYYY-MM-DD');
        const dependentUser = await User.findOne({ _id: dependentId });
        const medicines = await Medicine.find({ _id: { $in: dependentId ? dependentUser.medicines : user.medicines } });

        const records = await Record.aggregate([
            { $match: { userId: dependentId ? dependentId : user._id } },
            { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } }, records: { $push: "$$ROOT" } } },
            { $limit: Number(limit) },
            { $skip: Number(page * limit) }
        ]);
        const allData = [];
        let cDate = date;
        for (let i = 0; i < 7; i++) {
            const rec = records.find(rec => rec._id === cDate);
            if (rec) {
                const dateRecord = [];
                medicines.forEach(med => {
                    if (moment(med.createdAt).format('YYYY-MM-DD') <= cDate) {
                        const copyMed = JSON.parse(JSON.stringify(med));
                        const recFind = rec.records.find(r => r.medicineId.toString() === copyMed._id.toString());
                        if (recFind) {
                            dateRecord.push({ ...copyMed, doses: recFind.doses });
                        } else {
                            dateRecord.push({ ...copyMed, doses: [] });
                        }
                    }
                })
                if (dateRecord.length) {
                    allData.push({ date: rec._id, records: dateRecord })
                }
            } else {
                const emptyRecord = medicines.map(med => {
                    if (moment(med.createdAt).format('YYYY-MM-DD') <= cDate) {
                        const copyMed = JSON.parse(JSON.stringify(med));
                        copyMed.doses = [];
                        return copyMed
                    } else {
                        return
                    }

                }).filter(e => e)
                if (emptyRecord.length) {
                    allData.push({ date: cDate, records: emptyRecord })
                }
            }

            cDate = moment(cDate).add(-1, 'days').format('YYYY-MM-DD')
        }

        return res.status(200).json({
            flag: true,
            data: allData
        });
    } catch (error) {
        return res.status(500).json({
            flag: false,
            message: error.message
        });
    }
}


const getDatewiseMedicine = async (req, res) => {
    try {
        const user = req.user;
        const { date } = req.body;
        const dependentId = req.query.dependentId;

        if (dependentId && user.dependents.find(u => u.userId.toString() !== dependentId?.toString())) {
            return res.status(422).json({
                flag: false,
                message: "This user is not your dependent."
            });
        }
        const startDate = `${moment(date).format('YYYY-MM-DD')}T00:00:00.000Z`;
        const endDate = `${moment(date).add(1, 'days').format('YYYY-MM-DD')}T00:00:00.000Z`;

        const dependentUser = await User.findOne({ _id: dependentId });
        const medicines = await Medicine.find({ _id: { $in: dependentId ? dependentUser.medicines : user.medicines } });

        const record = await Record.find({ userId: dependentId ? dependentId : user._id, date: { $gte: startDate, $lte: endDate } });

        const dateRecord = medicines.map(med => {
            if (moment(med.createdAt).format('YYYY-MM-DD') <= date) {
                const medCopy = JSON.parse(JSON.stringify(med));
                const rec = record.find(r => med._id.toString() === r.medicineId.toString());
                if (rec) {
                    return { ...medCopy, doses: rec.doses };
                } else {
                    return { ...medCopy, doses: [] };
                }
            } else {
                return;
            }

        }).filter(record => record);

        return res.status(200).json({
            flag: true,
            data: dateRecord
        });
    } catch (error) {
        return res.status(500).json({
            flag: false,
            message: error.message
        });
    }
}

const getDateRangeRecord = async (req, res) => {
    try {
        const user = req.user;
        const dependentId = req.query.dependentId;
        const { startDate, endDate } = req.body;

        if (dependentId && !user.dependents.find(u => u.userId.toString() === dependentId?.toString())) {
            return res.status(422).json({
                flag: false,
                message: "This user is not your dependent."
            });
        }

        const sDate = moment(startDate).add(Number(user.timeOffset), 'minutes').format('YYYY-MM-DD');
        const eDate = moment(endDate).add(Number(user.timeOffset), 'minutes').format('YYYY-MM-DD');

        if (sDate === 'Invalid date' || eDate === 'Invalid date') return res.status(422).json({
            falg: false,
            message: "Invalid date"
        })
        const dependentUser = await User.findOne({ _id: dependentId });
        const medicines = await Medicine.find({ _id: { $in: dependentId ? dependentUser.medicines : user.medicines } });

        const records = await Record.aggregate([
            { $match: { userId: dependentId ? dependentId : user._id, date: { $gte: new Date(sDate), $lte: new Date(eDate) } } },
            { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } }, records: { $push: "$$ROOT" } } },
        ]);

        const allData = [];
        let cDate = endDate

        while (cDate >= startDate) {
            const rec = records.find(rec => rec._id === cDate);
            if (rec) {
                const dateRecord = [];
                medicines.forEach(med => {
                    if (moment(med.createdAt).format('YYYY-MM-DD') <= cDate) {
                        const copyMed = JSON.parse(JSON.stringify(med));
                        const recFind = rec.records.find(r => r.medicineId.toString() === copyMed._id.toString());
                        if (recFind) {
                            dateRecord.push({ ...copyMed, doses: recFind.doses });
                        } else {
                            dateRecord.push({ ...copyMed, doses: [] });
                        }
                    }
                })
                if (dateRecord.length) {
                    allData.push({ date: rec._id, records: dateRecord })
                }
            } else {
                const emptyRecord = medicines.map(med => {
                    if (moment(med.createdAt).format('YYYY-MM-DD') <= cDate) {
                        const copyMed = JSON.parse(JSON.stringify(med));
                        copyMed.doses = [];
                        return copyMed
                    } else {
                        return
                    }

                }).filter(e => e)
                if (emptyRecord.length) {
                    allData.push({ date: cDate, records: emptyRecord })
                }
            }
            cDate = moment(cDate).add(-1, 'days').format('YYYY-MM-DD')
        }

        return res.status(200).json({
            flag: true,
            data: allData
        });
    } catch (error) {
        return res.status(500).json({
            flag: false,
            message: error.message
        });
    }
}
module.exports = {
    addMedicine,
    getAllMedicines,
    addMedicineRecord,
    getMedicineRecord,
    deleteMedicines,
    getDatewiseMedicine,
    getDateRangeRecord
}