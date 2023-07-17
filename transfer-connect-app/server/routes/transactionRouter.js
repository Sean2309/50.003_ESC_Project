const transactionRouter = require('express').Router();
const transactionController = require('../controllers/transactionController');

/* 
  sample data format
  {
    embershipId": "1021030213",
      "memberName": "kei lowth
    "transferDate", "23-10-2000"",
    "transferAmount": "2000"    
  }

*/


// Easy debug GET
transactionRouter.get('/', transactionController.getAllForms);

// Route for creating a new transfer form
transactionRouter.post('/', transactionController.submitTransaction)

module.exports = transactionRouter;