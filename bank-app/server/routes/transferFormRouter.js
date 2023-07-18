const transferFormRouter = require('express').Router();
const transferFormController = require('../controllers/transferFormController');

// // Easy debug GET
transferFormRouter.get('/', transferFormController.getAllForms);

// Route for creating a new transfer form, with path parameter to different loyaltyProgram
transferFormRouter.post('/:loyaltyProgramId', transferFormController.submitTransferForm)

module.exports = transferFormRouter;