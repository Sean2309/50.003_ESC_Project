const transactionEnquiryRouter = require('express').Router();

const transactionEnquiryController = require('../controllers/transactionEnquiryController');

// Router to handle get request

transactionEnquiryRouter.get('/:userId', transactionEnquiryController.getUserTransactions);

module.exports = transactionEnquiryRouter;