const express = require("express");
const router = express.Router();

const reportControllers = require("../controllers/report-controllers");

router.post("/add/:patientId" , reportControllers.addReport);

module.exports = router;