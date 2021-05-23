const express = require("express");
const router = express.Router();

const reportControllers = require("../controllers/report-controllers");

router.get("/:date/:patientId", reportControllers.getReportByDate);

router.post("/add/:patientId" , reportControllers.addReport);

module.exports = router;