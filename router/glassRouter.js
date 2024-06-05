const glassRouter = require('express').Router();

const { addGlassRecord, getGlassRecord } = require("../controller/glassController");

glassRouter.post('/', addGlassRecord);
glassRouter.get('/', getGlassRecord);

module.exports = { glassRouter };
