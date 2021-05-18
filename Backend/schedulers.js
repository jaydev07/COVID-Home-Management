const schedule = require("node-schedule");

const HttpError = require("./util/http-error");
const Patient = require("./models/patient-model");
const Doctor = require("./models/doctor-model");

schedule.scheduleJob('* * * * * */1' ,() => {
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

        patients.forEach(async (patient) => {
            if(patient.prescribedMedicines.length > 0){
                let medicines = [];
                patient.prescribedMedicines.forEach(medicine => {
                    if(medicine.time.morningBeforeB){
                        medicines.push(medicine.name);
                    }
                });

                // Medicines notification which should be sended to the patient
                let notification = {
                    'title':`${patient.name} please take this medicines before breakfast.`,
                    'text':medicines
                }

                // Tokens of mobile devices
                let fcm_tokens = [patient.accessKey];

                var notification_body = {
                    'notification':notification,
                    'registration_ids':fcm_tokens
                }

                try{
                    await fetch('https://fcm.googleapis.com/fcm/send',{
                        "method": 'POST',
                        "headers":{
                            "Authorization":"key=" + "AAAAKNaJUws:APA91bESAgv4OUtCkTjlc_uQi5q1sPlx0XfBhS7hosvJBbXj-nVVvkT5suq3p4sTernalIZYQiIpDPXKR_AR1fUNqDBRVCbghFEseU2c9xsUUuzCz4w4LjGwTnl-dDUaQcLkq0D3l1vd",
                            "Content-Type": "application/json"
                        },
                        "body":JSON.stringify(notification_body)
                    });

                    console.log(`Medicine Notification sended successfully to ${patient.name}`);
                }catch(err){
                    console.log(err);
                    return next(new HttpError('Notification was not sended to the doctor.',500));
                }
            }
        });
    });

    schedule.scheduleJob(morningAfterB,async () => {
        console.log(morningAfterB);
        let patients;
        try{
            patients = await Patient.find().populate('prescribedMedicines');
        }catch(err){
            console.log(err);
            return next(new HttpError('Something went wrong',500));
        }

        patients.forEach(async (patient) => {
            if(patient.prescribedMedicines.length > 0){
                let medicines = [];
                patient.prescribedMedicines.forEach(medicine => {
                    if(medicine.time.morningAfterB){
                        medicines.push(medicine.name);
                    }
                });

                // Medicines notification which should be sended to the patient
                let notification = {
                    'title':`${patient.name} please take this medicines after breakfast.`,
                    'text':medicines
                }

                // Tokens of mobile devices
                let fcm_tokens = [patient.accessKey];

                var notification_body = {
                    'notification':notification,
                    'registration_ids':fcm_tokens
                }

                try{
                    await fetch('https://fcm.googleapis.com/fcm/send',{
                        "method": 'POST',
                        "headers":{
                            "Authorization":"key=" + "AAAAKNaJUws:APA91bESAgv4OUtCkTjlc_uQi5q1sPlx0XfBhS7hosvJBbXj-nVVvkT5suq3p4sTernalIZYQiIpDPXKR_AR1fUNqDBRVCbghFEseU2c9xsUUuzCz4w4LjGwTnl-dDUaQcLkq0D3l1vd",
                            "Content-Type": "application/json"
                        },
                        "body":JSON.stringify(notification_body)
                    });

                    console.log(`Medicine Notification sended successfully to ${patient.name}`);
                }catch(err){
                    console.log(err);
                    return next(new HttpError('Notification was not sended to the doctor.',500));
                }
            }
        });
    });

    schedule.scheduleJob(afternoonBeforeL,async () => {
        console.log(afternoonBeforeL);
        let patients;
        try{
            patients = await Patient.find().populate('prescribedMedicines');
        }catch(err){
            console.log(err);
            return next(new HttpError('Something went wrong',500));
        }

        patients.forEach(async (patient) => {
            if(patient.prescribedMedicines.length > 0){
                let medicines = [];
                patient.prescribedMedicines.forEach(medicine => {
                    if(medicine.time.afternoonBeforeL){
                        medicines.push(medicine.name);
                    }
                });

                // Medicines notification which should be sended to the patient
                let notification = {
                    'title':`${patient.name} please take this medicines before lunch.`,
                    'text':medicines
                }

                // Tokens of mobile devices
                let fcm_tokens = [patient.accessKey];

                var notification_body = {
                    'notification':notification,
                    'registration_ids':fcm_tokens
                }

                try{
                    await fetch('https://fcm.googleapis.com/fcm/send',{
                        "method": 'POST',
                        "headers":{
                            "Authorization":"key=" + "AAAAKNaJUws:APA91bESAgv4OUtCkTjlc_uQi5q1sPlx0XfBhS7hosvJBbXj-nVVvkT5suq3p4sTernalIZYQiIpDPXKR_AR1fUNqDBRVCbghFEseU2c9xsUUuzCz4w4LjGwTnl-dDUaQcLkq0D3l1vd",
                            "Content-Type": "application/json"
                        },
                        "body":JSON.stringify(notification_body)
                    });

                    console.log(`Medicine Notification sended successfully to ${patient.name}`);
                }catch(err){
                    console.log(err);
                    return next(new HttpError('Notification was not sended to the doctor.',500));
                }
            }
        });
    });

    schedule.scheduleJob(afternoonAfterL,async () => {
        console.log(afternoonAfterL);
        let patients;
        try{
            patients = await Patient.find().populate('prescribedMedicines');
        }catch(err){
            console.log(err);
            return next(new HttpError('Something went wrong',500));
        }

        patients.forEach(async (patient) => {
            if(patient.prescribedMedicines.length > 0){
                let medicines = [];
                patient.prescribedMedicines.forEach(medicine => {
                    if(medicine.time.afternoonAfterL){
                        medicines.push(medicine.name);
                    }
                });

                // Medicines notification which should be sended to the patient
                let notification = {
                    'title':`${patient.name} please take this medicines after lunch.`,
                    'text':medicines
                }

                // Tokens of mobile devices
                let fcm_tokens = [patient.accessKey];

                var notification_body = {
                    'notification':notification,
                    'registration_ids':fcm_tokens
                }

                try{
                    await fetch('https://fcm.googleapis.com/fcm/send',{
                        "method": 'POST',
                        "headers":{
                            "Authorization":"key=" + "AAAAKNaJUws:APA91bESAgv4OUtCkTjlc_uQi5q1sPlx0XfBhS7hosvJBbXj-nVVvkT5suq3p4sTernalIZYQiIpDPXKR_AR1fUNqDBRVCbghFEseU2c9xsUUuzCz4w4LjGwTnl-dDUaQcLkq0D3l1vd",
                            "Content-Type": "application/json"
                        },
                        "body":JSON.stringify(notification_body)
                    });

                    console.log(`Medicine Notification sended successfully to ${patient.name}`);
                }catch(err){
                    console.log(err);
                    return next(new HttpError('Notification was not sended to the doctor.',500));
                }
            }
        });
    });

    schedule.scheduleJob(eveningBeforeD,async () => {
        console.log(eveningBeforeD);
        let patients;
        try{
            patients = await Patient.find().populate('prescribedMedicines');
        }catch(err){
            console.log(err);
            return next(new HttpError('Something went wrong',500));
        }

        patients.forEach(async (patient) => {
            if(patient.prescribedMedicines.length > 0){
                let medicines = [];
                patient.prescribedMedicines.forEach(medicine => {
                    if(medicine.time.eveningBeforeD){
                        medicines.push(medicine.name);
                    }
                });

                // Medicines notification which should be sended to the patient
                let notification = {
                    'title':`${patient.name} please take this medicines before dinner.`,
                    'text':medicines
                }

                // Tokens of mobile devices
                let fcm_tokens = [patient.accessKey];

                var notification_body = {
                    'notification':notification,
                    'registration_ids':fcm_tokens
                }

                try{
                    await fetch('https://fcm.googleapis.com/fcm/send',{
                        "method": 'POST',
                        "headers":{
                            "Authorization":"key=" + "AAAAKNaJUws:APA91bESAgv4OUtCkTjlc_uQi5q1sPlx0XfBhS7hosvJBbXj-nVVvkT5suq3p4sTernalIZYQiIpDPXKR_AR1fUNqDBRVCbghFEseU2c9xsUUuzCz4w4LjGwTnl-dDUaQcLkq0D3l1vd",
                            "Content-Type": "application/json"
                        },
                        "body":JSON.stringify(notification_body)
                    });

                    console.log(`Medicine Notification sended successfully to ${patient.name}`);
                }catch(err){
                    console.log(err);
                    return next(new HttpError('Notification was not sended to the doctor.',500));
                }
            }
        });
    });

    schedule.scheduleJob(eveningAfterD,async () => {
        console.log(eveningAfterD);
        let patients;
        try{
            patients = await Patient.find().populate('prescribedMedicines');
        }catch(err){
            console.log(err);
            return next(new HttpError('Something went wrong',500));
        }

        patients.forEach(async (patient) => {
            if(patient.prescribedMedicines.length > 0){
                let medicines = [];
                patient.prescribedMedicines.forEach(medicine => {
                    if(medicine.time.eveningAfterD){
                        medicines.push(medicine.name);
                    }
                });

                // Medicines notification which should be sended to the patient
                let notification = {
                    'title':`${patient.name} please take this medicines after dinner.`,
                    'text':medicines
                }

                // Tokens of mobile devices
                let fcm_tokens = [patient.accessKey];

                var notification_body = {
                    'notification':notification,
                    'registration_ids':fcm_tokens
                }

                try{
                    await fetch('https://fcm.googleapis.com/fcm/send',{
                        "method": 'POST',
                        "headers":{
                            "Authorization":"key=" + "AAAAKNaJUws:APA91bESAgv4OUtCkTjlc_uQi5q1sPlx0XfBhS7hosvJBbXj-nVVvkT5suq3p4sTernalIZYQiIpDPXKR_AR1fUNqDBRVCbghFEseU2c9xsUUuzCz4w4LjGwTnl-dDUaQcLkq0D3l1vd",
                            "Content-Type": "application/json"
                        },
                        "body":JSON.stringify(notification_body)
                    });

                    console.log(`Medicine Notification sended successfully to ${patient.name}`);
                }catch(err){
                    console.log(err);
                    return next(new HttpError('Notification was not sended to the doctor.',500));
                }
            }
        });
    });
});

