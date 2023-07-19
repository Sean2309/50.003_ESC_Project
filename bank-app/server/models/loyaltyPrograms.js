const mongoose = require('mongoose');

const loyaltyProgramsSchema = new mongoose.Schema({
    programId: String,
    programName: String,
    currencyName: String,
    processingTime: String,
    description: String,
    enrollmentLink: String,
    tncLink: String,
    membershipFormat: String,
    currencyRate: String
});

const LoyaltyPrograms = mongoose.model('loyaltyprograms', loyaltyProgramsSchema);

module.exports = LoyaltyPrograms;