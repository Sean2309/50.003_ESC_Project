const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');

const accrualFileFormSchema = new mongoose.Schema({
  index: Number,
  membershipId: String,
  membershipName: String,
  transferDate: String,
  transferAmount: Number,
  referenceNumber: String,
  partnerCode: String
});

module.exports = accrualFileFormSchema;