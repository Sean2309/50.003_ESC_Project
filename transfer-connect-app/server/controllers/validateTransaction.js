const validateTransaction = (req, res, next) => {


  /*
{
  membershipId: String,
  memberName: String,
  transferDate: String,
  transferAmount: String,
  emailAddress: String,
  phoneNumber: String,
  notificationMethod: String,
  referenceNumber: Integer
  partnerCode: String,
}
*/

  const reqBody = req.body;
  const requiredFields = ['membershipId', 'memberName','transferDate','emailAddress','phoneNumber','notificationMethod','referenceNumber','partnerCode'];
  const missingFields = requiredFields.filter(field => !reqBody[field]);
  if (missingFields.length > 0 ) {
      return res.status(400).json({ error: `Missing required fields: ${missingFields.join(', ')}` });
  };

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
  next();

};

module.exports = validateTransaction;