const mongoose = require('mongoose');

//edit fields according to handback file 
const transactionSchema = new mongoose.Schema({
  "membershipId": String,
  "memberName": String,
  "transferDate": String,
  "transferAmount": Number,
  "referenceNumber": String,
  "partnerCode": String,
  "outcomeCode": String
});

//edit to add/remove loyaltyprograms available
const loyaltyprograms = ["AirAsia", "GoJet"];
module.exports = {transactionSchema, loyaltyprograms};