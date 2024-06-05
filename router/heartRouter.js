const heartRouter = require('express').Router();

const { addHeartRecord, getHeartRecord } = require("../controller/heartController");

heartRouter.post('/', addHeartRecord);
heartRouter.get('/', getHeartRecord);

module.exports = { heartRouter };
