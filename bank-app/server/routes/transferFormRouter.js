const transferFormRouter = require('express').Router();
const transferFormController = require('../controllers/transferFormController');

// Easy debug GET
transferFormRouter.get('/', transferFormController.getAllForms);

// Route for creating a new transfer form
transferFormRouter.post('/', transferFormController.submitTransferForm)

module.exports = transferFormRouter;