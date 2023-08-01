const mongoose = require('mongoose');

const transferFormSchema = new mongoose.Schema({
  memberName: String,
  membershipId: String,
  transferDate: String,
  transferAmount: Number,
  referenceNumber: String,
  partnerCode: String,
  outcomeCode: String,
  notificationMethod: String,
  emailAddress: String,
  phoneNumber: String,
  systemId: String
});

const createTransferForm = (loyaltyProgramId) => {
  return mongoose.model('transferform', transferFormSchema, loyaltyProgramId);
}

module.exports = createTransferForm;