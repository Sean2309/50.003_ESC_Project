const express = require('express');
const transactionController = require('../controllers/transactionEnquiryController.js');
const transactionEnquiryRouter = express.Router();



transactionEnquiryRouter.get('/check/:bank_app/:loyalty_program/:systemId', async function(req, res, next) {
    const id = req.params;
  if (id == null){
      return;
  }
  transactionController.processRoute(req,res);
});



module.exports = transactionEnquiryRouter;


