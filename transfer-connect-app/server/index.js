const config = require('./utils/config');

// import middlewares 
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const transactionRouter = require('./routes/transactionRouter');
const loyaltyProgramQueryRouter = require("./routes/loyaltyProgramQueryRouter")
const transactionEnquiryRouter = require('./routes/transactionEnquiryRouter');
const accrualFileController = require('./controllers/accrualFileController');
const handbackFileController = require('./controllers/handbackFileController');
const transactionEnquiryModel = require('./models/transactionEnquiryModel');

const app = express();

// createMongoDBCollection.createNewCollection();
// accrualFileController.queryFromDBandUpload();
handbackFileController.testHandbackFileFns();

// connect to mongoDB cloud
mongoose.connect(config.MONGODB_URL,  {dbName: config.DB_NAME, useNewUrlParser: true, useUnifiedTopology: true}).catch((err) => console.error('error'));
// mongoose.connect('mongodb+srv://test:4321@test.j9ugyp5.mongodb.net/Dtest?retryWrites=true&w=majority').then((res) => console.log('connected')).catch((err) => console.error('error'))

// enable CORS for all routes


// to allow request from different origins (domain, port etc)
app.use(cors());

// for purpose of parsing incoming requests 
app.use(express.json());

// setup routes
app.use('/api/transactions', transactionRouter)

// routes based on bankapp to to retrieve loyalty program information
app.use('/api/loyaltyprograms', loyaltyProgramQueryRouter);

app.use('/api/transactionenquiry', transactionEnquiryRouter)

app.listen(config.PORT);

module.exports = {app};
