const mongoose = require("mongoose");

const medicineSchema = new mongoose.Schema({

    name: { type: String, required: true },

    startDate: { type: String, required: true },

    endDate: { type: String, required: true },

    duration: { type: Number, required: true },

    active: { type: Boolean, required: true },

    patientId: { type: mongoose.Types.ObjectId, required: true, ref: 'Patient' },

    doctorId: { type: mongoose.Types.ObjectId, required: true, ref: 'Doctor' },

    time: {
        morning: { type: Number },
        afternoon: { type: Number },
        evening: { type: Number }
    }

});


module.exports = mongoose.model('Medicine', medicineSchema);