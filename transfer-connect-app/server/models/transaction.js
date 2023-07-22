const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  memberName: String,
  membershipId: String,
  transferDate: String,
  transferAmount: Number,
  referenceNumber: String,
  partnerCode: String,
  outcomeCode: String,
  notificationMethod: String,
  emailAddress: String,
  phoneNumber: String
} , );

const createTransactionModel = (loyaltyProgramId) => {
  return mongoose.model('transaction', transactionSchema, loyaltyProgramId);
}

module.exports = createTransactionModel;