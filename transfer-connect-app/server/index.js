// npm install cron
var CronJob = require('cron').CronJob;
var queryFromDBandUpload = require('./controllers/accrualFileController').queryFromDBandUpload;
var job = new CronJob(
    '0 0 0 * * *',
    queryFromDBandUpload,
);
job.start() // - See note below when to use this
// Seconds (0-59)
// Minutes (0-59)
// Hours (0-23)
// Day of Month (1-31)
// Months (0-11, January is 0, December is 11)
// Day of Week (0-6, Sunday is 0, Saturday is 6)
// The asterisk (*) means "any value" or "every" in cron syntax. 
// A value of 0 means exactly at the 0th second, 0th minute, or 0th hour.