const axios = require('axios');
const { TRANSFER_CONNECT_API_URL } = require('../utils/config.js');
const { PARTNERCODE } = require('../utils/config.js');
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
    // for easy debug, clear and populate all transactions (without outcomeCode) on each startup
    this.populateTransactions();
  }
  
  populateTransactions = async () => {
    const transactionModelGOPOINTS = mongoose.model("GOPOINTS", transactionSchema, "GOPOINTS");
    const transactionModelASIAMILES = mongoose.model("ASIAMILES", transactionSchema, "ASIAMILES");

    await transactionModelGOPOINTS.deleteMany({});
    await transactionModelASIAMILES.deleteMany({});

    const transactionsGOPOINTS = [
      {
        "membershipId": "987654321A",
        "memberName": "johnny",
        "transferDate": "2023-08-08",
        "transferAmount": 123,
        "referenceNumber": "8909890",
        "partnerCode": "DBSSG",
        "notificationMethod": 2,
        "emailAddress": "leelxuan@gmail.com",
        "phoneNumber": "+6588669619",
        "systemId": "666666",
        "userId": "1"
      },
      {
        "membershipId": "987654321A",
        "memberName": "johnny",
        "transferDate": "2023-08-08",
        "transferAmount": 789,
        "referenceNumber": "8909111",
        "partnerCode": "DBSSG",
        "notificationMethod": 2,
        "emailAddress": "leelxuan@gmail.com",
        "phoneNumber": "+6588669619",
        "systemId": "666611",
        "userId": "1"
      }
    ]

    const transactionsASIAMILES = [
      {
        "membershipId": "98765432110",
        "memberName": "johnny",
        "transferDate": "2023-08-08",
        "transferAmount": 77,
        "referenceNumber": "7777777",
        "partnerCode": "DBSSG",
        "notificationMethod": 2,
        "emailAddress": "leelxuan@gmail.com",
        "phoneNumber": "+6588669619",
        "systemId": "666655",
        "userId": "1"
      }
      ]

    await transactionModelASIAMILES.create(transactionsASIAMILES);
    await transactionModelGOPOINTS.create(transactionsGOPOINTS);

  }

  //get all transactions of user to display on transactions webpage
  getUserTransactions = async (request, response) => {
    const userId = request.body.userId;

    const allTransactions = {};

    for (const loyaltyProgram of loyaltyPrograms) {

      const transactionModel = mongoose.model(loyaltyProgram, transactionSchema, loyaltyProgram);

      const retrievedTransactions = await transactionModel.find({ userId: userId });

      allTransactions[loyaltyProgram] = retrievedTransactions;

    }

    response.json(allTransactions);
  }

  //search through loyaltyProgram collection stored in bank app
  //for transactions whose outcomeCode field isnt updated
  getReferenceNumbers = async (loyaltyProgram) => {
    //connect to specific collection
    const collection_connection = mongoose.model(loyaltyProgram, transactionSchema, loyaltyProgram);

    let systemIds = [];
    try {

      //find those that don't have outcomeCode declared or values are empty
      let transactions = await collection_connection.find({ "outcomeCode": { $exists: false } }, { "systemId": 1, "_id": 0 });
      if (transactions.length != 0) {
        systemIds = (transactions.map(transaction => transaction['systemId']));
      };
    }
    catch (error) {
      return error;
    };
    return systemIds;
  }


  //to TransferConnect to get outcomeCodes
  makeApiRequest = async (id_list, loyaltyProgram) => {

    //return if no transaction to poll for
    if (id_list.length === 0) {
      return;
    }
    var response;

    //id_list is obtained from getReferenceNumbers
    let string_ids = (id_list).join();

    ///PARTNERCODE is not DBSSG 
    let url = TRANSFER_CONNECT_API_URL + '/api/transactionenquiry/check/' + PARTNERCODE + '/' + loyaltyProgram;
    url = url + "/" + string_ids;
    try {
      response = await axios.get(url); // Await the API response
      if (response.data == null || response.data == undefined) {
        return;
      }
      else {
        return response.data;
      }

    } catch (error) {

      // Handle any errors
      return error;
    };
  }

  //to update bank-app database
  updateDBandNotifs = async (response_data, loyaltyProgram) => {
    if (response_data == null || response_data == undefined || response_data.length == 0) {
      return;
    }
    else {
      for (const data of response_data) {
        let systemId = data["systemId"];
        let outcome_code = data["outcomeCode"];
        let userId = await this.updateOutcomeCodes(systemId, outcome_code, loyaltyProgram);

        //userId used for WebSocket connection
        this.sendPushNotification(userId, outcome_code);
      };
    }
  }

  //update bank app database if outcomeCode is updated
  updateOutcomeCodes = async (systemId, outcome_code, loyaltyProgram) => {
    //specific loyaltyProgram collection in the bank app database
    const collection_connection = mongoose.model(loyaltyProgram, transactionSchema, loyaltyProgram);
    //find userId 
    const userIdCollection = await collection_connection.find({ "systemId": systemId }, { "userId": 1 });
    const userIdObject = userIdCollection[0];
    const userId = userIdObject["userId"];
    collection_connection.updateOne({ "systemId": systemId }, { $set: { "outcomeCode": outcome_code } }).exec();
    return userId;
  }


  //send web push notif to user whose transaction was just updated
  sendPushNotification = async (userId, outcomeCode) => {
    sendMessagetoClient(clients, userId, outcomeCode, 0);
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
          return error;
        };
        
      }
    }, 5 * 1000); // 5 seconds
  }

  //used for testing
  stopEnquiry = () => {
    clearInterval(this.IntervalId);
    this.IntervalId = null;
  }

}

//setInterval to true to make the interval run 
const transactionEnquiryController = new TransactionEnquiryController(startInterval = true);


module.exports = transactionEnquiryController;