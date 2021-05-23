const express = require('express');
const router = express.Router();

const patientControllers = require("../controllers/patient-controllers");

// Middleware of jwt token for Authentication
const isAuth = require('../middlewares/is-auth');

// To get the list of all the doctors present in database
router.get("/all/doctors", patientControllers.getAllDoctors);

// To get the list of all the doctors which are nearby the patient
router.get("/doctorsNearBy",  patientControllers.getDoctorsNearBy);

// To get the Information and data of a patient  
router.get("/info/:patientId", patientControllers.getPatientData);

// To get daily report which sholud be rendered when the patient logedin
router.get("/daily/:patientId", patientControllers.patientDailyRender);

// To signup a patient
router.post("/signup", patientControllers.signup);

// To login a patient
router.post("/login", patientControllers.login);

// To login a patient with a jwt token for authentication
router.post("/token/login", patientControllers.loginWithToken);

// Used to consult a doctor and send the notification to a perticular doctor
router.post("/consultDoctor", patientControllers.consultDoctor);

// To add the symptoms & current medication of a patient
router.post("/addSymptomDetails/:patientId", patientControllers.addSymptomDetails);

module.exports = router;