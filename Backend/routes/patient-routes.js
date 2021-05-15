const express = require('express');
const router = express.Router();

const patientControllers = require("../controllers/patient-controllers");

router.get("/doctorsNearBy/:patientId", patientControllers.getDoctorsNearBy);

router.post("/signup", patientControllers.signup);

router.post("/login", patientControllers.login);

router.post("/consultDoctor/:patientId", patientControllers.consultDoctor);

module.exports = router;