const transactionRouter = require('express').Router();
const transactionController = require('../controllers/transactionController');

// Route for creating a new transfer form
transactionRouter.post('/:loyaltyProgramId', transactionController.submitTransaction)

module.exports = transactionRouter;