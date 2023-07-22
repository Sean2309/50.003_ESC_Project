const updateLoyaltyProgramsRouter = require('express').Router();
const loyaltyProgramsController = require('../controllers/loyaltyProgramsController');

// Router to handle get request
updateLoyaltyProgramsRouter.get('/', loyaltyProgramsController.updateLoyaltyPrograms);

module.exports = updateLoyaltyProgramsRouter;