const loyaltyPrograms = require('../models/transactionEnquiryModel').loyaltyprograms;
//get from login later on
const membershipId = "123oij"

class TransactionDisplayController {
  constructor() {
  }

  getAllUserTransactions = async () => {
    try{
        const allTransactions = [];
        for (var loyaltyProgram in loyaltyPrograms){
        //connect to specific collection
            const collection_connection = mongoose.model(loyaltyProgram, transactionSchema, loyaltyProgram);
            const transactionOneProgram = await collection_connection.find({ "membershipId": membershipId});
            allTransactions.push(transactionOneProgram)
        }
        console.log(allTransactions);
      response.json({ allTransactions });
    } catch (error) {
      console.error(error);
      response.status(500).json({ error });
    }
  };

}

const transactionDisplayController = new TransactionDisplayController();

module.exports = transactionDisplayController;