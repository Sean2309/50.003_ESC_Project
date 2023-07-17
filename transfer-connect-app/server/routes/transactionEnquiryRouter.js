const express = require('express');
const transactionController = require('../controllers/transactionEnquiryController.js');
const messageNotification = require('../controllers/messageNotification.js');
var router = express.Router();



router.get('/check/:bank_app/:loyalty_program/:referencenumber', async function(req, res, next) {
    const id = req.params;
  if (id == null){
      return;
  }
  console.log(id.loyalty_program);
  console.log(id.bank_app);
  console.log(id.referencenumber);
    transactionController.processRoute(req, res);
});

router.get('/sendemail', async function(req, res, next) {
  messageNotification.sendMessages();
  transactionController.sendingEmail();
});


module.exports = {router};


