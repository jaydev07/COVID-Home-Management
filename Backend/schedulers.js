const schedule = require("node-schedule");

var date1 = new Date().toJSON().slice(0,10) + 'T16:14:20';
var date2 = new Date().toJSON().slice(0,10) + 'T16:14:30';
var date3 = new Date().toJSON().slice(0,10) + 'T16:14:40';

schedule.scheduleJob('*/10 * * * * *' , () => {
    schedule.scheduleJob(date1,() => {
        console.log(date1);
    });
    schedule.scheduleJob(date2,() => {
        console.log(date2);
    });
    schedule.scheduleJob(date3,() => {
        console.log(date3);
    });
})

