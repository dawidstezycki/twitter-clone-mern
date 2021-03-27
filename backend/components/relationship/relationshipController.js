const Relationship = require('./relationshipModel');
const User = require('../user/userModel');
const jwt = require('jsonwebtoken');

const getToken = (request) => {
  const authorization = request.get('authorization');
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7);
  }
  return null;
};

const getRelationships = async (request, response) => {
  const relationships = await Relationship.find({}).populate([
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
  ]);
  response.json(relationships.map((relationship) => relationship.toJSON()));
};

const getRelationship = async (request, response) => {
  const relationship = await Relationship.findById(request.params.id).populate([
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
  ]);

  if (relationship) {
    response.json(relationship.toJSON());
  } else {
    response.status(404).end();
  }
};

const postRelationship = async (request, response) => {
  const token = getToken(request);
  const decodedToken = jwt.verify(token, process.env.SECRET);

  if (!token || !decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' });
  }

  const body = request.body;
  const userFollowing = await User.findById(decodedToken.id);
  const userFollowed = await User.findById(body.followed);

  if (!userFollowing)
  {
    return response.status(401).json({ error: 'token missing or invalid' });
  }
  if (!userFollowed)
  {
    return response.status(400).json({error: 'following non-existing user'})
  }

  if (decodedToken.id === body.followed) {
    return response.status(400).json({ error: "can't follow yourself" });
  }

  const relationship = new Relationship({
    follower: userFollowing._id,
    followed: userFollowed._id,
    date: new Date(),
  });

  let savedRelationship = await relationship.save();
  savedRelationship = await savedRelationship
    .populate([
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
    ])
    .execPopulate();

  userFollowing.relationships = [
    ...userFollowing.relationships,
    savedRelationship._id,
  ];
  await userFollowing.save();
  userFollowed.relationships = [
    ...userFollowed.relationships,
    savedRelationship._id,
  ];
  await userFollowed.save();

  response.json(savedRelationship.toJSON());
};

const deleteRelationship = async (request, response) => {
  const token = getToken(request);
  const decodedToken = jwt.verify(token, process.env.SECRET);

  if (!token || !decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' });
  }

  const user = await User.findById(decodedToken.id);
  const relationshipToRemove = await Relationship.findById(request.params.id);

  if (!relationshipToRemove) {
    response.status(404).end();
  }

  const userFollowing = await User.findById(relationshipToRemove.follower._id);
  const userFollowed = await User.findById(relationshipToRemove.followed._id);

  const isUserSameAsFollower =
    user._id.toString() === userFollowing._id.toString();

  if (user.admin || isUserSameAsFollower) {
    await Relationship.findByIdAndRemove(request.params.id);
    userFollowing.relationships = userFollowing.relationships.filter(
      (relationship) =>
        relationship.toString() !== relationshipToRemove._id.toString()
    );
    await userFollowing.save();
    userFollowed.relationships = userFollowed.relationships.filter(
      (relationship) =>
        relationship.toString() !== relationshipToRemove._id.toString()
    );
    await userFollowed.save();
    response.status(204).end();
  } else {
    return response.status(401).json({ error: 'unauthorized user' });
  }
};

module.exports = {
  getRelationships,
  getRelationship,
  postRelationship,
  deleteRelationship,
};
