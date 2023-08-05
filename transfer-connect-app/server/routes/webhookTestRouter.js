const webhookTestRouter = require('express').Router();
const testWebhook = require('../controllers/webhookTestController');

webhookTestRouter.get('/', testWebhook);

module.exports = webhookTestRouter;