const config = require('./utils/config');

// import middlewares 
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const transactionRouter = require('./routes/transactionRouter');
const loyaltyProgramQueryRouter = require("./routes/loyaltyProgramQueryRouter")
const transactionEnquiryRouter = require('./routes/transactionEnquiryRouter');
const accrualFileController = require('./controllers/accrualFileController');
const webhookTestRouter = require('./routes/webhookTestRouter');
const handbackFileController = require('./controllers/handbackFileController');
const transactionEnquiryModel = require('./models/transactionEnquiryModel');
const createMongoDBCollection = require('./controllers/createMongoDBCollection');
const accrualToHandbackController = require('./controllers/accrualToHandbackController');

const app = express();

// connect to mongoDB cloud
mongoose.connect(config.MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true}).catch((err) => console.error('error'));

createMongoDBCollection.populateTransactions();

 const transferConnectSimulation = async () => {
    // await createMongoDBCollection.populateTransactions();
    await accrualFileController.queryFromDBandUpload();
    await accrualToHandbackController.queryFromDBandUpload();
    await handbackFileController.downloadfromSFTPandUpload();
};

transferConnectSimulation();


// to allow request from different origins (domain, port etc)
app.use(cors());

// for purpose of parsing incoming requests 
app.use(express.json());

// setup routes
app.use('/api/transactions', transactionRouter)

// routes based on bankapp to to retrieve loyalty program information
app.use('/api/loyaltyprograms', loyaltyProgramQueryRouter);

app.use('/api/transactionenquiry', transactionEnquiryRouter);

app.use('/api/webhook', webhookTestRouter);

app.listen(config.PORT);

module.exports = {app};
