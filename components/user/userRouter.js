const userRouter = require('express').Router();
const { getUsers, createUser, updateUserAdmin} = require('./userController');

userRouter.get('/', getUsers);
userRouter.post('/', createUser);
userRouter.put('/:id', updateUserAdmin);

module.exports = userRouter;
