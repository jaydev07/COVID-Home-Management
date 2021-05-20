const express = require('express');
const router = express.Router();

const isAuth = require('../middlewares/is-auth');

const doctorControllers = require("../controllers/doctor-controllers");

router.get("/patients",doctorControllers.getPatients);

router.post("/signup", doctorControllers.signup);

router.post("/login", doctorControllers.login);

router.post("/token/login", doctorControllers.loginWithToken);

router.post("/update/accesskey", isAuth, doctorControllers.updateAccessKey);

module.exports = router;