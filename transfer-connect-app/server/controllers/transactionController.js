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
  generateSystemId = () => {
    // TODO: generate systemId to for reconcilation between TransferConnect and Bank app
    return Math.floor((Math.random() * 9999999));
  };

  saveTransactionToDb = async (loyaltyProgramId, transactionData) => {
    const TransactionModel = createTransactionModel(loyaltyProgramId);

    const transaction = new TransactionModel(transactionData);

    try {
      await transaction.save();
    }
    catch (error) {
      // As it turns out, Promise errors are not propagated up, so we need to throw again
      throw error;
    }
  };

  submitTransaction = async (request, response) => {
    try {
      const transactionData = request.body;

      const { loyaltyProgramId } = request.params;

      transactionData.systemId = this.generateSystemId();

      // save Transaction to DB
      await this.saveTransactionToDb(loyaltyProgramId, transactionData);

      response.status(201).json({ systemId: transactionData.systemId });
    } catch (error) {
      response.sendStatus(500);
    }
  };
}
const transactionController = new TransactionController();

module.exports = transactionController;
