const mongoose = require('mongoose');
const transactionSchema = require('../models/transactionEnquiryModel').transactionSchema;
const clients = require('./notificationServerController.js').clients;
const sendMessagetoClient = require('./notificationSendingController.js').sendMessagetoClient;

const transactionEnquiryControllerClass = require('./transactionEnquiryController.js').TransactionEnquiryController;
const transactionEnquiryController = new transactionEnquiryControllerClass(true);

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
        let response_data = await transactionEnquiryController.makeApiRequest(id_list, loyaltyProgramName);
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

//export as class
module.exports = {ResendNotification};