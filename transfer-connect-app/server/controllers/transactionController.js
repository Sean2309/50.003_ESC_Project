const createTransactionModel = require('../models/transaction');
const validateTransaction = require('./validateTransaction');

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

  saveTransactionToDb = async (loyaltyProgramId, transactionData) => {
    const TransactionModel = createTransactionModel(loyaltyProgramId);

    const transaction = new TransactionModel(transactionData);

    await transaction.save()
  }

  submitTransaction = async (request, response) => {
    try {
      const transactionData = request.body;

      const loyaltyProgramId = request.params.loyaltyProgramId;

      // save Transaction to DB
      this.saveTransactionToDb(loyaltyProgramId, transactionData);

      response.status(201).json({ systemCode: this.generateSystemCode() });
    }
    catch (error) {
      console.error('Error saving transfer form data:', error);
      response.sendStatus(500);
    }
  }
}
const transactionController = new TransactionController();

module.exports = transactionController;