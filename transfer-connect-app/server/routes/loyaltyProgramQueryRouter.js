const loyaltyProgramQueryController = require('../controllers/loyaltyProgramQueryController');

const loyaltyProgramQueryRouter = require('express').Router();


  // Router to handle GET request to /api/loyaltyprograms

console.log("In router")
loyaltyProgramQueryRouter.get('/:partnerCode', loyaltyProgramQueryController.getLoyaltyPrograms)

module.exports = loyaltyProgramQueryRouter;