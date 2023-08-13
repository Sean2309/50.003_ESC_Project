const webhookController = require('../controllers/webhookController')

//only for testing - ignore this function
async function testWebhook(req,res) {
   webhookController.processRoute("8909890", "DBSSG", 123, "GOPOINTS");
}

module.exports = testWebhook;