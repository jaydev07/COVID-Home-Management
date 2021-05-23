const express = require('express');
const router = express.Router();

const isAuth = require('../middlewares/is-auth');

const doctorControllers = require("../controllers/doctor-controllers");

// To get the whole list of patients of a perticular doctor 
router.get("/patients/:doctorId", doctorControllers.getPatients);

// To get the list of panding or non-consulted patients of a perticular doctor
router.get("/nonConsulted/patients/:doctorId", doctorControllers.getNonConsultedPatients);

// To signup a doctor 
router.post("/signup", doctorControllers.signup);

// To login a doctor
router.post("/login", doctorControllers.login);

// To login with a token which is stored in the memory of user's phone
router.post("/token/login", doctorControllers.loginWithToken);

// To confirm a perticular patient & consult him.
router.patch("/confirm/patient/:doctorId", doctorControllers.confirmPatient);

// To reject the patient's consulting request
router.patch("/reject/patient/:doctorId" , doctorControllers.rejectPatient);

// After the whole medication of a patient is completed
router.patch("/completed/medication/:doctorId", doctorControllers.medicationEnded);

module.exports = router;