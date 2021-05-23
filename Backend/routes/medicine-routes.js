const express = require("express");
const router = express.Router();

const medicineControllers = require("../controllers/medicine-controllers");

// To prescribe the medicines to a perticular patient
router.post("/add" , medicineControllers.addMedicines);

module.exports = router;