const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');

const accrualFileFormSchema = new mongoose.Schema({
  index: Number,
  memberID: String,
  memberFirstName: String,
  memberLastName: String,
  transferDate: String,
  transferAmount: Number,
  referenceNumber: String,
  partnerCode: String,
  outcomeCode: String
});

module.exports = accrualFileFormSchema;