const axios = require('axios');
const { BANK_APP_URL, PARTNERCODE } = require('../utils/config');
const transactionSchema = require('../models/transactionEnquiryModel');
const mongoose = require('mongoose');
const transactionEnquiryController = require('../controllers/transactionEnquiryController');



class WebhookController {
  // to route to transferConnect transaction submission API endpoint
  constructor() {
    this.submissionRoute = `${BANK_APP_URL}/api/webhook/`; // localhost:3003/api/transactions
  };

  //to run all functions
  processRoute = async (referenceNumber, partnerCode, transferAmount, loyaltyProgram) => {
    let transaction1 = await this.findTransaction(referenceNumber, partnerCode, transferAmount, loyaltyProgram);
    this.postTransaction(transaction1, loyaltyProgram, partnerCode);
    let transaction = transaction1[0];
    let userEmail = transaction["emailAddress"];
    let userNumber = transaction["phoneNumber"];
    let notificationMethod = transaction["notificationMethod"];
    let outcomeCode = transaction["outcomeCode"];
    await transactionEnquiryController.sendNotification(userNumber, userEmail, notificationMethod, outcomeCode, partnerCode, loyaltyProgram, transferAmount);
  };

    // this function posts transaction details to Bank App API endpoint
    postTransaction = async (transactionData, loyaltyProgramId, partnerCode) => {
      try{
        await axios.post(`${this.submissionRoute}${partnerCode}/${loyaltyProgramId}`, transactionData);
      } catch (error){
        return error;
      }
      };

  //find all transaction details from database
  findTransaction = async (referenceNumber, partnerCode, transferAmount, loyaltyProgram) => {
    let collection_connection;

    if (mongoose.models[loyaltyProgram]) {
      collection_connection = mongoose.model(loyaltyProgram);
    } else {
      collection_connection = mongoose.model(loyaltyProgram, transactionSchema, loyaltyProgram);
    }
    try{

        let transaction = await collection_connection.find({ "referenceNumber": referenceNumber, "partnerCode": partnerCode, "transferAmount": transferAmount }, { "outcomeCode": 1, "systemId": 1, "_id": 0, "notificationMethod": 1, "phoneNumber": 1, "emailAddress": 1, "transferAmount": 1}).lean().exec()
        return transaction;
    }
    catch (error) {
        return error;
    }
  };
}

const webhookController = new WebhookController();

module.exports = webhookController;
