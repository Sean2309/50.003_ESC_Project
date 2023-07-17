const Transaction = require('../models/transaction');

/* 
  sample data format
  {
    "membershipId": "1021030213",
    "memberName": "keith low",
    "transferDate", "23-10-2000"
    "transferAmount": "2000"    
  }

*/
  
class TransactionController {
  
  generateReferenceNumber = () => {
    // TODO: generate Reference Number
    return "101";
  }
  
  getPartnerCode = () => {
    // TODO: figure out how we will implement partner code. 
    // will we give banks exclusive API links? make them write their partnercode in the query parameter? hmm
    return "DBSSG";
  }

  
  // Arrow functions do not have their own this binding and inherit the this value from the enclosing lexical scope. 
  // So they preserve the 'this' instance from the surrounding scope 
  getAllForms = async (request, response) => {
    const submittedForms = await Transaction.find({});
    response.json(submittedForms);
  }
  
  submitTransaction = async (request, response) => {
    const transactionData = request.body;
    

    transactionData.referenceNumber = this.generateReferenceNumber();

    transactionData.partnerCode = this.getPartnerCode();

    const transaction = new Transaction(transactionData);

    transaction.save()
      .then(() => {
        console.log('Transfer form data saved to MongoDB');
        // send referenceNumber to bank app
        response.status(201).json({ referenceNumber: transaction.referenceNumber });
      })
      .catch((error) => {
        console.error('Error saving transfer form data:', error);
        response.sendStatus(500);
      });

    }

};

const transactionController = new TransactionController();

module.exports = transactionController;