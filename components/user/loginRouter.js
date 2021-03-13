const loginRouter = require('express').Router();
const { loginUser } = require('./loginController');

loginRouter.post('/', loginUser);

module.exports = loginRouter;