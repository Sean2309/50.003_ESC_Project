const config = require('./utils/config');

// import middlewares 
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const transactionRouter = require('./routes/transactionRouter');
const loyaltyProgramQueryRouter = require("./routes/loyaltyProgramQueryRouter")


const app = express();

// connect to mongoDB cloud
mongoose.connect(config.MONGODB_URL).then((res) => console.log('connected')).catch((err) => console.error('error'))

// enable CORS for all routes
// to allow request from different origins (domain, port etc)
app.use(cors());

// for purpose of parsing incoming requests 
app.use(express.json());

// setup routes
app.use('/api/transactions', transactionRouter)

// routes based on bankapp to to retrieve loyalty program information
app.use('/api/loyaltyprograms/BankApp', loyaltyProgramQueryRouter('BankApp'));
app.use('/api/loyaltyprograms/DBS', loyaltyProgramQueryRouter('DBS'));


  

app.listen(config.PORT, () => {
    console.log(`Server running on port ${config.PORT}`);
})
