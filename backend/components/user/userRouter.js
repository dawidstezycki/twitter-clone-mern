const userRouter = require('express').Router();
const {
  getUsers,
  getUser,
  createUser,
  updateUser,
} = require('./userController');

userRouter.get('/', getUsers);
userRouter.get('/:id', getUser);
userRouter.post('/', createUser);
userRouter.put('/:id', updateUser);

module.exports = userRouter;
