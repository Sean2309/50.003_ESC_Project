const mongoose = require('mongoose');


//Schema tells Mongoose how loyaltyProgramQueryModel objects are stored in Db
const currencyRateSchema = new mongoose.Schema({
  partnerCode: {
    type: String,
    ref: 'loyaltyProgramQueryModel'
  },
  currencyRates: [
    {
      programId: String,
      currencyRate: Number
    }
  ]
}, { collection: 'CurrencyRates' });



const CurrencyRateModel = mongoose.model('currencyRateModel', currencyRateSchema);
module.exports = CurrencyRateModel;


