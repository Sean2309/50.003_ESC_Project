const axios = require('axios');
const createTransferForm = require('../models/transferForm');
const { TRANSFER_CONNECT_API_URL, PARTNERCODE } = require('../utils/config');

class TransferFormController {
  // to route to transferConnect transaction submission API endpoint
  constructor() {
    this.submissionRoute = `${TRANSFER_CONNECT_API_URL}/api/transactions/`; // localhost:3003/api/transactions
  }

  // this function posts transaction details to TransferConnect transaction submission API endpoint
  postTransaction = async (transactionData, loyaltyProgramId) => {
    const response = await axios.post(`${this.submissionRoute}${loyaltyProgramId}`, transactionData);
    return response.data;
  };

  generateReferenceNumber = () => {
  // TODO: unique reference number generator

    // generate some random number for now
    return Math.floor((Math.random() * 9999999));
  };

  saveTransactionToDb = async (loyaltyProgramId, transferFormData) => {
    // point the model to the specific loyaltyProgram's collection
    const TransferForm = createTransferForm(loyaltyProgramId);

    const transferForm = new TransferForm(transferFormData);

    await transferForm.save();
  };

  // submit to TransferConnect app, then save to db
  submitTransferForm = async (request, response) => {
    try {
      const transferFormData = request.body; // see sample data comments above

      const { loyaltyProgramId } = request.params; // grab loyaltyProgramId from path params

      // add referenceNumber to transaction data
      transferFormData.referenceNumber = this.generateReferenceNumber();

      // add partnerCode to transaction data
      transferFormData.partnerCode = PARTNERCODE;
      
      // copy transaction over, and drop userId
      const transaction = {...transferFormData};
      delete transaction.userId;
      
      // submit Transaction to TransferConnect
      // check for systemId given to us by TransferConnect, tag to the transaction then save to our own DB
      const postTransactionResponse = await this.postTransaction(transaction, loyaltyProgramId);

      transferFormData.systemId = postTransactionResponse.systemId;

      await this.saveTransactionToDb(loyaltyProgramId, transferFormData);

      response.status(201).json(transferFormData);
    } catch (error) {
      response.status(500).json({ error: error.message });
    }
  };
}

const transferFormController = new TransferFormController();

module.exports = transferFormController;
