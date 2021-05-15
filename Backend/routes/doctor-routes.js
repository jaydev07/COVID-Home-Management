const express = require('express');
const router = express.Router();

const doctorControllers = require("../controllers/doctor-controllers");

router.post("/signup", doctorControllers.signup);

router.post("/login", doctorControllers.login);

module.exports = router;