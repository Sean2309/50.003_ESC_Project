// npm install cron
var CronJob = require('cron').CronJob;
var downloadfromSFTPandUpload = require('./controllers/handbackFileController').downloadfromSFTPandUpload;
var queryFromDBandUpload = require('./controllers/accrualFileController').queryFromDBandUpload;

// Syntax for CronJob 
// => seconds (optional), minute, hour, day of mth, mth, day of week
// * : every (e.g every minute)

var gordanJob = new CronJob(
    '0 30 * * * *',
    queryFromDBandUpload,
);

var seanJob = new CronJob(
    '30 30 * * * *', 
    downloadfromSFTPandUpload,
);



gordanJob.start() 
seanJob.start() //- See note below when to use this


//------------- Le Xuan's code -------------//

const config = require('./utils/config');

// import middlewares 
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const transferconnectController = require('./routes/transactionEnquiryRouter');

const app = express();

// connect to mongoDB cloud
mongoose.connect(config.MONGODB_URL,  { 
    dbName: config.DB_NAME,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }).then((res) => console.log('connected')).catch((err) => console.log(err))


// enable CORS for all routes
// to allow request from different origins (domain, port etc)
app.use(cors());

// for purpose of parsing incoming requests 
app.use(express.json());

// setup routes
app.use('/transferconnect', transferconnectController.router)

app.listen(config.PORT, () => {
    console.log(`Server running on port ${config.PORT}`);
})

module.exports = {app};
