const express = require('express');
const router = express.Router();

const doctorControllers = require("../controllers/doctor-controllers");

router.post("/signup", doctorControllers.signup);

router.post("/login", doctorControllers.login);

router.post("/token/login", doctorControllers.loginWithToken);

router.post("/update/accesskey" , doctorControllers.updateAccessKey);

module.exports = router;