const authManagerController = require('../controllers/authManagerController');

const authManagerRouter = require('express').Router();


// Route to handle POST
authManagerRouter.post('/', authManagerController.userAuthentication);

module.exports = authManagerRouter;