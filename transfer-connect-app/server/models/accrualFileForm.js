const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');

const accrualFileFormSchema = new mongoose.Schema({
  index: Number,
  memberID: String,
  memberFirstName: String,
  memberLastName: String,
  transferDate: String,
  amount: Number,
  referenceNumber: String,
  partnerCode: String
});

module.exports = accrualFileFormSchema;