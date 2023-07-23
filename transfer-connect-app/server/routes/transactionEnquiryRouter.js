const express = require('express');
const transactionController = require('../controllers/transactionEnquiryController.js');
var router = express.Router();



router.get('/check/:bank_app/:loyalty_program/:referencenumber', async function(req, res, next) {
    const id = req.params;
  if (id == null){
      return;
  }
  console.log(id.loyalty_program);
  console.log(id.bank_app);
  console.log(id.referencenumber);
  const transactionEnquiryController = new transactionController();
  transactionEnquiryController.processRoute(req,res);
});



module.exports = {router};


