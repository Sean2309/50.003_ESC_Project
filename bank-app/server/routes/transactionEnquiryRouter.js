const transactionEnquiryRouter = require('express').Router();

const transactionEnquiryController = require('../controllers/transactionEnquiryController');

const userProfileController = require('../controllers/userProfileController');

// Router to handle get request

transactionEnquiryRouter.get('/', userProfileController.authenticateToken, transactionEnquiryController.getUserTransactions);

module.exports = transactionEnquiryRouter;