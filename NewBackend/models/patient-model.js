const mongoose = require("mongoose");

const uniqueValidator = require('mongoose-unique-validator');

const patientSchema = new mongoose.Schema({
    
    name:{type:String , required:true},

    email:{type:String , required:true , unique:true},

    password:{type:String , required:true},

    phoneNo:{type:Number , required:true , unique:true},

    city:{ type:String , required:true },

    state:{ type:String , required:true },

    gender:{ type:String , required:true },

    age:{ type:Number , required:true },

    accessKey: {type:String},

    doctorIds:[{ type:mongoose.Types.ObjectId ,required:true, ref:'Doctor' }],

    doctors:[{
        name:{type:String },
        active:{type:Boolean },
        startDate:{type:String },
        endDate:{type:String }
    }],

    // currentMedicines:[{
    //     medicine:{type:String},
    //     startDate:{type:String }
    // }],

    symptoms:[{type:String}],

    chronicDisease:[{
        name:{type:string},
        since:{type:string}
    }],

    remarksForDoctor:{type:string},

    remarksFromDoctor:{type:string},

    reports:[{ type:mongoose.Types.ObjectId ,required:true, ref:'Report' }],

    prescribedMedicines:[{ type:mongoose.Types.ObjectId ,required:true, ref:'Medicine' }]

});

patientSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Patient',patientSchema);