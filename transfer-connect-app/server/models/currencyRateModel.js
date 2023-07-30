const mongoose = require('mongoose');


//Schema tells Mongoose how loyaltyProgramQueryModel objects are stored in Db
const currencyRateSchema = new mongoose.Schema({
  currencyRate: String,
  programID: String,
  appName: String
},{ collection: 'CurrencyRates' });



const currencyRateModel = mongoose.model('currencyRateModel', currencyRateSchema);
module.exports = currencyRateModel;


