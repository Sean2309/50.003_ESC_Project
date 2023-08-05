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
    //await this.updateDBandNotifs(transaction, loyaltyProgramId);
  } 
  processResponse = async (request, response) => {
    try {
        const transactionData = request.body; // see sample data comments above
  
        const { loyaltyProgramId } = request.params; // grab loyaltyProgramId from path params

        console.log("transactionData");
        console.log(transactionData);

        return [transactionData[0], loyaltyProgramId];

      } catch (error) {
        response.status(500).json({ error: error.message });
      }
    };

  //to update bank-app database
  updateDBandNotifs = async (data, loyaltyProgram) => {
    if (data == null || data == undefined || data.length == 0) {
      console.log(`response_data for ${loyaltyProgram} is null`)
    }
    else {
      let systemId = data["systemId"];
      let outcome_code = data["outcomeCode"];
      let userId = await this.updateOutcomeCodes(systemId, outcome_code, loyaltyProgram);

      console.log(`Updated ${systemId} of ${loyaltyProgram} with outcomeCode ${outcome_code}`);
      //userId used for WebSocket connection
      this.sendPushNotification(userId, outcome_code);
      };
    }
  

  //update bank app database if outcomeCode is updated
  updateOutcomeCodes = async (systemId, outcome_code, loyaltyProgram) => {
    //specific loyaltyProgram collection in the bank app database
    const collection_connection = mongoose.model(loyaltyProgram, transactionSchema, loyaltyProgram);
    //find userId 
    const userIdCollection = await collection_connection.find({ "systemId": systemId }, { "userId": 1 });
    const userIdObject = userIdCollection[0];
    const userId = userIdObject["userId"];
    console.log(userId)
    collection_connection.updateOne({ "systemId": systemId }, { $set: { "outcomeCode": outcome_code } }).exec();
    return userId;
  };


  //send web push notif to user whose transaction was just updated
  sendPushNotification = async (userId, outcomeCode) => {
    console.log("membershipID: " + userId);
    sendMessagetoClient(clients, userId, outcomeCode, 0);
  };

}
const webhookController = new WebhookController();

module.exports = webhookController;
