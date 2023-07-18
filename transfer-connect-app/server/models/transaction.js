const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  membershipId: String,
  membershipName: String,
  transferDate: String,
  transferAmount: Number,
  referenceNumber: String,
  partnerCode: String,
  outcomeCode: String,
  notificationMethod: String,
  emailAddress: String,
  phoneNumber: String
});

const createTransactionModel = (loyaltyProgramId) => {
  return mongoose.model('transaction', transactionSchema, loyaltyProgramId);
}

module.exports = createTransactionModel;