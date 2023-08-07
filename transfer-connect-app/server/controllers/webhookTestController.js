const webhookController = require('../controllers/webhookController')

async function testWebhook(req,res) {
   webhookController.processRoute("8909890", "DBSSG", 123, "GOPOINTS");
}

module.exports = testWebhook;