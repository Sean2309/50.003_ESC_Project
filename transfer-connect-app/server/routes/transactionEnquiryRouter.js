const express = require('express');
const transactionController = require('../controllers/transactionEnquiryController.js');
var router = express.Router();



router.get('/check/:bank_app/:loyalty_program/:systemId', async function(req, res, next) {
    const id = req.params;
  if (id == null){
      return;
  }
  console.log(id.loyalty_program);
  console.log(id.bank_app);
  console.log(id.systemId);
  //const transactionEnquiryController = new transactionController();
  transactionController.processRoute(req,res);
});



module.exports = {router};


