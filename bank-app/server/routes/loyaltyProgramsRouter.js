const loyaltyProgramsRouter = require('express').Router();
const loyaltyProgramsController = require('../controllers/loyaltyProgramsController');

// Router to handle get request
loyaltyProgramsRouter.get('/', loyaltyProgramsController.getLoyaltyPrograms);

module.exports = loyaltyProgramsRouter;