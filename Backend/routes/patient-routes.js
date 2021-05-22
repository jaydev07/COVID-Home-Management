const express = require('express');
const router = express.Router();

const isAuth = require('../middlewares/is-auth');

const patientControllers = require("../controllers/patient-controllers");

router.get("/doctorsNearBy",  patientControllers.getDoctorsNearBy);

router.get("/daily/:patientId", patientControllers.patientDailyRender);

router.post("/signup", patientControllers.signup);

router.post("/login", patientControllers.login);

router.post("/token/login", patientControllers.loginWithToken);

router.post("/consultDoctor", patientControllers.consultDoctor);

router.post("/addMedicationDetails/:patientId", patientControllers.addMedicationDetails);

module.exports = router;