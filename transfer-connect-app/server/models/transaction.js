const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  membershipId: String,
  membershipName: String,
  transferDate: String,
  transferAmount: Number,
  referenceNumber: String,
  partnerCode: String,
});

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;