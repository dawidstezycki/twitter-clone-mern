const userRouter = require('express').Router();
const { getUsers, getUser, createUser, updateUserAdmin} = require('./userController');

userRouter.get('/', getUsers);
userRouter.get('/:id', getUser);
userRouter.post('/', createUser);
userRouter.put('/:id', updateUserAdmin);

module.exports = userRouter;
