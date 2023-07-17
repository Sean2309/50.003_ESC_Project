const mongoose = require('mongoose');

//edit fields according to handback file 
const transactionSchema = new mongoose.Schema({
  "membershipId": String,
  "membershipName": String,
  "transferDate": String,
  "transferAmount": Number,
  "referenceNumber": String,
  "partnerCode": String,
  "outcomeCode": String,
  "notificationMethod": Number,
  "email": String,
  "phoneNumber": Number
});


module.exports = {transactionSchema};