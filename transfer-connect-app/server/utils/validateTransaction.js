const LoyaltyProgramQueryModel = require('../models/loyaltyProgramQueryModel');

const getLoyaltyProgram = async (loyaltyProgramId) => {
  const loyaltyProgram = await LoyaltyProgramQueryModel.findOne({ programId: loyaltyProgramId }).exec();
  return loyaltyProgram;
};

const validateTransaction = async (request, response, next) => {
  const requestBody = request.body;
  const { loyaltyProgramId } = request.params;

  try {
    // Retrieve the loyalty program by its identifier (e.g., programId) from the database
    const loyaltyProgram = await getLoyaltyProgram(loyaltyProgramId);
    
    if (!loyaltyProgram) {
      return response.status(400).json({ error: 'Invalid loyaltyProgramId.' });
    }

    // Use the membershipFormat from the loyalty program to construct the regex for membershipId
    const membershipIdRegexFromDB = new RegExp(loyaltyProgram.membershipFormat);

    if (!membershipIdRegexFromDB.test(requestBody.membershipId)) {
      return response.status(400).json({ error: 'Invalid membershipId format for this loyalty program.' });
    }
  } catch (error) {
    return response.status(500).json({ error: 'Internal server error.' });
  }

  next();
};

module.exports = validateTransaction;
