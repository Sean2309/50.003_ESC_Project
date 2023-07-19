const createTransferForm = require('../models/transferForm');
const { TRANSFER_CONNECT_API_URL, PARTNERCODE } = require('../utils/config');
const axios = require('axios');

class TransferFormController {

  // to route to transferConnect transaction submission API endpoint
  constructor() {
    this.submissionRoute = TRANSFER_CONNECT_API_URL + '/api/transactions/'; //localhost:3003/api/transactions 
  }

  // this function posts transaction details to TransferConnect transaction submission API endpoint
  postTransaction = async (transactionData, loyaltyProgramId) => {
    const response = await axios.post(this.submissionRoute + `${loyaltyProgramId}`, transactionData);
    return response.data;
  }
  
  generateReferenceNumber = () => {
    // TODO: unique reference number generator
    
    // generate some random number for now
    return Math.floor((Math.random() * 9999999));
  }
  
  // submit to TransferConnect app, then save to db
  submitTransferForm = async (request, response) => {
    try {

      const transferFormData = request.body; // see sample data comments above 
      
      const loyaltyProgramId = request.params.loyaltyProgramId; // grab loyaltyProgramId from path params
      
      // add referenceNumber to transaction data
      transferFormData.referenceNumber = this.generateReferenceNumber();
      
      // add partnerCode to transaction data
      transferFormData.partnerCode = PARTNERCODE;

      console.log(transferFormData);
      
      // submit Transaction to TransferConnect
      // TODO: appropriate handling of systemCode given by TransferConnect, then save to our own DB
      const postTransactionResponse = await this.postTransaction(transferFormData, loyaltyProgramId);

      console.log('Transaction submitted to TransferConnect');
      
      // point the model to the specific loyaltyProgram's collection
      const TransferForm = createTransferForm(loyaltyProgramId);

      const transferForm = new TransferForm(transferFormData);

      transferForm.save()
        .then(() => {
          console.log('Transaction data saved to MongoDB');
          response.status(201).json(transferForm);
        });

    } catch (error) {
      // TODO: appropriate error handling for when POST to TransferConnect fails and when .save() to db fails
      console.error(error);
    }

  }

};

const transferFormController = new TransferFormController();

module.exports = transferFormController;