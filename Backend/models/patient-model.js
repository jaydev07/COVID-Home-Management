const mongoose = require("mongoose");

const uniqueValidator = require('mongoose-unique-validator');

const patientSchema = new mongoose.Schema({
    
    name:{type:String , required:true},

    email:{type:String , required:true , unique:true},

    password:{type:String , required:true},

    accessKey:{type:String},

    phoneNo:{type:Number , required:true , unique:true},

    address:{ type:String , required:true },

    doctorIds:[{ type:mongoose.Types.ObjectId ,required:true, ref:'Doctor' }],

    doctors:[{
        name:{type:String },
        active:{type:Boolean },
        startDate:{type:String },
        endDate:{type:String }
    }],

    previousDiseases:[{type:String}],

    symptoms:[{type:String}],

    reports:[{ type:mongoose.Types.ObjectId ,required:true, ref:'Report' }],

    prescribedMedicines:[{ type:mongoose.Types.ObjectId ,required:true, ref:'Medicine' }]

});

patientSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Patient',patientSchema);