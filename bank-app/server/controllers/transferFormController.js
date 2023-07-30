const TransferForm = require('../models/transferForm');
const { TRANSFER_CONNECT_API_URL } = require('../utils/config');
const axios = require('axios');

/* 
  sample data format  
  {
    "membershipId": "1021030213",
    "memberName": "keith low",
    "transferDate", "23-10-2000"
    "transferAmount": "2000"    
  }

*/

class TransferFormController {

  // to route to transferConnect transaction submission API endpoint
  constructor() {
    this.submissionRoute = TRANSFER_CONNECT_API_URL + '/api/transactions'; //localhost:3003/api/transactions 
    console.log(TRANSFER_CONNECT_API_URL);
  }

  // this function posts transaction details to TransferConnect transaction submission API endpoint
  postTransaction = async (transactionData) => {
    const response = await axios.post(this.submissionRoute, transactionData);
    return response.data;
  }

  // get handler for easy debugging
  getAllForms = async (request, response) => {
    const submittedForms = await TransferForm.find({});
    response.json(submittedForms);
  }
  
  // submit to TransferConnect app, then save to db
  submitTransferForm = async (request, response) => {
    try {

      console.log( "Submit transfer form **********")
      const transferFormData = request.body; // see sample data comments above 

      const postTransactionResponse = await this.postTransaction(transferFormData);
      
      //adding reference Number to transaction data
      transferFormData.referenceNumber = postTransactionResponse.referenceNumber;

      const transferForm = new TransferForm(transferFormData);

      console.log('Transaction submitted to TransferConnect');
      console.log(transferForm, transferForm.referenceNumber);

      transferForm.save()
        .then(() => {
          console.log('Transaction data saved to MongoDB');
          response.sendStatus(201);
        });

    } catch (error) {
      // TODO: appropriate error handling for when POST to TransferConnect fails and when .save() to db fails
      console.error(error);
    }

  }

};

const transferFormController = new TransferFormController();

module.exports = transferFormController;