const { TRANSFER_CONNECT_API_URL } = require('../utils/config.js');
const transactionSchema = require('../models/transactionEnquiryModel.js');
const mongoose  = require('mongoose');
const sendEmail = require('./emailNotification.js');


//can improve code by using caching for faster data retrieval

//processRoute
async function processRoute(req, res){
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
  const database_connection = mongoose.connection.useDb(loyalty_program_name);
  const collection_connection = database_connection.model(bank_name, transactionSchema, bank_name);

  //pass in reference numbers
  const id_list = id.referencenumber.split(",");
  console.log(id_list);
  const transactions = await getOutcomeCode(collection_connection, id_list);

  res.send(transactions);
  return;
}



async function getOutcomeCode(collection_connection, id_list){
  console.log(id_list);
  let outcomeCodes = [];
  //use of instead of in - in makes 0000 into 0 
  for (let id of id_list){
    console.log(id);
    //use .lean().exec() to return an obj instead of document
    //check if referenceNumber has outcomeCode field + not empty
    await collection_connection.find({"referenceNumber": id, "outcomeCode":{$exists: true, $ne:""}}, {"outcomeCode": 1, "referenceNumber": 1, "_id": 0, "notificationMethod": 1 }).lean().exec()
    .then(user => {
      if (user[0] != null) {
        console.log('Found transactions:', user);
        outcomeCodes.push(user[0]);
        if (isNaN(user[0].notificationMethod)){

          //notify user
          console.log('sendemailed');
          console.log(user[0].notificationMethod)
          sendEmail.main(user[0].notificationMethod).catch(console.error);}

      } else {
        console.log('Outcome code not updated or transaction not found.');
      }
    })
    .catch(error => {
      console.error('Error finding transaction:', error);
  });}
  return outcomeCodes;
  };

  async function sendingEmail(){
    const database_connection = mongoose.connection.useDb('GoJet');
    const collection_connection = database_connection.model('DBS', transactionSchema, 'DBS');

    //pass in reference numbers
    const id_list = ["0000"];
    console.log("sendingEmail function")
    const transactions = await getOutcomeCode(collection_connection, id_list);

    return;
  }

module.exports = {processRoute, sendingEmail};