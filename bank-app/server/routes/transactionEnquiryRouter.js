const transactionEnquiryRouter = require('express').Router();
const transactionDisplayController = require('../controllers/transactionDisplayController');

// Router to handle get request

transactionEnquiryRouter.get('/', transactionDisplayController.getAllUserTransactions);

module.exports = transactionEnquiryRouter;