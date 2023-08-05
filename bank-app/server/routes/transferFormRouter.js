const transferFormRouter = require('express').Router();
const transferFormController = require('../controllers/transferFormController');
const validateTransaction = require('../utils/validateTransaction');
const userProfileController = require('../controllers/userProfileController');

// Route for creating a new transfer form, with path parameter to different loyaltyProgram
transferFormRouter.post('/:loyaltyProgramId',
    userProfileController.authenticateToken,
    validateTransaction,
    transferFormController.submitTransferForm,
    userProfileController.updateSuccessfulTransaction
);

module.exports = transferFormRouter;