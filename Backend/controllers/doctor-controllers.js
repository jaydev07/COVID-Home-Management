const mongoose = require("mongoose");
const fetch = require("node-fetch");
const bcrypt = require("bcrypt");

const HttpError = require("../util/http-error");
const Doctor = require("../models/doctor-model");

const signup = async (req,res,next) => {
    
    const email = req.body.email;
    let password = req.body.password;
    password = email.concat(password);

    const salt = await bcrypt.genSalt();
    password = await bcrypt.hash(password , salt);

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
        name:req.body.name,
        email,
        password,
        accessKey:null,
        phoneNo:req.body.phoneNo,
        address:req.body.address,
        doctorLicense:req.body.doctorLicense,
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
    
    const email = req.body.email;
    const password = email.concat(req.body.password);

    let doctorFound;
    try{
        doctorFound = await Doctor.findOne({email:email});
    }catch(err){
        console.log(err);
        return next(new HttpError('Something went wrong',500));
    }

    if(!doctorFound){
        return next(new HttpError('Doctor not found.Please signup!',500));
    }else{
        const auth = await bcrypt.compare(password , doctorFound.password);
        if(!auth){
            return next(new HttpError('Incorrect password!',500));
        }
    }

    res.json({doctor:doctorFound.toObject({getters:true})});
}

const loginWithToken = async (req,res,next) => {
    const token = req.body.token;

    let doctorFound;
    try{
        doctorFound = await Doctor.findOne({password:token}); 
    }catch(err){
        console.log(err);
        return next(new HttpError('Something went wrong',500));
    }

    if(!doctorFound){
        return next(new HttpError('Token not matched.Redirect to login page!',500));
    }

    res.json({doctor:doctorFound.toObject({getters:true})});
}

const updateAccessKey = async (req,res,next) => {
    const doctorId = req.body.doctorId;
    const accessKey = req.body.accessKey;

    let doctorFound;
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
exports.loginWithToken = loginWithToken;
