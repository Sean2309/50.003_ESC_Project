const axios = require('axios');
const { TRANSFER_CONNECT_API_URL } = require('../utils/config.js');
const {BANK_NAME} = require('../utils/config.js');

const mongoose = require('mongoose');
const transactionSchema = require('../models/transactionEnquiryModel').transactionSchema;
const clients = require('./notificationServerController.js').clients;
const sendMessagetoClient = require('./notificationSendingController.js').sendMessagetoClient;

const eventEmitter = require('./eventEmitter.js').eventEmitter;


class ResendNotification {
    constructor(){};

    processClientMessage = async (message) => {
        const transferAmount = message.transferAmount;
        const loyaltyProgramName = message.loyaltyProgramName;
        const membershipId = message.membershipId;
        return {transferAmount, loyaltyProgramName, membershipId};
    }

    getTransactions = async (transferAmount, loyaltyProgramName, membershipId) => {        
        let collection_connection;
        if (mongoose.models[loyaltyProgramName]) {
            collection_connection = mongoose.model(loyaltyProgramName);
          } else {
            collection_connection = mongoose.model(loyaltyProgramName, transactionSchema, loyaltyProgramName);
          };
        let transactions = await collection_connection.find({"transferAmount": transferAmount, "membershipId": membershipId}, {"outcomeCode": 1, "referenceNumber": 1, "_id": 0, "notificationMethod": 1, "phoneNumber": 1, "emailAddress" : 1, "transferAmount" : 1, "membershipId": 1 }).lean().exec()
        
        return transactions;
    }

    processTransactionsParam = async (transactions, loyaltyProgramName) => {
        let id_list = [];
        //check if transaction exists
        if (transactions[0]!= null) {
            for (let transaction in transactions){
                //add to id_list to send to TC
                id_list.push(transaction.referenceNumber);
            }
        //query from TC
        let response_data = await this.makeApiRequest(id_list, loyaltyProgramName);
        return response_data;
        }
        else {
            //TODO: send as websocket notif
            console.log("transaction does not exist")
            const message = "Transaction does not exist";
            const messageType = 1;
            sendMessagetoClient(clients, membershipId, message, messageType);
            return
        }
    }

    //copy and pasting to avoid circular imports zzzz
    makeApiRequest = async (id_list, loyaltyprogram) => {
    
        //return if no transaction to poll for
        if (id_list.length === 0) {
          console.log(`${loyaltyprogram} id_list is null`)
          return;
        }
        var response;
    
        //id_list is obtained from getReferenceNumbers
        let string_ids = (id_list).join();
    
        ///DBS since we set our bank-app currently to be DBS, can be changed accordingly in .env
        let url = TRANSFER_CONNECT_API_URL + '/transferconnect/check/' + BANK_NAME +'/' + loyaltyprogram;
        url = url + "/" + string_ids;
        console.log(url);
        try {
          response = await axios.get(url); // Await the API response
          if(response.data == null || response.data == undefined){
            console.log("API request response is null");
            return;
          }
          else{
            console.log("returning response.data");
            console.log(response.data);
            return response.data;
          }
          
        } catch (error) {
          // Handle any errors
          console.error(error);
          return error;
        };
      }

    handleNullData = async (response_data) => {
        if (response_data == null || response_data == undefined){
            console.log("sendNotif outcome code not updated");
            //TODO: send as websocket notif
            const message = "Outcome code not updated";
            const messageType = 1;
            sendMessagetoClient(clients, membershipId, message, messageType);
        }
    }

    resendNotif = async (message) => {
        let {transferAmount, loyaltyProgramName, membershipId} = this.processClientMessage(message);
        let transactions = await this.getTransactions(transferAmount, loyaltyProgramName, membershipId);
        let response_data = await this.processTransactionsParam(transactions, loyaltyProgramName);
        await this.handleNullData(response_data);
    }
}

// Listen for the custom event 'dataSent'
eventEmitter.on('messageReceived', (dataReceived) => {
    console.log('Data received in resendNotification.js');
    console.log('Received data:', dataReceived);
      ResendNotification.resendNotif(dataReceived);
  });


//export as class
module.exports = {ResendNotification};