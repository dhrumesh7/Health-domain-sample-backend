const cron = require('node-cron');
const moment = require('moment');
var admin = require("firebase-admin");

var serviceAccount = require("../health-app-8c2d0-firebase-adminsdk.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
})

const { Medicine } = require('../models/medicineModel');
const { Reminder } = require('../models/reminderModel');

// Service to reminder by send push notifications
const reminderService = async () => {
    try {
        const startRange = moment().utc().format('HH:mm');
        const endRange = moment().add(10, 'minutes').utc().format('HH:mm');
        console.log(startRange, endRange)
        const medicines = await Medicine.find({ utcShceduleTime: { $elemMatch: { $gte: startRange, $lte: endRange } } }).populate('userId');
        const fcm_tokens = {};
        const reminderData = []

        medicines.forEach(medicine => {
            medicine.name = medicine.name.toLowerCase()
            if (!fcm_tokens[medicine.name]) fcm_tokens[medicine.name] = [];
            fcm_tokens[medicine.name].push(medicine?.userId?.fcm_token);
            reminderData.push({
                title: `Hey, Take Your Med (${medicine.name})`,
                userId: medicine?.userId?._id,
                date: moment.utc().add(Number(medicine?.userId?.timeOffset), 'minutes').format()
            });
        });

        for (let key in fcm_tokens) {
            const tokens = fcm_tokens[key]?.filter(token => token);

            admin.messaging().sendToDevice(tokens, {
                notification: {
                    title: `Hey, Take Your Med (${key})`,
                }
            })
        }

        await Reminder.insertMany(reminderData);

    } catch (error) {
        console.log('errr reminder', error)
    }
}
const reminderNotification = () => {
    try {
        console.log('called periodic')
        cron.schedule('0 */10 * * * *', () => {
            console.log('frequest calling ')
            reminderService();
        });

    } catch (error) {
        console.log("error in cron job fork: ", error);
    }
}

module.exports = {
    reminderNotification
}