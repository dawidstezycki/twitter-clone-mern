const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Micropost = require('../components/micropost/micropostModel');
const User = require('../components/user/userModel');

const initialMicroposts = [
  {
    content: 'Going for the walk with the dog',
    date: new Date(),
  },
  {
    content: 'I need to do some grocery shopping',
    date: new Date(),
  },
];

const testingAdminCredentials = {
  username: 'admin',
  email: 'admin@admin.com',
  password: 'admin',
  admin: true,
};

const testingUserCredentials = {
  username: 'testing',
  email: 'testing@testing.com',
  password: 'testing',
  admin: false,
};

const addUserFromCredentials = async (credentials) => {
  const passwordHash = await bcrypt.hash(credentials.password, 10);
  const user = new User({
    username: credentials.username,
    email: credentials.email,
    admin: credentials.admin,
    passwordHash,
  });
  const savedUser = await user.save();
  return savedUser;
};

const nonExistingMicropostId = async () => {
  const passwordHash = await bcrypt.hash('toberemoved', 10);
  const user = new User({
    username: 'toBeRemoved',
    email: 'toberemoved@toberemoved.com',
    admin: true,
    passwordHash,
  });
  const userToBeRemoved = await user.save();

  const micropostToBeRemoved = new Micropost({
    content: 'toberemoved',
    date: new Date(),
    user: userToBeRemoved.id,
  });
  await micropostToBeRemoved.save();
  await micropostToBeRemoved.remove();

  return micropostToBeRemoved._id.toString();
};

const getMicropostsInDb = async () => {
  const microposts = await Micropost.find({});
  return microposts.map((micropost) => micropost.toJSON());
};

const getUsersInDb = async () => {
  const users = await User.find({});
  return users.map((u) => u.toJSON());
};

const getUserFromDbById = async (userId) => {
  const user = await User.findById(userId);
  return user.toJSON();
};

const getUserTokenByUsername = async (username) => {
  const user = await User.findOne({ username });
  const userForToken = {
    username: user.username,
    id: user._id,
  };
  return jwt.sign(userForToken, process.env.SECRET);
};

const getMicropostsByUsername = async (username) => {
  const user = await User.findOne({ username });
  const microposts = await Micropost.find({ user: user._id });
  return microposts.map((micropost) => micropost.toJSON());
};

module.exports = {
  initialMicroposts,
  testingUserCredentials,
  testingAdminCredentials,
  addUserFromCredentials,
  nonExistingMicropostId,
  getMicropostsInDb,
  getUsersInDb,
  getUserFromDbById,
  getUserTokenByUsername,
  getMicropostsByUsername
};
