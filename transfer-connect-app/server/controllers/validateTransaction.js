const LoyaltyProgramQueryModel = require('../models/loyaltyProgramQueryModel');

const validateTransaction = async (req, res, loyaltyProgramId, next) => {
  const reqBody = req.body;
  const requiredFields = ['membershipId', 'memberName', 'transferDate', 'emailAddress', 'phoneNumber', 'notificationMethod', 'referenceNumber', 'partnerCode'];
  const missingFields = requiredFields.filter(field => !reqBody[field]);
  if (missingFields.length > 0) {
    return res.status(400).json({ error: `Missing required fields: ${missingFields.join(', ')}` });
  }

  const fieldTypes = {
    membershipId: 'string',
    memberName: 'string',
    transferDate: 'string',
    transferAmount: 'string',
    emailAddress: 'string',
    phoneNumber: 'string',
    notificationMethod: 'string',
    referenceNumber: 'number',
    partnerCode: 'string',
  };

  const typeErrors = Object.keys(fieldTypes).filter(field => typeof reqBody[field] !== fieldTypes[field]);
  if (typeErrors.length > 0) {
    return res.status(400).json({ error: `Invalid data types for fields: ${typeErrors.join(', ')}` });
  }

  // Retrieve the loyalty program by its identifier (e.g., programId) from the database
  try {
    const loyaltyProgram = await LoyaltyProgramQueryModel.findOne({ programId: loyaltyProgramId }).exec();
    if (!loyaltyProgram) {
      return res.status(404).json({ error: "Loyalty program not found." });
    }
    // Use the membershipFormat from the loyalty program to construct the regex for membershipId
    const membershipIdRegexFromDB = new RegExp(loyaltyProgram.membershipFormat);
   
    if (!membershipIdRegexFromDB.test(reqBody.membershipId)) {
      return res.status(400).json({ error: "Invalid membershipId format for this loyalty program." });
    }

    
  } catch (error) {
    console.error('Error retrieving loyalty program data:', error);
    return res.status(500).json({ error: "Internal server error." });
  }

  next();
};

module.exports = validateTransaction;
