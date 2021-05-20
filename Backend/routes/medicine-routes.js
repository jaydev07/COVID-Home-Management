const express = require("express");
const router = express.Router();

const medicineControllers = require("../controllers/medicine-controllers");

router.post("/addmedicines" , medicineControllers.addMedicines);

module.exports = router;