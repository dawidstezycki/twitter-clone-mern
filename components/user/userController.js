const bcrypt = require('bcrypt');
const User = require('./userModel');
const jwt = require('jsonwebtoken');

const getToken = (request) => {
  const authorization = request.get('authorization');
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7);
  }
  return null;
};

const getUsers = async (request, response) => {
  const users = await User.find({}).populate('microposts', {
    content: 1,
    date: 1,
  });
  response.json(users.map((u) => u.toJSON()));
};

const getUser = async (request, response) => {
  const user = await User.findById(request.params.id).populate('microposts', {
    content: 1,
    date: 1,
  });
  response.json(user.toJSON());
};

const createUser = async (request, response) => {
  const body = request.body;

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(body.password, saltRounds);

  const user = new User({
    username: body.username,
    email: body.email,
    passwordHash,
  });

  const savedUser = await user.save();

  response.json(savedUser);
};

const updateUserAdmin = async (request, response) => {
  const body = request.body;
  const token = getToken(request);
  const decodedToken = jwt.verify(token, process.env.SECRET);

  if (!token || !decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' });
  }

  const user = await User.findById(decodedToken.id);

  if (user.admin) {
    const userToUpdate = {
      admin: body.admin,
    };

    const updatedUser = await User.findByIdAndUpdate(
      request.params.id,
      userToUpdate,
      { new: true }
    );
    return response.json(updatedUser.toJSON());
  }

  return response.status(401).json({ error: 'unauthorized user' });
};

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUserAdmin,
};
