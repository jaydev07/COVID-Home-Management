const cron = require("node-cron");
const fetch = require("node-fetch");
const Patient = require("./models/patient-model");

cron.schedule("01 59 23 * * *", async () => {
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
            console.log(patient.name);
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
                    medicines.push(medicine.name);
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
                        "Authorization":"key=" + "AAAAMGzW3sY:APA91bFkpmHZumZxoN-Sm7BOPYsnACLvmFc_WiR6WrbTRrWp6BdwfYvVBU4jBnhpdx0oZ2vb7gYswVAcgJX8DberZVai5MiCYMz9MEIb0gpskPpFIqtdxsyybAWdbYtOfDjKTj4fARmy",
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
                        "Authorization":"key=" + "AAAAMGzW3sY:APA91bFkpmHZumZxoN-Sm7BOPYsnACLvmFc_WiR6WrbTRrWp6BdwfYvVBU4jBnhpdx0oZ2vb7gYswVAcgJX8DberZVai5MiCYMz9MEIb0gpskPpFIqtdxsyybAWdbYtOfDjKTj4fARmy",
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
                        "Authorization":"key=" + "AAAAMGzW3sY:APA91bFkpmHZumZxoN-Sm7BOPYsnACLvmFc_WiR6WrbTRrWp6BdwfYvVBU4jBnhpdx0oZ2vb7gYswVAcgJX8DberZVai5MiCYMz9MEIb0gpskPpFIqtdxsyybAWdbYtOfDjKTj4fARmy",
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

cron.schedule("01 00 20 * * *", async () => {
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
                        "Authorization":"key=" + "AAAAMGzW3sY:APA91bFkpmHZumZxoN-Sm7BOPYsnACLvmFc_WiR6WrbTRrWp6BdwfYvVBU4jBnhpdx0oZ2vb7gYswVAcgJX8DberZVai5MiCYMz9MEIb0gpskPpFIqtdxsyybAWdbYtOfDjKTj4fARmy",
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
                        "Authorization":"key=" + "AAAAMGzW3sY:APA91bFkpmHZumZxoN-Sm7BOPYsnACLvmFc_WiR6WrbTRrWp6BdwfYvVBU4jBnhpdx0oZ2vb7gYswVAcgJX8DberZVai5MiCYMz9MEIb0gpskPpFIqtdxsyybAWdbYtOfDjKTj4fARmy",
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

