const medicineRouter = require('express').Router();

const { addMedicine, getAllMedicines, addMedicineRecord, getMedicineRecord, deleteMedicines,getDatewiseMedicine, getDateRangeRecord } = require("../controller/medicineController");

medicineRouter.post('/', addMedicine);
medicineRouter.get('/', getAllMedicines);
medicineRouter.post('/record', addMedicineRecord);
medicineRouter.get('/record', getMedicineRecord);
medicineRouter.post('/date-record', getDatewiseMedicine);
medicineRouter.post('/date-range', getDateRangeRecord);
medicineRouter.get('/delete/:medicineId', deleteMedicines);

module.exports = { medicineRouter };
