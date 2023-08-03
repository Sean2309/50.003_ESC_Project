const axios = require('axios');
const { TRANSFER_CONNECT_API_URL } = require('../utils/config.js');
const { PARTNER_CODE } = require('../utils/config.js');
const { mongoose } = require('mongoose');
const transactionSchema = require('../models/transactionEnquiryModel.js').transactionSchema;
const loyaltyPrograms = require('../models/transactionEnquiryModel.js').loyaltyPrograms;
const clients = require('./notificationServerController.js').clients;
const sendMessagetoClient = require('./notificationSendingController.js').sendMessagetoClient;

class TransactionEnquiryController {

  constructor(startInterval = true) {
    this.IntervalId = null;
    if (startInterval) {
      this.startEnquiry();
    }
  }

  populateTransactions = async () => {
    const transactionModel = mongoose.model("AirAsia", transactionSchema, "AirAsia");
    
    await transactionModel.deleteMany({});

    const transactions = [
      {
        "membershipId": "1234",
        "memberName": "keith low",
        "transferDate": "11-11-11",
        "transferAmount": 300,
        "referenceNumber": "123132",
        "partnerCode": "DBSSG",
        "outcomeCode": "1",
        "notificationMethod": "0",
        "emailAddress": "email@address.com",
        "phoneNumber": "88910101",
        "systemId": "1"
      },
      {
        "membershipId": "1234",
        "memberName": "keith low",
        "transferDate": "11-11-11",
        "transferAmount": 300,
        "referenceNumber": "123132",
        "partnerCode": "DBSSG",
        "outcomeCode": "1",
        "notificationMethod": "0",
        "emailAddress": "email@address.com",
        "phoneNumber": "88910101",
        "systemId": "3"
      },
      {
        "membershipId": "1234",
        "memberName": "keith low",
        "transferDate": "11-11-11",
        "transferAmount": 300,
        "referenceNumber": "123132",
        "partnerCode": "DBSSG",
        "outcomeCode": "1",
        "notificationMethod": "0",
        "emailAddress": "email@address.com",
        "phoneNumber": "88910101",
        "systemId": "2"
      }
    ]
    
    await transactionModel.create(transactions);

  }

  getUserTransactions = async (request, response) => {
    const userId = request.params.userId;

    // mock transactions ids in userProfile by systemId
    // TODO: retrieve from userProfile in integration by userId
    const mockTransactionIds = ["1", "2", "3"];
    
    this.populateTransactions();

    const allTransactions = [];

    for(const loyaltyProgram of loyaltyPrograms) {

      const transactionModel = mongoose.model(loyaltyProgram, transactionSchema, loyaltyProgram);

      const retrievedTransactions = await transactionModel.find({ systemId: { $in: mockTransactionIds } });

      allTransactions.push(retrievedTransactions);
    }

    response.json(allTransactions);
  }

  //search through loyaltyProgram collection stored in bank app
  //for transactions whose outcomeCode field isnt updated
  getReferenceNumbers = async (loyaltyProgram) => {
    //connect to specific collection
    const collection_connection = mongoose.model(loyaltyProgram, transactionSchema, loyaltyProgram);

    //remember to define variables first
    let systemIds = [];
    try {
      //find those that don't have outcomeCode declared or values are empty
      let transactions = await collection_connection.find({ "outcomeCode": { $exists: false } }, { "systemId": 1, "_id": 0 });
      if (transactions.length != 0) {
        console.log(`Found reference numbers for ${loyaltyProgram}:`, transactions);
        systemIds = (transactions.map(transaction => transaction['systemId']));
      } else {
        console.log(`No reference numbers found for ${loyaltyProgram}`);
      }
    }
    catch (error) {
      console.error(`Error finding reference numbers for ${loyaltyProgram}:`, error);
      return error;
    };
    return systemIds;
  }


  //to TransferConnect to get outcomeCodes
  makeApiRequest = async (id_list, loyaltyProgram) => {

    //return if no transaction to poll for
    if (id_list.length === 0) {
      console.log(`${loyaltyProgram} id_list is null`)
      return;
    }
    var response;

    //id_list is obtained from getReferenceNumbers
    let string_ids = (id_list).join();

    ///DBS since we set our bank-app currently to be DBS, can be changed accordingly in .env
    let url = TRANSFER_CONNECT_API_URL + '/transferconnect/check/' + PARTNER_CODE + '/' + loyaltyProgram;
    url = url + "/" + string_ids;
    console.log(url);
    try {
      response = await axios.get(url); // Await the API response
      if (response.data == null || response.data == undefined) {
        console.log("API request response is null");
        return;
      }
      else {
        console.log("returning response.data");
        //console.log(response.data);
        return response.data;
      }

    } catch (error) {
      // Handle any errors
      //console.error(error);
      return error;
    };
  }

  //to update bank-app database
  updateDBandNotifs = async (response_data, loyaltyProgram) => {
    if (response_data == null || response_data == undefined || response_data.length == 0) {
      console.log(`response_data for ${loyaltyProgram} is null`)
    }
    else {
      for (const data of response_data) {
        let systemId = data["systemId"];
        let outcome_code = data["outcomeCode"];
        let membershipId = data["membershipId"];
        this.updateOutcomeCodes(systemId, outcome_code, loyaltyProgram);

        console.log(`Updated ${systemId} of ${loyaltyProgram} with outcomeCode ${outcome_code}`);
        //membershipId used for WebSocket connection
        this.sendPushNotification(membershipId, outcome_code);
      };
    }
  }

  //update bank app database if outcomeCode is updated
  updateOutcomeCodes = async (systemId, outcome_code, loyaltyProgram) => {
    //specific loyaltyProgram collection in the bank app database
    const collection_connection = mongoose.model(loyaltyProgram, transactionSchema, loyaltyProgram);
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
      //repeat for every loyaltyProgram stored in bank app database
      for (const loyaltyProgram of loyaltyPrograms) {
        try {
          const id_list = await this.getReferenceNumbers(loyaltyProgram);
          const response_data = await this.makeApiRequest(id_list, loyaltyProgram);
          await this.updateDBandNotifs(response_data, loyaltyProgram);
        }
        catch (error) {
          // Handle any errors that occur during the promise chain
          //console.error(error);
          return error;
        };
        console.log('\n');
      }
    }, 5 * 1000); // 5 seconds
  }

  //used for testing
  stopEnquiry = () => {
    clearInterval(this.IntervalId);
    this.IntervalId = null;
  }

}

const transactionEnquiryController = new TransactionEnquiryController();


module.exports = transactionEnquiryController;