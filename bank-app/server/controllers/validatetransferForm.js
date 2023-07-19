const validatetransferForm = (req, res, next) => {


    /*

    membershipId: String,
    membershipName: String,
    transferDate: String,
    transferAmount: Number,
    referenceNumber: String,
    partnerCode: String,
    notificationMethod: String,
    emailAddress: String,
    phoneNumber: String,

*/

    const reqBody = req.body;
    const requiredFields = ['membershipId', 'membershipName', 'transferDate', 'transferAmount', 'referenceNumber', 'partnerCode', 'notificationMethod', 'emailAddress', 'phoneNumber'];
    const missingFields = requiredFields.filter(field => !reqBody[field]);
    if (missingFields.length > 0 ) {
        return res.status(400).json({ error: `Missing required fields: ${missingFields.join(', ')}` });
    };
    next();

};

module.exports = validatetransferForm;