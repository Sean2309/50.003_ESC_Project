const mongoose = require('mongoose');

const transferFormSchema = new mongoose.Schema({
  memberName: {
    type: String,
    required: true
  },
  membershipId: {
    type: String,
    required: true
  },
  transferDate: {
    type: String,
    required: true
  },
  transferAmount: {
    type: Number,
    required: true
  },
  referenceNumber: {
    type: String,
    required: true
  },
  partnerCode: {
    type: String,
    required: true
  },
  notificationMethod: {
    type: String,
    required: true
  },
  phoneNumber: {
    type: String,
    required: true
  },
  systemId: {
    type: String,
    required: true
  },
  emailAddress: {
    type: String,
    required: true
  },
  outcomeCode: String,
  userId: {
    type: String,
    ref: 'UserCredentials'
  }
});

const createTransferForm = (loyaltyProgramId) => {
  return mongoose.model('transferform', transferFormSchema, loyaltyProgramId);
}

module.exports = createTransferForm;