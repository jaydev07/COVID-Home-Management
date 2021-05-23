const mongoose = require("mongoose");
const fetch = require("node-fetch");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');

const HttpError = require("../util/http-error");
const Patient = require("../models/patient-model");
const Doctor = require("../models/doctor-model");
const Report = require("../models/report-model");

//////////////////////////////////////////////////////////// GET /////////////////////////////////////////////////////////////////////////

const getAllDoctors = async (req,res,next) => {
    let doctors;
    try{
        doctors = await Doctor.find();
    }catch (err) {
        console.log(err);
        return next(new HttpError('Something went wrong', 500));
    }
    res.json({doctors});
}

const getDoctorsNearBy = async(req, res, next) => {

    const patientId = req.body.patientId;

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

const patientDailyRender = async (req,res,next) => {

    const patientId = req.params.patientId;

    let patientFound;
    try{
        patientFound = await Patient.findById(patientId);
    }catch(err){
        console.log(err);
        return next(new HttpError('Something went wrong', 500));
    }
    if(!patientFound){
        return next(new HttpError('Patient not found', 500));
    }

    const date = new Date().toJSON().slice(0,10);
    let todayReport;
    try{
        todayReport = await Report.findOne({date:date , patientId:patientFound.id});
    }catch(err){
        console.log(err);
        return next(new HttpError('Something went wrong', 500));
    }

    let oxygen,pulse,temperature;
    if(todayReport){
        oxygen=todayReport.oxygen;
        pulse=todayReport.pulse;
        temperature = todayReport.temperature;
    }else{
        oxygen=[];
        pulse=[];
        temperature = [];
    }

    res.json({
        info:{
            symptoms:patientFound.symptoms,
            prescribedMedicines:patientFound.prescribedMedicines,
            date:todayReport.date,
            oxygen,
            pulse,
            temperature
        }
    });

}

////////////////////////////////////////////////////////////// POST ///////////////////////////////////////////////////////////////////////

const signup = async(req, res, next) => {

    console.log(req.body);
    const email = req.body.email;
    let password = req.body.password;

    const salt = await bcrypt.genSalt();
    password = await bcrypt.hash(password, salt);

    let patientFound;
    try {
        patientFound = await Patient.findOne({ email: email });
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
        accessKey: req.body.accessKey,
        phoneNo: req.body.phoneNo,
        address: req.body.address,
        age:null,
        doctorIds: [],
        doctors: [],
        previousDiseases: [],
        symptoms: null,
        reports: [],
        prescribedMedicines: []
    });

    let token;
    try {
        await newPatient.save();
        token = jwt.sign({
            email: newPatient.email,
            id: newPatient._id
        }, 'innoventX123');
    } catch (err) {
        console.log(err);
        return next(new HttpError('Something went wrong,Patient not saved', 500));
    }

    res.json({
        patient:{
            id:newPatient.id,
            name:newPatient.name, 
            email:newPatient.email, 
            phoneNo:newPatient.phoneNo, 
            address:newPatient.address,
            token
        }  
    });
}

const login = async(req, res, next) => {

    console.log(req.body);
    const {email,password,accesskey} = req.body;

    let patientFound;
    try {
        patientFound = await Patient.findOne({ email: email }).populate('doctorIds');
    } catch (err) {
        console.log(err);
        return next(new HttpError('Something went wrong', 500));
    }

    if (!patientFound) {
        return next(new HttpError('Patient not found.Please signup!', 500));
    } else {

        patientFound.accessKey = accesskey;
        try{
            await patientFound.save();
        }catch(err){
            console.log(err);
            return next(new HttpError('Something went wrong', 500));
        }

        const auth = await bcrypt.compare(password, patientFound.password);
        if (!auth) {
            return next(new HttpError('Incorrect password!', 500));
        }
    }
    // * created token for jwt
    let token = jwt.sign({
        email: patientFound.email,
        id: patientFound._id
    }, 'innoventX123');

    const date = new Date().toJSON().slice(0,10);
    let todayReport;
    try{
        todayReport = await Report.findOne({date:date , patientId:patientFound.id});
    }catch(err){
        console.log(err);
        return next(new HttpError('Something went wrong', 500));
    }

    let oxygen,pulse,temperature;
    if(todayReport){
        oxygen=todayReport.oxygen;
        pulse=todayReport.pulse;
        temperature = todayReport.temperature;
    }else{
        oxygen=[];
        pulse=[];
        temperature = [];
    }

    let doctors=[];
    if(patientFound.doctorIds.length !== 0){
        patientFound.doctorIds.forEach((doctor,index) => {
            let doctorFound = {
                id:doctor.id,
                name:doctor.name,
                address:doctor.address,
                phoneNo:doctor.phoneNo,
                active:patientFound.doctors[index].active
            }
            doctors.push(doctorFound);

            if(index === patientFound.doctorIds.length - 1){
                res.json({ 
                    patient: {
                        id:patientFound.id,
                        name:patientFound.name, 
                        email:patientFound.email, 
                        phoneNo:patientFound.phoneNo, 
                        address:patientFound.address, 
                        doctors:doctors,
                        token,
                        symptoms:patientFound.symptoms,
                        prescribedMedicines:patientFound.prescribedMedicines,
                        date:todayReport.date,
                        oxygen,
                        pulse,
                        temperature
                    } 
                });
            }
        });
    }else{
        res.json({ 
            patient: {
                id:patientFound.id,
                name:patientFound.name, 
                email:patientFound.email, 
                phoneNo:patientFound.phoneNo, 
                address:patientFound.address, 
                doctors:doctors,
                token,
                symptoms:patientFound.symptoms,
                prescribedMedicines:patientFound.prescribedMedicines,
                date:todayReport.date,
                oxygen,
                pulse,
                temperature
            } 
        });
    }
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

const consultDoctor = async(req, res, next) => {

    const patientId = req.body.patientId;
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

    doctorFound.patientIds.push(patientFound);
    doctorFound.patients.push({
        consulted: false,
        active: false,
        startDate: today,
        endDate: null
    });
    try {
        await doctorFound.save();
    } catch (err) {
        console.log(err);
        return next(new HttpError('Data not saved in doctor', 500));
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

const addSymptomDetails = async (req,res,next) => {
    const patientId = req.params.patientId;
    const {symptoms, currentMedicines, age} = req.body;

    let patientFound;
    try{
        patientFound = await Patient.findById(patientId).populate('doctorIds');
    }catch(err){
        console.log(err);
        return next(new HttpError('Something went wrong.', 500));   
    }

    patientFound.symptoms = symptoms;
    patientFound.currentMedicines = currentMedicines;
    patientFound.age = age;
    try{
        patientFound.save();
    }catch(err){
        console.log(err);
        return next(new HttpError('Patient data not saved.', 500));   
    }

    res.json({patient: patientFound.toObject({ getters: true })});
}

const getPatientData = async (req,res,next) => {

    const patientId = req.params.patientId;

    let patientFound;
    try{
        patientFound = await Patient.findById(patientId).populate('reports').populate("prescribedMedicines");
    }catch(err){
        console.log(err);
        return next(new HttpError('Something went wrong.', 500));
    }
    if(!patientFound){
        return next(new HttpError('Patient not found', 500));
    }

    res.json({ patient:patientFound.toObject({ getters: true})});
}

exports.signup = signup;
exports.login = login;
exports.getDoctorsNearBy = getDoctorsNearBy;
exports.consultDoctor = consultDoctor;
exports.loginWithToken = loginWithToken;
exports.addSymptomDetails = addSymptomDetails;
exports.patientDailyRender = patientDailyRender;
exports.getPatientData = getPatientData;
exports.getAllDoctors = getAllDoctors;