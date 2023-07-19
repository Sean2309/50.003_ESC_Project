const transactionRouter = require('express').Router();
const transactionController = require('../controllers/transactionController');

// // Easy debug GET
// transactionRouter.get('/', transactionController.getAllForms);

// Route for creating a new transfer form
transactionRouter.post('/:loyaltyProgramId', transactionController.submitTransaction)

module.exports = transactionRouter;