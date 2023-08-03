const config = require('./utils/config');

// import middlewares 
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const transferconnectController = require('./routes/transactionEnquiryRouter');

const app = express();

accrualFileController.queryFromDBandUpload();

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



handbackFileController.testHandbackFileFns();