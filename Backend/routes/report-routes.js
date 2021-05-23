const express = require("express");
const router = express.Router();

const reportControllers = require("../controllers/report-controllers");

// To get a patient's report of a perticular day
router.get("/:date/:patientId", reportControllers.getReportByDate);

// To add the patient's level into the report
router.post("/add/:patientId" , reportControllers.addReport);

module.exports = router;