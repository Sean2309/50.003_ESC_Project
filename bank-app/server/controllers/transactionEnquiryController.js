const axios = require('axios');
const { TRANSFER_CONNECT_API_URL } = require('../utils/config.js');
const {BANK_NAME} = require('../utils/config.js');
const { mongoose } = require('mongoose');
const transactionSchema = require('../models/transactionEnquiryModel.js').transactionSchema;
const loyaltyprograms = require('../models/transactionEnquiryModel.js').loyaltyprograms;
const clients = require('./notificationServerController.js').clients;
const sendMessagetoClient = require('./notificationSendingController.js').sendMessagetoClient;


class TransactionEnquiryController {
  
  constructor() {
    this.startEnquiry();
  }

  getReferenceNumbers = async (loyaltyprogram) => {
    //connect to specific collection
    const collection_connection = mongoose.model(loyaltyprogram, transactionSchema, loyaltyprogram);

    //remember to define variables first
    let reference_numbers = [];
    //find those that don't have outcomeCode declared or values are empty
    await collection_connection.find({ "outcomeCode": { $exists: false} }, { "referenceNumber": 1, "_id": 0})
      .then(transactions => {
        if (transactions.length != 0) {
          console.log(`Found reference numbers for ${loyaltyprogram}:`, transactions);
          reference_numbers = (transactions.map(transaction => transaction['referenceNumber']));
        } else {
          console.log(`No reference numbers found for ${loyaltyprogram}`);
        }
      })
      .catch(error => {
        console.error(`Error finding reference numbers for ${loyaltyprogram}:`, error);
      });
    return reference_numbers;
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
        return response.data;
      }
      
    } catch (error) {
      // Handle any errors
      console.error(error);
    };
  }


  //to update bank-app database
  updateOutcomeCodes = async (response_data, loyaltyprogram) => {
    //select specific collection
    const collection_connection = mongoose.model(loyaltyprogram, transactionSchema, loyaltyprogram);
    if (response_data == null || response_data == undefined) {
      console.log(`response_data for ${loyaltyprogram} is null`)
      return;
    }
    for (const data of response_data) {
      let reference_number = data["referenceNumber"];
      let outcome_code = data["outcomeCode"];
      collection_connection.updateOne({ "referenceNumber": reference_number }, { $set: { "outcomeCode": outcome_code } }).exec();
      console.log(`Updated ${reference_number} of ${loyaltyprogram} with outcomeCode ${outcome_code}`);
      this.sendPushNotification(outcome_code, reference_number, collection_connection);
    };
    return;
  }

  //finds membershipId of transaction that was just updated, and send push notification to user with that membershipId
  sendPushNotification = async (outcomeCode, reference_number, collection_connection) => {
    //only returns membershipId which will be used as webSocket unique identifier for push notification
    const transaction = await collection_connection.find({"referenceNumber": reference_number}, { "membershipId": 1, "_id": 0}).lean().exec();
    let membershipId = transaction[0].membershipId;
    console.log("membershipID: " + membershipId);
    sendMessagetoClient(clients, membershipId, outcomeCode);
  }

  //trigger for setInterval
  startEnquiry = () => {
    setInterval(() => {
      for (const loyaltyprogram of loyaltyprograms) {
        this.getReferenceNumbers(loyaltyprogram)
          .then(id_list => this.makeApiRequest(id_list, loyaltyprogram))
          .then(response_data => this.updateOutcomeCodes(response_data, loyaltyprogram))
          .catch(error => {
            // Handle any errors that occur during the promise chain
            console.error(error);
          });
          console.log('\n');
      }
    }, 5 * 1000); // 5 seconds
  }

}

const transactionEnquiryController = new TransactionEnquiryController();

module.exports = {transactionEnquiryController};