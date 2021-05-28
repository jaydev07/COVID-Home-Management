const cron = require("node-cron");
const fetch = require("node-fetch");
const Patient = require("./models/patient-model");
const nodemailer = require("nodemailer");

const patientKey = "AAAAfwBoauo:APA91bH_pvuOE-FBg2Ku60HJMj99KPa4t06J3BO5WlP5MG2f4BSkX5y4Jf6WXrhJUgNX6R-LOsNHsS9lFNASM0s7F4rbsdonz-5V7KQBTdsdrgK1Z_qaX7RHv8xj6GAAwcWfWb7qBJdc";

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth:{
        user:"jdbhavsar213@gmail.com",
        pass: 'jaydev@385'
    }
});

cron.schedule("01 00 09 * * *", async () => {
    console.log("morningBeforeB");
    let patients;
    try{
        patients = await Patient.find().populate("prescribedMedicines");
    }catch(err){
        console.log(err);
        throw new Error("Somithing went wrong");
    }

    patients.forEach(async (patient) => {
        if(patient.prescribedMedicines.length > 0){
            let medicines = [];
            patient.prescribedMedicines.forEach(medicine => {
                if(medicine.time.morningBeforeB){
                    medicines.push({name:medicine.name ,quantity:medicine.time.morningBeforeB});
                }
            });

            //////////////////// Email

            let mailOptions = {
                from:"jaydevbhavsar.ict18@gmail.com",
                to:`${patient.email}`,
                subject:"Medicine Time",
                text:`Please take this medicines before breakfast
                      ${medicines}`
            };
        
            transporter.sendMail(mailOptions, (err,info) => {
                if(err){
                    console.log(err);
                }else{
                    console.log("Email sent:" + info.response);
                }
            });

            // Mobile Medicines notification which should be sended to the patient
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
                        "Authorization":"key=" + patientKey,
                        "Content-Type": "application/json"
                    },
                    "body":JSON.stringify(notification_body)
                });

                console.log(`Medicine Notification sended successfully to ${patient.name}`);
            }catch(err){
                console.log(err);
                throw new Error(`Notification not sended to ${patient.name}`);
            }
        }
    });
});

cron.schedule("01 00 10 * * *", async () => {
    console.log("morningAfterB");
    let patients;
    try{
        patients = await Patient.find().populate("prescribedMedicines");
    }catch(err){
        console.log(err);
        throw new Error("Somithing went wrong");
    }

    patients.forEach(async (patient) => {
        if(patient.prescribedMedicines.length > 0){
            let medicines = [];
            patient.prescribedMedicines.forEach(medicine => {
                if(medicine.time.morningAfterB){
                    medicines.push({name:medicine.name ,quantity:medicine.time.morningAfterB});
                }
            });

            //////////////////// Email

            let mailOptions = {
                from:"jaydevbhavsar.ict18@gmail.com",
                to:`${patient.email}`,
                subject:"Medicine Time",
                text:`Please take this medicines after breakfast
                      ${medicines}`
            };
        
            transporter.sendMail(mailOptions, (err,info) => {
                if(err){
                    console.log(err);
                }else{
                    console.log("Email sent:" + info.response);
                }
            });

            // Medicines notification which should be sended to the patient
            let notification = {
                'title':`${patient.name} please take this medicines After breakfast.`,
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
                        "Authorization":"key=" + patientKey,
                        "Content-Type": "application/json"
                    },
                    "body":JSON.stringify(notification_body)
                });

                console.log(`Medicine Notification sended successfully to ${patient.name}`);
            }catch(err){
                console.log(err);
                throw new Error(`Notification not sended to ${patient.name}`);
            }
        }
    });
});

cron.schedule("01 00 12 * * *", async () => {
    console.log("afternoonBeforeL");
    let patients;
    try{
        patients = await Patient.find().populate("prescribedMedicines");
    }catch(err){
        console.log(err);
        throw new Error("Somithing went wrong");
    }

    patients.forEach(async (patient) => {
        if(patient.prescribedMedicines.length > 0){
            let medicines = [];
            patient.prescribedMedicines.forEach(medicine => {
                if(medicine.time.afternoonBeforeL){
                    medicines.push({name:medicine.name ,quantity:medicine.time.afternoonBeforeL});
                }
            });

            //////////////////// Email

            let mailOptions = {
                from:"jaydevbhavsar.ict18@gmail.com",
                to:`${patient.email}`,
                subject:"Medicine Time",
                text:`Please take this medicines before lunch
                      ${medicines}`
            };
        
            transporter.sendMail(mailOptions, (err,info) => {
                if(err){
                    console.log(err);
                }else{
                    console.log("Email sent:" + info.response);
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
                        "Authorization":"key=" + patientKey,
                        "Content-Type": "application/json"
                    },
                    "body":JSON.stringify(notification_body)
                });

                console.log(`Medicine Notification sended successfully to ${patient.name}`);
            }catch(err){
                console.log(err);
                throw new Error(`Notification not sended to ${patient.name}`);
            }
        }
    });
});

cron.schedule("01 00 13 * * *", async () => {
    console.log("afternoonAfterL");
    let patients;
    try{
        patients = await Patient.find().populate("prescribedMedicines");
    }catch(err){
        console.log(err);
        throw new Error("Somithing went wrong");
    }

    patients.forEach(async (patient) => {
        if(patient.prescribedMedicines.length > 0){
            let medicines = [];
            patient.prescribedMedicines.forEach(medicine => {
                if(medicine.time.afternoonAfterL){
                    medicines.push({name:medicine.name ,quantity:medicine.time.afternoonAfterL});
                }
            });

            //////////////////// Email

            let mailOptions = {
                from:"jaydevbhavsar.ict18@gmail.com",
                to:`${patient.email}`,
                subject:"Medicine Time",
                text:`Please take this medicines after lunch
                      ${medicines}`
            };
        
            transporter.sendMail(mailOptions, (err,info) => {
                if(err){
                    console.log(err);
                }else{
                    console.log("Email sent:" + info.response);
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
                        "Authorization":"key=" + patientKey,
                        "Content-Type": "application/json"
                    },
                    "body":JSON.stringify(notification_body)
                });

                console.log(`Medicine Notification sended successfully to ${patient.name}`);
            }catch(err){
                console.log(err);
                throw new Error(`Notification not sended to ${patient.name}`);
            }
        }
    });
});

cron.schedule("01 22 17 * * *", async () => {
    console.log("eveningBeforeD");
    let patients;
    try{
        patients = await Patient.find().populate("prescribedMedicines");
    }catch(err){
        console.log(err);
        throw new Error("Somithing went wrong");
    }

    patients.forEach(async (patient) => {
        if(patient.prescribedMedicines.length > 0){
            let medicines = [];
            patient.prescribedMedicines.forEach(medicine => {
                if(medicine.time.eveningBeforeD){
                    medicines.push({name:medicine.name ,quantity:medicine.time.eveningBeforeD});
                }
            });

            // Medicines notification which should be sended to the patient
            let notification = {
                'title':`${patient.name} please take this medicines before dinner.`,
                'text':medicines
            }

            //////////////////// Email

            let mailOptions = {
                from:"jaydevbhavsar.ict18@gmail.com",
                to:`${patient.email}`,
                subject:"Medicine Time",
                text:`Please take this medicines before dinner
                      ${medicines}`
            };
        
            transporter.sendMail(mailOptions, (err,info) => {
                if(err){
                    console.log(err);
                }else{
                    console.log("Email sent:" + info.response);
                }
            });

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
                        "Authorization":"key=" + patientKey,
                        "Content-Type": "application/json"
                    },
                    "body":JSON.stringify(notification_body)
                });

                console.log(`Medicine Notification sended successfully to ${patient.name}`);
            }catch(err){
                console.log(err);
                throw new Error(`Notification not sended to ${patient.name}`);
            }
        }
    });
});

cron.schedule("01 00 21 * * *", async () => {
    console.log("eveningAfterD");
    let patients;
    try{
        patients = await Patient.find().populate("prescribedMedicines");
    }catch(err){
        console.log(err);
        throw new Error("Somithing went wrong");
    }

    patients.forEach(async (patient) => {
        if(patient.prescribedMedicines.length > 0){
            let medicines = [];
            patient.prescribedMedicines.forEach(medicine => {
                if(medicine.time.eveningAfterD){
                    medicines.push({name:medicine.name ,quantity:medicine.time.eveningAfterD});
                }
            });

            //////////////////// Email

            let mailOptions = {
                from:"jaydevbhavsar.ict18@gmail.com",
                to:`${patient.email}`,
                subject:"Medicine Time",
                text:`Please take this medicines after dinner
                      ${medicines}`
            };
        
            transporter.sendMail(mailOptions, (err,info) => {
                if(err){
                    console.log(err);
                }else{
                    console.log("Email sent:" + info.response);
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
                        "Authorization":"key=" + patientKey,
                        "Content-Type": "application/json"
                    },
                    "body":JSON.stringify(notification_body)
                });

                console.log(`Medicine Notification sended successfully to ${patient.name}`);
            }catch(err){
                console.log(err);
                throw new Error(`Notification not sended to ${patient.name}`);
            }
        }
    });
});

