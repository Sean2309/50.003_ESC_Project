const clients = require('./notificationServerController.js').clients;
const sendMessagetoClient = require('./notificationSendingController.js').sendMessagetoClient;
const { mongoose } = require('mongoose');
const transactionSchema = require('../models/transactionEnquiryModel.js').transactionSchema;


class WebhookController {
  // to route to transferConnect transaction submission API endpoint
  constructor() {
  }

  processData = async (request, response) => {
    let [transaction, loyaltyProgramId] = await this.processResponse(request, response);
    await this.updateDBandNotifs(transaction, loyaltyProgramId);
    
    return response.status(201).json({ message: 'updated transaction' });
  } 

  processResponse = async (request, response) => {
    try {
        const transactionData = request.body; // see sample data comments above
  
        const { loyaltyProgramId } = request.params; // grab loyaltyProgramId from path params

        console.log(transactionData[0]);

        return [transactionData[0], loyaltyProgramId];

      } catch (error) {
        response.status(500).json({ error: error.message });
      }
    };

  //to update bank-app database
  updateDBandNotifs = async (data, loyaltyProgram) => {
    if (data == null || data == undefined || data.length == 0) {
      return;
    }
    else {
      let systemId = data["systemId"];
      let outcome_code = data["outcomeCode"];
      let userId = await this.updateOutcomeCodes(systemId, outcome_code, loyaltyProgram);

      //userId used for WebSocket connection
      this.sendPushNotification(userId, outcome_code);
      };
    }
  

  //update bank app database if outcomeCode is updated
  updateOutcomeCodes = async (systemId, outcome_code, loyaltyProgram) => {
    //specific loyaltyProgram collection in the bank app database
    const collection_connection = mongoose.model(loyaltyProgram, transactionSchema, loyaltyProgram);

    const userIdCollection = await collection_connection.find({ "systemId": systemId }, { "userId": 1, "_id" :0 });
    const userIdObject = userIdCollection[0];
    const userId = userIdObject["userId"];
    collection_connection.updateOne({ "systemId": systemId }, { $set: { "outcomeCode": outcome_code } }).exec();
    return userId;
  };


  //send web push notif to user whose transaction was just updated
  sendPushNotification = async (userId, outcomeCode) => {
    sendMessagetoClient(clients, userId, outcomeCode, 0);
  };

}
const webhookController = new WebhookController();

module.exports = webhookController;
