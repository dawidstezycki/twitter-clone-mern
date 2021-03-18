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
  const user = await User.findById(request.params.id).populate([{
    path: 'microposts',
    model: 'Micropost',
    populate: {
      path: 'user',
      model: 'User',
      select: { username: 1, id: 1 },
    },
  },
  {
    path: 'relationships',
    model: 'Relationship',
    populate: [
      {
        path: 'follower',
        model: 'User',
        select: { username: 1 },
      },
      {
        path: 'followed',
        model: 'User',
        select: { username: 1 },
      },
    ]
  }
]);
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

const updateUser = async (request, response) => {
  const body = request.body;
  const token = getToken(request);
  const decodedToken = jwt.verify(token, process.env.SECRET);

  if (!token || !decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' });
  }

  const user = await User.findById(decodedToken.id);

  const userToUpdate = await User.findById(request.params.id);
  const isUserSameAsToUpdate = userToUpdate.id.toString() === user.id;

  if (user.admin || isUserSameAsToUpdate) {
    const newUserObject = {
      relationships: body.relationships,
    };

    if (body.admin != null) {
      if (user.admin) {
        newUserObject.admin = body.admin;
      } else {
        return response.status(401).json({ error: 'unauthorized user' });
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      request.params.id,
      newUserObject,
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
  updateUser,
};
