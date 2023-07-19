const mongoose = require('mongoose');

const transferFormSchema = new mongoose.Schema({
  membershipId: String,
  membershipName: String,
  transferDate: String,
  transferAmount: Number,
  referenceNumber: String,
  partnerCode: String,
  notificationMethod: String,
  emailAddress: String,
  phoneNumber: String,
  
});

const createTransferForm = (loyaltyProgramId) => {
  return mongoose.model('transferform', transferFormSchema, loyaltyProgramId);
}

module.exports = createTransferForm;