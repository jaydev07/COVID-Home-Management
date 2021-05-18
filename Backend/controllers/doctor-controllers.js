const HttpError = require("../util/http-error");
const Doctor = require("../models/doctor-model");

const signup = async (req,res,next) => {
    
    const {name, email, password,accessKey, phoneNo, address, doctorLicense} = req.body;

    let doctorFound;
    try{
        doctorFound = await Doctor.findOne({email:email});
    }catch(err){
        console.log(err);
        return next(new HttpError('Something went wrong',500));
    }

    if(doctorFound){
        return next(new HttpError('Doctor already exists.Please login',500));
    }

    const newDoctor = new Doctor({
        name,
        email,
        password,
        accessKey,
        phoneNo,
        address,
        doctorLicense,
        patientIds:[],
        patients:[]
    });

    try{
        await newDoctor.save();
    }catch(err){
        console.log(err);
        return next(new HttpError('Something went wrong,Doctor not saved',500));
    }

    res.json({doctor:newDoctor.toObject({getters:true})});
}

const login = async (req,res,next) => {
    
    const {email,password} = req.body;

    let doctorFound;
    try{
        doctorFound = await Doctor.findOne({email:email});
    }catch(err){
        console.log(err);
        return next(new HttpError('Something went wrong',500));
    }

    if(!doctorFound){
        return next(new HttpError('Doctor not found.Please signup!',500));
    }else if(doctorFound.password !== password){
        return next(new HttpError('Incorrect password!',500));
    }

    res.json({doctor:doctorFound.toObject({getters:true})});
}

const updateAccessKey = async (req,res,next) => {
    const doctorId = req.body.patientId;
    const accessKey = req.body.accessKey;

    let  doctorFound;
    try{
        doctorFound = await Doctor.findById(doctorId);
    }catch(err){
        console.log(err);
        return next(new HttpError('Something went wrong',500));
    }

    if(!doctorFound){
        return next(new HttpError('Doctor not found',500));
    }

    doctorFound.accessKey = accessKey;
    try{
        await doctorFound.save();
    }catch(err){
        console.log(err);
        return next(new HttpError('Doctor not saved',500));
    }

    res.json({doctor:doctorFound.toObject({getters:true})})
}

exports.signup = signup;
exports.login = login;
exports.updateAccessKey = updateAccessKey;
