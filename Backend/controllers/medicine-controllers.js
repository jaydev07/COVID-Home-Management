const mongoose = require("mongoose");
const fetch = require("node-fetch");
const jwt = require('jsonwebtoken');

const HttpError = require("../util/http-error");
const Patient = require("../models/patient-model");
const Doctor = require("../models/doctor-model");
const Medicine = require("../models/medicine-model");

const addMedicines = async (req,res,next) => {
    const {doctorId,patientId,medicines} = req.body;

    let doctorFound,patientFound;
    try{
        doctorFound = await Doctor.findById(doctorId);
        patientFound = await Patient.findById(patientId);
    }catch(err){
        console.log(err);
        return next(new HttpError('Something went wrong', 500));
    }

    if(!patientFound){
        return next(new HttpError('Patient not found', 500));
    }

    medicines.forEach(async (medicine,index) => {
        const newMedicine = new Medicine({
            name:medicine.name,
            duration:medicine.duration,
            active: true,
            quantity:medicine.quantity,
            patientId:patientFound,
            doctorId:doctorFound,
            time:medicine.time
        });
        try{
            await newMedicine.save();
            patientFound.prescribedMedicines.push(newMedicine);
        }catch(err){
            console.log(err);
            return next(new HttpError('Medicine not saved', 500));   
        }

        console.log(index);
        if(index == medicines.length-1){
            try{
                await patientFound.save();
            }catch(err){
                console.log(err);
                return next(new HttpError('Medicine not saved in Patient', 500));  
            }   
        }
    });

    res.json({message:"medicine added successfully"});

}

exports.addMedicines = addMedicines;