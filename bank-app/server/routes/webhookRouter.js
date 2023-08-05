const webhookRouter = require('express').Router();
const webhookController = require('../controllers/webhookController');
const PARTNERCODE = require('../utils/config').PARTNERCODE

// Route for creating a new transfer form, with path parameter to different loyaltyProgram
webhookRouter.post(`/${PARTNERCODE}/:loyaltyProgramId`, webhookController.processData);

module.exports = webhookRouter;