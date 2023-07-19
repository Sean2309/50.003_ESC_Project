const transferFormRouter = require('express').Router();
const transferFormController = require('../controllers/transferFormController');

// Route for creating a new transfer form, with path parameter to different loyaltyProgram
transferFormRouter.post('/:loyaltyProgramId', transferFormController.submitTransferForm)

module.exports = transferFormRouter;