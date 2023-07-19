const mongoose = require('mongoose');


//Schema tells Mongoose how loyaltyProgramQueryModel objects are stored in Db
const loyaltyProgramQuerySchema = new mongoose.Schema({
  programId: String,
  programName: String,
  currencyName: String,
  processingTime: String,
  description: String,
  enrollmentLink: String,
  tncLink: String,
  membershipFormat: String,
  currencyRate: Number
}, { collection: 'loyaltyProgramProviders' });

const LoyaltyProgramQueryModel = mongoose.model('loyaltyProgramQueryModel', loyaltyProgramQuerySchema);

module.exports = LoyaltyProgramQueryModel;


