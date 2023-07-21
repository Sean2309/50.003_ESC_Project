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

  submitTransaction = async (request, response) => {
    const transactionData = request.body;
    console.log(transactionData)
    console.log("*************")

    const loyaltyProgramId = request.params.loyaltyProgramId;

    // Use the validateTransaction middleware to validate the transactionData
    validateTransaction(request, response, loyaltyProgramId, (error) => {
      if (error) {
        return response.status(400).json({ error });
      }

      const TransactionModel = createTransactionModel(loyaltyProgramId);
      const transaction = new TransactionModel(transactionData);

      console.log(transaction)

      transaction.save()
        .then(() => {
          console.log('Transfer form data saved to MongoDB');
          // send referenceNumber to bank app
          response.status(201).json({ systemCode: this.generateSystemCode() });
        })
        .catch((error) => {
          console.error('Error saving transfer form data:', error);
          response.sendStatus(500);
        });
    });
  }
}
const transactionController = new TransactionController();

module.exports = transactionController;