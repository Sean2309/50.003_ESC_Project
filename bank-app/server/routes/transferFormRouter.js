const transferFormRouter = require('express').Router();
const transferFormController = require('../controllers/transferFormController');
const validateTransferForm = require('../utils/validateTransferForm');

// Route for creating a new transfer form, with path parameter to different loyaltyProgram
transferFormRouter.post('/:loyaltyProgramId', validateTransferForm, transferFormController.submitTransferForm)

module.exports = transferFormRouter;