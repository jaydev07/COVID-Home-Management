const mongoose = require("mongoose");

const medicineSchema = new mongoose.Schema({

    name:{ type:String , required:true },

    givenFor:{ type:String , required:true },

    duration:{type:Number , required:true},

    active:{type:Boolean , required:true},

    quantity:{ type:Number , required:true },

    patientId:{type:mongoose.Types.ObjectId , required:true , ref:'Patient'},

    doctorId:{type:mongoose.Types.ObjectId , required:true , ref:'Doctor'},

    time:{
        morningBeforeB:{type:Boolean , required:true},
        morningAfterB:{type:Boolean , required:true},
        afternoonBeforeL:{type:Boolean , required:true},
        afternoonAfterL:{type:Boolean , required:true},
        eveningBeforeD:{type:Boolean , required:true},
        eveningAfterD:{type:Boolean , required:true},
    }
});


module.exports = mongoose.model('Medicine',medicineSchema);