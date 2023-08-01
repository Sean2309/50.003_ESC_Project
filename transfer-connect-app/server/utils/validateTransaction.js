const LoyaltyProgramQueryModel = require('../models/loyaltyProgramQueryModel');

const validateTransaction = async (req, res, next) => {
  const reqBody = req.body;
  const { loyaltyProgramId } = req.params;
  const requiredFields = ['membershipId', 'memberName', 'transferDate', 'emailAddress', 'phoneNumber', 'notificationMethod', 'referenceNumber', 'partnerCode'];
  const missingFields = requiredFields.filter((field) => !reqBody[field]);

  if (missingFields.length > 0) {
    return res.status(400).json({ error: `Missing required fields: ${missingFields.join(', ')}` });
  }

  // Retrieve the loyalty program by its identifier (e.g., programId) from the database
  try {
    const loyaltyProgram = await LoyaltyProgramQueryModel.findOne({ programId: loyaltyProgramId }).exec();
    if (!loyaltyProgram) {
      return res.status(404).json({ error: 'Loyalty program not found.' });
    }
    // Use the membershipFormat from the loyalty program to construct the regex for membershipId
    const membershipIdRegexFromDB = new RegExp(loyaltyProgram.membershipFormat);

    if (!membershipIdRegexFromDB.test(reqBody.membershipId)) {
      return res.status(400).json({ error: 'Invalid membershipId format for this loyalty program.' });
    }
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error.' });
  }

  next();
};

module.exports = validateTransaction;
