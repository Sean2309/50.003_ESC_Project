const webhookController = require('../controllers/webhookController')

async function testWebhook(req,res) {
   console.log("testWebhook called");
   webhookController.processRoute("8909890", "DBSSG", 123, "GOPOINTS");
}

module.exports = testWebhook;