const mongoose = require('mongoose');


//Schema tells Mongoose how loyaltyProgramQueryModel objects are stored in Db
const loyaltyProgramQuerySchema = new mongoose.Schema({
  programID: String,
  programName: String,
  currencyName: String,
  processingTime: String,
  description: String,
  enrollmentLink: String,
  tncLink: String,
  membershipFormat: String
},{ collection: 'loyaltyProgramProviders' });



const loyaltyProgramQueryModel = mongoose.model('loyaltyProgramQueryModel', loyaltyProgramQuerySchema);
module.exports = loyaltyProgramQueryModel;


