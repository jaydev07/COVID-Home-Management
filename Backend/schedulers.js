const schedule = require("node-schedule");

const HttpError = require("../util/http-error");
const Patient = require("./models/patient-model");
const Doctor = require("./models/doctor-model");


schedule.scheduleJob('* * * * * */1' , () => {
    var morningBeforeB = new Date().toJSON().slice(0,10) + 'T09:00:00';
    var morningAfterB = new Date().toJSON().slice(0,10) + 'T10:00:00';
    var afternoonBeforeL = new Date().toJSON().slice(0,10) + 'T12:00:00';
    var afternoonAfterL = new Date().toJSON().slice(0,10) + 'T13:00:00';
    var eveningBeforeD = new Date().toJSON().slice(0,10) + 'T20:00:00';
    var eveningAfterD = new Date().toJSON().slice(0,10) + 'T21:00:00';

    schedule.scheduleJob(morningBeforeB,async () => {
        console.log(morningBeforeB);
        let patients;
        try{
            patients = await Patient.find().populate('prescribedMedicines');
        }catch(err){
            console.log(err);
            return next(new HttpError('Something went wrong',500));
        }

        patients.forEach(patient => {
            if(patient.prescribedMedicines.length > 0){
                patient.prescribedMedicines.forEach(medicine => {
                    if(medicine.time.morningBeforeB){
                        // Notification of new patient which should be sended to the doctor 
                        let notification = {
                            'title':'Did you take your before breakfast medicine',
                            'text':medicine.name
                        }

                        // Tokens of mobile devices
                        let fcm_tokens = [doctorFound.accessKey];

                        var notification_body = {
                            'notification':notification,
                            'registration_ids':fcm_tokens
                        }

                        try{
                            await fetch('https://fcm.googleapis.com/fcm/send',{
                                "method": 'POST',
                                "headers":{
                                    "Authorization":"key=" + "",
                                    "Content-Type": "application/json"
                                },
                                "body":JSON.stringify(notification_body)
                            });

                            console.log("Notification sended successfully");
                        }catch(err){
                            console.log(err);
                            return next(new HttpError('Notification was not sended to the doctor.',500));
                        }
                    }
                })
            }
        })

    });
    schedule.scheduleJob(date2,() => {
        console.log(date2);
    });
    schedule.scheduleJob(date3,() => {
        console.log(date3);
    });
})

