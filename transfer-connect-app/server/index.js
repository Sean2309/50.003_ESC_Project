// npm install cron
var CronJob = require('cron').CronJob;
var downloadfromSFTPandUpload = require('./controllers/handbackFileController').downloadfromSFTPandUpload;
var queryFromDBandUpload = require('./controllers/accrualFileController').queryFromDBandUpload;

// Syntax for CronJob 
// => seconds (optional), minute, hour, day of mth, mth, day of week
// * : every (e.g every minute)

var gordanJob = new CronJob(
    '0 41 * * * *',
    queryFromDBandUpload,
);

var seanJob = new CronJob(
    '0 42 * * * *', // Every day at 0000
    downloadfromSFTPandUpload,
);



gordanJob.start() 
seanJob.start() //- See note below when to use this
