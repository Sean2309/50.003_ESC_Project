const validateTransferForm = (req, res, next) => {


    /*

    membershipId: String,
    membershipName: String,
    transferDate: String,
    transferAmount: Number,
    notificationMethod: String,
    emailAddress: String,
    phoneNumber: String,

    */

    const reqBody = req.body;
<<<<<<< HEAD:bank-app/server/controllers/validatetransferForm.js
    const requiredFields = ['membershipId', 'memberName', 'transferDate', 'transferAmount', 'referenceNumber', 'partnerCode', 'notificationMethod', 'emailAddress', 'phoneNumber'];
=======
    const requiredFields = ['membershipId', 'memberName', 'transferDate', 'transferAmount', 'notificationMethod', 'emailAddress', 'phoneNumber'];
>>>>>>> kms_merged_logincredittransfer:bank-app/server/utils/validateTransferForm.js
    const missingFields = requiredFields.filter(field => !reqBody[field]);
    if (missingFields.length > 0 ) {
        return res.status(400).json({ error: `Missing required fields: ${missingFields.join(', ')}` });
    };
    next();

};

module.exports = validateTransferForm;