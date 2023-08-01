const { TRANSFER_CONNECT_API_URL } = require('../utils/config.js');
const transactionSchema = require('../models/transactionEnquiryModel.js');
const mongoose  = require('mongoose');
const emailNotification = require('./emailNotification.js');
const messageNotification = require('./messageNotification.js');


//can improve code by using caching for faster data retrieval
class TransactionEnquiryController {

  constructor(){
  }

  //processRoute
  processRoute = async (req, res) =>{
    const id = req.params;
    if (id == null){
        return;
    }
    console.log(id.loyalty_program);
    console.log(id.bank_app);
    console.log(id.referencenumber);

    //connections to specific DB and collection
    var bank_name = id.bank_app;
    var loyalty_program_name = id.loyalty_program;
    let collection_connection;

    if (mongoose.models[loyalty_program_name]) {
      collection_connection = mongoose.model(loyalty_program_name);
    } else {
      collection_connection = mongoose.model(loyalty_program_name, transactionSchema, loyalty_program_name);
    }
    
    //pass in reference numbers
    const id_list = id.referencenumber.split(",");
    console.log(id_list);
    const transactions = await this.getOutcomeCode(collection_connection, id_list, bank_name, loyalty_program_name);

    res.send(transactions);
    return [bank_name, loyalty_program_name, id_list];
  }


  getOutcomeCode = async (collection_connection, id_list, bank_name, loyalty_program_name) =>{
    console.log(id_list);
    let outcomeCodes = [];
    //use of instead of in - in makes 0000 into 0 
    for (let id of id_list){
      console.log(id);
      let user = await this.find_transaction(collection_connection, id, bank_name);
      if (user[0] != null) {
        let user1 = user[0];
        console.log('Found transactions:', user);
        outcomeCodes.push(user[0]);
        this.sendNotification(user1.phoneNumber, user1.emailAddress, user1.notificationMethod, user1.outcomeCode, bank_name, loyalty_program_name, user1.transferAmount);
      } 
      else {
        console.log('Outcome code not updated or transaction not found.');
      }
    }
    return outcomeCodes;
    };

  find_transaction = async(collection_connection, id, bank_name) => {
    //use .lean().exec() to return an obj instead of document
    //check if referenceNumber has outcomeCode field + not empty
    try {
    console.log("find_transaction")
    console.log(id)
    let user = await collection_connection.find({"referenceNumber": id, "outcomeCode":{$exists: true, $ne:""}, "partnerCode": bank_name}, {"outcomeCode": 1, "referenceNumber": 1, "_id": 0, "notificationMethod": 1, "phoneNumber": 1, "emailAddress" : 1, "transferAmount" : 1, "membershipId": 1 }).lean().exec()
    return user;
    } catch(error) {
      //can change this to throw status code
      console.log(error)
      return error
    }
  }


  sendNotification = async (phoneNumber, email, notificationMethod, outcomeCode, bank_name, loyalty_program_name, transferAmount) =>{
    if (notificationMethod == 0){
      //only email
      console.log('sent email');
      emailNotification.sendEmail(email, bank_name, loyalty_program_name, outcomeCode, transferAmount);
    }
    else if (notificationMethod == 1){
      //only phone number
      console.log("sent message")
      messageNotification.sendMessages(phoneNumber, bank_name,loyalty_program_name, outcomeCode, transferAmount);
    }
    else{
      //both
      console.log('sent email');
      emailNotification.sendEmail(email, bank_name, loyalty_program_name, outcomeCode, transferAmount);

      console.log("sent message")
      messageNotification.sendMessages(phoneNumber, bank_name,loyalty_program_name, outcomeCode, transferAmount);
    }
  }

}

const transactionController = new TransactionEnquiryController();



module.exports = {transactionController};