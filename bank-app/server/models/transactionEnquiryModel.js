const mongoose = require('mongoose');

//edit fields according to handback file 
const transactionSchema = new mongoose.Schema({
  "membershipId": String,
  "memberName": String,
  "transferDate": String,
  "transferAmount": Number,
  "referenceNumber": String,
  "partnerCode": String,
  "outcomeCode": String,
  "notificationMethod": Number,
  "emailAddress": String,
  "phoneNumber": String,
  "systemId": String,
  "userId": String
});

//edit to add/remove loyaltyprograms available
const loyaltyPrograms = ["GOPOINTS", "ASIAMILES"];
module.exports = {transactionSchema, loyaltyPrograms};