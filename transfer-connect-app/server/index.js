// npm install cron
var CronJob = require('cron').CronJob;
var downloadfromSFTPandUpload = require('./controllers/handbackFileController.js').downloadfromSFTPandUpload;

// Syntax for CronJob 
// => seconds (optional), minute, hour, day of mth, mth, day of week
// * : every (e.g every minute)
var job1 = new CronJob(
    '0 * * * * *', // Every day at 0000
    downloadfromSFTPandUpload,
);
job1.start() //- See note below when to use this
var queryFromDBandUpload = require('controllers/accrualFileController').queryFromDBandUpload;
var job2 = new CronJob(
    '0 0 0 * * *',
    queryFromDBandUpload,
);
// job2.start() - See note below when to use this
