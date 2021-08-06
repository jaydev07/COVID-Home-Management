const mongoose = require("mongoose");
const fetch = require("node-fetch");
const jwt = require('jsonwebtoken');
const { validationResult } = require("express-validator");

const HttpError = require("../util/http-error");
const Patient = require("../models/patient-model");
const Doctor = require("../models/doctor-model");
const Medicine = require("../models/medicine-model");

/////////////////////////////////////////////////////////////// POST Requests ////////////////////////////////////////////////////////////

// To prescribe the medicines to a perticular patient
const addMedicines = async(req, res, next) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
        console.log(error);
        return next(new HttpError('Invalid input.Please Check!', 422));
    }

    const { doctorId, patientId, medicines } = req.body;

    let doctorFound, patientFound;
    try {
        doctorFound = await Doctor.findById(doctorId);
        patientFound = await Patient.findById(patientId).populate("prescribedMedicines");
    } catch (err) {
        console.log(err);
        return next(new HttpError('Something went wrong', 500));
    }

    if (!patientFound) {
        return next(new HttpError('Patient not found', 500));
    }

    const d = new Date();
    let dd = String(d.getDate()).padStart(2, '0');
    let mm = String(d.getMonth() + 1).padStart(2, '0');
    let yyyy = d.getFullYear();
    let date = dd + '-' + mm + '-' + yyyy;
    let endDay;
    let endMonth;
    let endYear;
 
    patientFound.prescribedMedicines.forEach(async (medicine) => {
        let medicineExists=medicines.findIndex(med => med.name=medicine.name);
        if(medicineExists==-1){
            medicine.active=false;
            medicine.endDate=date;
            try{
                await medicine.save();
            }catch(err){
                console.log(err);
                return next(new HttpError('Error in deactivating the medicine', 500));   
            }
        }
    })

    medicines.forEach(async(medicine, index) => {

        let medicineExists;
        try{
            medicineExists = await Medicine.findOne({name:medicine.name, patientId:patientFound, doctorId:doctorFound});
        }catch(err){
            console.log(err);
            return next(new HttpError('Error in finding the medicine', 500));
        }

        if(medicineExists){
            endDay=Number(medicineExists.startDate.split('-')[0])+Number(duration);
            endMonth=Number(mm);
            endYear=Number(yyyy);
            if(endDay>30){
                endDay-=30;
                endMonth+=1;
            }
            if(endMonth>12){
                endMonth-=12;
                endYear+=1;
            }
            endDate= String(endDay)+'-'+String(endMonth)+'-'+String(endYear);

            medicineExists.duration=medicine.duration;
            medicineExists.endDate=endDate;
            medicineExists.active=true;
            medicineExists.time=medicine.time;

            try{
                await medicineExists.save();
            }catch(err){
                console.log(err);
                return next(new HttpError('Existing medicine not saved', 500));
            }
        }
        else{
            endDay=Number(dd)+Number(duration);
            endMonth=Number(mm);
            endYear=Number(yyyy);
            if(endDay>30){
                endDay-=30;
                endMonth+=1;
            }
            if(endMonth>12){
                endMonth-=12;
                endYear+=1;
            }
            endDate= String(endDay)+'-'+String(endMonth)+'-'+String(endYear);

            const newMedicine = new Medicine({
                name: medicine.name,
                startDate: date,
                endDate:endDate,
                duration: medicine.duration,
                active: true,
                patientId: patientFound,
                doctorId: doctorFound,
                time: medicine.time
            });
            try {
                await newMedicine.save();
                patientFound.prescribedMedicines.push(newMedicine);
            } catch (err) {
                console.log(err);
                return next(new HttpError('Medicine not saved', 500));
            }
        }

        if (index == medicines.length - 1) {
            try {
                await patientFound.save();
            } catch (err) {
                console.log(err);
                return next(new HttpError('Medicine not saved in Patient', 500));
            }
        }
    });

    res.json({ message: "medicine added successfully" });

}

exports.addMedicines = addMedicines;