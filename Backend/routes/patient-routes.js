const express = require('express');
const router = express.Router();

const isAuth = require('../middlewares/is-auth');

const patientControllers = require("../controllers/patient-controllers");

router.get("/doctorsNearBy", patientControllers.getDoctorsNearBy);

router.post("/signup", patientControllers.signup);

router.post("/login", patientControllers.login);

router.post("/token/login", patientControllers.loginWithToken);

router.post("/consultDoctor", isAuth, patientControllers.consultDoctor);

router.post("/update/accesskey", isAuth, patientControllers.updateAccessKey);

module.exports = router;