const mongoose = require("mongoose");
const fetch = require("node-fetch");
const bcrypt = require("bcrypt");

const HttpError = require("../util/http-error");
const Patient = require("../models/patient-model");
const Doctor = require("../models/doctor-model");
const Report = require("../models/report-model");
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
        designation: req.body.designation,
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

const pushDataInPatients = (patients, insertPatient) => {

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

    var patients=[];
    for(let index=0 ; index<doctorFound.patientIds.length ; index++){
        if(doctorFound.patients[index].consulted){
            if(doctorFound.patients[index].active){
                let patientReports;
                try{
                    patientReports = await Patient.findById(doctorFound.patientIds[index].id).populate('reports').populate('prescribedMedicines');
                }catch(err){
                    console.log(err);
                    return next(new HttpError('Something went wrong', 500));
                }
                patients.push({
                    id:patientReports.id,
                    name:patientReports.name,
                    email:patientReports.email,
                    phoneNo:patientReports.phoneNo,
                    address:patientReports.address,
                    age:patientReports.age,
                    active:true,
                    currentMedicines:patientReports.currentMedicines,
                    symptoms:patientReports.symptoms,
                    reports:patientReports.reports,
                    prescribedMedicines:patientReports.prescribedMedicines,
                    startDate:doctorFound.patients[index].startDate
                });
            }
            else{
                patients.push({
                    id:doctorFound.patientIds[index].id,
                    name:doctorFound.patientIds[index].name,
                    email:doctorFound.patientIds[index].email,
                    phoneNo:doctorFound.patientIds[index].phoneNo,
                    address:doctorFound.patientIds[index].address,
                    active:false,
                    startDate:doctorFound.patients[index].startDate
                });
            }
            if(index === doctorFound.patientIds.length - 1){
                res.json({patients});
            }
        }
    }
}

const getNonConsultedPatients = async (req,res,next) => {
    
    const doctorId = req.params.doctorId;

    let doctorFound;
    try{
        doctorFound = await Doctor.findById(doctorId).populate('patientIds');
    }catch(err){
        console.log(err);
        return next(new HttpError('Something went wrong', 500));
    }
    if(!doctorFound){
        return next(new HttpError('Doctor not found!', 500));
    }
    
    let patients=[];
    doctorFound.patientIds.forEach((patient,index) => {
        if(!doctorFound.patients[index].consulted){
            patients.push({
                id:patient.id,
                name:patient.name,
                address:patient.address,
                phoneNo:patient.phoneNo,
                startDate:doctorFound.patients[index].startDate  
            });
        }
    });

    res.json({patients});
}

const confirmPatient = async (req,res,next) => {
    const doctorId = req.params.doctorId;
    const patientId = req.body.patientId;

    let doctorFound, patientFound;
    try{
        patientFound = await Patient.findById(patientId);
        doctorFound = await Doctor.findById(doctorId).populate('patientIds');
    }catch(err){
        console.log(err);
        return next(new HttpError('Something went wrong', 500));
    }
    if(!patientFound){
        return next(new HttpError('Patient not found!', 500));
    }

    let today = new Date();
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0');
    let yyyy = today.getFullYear();
    today = dd + '/' + mm + '/' + yyyy;

    const index = doctorFound.patientIds.findIndex(patient => patient.id===patientId);
    doctorFound.patients[index].consulted = true;
    doctorFound.patients[index].active = true;
    patientFound.doctorIds.push(doctorFound);
    patientFound.doctors.forEach(doctor => {
        doctor.active = false;
        if(!doctor.endDate){
            doctor.endDate = today;
        }
    });
    patientFound.doctors.push({
        name:doctorFound.name,
        active:true,
        startDate:today,
        endDate:null
    });

    try{
        const sess = await mongoose.startSession();
        sess.startTransaction();

        await doctorFound.save({ session: sess});
        await patientFound.save({ session: sess});

        sess.commitTransaction();
    }catch(err){
        console.log(err);
        return next(new HttpError('Data not saved in patient & doctor!', 500));
    }

    let notification = {
        'title': `${doctorFound.name} is ready to consult you.`,
        'text': "Good News!!"
    }

    // Tokens of mobile devices
    let fcm_tokens = [patientFound.accessKey];

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

        console.log("Notification sended successfully to patient");
    } catch (err) {
        console.log(err);
        return next(new HttpError('Notification was not sended to patient!', 500));
    }

    res.json({ doctor: doctorFound.toObject({ getters: true }), patient: patientFound.toObject({ getters: true }) });
}

const rejectPatient = async ( req,res,next) => {
    const doctorId = req.params.doctorId;
    const patientId = req.body.patientId;

    let doctorFound, patientFound;
    try{
        patientFound = await Patient.findById(patientId);
        doctorFound = await Doctor.findById(doctorId).populate('patientIds');
    }catch(err){
        console.log(err);
        return next(new HttpError('Something went wrong', 500));
    }

    const index = doctorFound.patientIds.findIndex(patient => patient.id===patientId);
    doctorFound.patients.splice(index,1);
    doctorFound.patientIds.pull(patientFound);
 
    try{
        await doctorFound.save();
    }catch(err){
        console.log(err);
        return next(new HttpError('Something went wrong', 500));
    }

    let notification = {
        'title': `${doctorFound.name} has not consulted you.`,
        'text': "Please consult new doctor!"
    }
    let fcm_tokens = [patientFound.accessKey];

    let notification_body = {
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

        console.log("Notification sended successfully to patient");
    } catch (err) {
        console.log(err);
        return next(new HttpError('Notification was not sended to patient!', 500));
    }    

    res.json({doctor: doctorFound.toObject({ getters: true })});
}

const medicationEnded = async ( req,res,next) => {
    const doctorId = req.params.doctorId;
    const patientId = req.body.patientId;

    let doctorFound, patientFound;
    try{
        patientFound = await Patient.findById(patientId).populate("doctorIds");
        doctorFound = await Doctor.findById(doctorId).populate('patientIds');
    }catch(err){
        console.log(err);
        return next(new HttpError('Something went wrong', 500));
    }
    if(!patientFound){
        return next(new HttpError('Patient not found!', 500));
    }

    let today = new Date();
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0');
    let yyyy = today.getFullYear();
    today = dd + '/' + mm + '/' + yyyy;

    const patientIndex = doctorFound.patientIds.findIndex(patient => patient.id===patientId);
    doctorFound.patients[patientIndex].active = false;
    if(!doctorFound.patients[patientIndex].endDate){
        doctorFound.patients[patientIndex].endDate = today;
    }
    const doctorIndex = patientFound.doctorIds.findIndex(doctor => doctor.id===doctorId);
    patientFound.doctors[doctorIndex].active = false;
    if(!patientFound.doctors[doctorIndex].endDate){
        patientFound.doctors[doctorIndex].endDate = today;
    }

    try{
        const sess = await mongoose.startSession();
        sess.startTransaction();

        await doctorFound.save({ session: sess});
        await patientFound.save({ session: sess});

        sess.commitTransaction();
    }catch(err){
        console.log(err);
        return next(new HttpError('Data not saved in patient & doctor!', 500));
    }

    let notification = {
        'title': `${doctorFound.name} has ended your medication.`,
        'text': "You are fine now."
    }

    // Tokens of mobile devices
    let fcm_tokens = [patientFound.accessKey];

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

        console.log("Notification sended successfully to patient");
    } catch (err) {
        console.log(err);
        return next(new HttpError('Notification was not sended to patient!', 500));
    }

    res.json({ doctor: doctorFound.toObject({ getters: true }), patient: patientFound.toObject({ getters: true }) });

}

exports.signup = signup;
exports.login = login;
exports.loginWithToken = loginWithToken;
exports.getPatients = getPatients;
exports.getNonConsultedPatients = getNonConsultedPatients;
exports.confirmPatient = confirmPatient;
exports.rejectPatient = rejectPatient;
exports.medicationEnded = medicationEnded;