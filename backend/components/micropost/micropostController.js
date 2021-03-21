const Micropost = require('./micropostModel');
const User = require('../user/userModel');
const jwt = require('jsonwebtoken');

const getToken = (request) => {
  const authorization = request.get('authorization');
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7);
  }
  return null;
};

const getMicroposts = async (request, response) => {
  const microposts = await Micropost.find({}).populate('user', { username: 1 });
  response.json(microposts.map((post) => post.toJSON()));
};

const getMicropost = async (request, response) => {
  const micropost = await Micropost.findById(request.params.id).populate(
    'user',
    { username: 1 }
  );
  if (micropost) {
    response.json(micropost.toJSON());
  } else {
    response.status(404).end();
  }
};

const postMicropost = async (request, response) => {
  const token = getToken(request);
  const decodedToken = jwt.verify(token, process.env.SECRET);

  if (!token || !decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' });
  }

  const body = request.body;
  const user = await User.findById(decodedToken.id);

  if (!user) {
    return response.status(401).json({ error: 'token missing or invalid' });
  }

  const micropost = new Micropost({
    content: body.content,
    date: new Date(),
    user: user._id,
  });

  let savedMicropost = await micropost.save();
  savedMicropost = await savedMicropost.populate('user').execPopulate();

  user.microposts = [...user.microposts, savedMicropost._id];
  user.save();

  response.json(savedMicropost.toJSON());
};

const deleteMicropost = async (request, response) => {
  const token = getToken(request);
  const decodedToken = jwt.verify(token, process.env.SECRET);

  if (!token || !decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' });
  }

  const user = await User.findById(decodedToken.id);
  const micropostToRemove = await Micropost.findById(request.params.id);

  if (!micropostToRemove) {
    response.status(404).end();
  }

  const isUserSameAsAuthor = micropostToRemove.user.toString() === user.id;

  if (user.admin || isUserSameAsAuthor) {
    await Micropost.findByIdAndRemove(request.params.id);
    response.status(204).end();
  } else {
    return response.status(401).json({ error: 'unauthorized user' });
  }
};

module.exports = {
  getMicroposts,
  getMicropost,
  postMicropost,
  deleteMicropost,
};
