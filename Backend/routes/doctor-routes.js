const express = require('express');
const router = express.Router();

const isAuth = require('../middlewares/is-auth');

const doctorControllers = require("../controllers/doctor-controllers");

router.get("/patients/:doctorId", doctorControllers.getPatients);

router.get("/nonConsulted/patients/:doctorId", doctorControllers.getNonConsultedPatients);

router.post("/signup", doctorControllers.signup);

router.post("/login", doctorControllers.login);

router.post("/token/login", doctorControllers.loginWithToken);

router.patch("/confirm/patient/:doctorId", doctorControllers.confirmPatient);

router.patch("/reject/patient/:doctorId" , doctorControllers.rejectPatient);

router.patch("/completed/medication/:doctorId", doctorControllers.medicationEnded);

module.exports = router;