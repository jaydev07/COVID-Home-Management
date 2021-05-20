const mongoose = require("mongoose");
const fetch = require("node-fetch");
const bcrypt = require("bcrypt");

const HttpError = require("../util/http-error");
const Patient = require("../models/patient-model");
const Doctor = require("../models/doctor-model");

const jwt = require('jsonwebtoken');

const signup = async(req, res, next) => {

    const email = req.body.email;
    let password = req.body.password;
    password = email.concat(password);

    const salt = await bcrypt.genSalt();
    password = await bcrypt.hash(password, salt);

    let patientFound;
    try {
        patientFound = await Patient.findOne({ email: email });
        const token = jwt.sign({
            email: newDoctor.email,
            id: newDoctor._id
        }, 'innoventX123');
    } catch (err) {
        console.log(err);
        return next(new HttpError('Something went wrong', 500));
    }

    if (patientFound) {
        return next(new HttpError('Patient already exists.Please login', 500));
    }

    const newPatient = new Patient({
        name: req.body.name,
        email: req.body.email,
        password,
        accessKey: null,
        phoneNo: req.body.phoneNo,
        address: req.body.address,
        doctorIds: [],
        doctors: [],
        previousDiseases: [],
        symptoms: [],
        reports: [],
        prescribedMedicines: []
    });

    try {
        await newPatient.save();
    } catch (err) {
        console.log(err);
        return next(new HttpError('Something went wrong,Patient not saved', 500));
    }

    res.json({ patient: newPatient.toObject({ getters: true }), token });
}

const login = async(req, res, next) => {

    const email = req.body.email;
    const password = email.concat(req.body.password);

    let patientFound;
    try {
        patientFound = await Patient.findOne({ email: email });
        const token = jwt.sign({
            email: newDoctor.email,
            id: newDoctor._id
        }, 'innoventX123');
    } catch (err) {
        console.log(err);
        return next(new HttpError('Something went wrong', 500));
    }

    if (!patientFound) {
        return next(new HttpError('Patient not found.Please signup!', 500));
    } else {
        const auth = await bcrypt.compare(password, patientFound.password);
        if (!auth) {
            return next(new HttpError('Incorrect password!', 500));
        }
    }

    res.json({ patient: patientFound.toObject({ getters: true }), token });
}

const loginWithToken = async(req, res, next) => {
    const token = req.body.token;

    decodedToken = jwt.verify(token, 'innoventX123');

    let patientFound;
    try {
        patientFound = await Patient.findOne({ email: docodedToken.email });
    } catch (err) {
        console.log(err);
        return next(new HttpError('Something went wrong', 500));
    }

    if (!patientFound) {
        return next(new HttpError('Token not matched.Redirect to login page!', 500));
    }

    res.json({ patient: patientFound.toObject({ getters: true }) });
}

const updateAccessKey = async(req, res, next) => {
    const patientId = req.body.patientId;
    const accessKey = req.body.accessKey;

    let patientFound;
    try {
        patientFound = await Patient.findById(patientId);
    } catch (err) {
        console.log(err);
        return next(new HttpError('Something went wrong', 500));
    }

    if (!patientFound) {
        return next(new HttpError('Patient not found', 500));
    }

    patientFound.accessKey = accessKey;
    try {
        await patientFound.save();
    } catch (err) {
        console.log(err);
        return next(new HttpError('Patient not saved', 500));
    }

    res.json({ patient: patientFound.toObject({ getters: true }) })
}

const getDoctorsNearBy = async(req, res, next) => {

    const patientId = req.params.patientId;

    let patientFound;
    try {
        patientFound = await Patient.findById(patientId);
    } catch (err) {
        console.log(err);
        return next(new HttpError('Something went wrong', 500));
    }

    if (!patientFound) {
        return next(new HttpError('Patient not found', 500));
    }

    let patientCity = patientFound.address;
    let doctorsNearBy;
    try {
        doctorsNearBy = await Doctor.find({ address: patientCity });
    } catch (err) {
        console.log(err);
        return next(new HttpError('Something went wrong', 500));
    }

    if (doctorsNearBy.length === 0) {
        doctorsNearBy = await Doctor.find();
    }

    res.json({ doctors: doctorsNearBy.map(doc => doc.toObject({ getters: true })) });
}

const consultDoctor = async(req, res, next) => {

    const patientId = req.params.patientId;
    const doctorId = req.body.doctorId;

    let patientFound;
    let doctorFound;
    try {
        patientFound = await Patient.findById(patientId);
        doctorFound = await Doctor.findById(doctorId);
    } catch (err) {
        console.log(err);
        return next(new HttpError('Something went wrong', 500));
    }

    if (!doctorFound) {
        return next(new HttpError('Doctor not found', 500));
    }

    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0');
    var yyyy = today.getFullYear();
    today = dd + '/' + mm + '/' + yyyy;

    const doctorObj = {
        name: doctorFound.name,
        active: true,
        startDate: today,
        endDate: ""
    };
    const patientObj = {
        name: patientFound.name,
        active: true,
        startDate: today,
        endDate: ""
    };

    try {
        const sess = await mongoose.startSession();
        sess.startTransaction();

        patientFound.doctorIds.push(doctorFound);
        patientFound.doctors.push(doctorObj);
        doctorFound.patientIds.push(patientFound);
        doctorFound.patients.push(patientObj);

        await patientFound.save({ session: sess });
        await doctorFound.save({ session: sess });

        sess.commitTransaction();
    } catch (err) {
        console.log(err);
        return next(new HttpError('Something went wrong.', 500));
    }

    // Notification of new patient which should be sended to the doctor 
    let notification = {
        'title': 'New Patient Request',
        'text': patientFound.name
    }

    // Tokens of mobile devices
    let fcm_tokens = [doctorFound.accessKey];

    var notification_body = {
        'notification': notification,
        'registration_ids': fcm_tokens
    }

    try {
        await fetch('https://fcm.googleapis.com/fcm/send', {
            "method": 'POST',
            "headers": {
                "Authorization": "key=" + "AAAAKNaJUws:APA91bESAgv4OUtCkTjlc_uQi5q1sPlx0XfBhS7hosvJBbXj-nVVvkT5suq3p4sTernalIZYQiIpDPXKR_AR1fUNqDBRVCbghFEseU2c9xsUUuzCz4w4LjGwTnl-dDUaQcLkq0D3l1vd",
                "Content-Type": "application/json"
            },
            "body": JSON.stringify(notification_body)
        });

        console.log("Notification sended successfully");
    } catch (err) {
        console.log(err);
        return next(new HttpError('Notification was not sended to the doctor.', 500));
    }

    res.json({ doctor: doctorFound.toObject({ getters: true }), patient: patientFound.toObject({ getters: true }) });
}



exports.signup = signup;
exports.login = login;
exports.getDoctorsNearBy = getDoctorsNearBy;
exports.consultDoctor = consultDoctor;
exports.updateAccessKey = updateAccessKey;
exports.loginWithToken = loginWithToken;