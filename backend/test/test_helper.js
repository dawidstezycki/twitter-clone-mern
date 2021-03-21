const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Micropost = require('../components/micropost/micropostModel');
const User = require('../components/user/userModel');

const initialUsers = [
  {
    username: 'testing',
    email: 'testing@testing.com',
    password: 'testing',
    admin: false,
  },
  {
    username: 'admin',
    email: 'admin@admin.com',
    password: 'admin',
    admin: true,
  },
];

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

const addMicropostAndAssignToUser = async (micropost, userid) => {
  const user = await User.findById(userid);
  const micropostObject = new Micropost({ ...micropost, user: user.id });
  const savedMicropost = await micropostObject.save();
  user.microposts = [...user.microposts, savedMicropost._id];
  await user.save();
  return savedMicropost;
};

const addUserFromCredentials = async (credentials) => {
  const passwordHash = await bcrypt.hash(credentials.password, 10);
  const user = new User({
    username: credentials.username,
    email: credentials.email,
    admin: credentials.admin,
    passwordHash,
  });
  return user.save();
};

const nonExistingUserId = async () => {
  const passwordHash = await bcrypt.hash('toberemoved', 10);
  const userToBeRemoved = new User({
    username: 'toBeRemoved',
    email: 'toberemoved@toberemoved.com',
    admin: true,
    passwordHash,
  });
  await userToBeRemoved.save();
  await userToBeRemoved.remove();
  return userToBeRemoved._id.toString();
};

const nonExistingMicropostId = async () => {
  const user = await User.findOne({});

  const micropostToBeRemoved = new Micropost({
    content: 'toberemoved',
    date: new Date(),
    user: user._id,
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

const getUserByAdminRights = async (isAdmin) => {
  const user = await User.findOne({ admin: isAdmin });
  return user.toJSON();
};

const getMicropostsByUsername = async (username) => {
  const user = await User.findOne({ username });
  const microposts = await Micropost.find({ user: user._id });
  return microposts.map((micropost) => micropost.toJSON());
};

module.exports = {
  initialUsers,
  initialMicroposts,
  addMicropostAndAssignToUser,
  addUserFromCredentials,
  nonExistingMicropostId,
  nonExistingUserId,
  getMicropostsInDb,
  getUsersInDb,
  getUserFromDbById,
  getUserTokenByUsername,
  getUserByAdminRights,
  getMicropostsByUsername,
};
