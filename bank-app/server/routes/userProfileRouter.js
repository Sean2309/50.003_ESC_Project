const userProfileRouter = require('express').Router();

const userProfileController = require('../controllers/userProfileController');

// Route to get userProfile details
userProfileRouter.get('/', userProfileController.authenticateToken, userProfileController.getUserProfile);

module.exports = userProfileRouter;