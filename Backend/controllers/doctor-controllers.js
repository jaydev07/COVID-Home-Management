const mongoose = require("mongoose");
const fetch = require("node-fetch");
const bcrypt = require("bcrypt");

const HttpError = require("../util/http-error");
const Doctor = require("../models/doctor-model");

const jwt = require('jsonwebtoken');

const signup = async(req, res, next) => {

    console.log(req.body);
    const email = req.body.email;
    let password = req.body.password;
    const salt = await bcrypt.genSalt();
    password = await bcrypt.hash(password, salt);

    let doctorFound;
    try {
        doctorFound = await Doctor.findOne({ email: email });
    } catch (err) {
        console.log(err);
        return next(new HttpError('Something went wrong', 500));
    }

    if (doctorFound) {
        return next(new HttpError('Doctor already exists.Please login', 500));
    }

    const newDoctor = new Doctor({
        name: req.body.name,
        email,
        password,
        accessKey: req.body.accessKey,
        phoneNo: req.body.phoneNo,
        address: req.body.address,
        doctorLicense: req.body.doctorLicense,
        patientIds: [],
        patients: []
    });

    let token;

    try {
        await newDoctor.save();
        token = jwt.sign({
            email: newDoctor.email,
            id: newDoctor._id
        }, 'innoventX123');
    } catch (err) {
        console.log(err);
        return next(new HttpError('Something went wrong,Doctor not saved', 500));
    }

    res.json({ doctor: newDoctor.toObject({ getters: true }), token });
}

const login = async(req, res, next) => {


    console.log(req.body);
    const {email,password,accesskey} = req.body;

    let doctorFound;
    let token;
    try {
        doctorFound = await Doctor.findOne({ email: email });
    } catch (err) {
        console.log(err);
        return next(new HttpError('Something went wrong', 500));
    }

    if (!doctorFound) {
        return next(new HttpError('Doctor not found.Please signup!', 500));
    } else {

        doctorFound.accessKey = accesskey;
        try{
            await doctorFound.save();
        }catch(err){
            console.log(err);
            return next(new HttpError('Something went wrong', 500));
        }

        const auth = await bcrypt.compare(password, doctorFound.password);
        if (!auth) {
            return next(new HttpError('Incorrect password!', 500));
        }
        token = jwt.sign({
            email: doctorFound.email,
            id: doctorFound._id
        }, 'innoventX123');
    }

    res.json({ doctor: doctorFound.toObject({ getters: true }), token });
}

const loginWithToken = async(req, res, next) => {
    const token = req.body.token;

    decodedToken = jwt.verify(token, 'innoventX123');

    let doctorFound;
    try {
        doctorFound = await Doctor.findOne({ email: decodedToken.email });
    } catch (err) {
        console.log(err);
        return next(new HttpError('Something went wrong', 500));
    }

    if (!doctorFound) {
        return next(new HttpError('Token not matched.Redirect to login page!', 500));
    }

    res.json({ doctor: doctorFound.toObject({ getters: true }) });
}


const getPatients = async (req,res,next) => {
    const doctorId = req.params.doctorId;

    let doctorFound;
    try{
        doctorFound = await Doctor.findById(doctorId).populate('patientIds');
    }catch(err){
        console.log(err);
        return next(new HttpError('Something went wrong', 500));
    }

    if(!doctorFound){
        return next(new HttpError('Doctor not found', 500));
    }

    res.json({ 
        patients:doctorFound.patientIds.map(pat => pat.toObject({ getters: true })), 
        patientsInfo:doctorFound.patients.map(pat => pat.toObject({ getters: true }))
    });
}

exports.signup = signup;
exports.login = login;
exports.loginWithToken = loginWithToken;
exports.getPatients = getPatients;