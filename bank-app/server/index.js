const config = require('./utils/config');

// import middlewares 
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const transferFormRouter = require('./routes/transferFormRouter');
const loyaltyProgramsRouter = require('./routes/loyaltyProgramsRouter');
const updateLoyaltyProgramsRouter = require('./routes/updateLoyaltyProgramsRouter');
const authManagerRouter = require('./routes/authManagerRouter');
const userProfileRouter = require('./routes/userProfileRouter'); 
const transactionEnquiryRouter = require('./routes/transactionEnquiryRouter');
const cookieParser = require('cookie-parser');
const app = express();

// connect to mongoDB cloud
mongoose.connect(config.MONGODB_URL, config.MONGODB_OPTIONS).catch((err) => console.error('error'))

// enable CORS for all routes
// to allow request from different origins (domain, port etc)
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));

// for purpose of parsing incoming requests 
app.use(express.json());
// for setting token as cookie
app.use(cookieParser());

// setup routes
app.use('/api/transferformsubmit', transferFormRouter);
app.use('/api/loyaltyprograms', loyaltyProgramsRouter);
app.use('/api/updateLoyaltyProgramsRouter',updateLoyaltyProgramsRouter);
app.use('/api/userprofile', userProfileRouter);
app.use('/api/transactions', transactionEnquiryRouter);
app.use('/login', authManagerRouter);


app.listen(config.PORT);
module.exports = app; // Export the app object



