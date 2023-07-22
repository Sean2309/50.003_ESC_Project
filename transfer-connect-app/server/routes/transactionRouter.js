const transactionRouter = require('express').Router();
const transactionController = require('../controllers/transactionController');
const validateTransaction = require('../utils/validateTransaction');

// Route for creating a new transfer form
transactionRouter.post('/:loyaltyProgramId', validateTransaction, transactionController.submitTransaction)

module.exports = transactionRouter;