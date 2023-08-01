const LoyaltyPrograms = require('../models/loyaltyPrograms');

const validateTransaction = async (request, response, next) => {
  const { loyaltyProgramId } = request.params; // grab loyaltyProgramId from path params
  const transactionData = request.body;

  try {
    const loyaltyProgram = await LoyaltyPrograms.findOne({ programId: loyaltyProgramId });
    if (!loyaltyProgram) {
      return response.status(404).json({ error: 'Loyalty program not found.' });
    }

    // Use the membershipFormat from the loyalty program to construct the regex for membershipId
    const membershipIdRegex = new RegExp(loyaltyProgram.membershipFormat);

    if (!membershipIdRegex.test(transactionData.membershipId)) {
      return response.status(400).json({ error: 'Invalid membership Id format for this loyalty program. ' });
    }
  } catch (error) {
    return response.status(500).json({ error: 'Internal server error.' });
  }

  next();
};

module.exports = validateTransaction;
