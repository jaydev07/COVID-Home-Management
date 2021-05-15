const mongoose = require("mongoose");

const uniqueValidator = require('mongoose-unique-validator');

const reportSchema = new mongoose.Schema({
    
    date:{type:String , required:true, unique:true},

    patientId:{ type:mongoose.Types.ObjectId ,required:true, ref:'Patient' },

    patientName:{type:String , required:true },

    doctorId:{ type:mongoose.Types.ObjectId ,required:true, ref:'Doctor' },

    doctorName:{ type:String , required:true },

    morning:[{
        medicineName:{type:String},
        quantity:{type:Number}
    }],

    afternoon:[{
        medicineName:{type:String},
        quantity:{type:Number}
    }],

    evening:[{
        medicineName:{type:String},
        quantity:{type:Number}
    }],

    oxygenLevel:[{
        level:{type:Number},
        time:{type:String}
    }],

    pulseLevel:[{
        level:{type:Number},
        time:{type:String}
    }]

});

reportSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Report',reportSchema);