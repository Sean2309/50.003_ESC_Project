const axios = require('axios');
const { TRANSFER_CONNECT_API_URL } = require('../utils/config.js');
const {PARTNER_CODE} = require('../utils/config.js');
const { mongoose } = require('mongoose');
const transactionSchema = require('../models/transactionEnquiryModel.js').transactionSchema;
const loyaltyprograms = require('../models/transactionEnquiryModel.js').loyaltyprograms;
const clients = require('./notificationServerController.js').clients;
const sendMessagetoClient = require('./notificationSendingController.js').sendMessagetoClient;


class TransactionEnquiryController {
  
  constructor(startInterval = true) {
    this.IntervalId = null;
    if (startInterval){
      this.startEnquiry();
    }
  }

  //search through loyaltyprogram collection stored in bank app
  //for transactions whose outcomeCode field isnt updated
  getReferenceNumbers = async (loyaltyprogram) => {
    //connect to specific collection
    const collection_connection = mongoose.model(loyaltyprogram, transactionSchema, loyaltyprogram);

    //remember to define variables first
    let systemIds = [];
    try{
    //find those that don't have outcomeCode declared or values are empty
    let transactions = await collection_connection.find({ "outcomeCode": { $exists: false} }, { "systemId": 1, "_id": 0});
      if (transactions.length != 0) {
        console.log(`Found reference numbers for ${loyaltyprogram}:`, transactions);
        systemIds = (transactions.map(transaction => transaction['systemId']));
      } else {
        console.log(`No reference numbers found for ${loyaltyprogram}`);
      }
    }
    catch (error) {
      console.error(`Error finding reference numbers for ${loyaltyprogram}:`, error);
      return error;
    };
    return systemIds;
  }

  
  //to TransferConnect to get outcomeCodes
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
    let url = TRANSFER_CONNECT_API_URL + '/transferconnect/check/' + PARTNER_CODE +'/' + loyaltyprogram;
    url = url + "/" + string_ids;
    console.log(url);
    try {
      response = await axios.get(url); // Await the API response
      if(response == null || response == undefined){
        console.log("API request response is null");
        return;
      }
      else{
        console.log("returning response.data");
        //console.log(response.data);
        return response.data;
      }
      
    } catch (error) {
      // Handle any errors
      console.error(error);
      return error;
    };
  }


  //to update bank-app database
  updateDBandNotifs = async (response_data, loyaltyprogram) => {
    if (response_data == null || response_data == undefined || response_data.length == 0) {
      console.log(`response_data for ${loyaltyprogram} is null`)
    }
    else{
    for (const data of response_data) {
      let systemId = data["systemId"];
      let outcome_code = data["outcomeCode"];
      let membershipId = data["membershipId"];
      this.updateOutcomeCodes(systemId, outcome_code, loyaltyprogram);
      console.log(`Updated ${systemId} of ${loyaltyprogram} with outcomeCode ${outcome_code}`);
      //membershipId used for WebSocket connection
      this.sendPushNotification(membershipId, outcome_code);
    };
  }
  }

  //update bank app database if outcomeCode is updated
  updateOutcomeCodes = async (systemId, outcome_code, loyaltyprogram) => {
    //specific loyaltyprogram collection in the bank app database
    const collection_connection = mongoose.model(loyaltyprogram, transactionSchema, loyaltyprogram);
    collection_connection.updateOne({ "systemId": systemId }, { $set: { "outcomeCode": outcome_code } }).exec();
  }


  //send web push notif to user whose transaction was just updated
  sendPushNotification = async (membershipId, outcomeCode) => {
    console.log("membershipID: " + membershipId);
    sendMessagetoClient(clients, membershipId, outcomeCode, 0);
  }


  //trigger for setInterval
  startEnquiry = async () => {
    this.IntervalId = setInterval(async () => {
      //repeat for every loyaltyprogram stored in bank app database
      for (const loyaltyprogram of loyaltyprograms) {
        try{
        const id_list = await this.getReferenceNumbers(loyaltyprogram);
        const response_data = await this.makeApiRequest(id_list, loyaltyprogram);
        await this.updateDBandNotifs(response_data, loyaltyprogram);
        }
        catch (error) {
            // Handle any errors that occur during the promise chain
            console.error(error);
            return error;
          };
        console.log('\n');
      }
    }, 5 * 1000); // 5 seconds
  }

  //used for testing
  stopEnquiry = () =>{
    clearInterval(this.IntervalId);
    this.IntervalId = null;
}

}


module.exports = {TransactionEnquiryController};