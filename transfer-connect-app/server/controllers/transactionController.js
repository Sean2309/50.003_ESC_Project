const createTransactionModel = require('../models/transaction');

/* 
  sample data format
  {
    "membershipId": "1021030213",
    "memberName": "keith low",
    "transferDate", "23-10-2000",
    "transferAmount": 2000,
    "referenceNumber": 230203041,
    "partnerCode": "DBSSG",
    "notificationMethod": 2,
    "emailAddress": "keeve@gmail.com",
    "phoneNumber": "81231292"
  }
*/

class TransactionController {

  generateSystemCode = () => {
    // TODO: generate systemCode to notify successful/unsuccessful submission 
    return "101";
  }

  validateTransactionData = (transactionData) => {
    if (!transactionData) {
      console.log("Empty request.body")
      return { error: 'request.body cannot be found' };
    }

    if (transactionData.membershipId === '' || transactionData.transferAmount === null) {
      console.log("Invalid request.body")
      return { error: 'Membership ID or Transfer Amount is invalid' };
    }
    return {transactionData}; 
  }

  submitTransaction = async (request, response) => {
    const transactionData = request.body;
    
    const loyaltyProgramId = request.params.loyaltyProgramId;

    const validationResult = this.validateTransactionData(transactionData);

    if (validationResult.error) {
      return response.status(400).json({ error: validationResult.error});
    }

    const TransactionModel = createTransactionModel(loyaltyProgramId);
    
    const transaction = new TransactionModel(validationResult);

    await transaction.save()
      .then(() => {
        console.log('Transfer form data saved to MongoDB');
        // send referenceNumber to bank app
        response.status(201).json({ systemCode: this.generateSystemCode() });
      })
      .catch((error) => {
        console.error('Error saving transfer form data:', error);
        response.sendStatus(500);
      });
  }

};

const transactionController = new TransactionController();

module.exports = transactionController;