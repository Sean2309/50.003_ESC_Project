const mongoose = require('mongoose');
const transactionSchema = require('../models/transactionEnquiryModel');

class CreateMongoDBCollection {

    constructor() {
    };

  
  createData = async ()=> {
    this.clearTransactions();
    this.populateTransactions();
  };

  clearTransactions = async () => {
    const transactionModelGOPOINTS = mongoose.model("GOPOINTS", transactionSchema, "GOPOINTS");
    const transactionModelASIAMILES = mongoose.model("ASIAMILES", transactionSchema, "ASIAMILES");

    await transactionModelGOPOINTS.deleteMany({});
    await transactionModelASIAMILES.deleteMany({});
  };

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
        "notificationMethod": 1,
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
        "notificationMethod": 1,
        "emailAddress": "leelxuan@gmail.com",
        "phoneNumber": "+6588669619",
        "systemId": "666611",
        "userId": "1"
      }
    ];

    const transactionsASIAMILES = [
      {
        "membershipId": "98765432110",
        "memberName": "johnny",
        "transferDate": "2023-08-08",
        "transferAmount": 77,
        "referenceNumber": "7777777",
        "partnerCode": "DBSSG",
        "notificationMethod": 1,
        "emailAddress": "leelxuan@gmail.com",
        "phoneNumber": "+6588669619",
        "systemId": "666655",
        "userId": "1"
      }
      ];

    await transactionModelASIAMILES.create(transactionsASIAMILES);
    await transactionModelGOPOINTS.create(transactionsGOPOINTS);

  };

};

const createMongoDBCollection = new CreateMongoDBCollection();
module.exports = createMongoDBCollection;