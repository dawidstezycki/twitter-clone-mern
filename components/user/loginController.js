const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('./userModel');

const loginUser = async (request, response) => {
  const body = request.body;

  const user = await User.findOne({
    $or: [{ username: body.login }, { email: body.login }],
  });
  const passwordCorrect =
    user === null
      ? false
      : await bcrypt.compare(body.password, user.passwordHash);

  if (!(user && passwordCorrect)) {
    return response.status(401).json({
      error: 'invalid username or password',
    });
  }

  const userForToken = {
    username: user.username,
    id: user._id,
  };

  const token = jwt.sign(userForToken, process.env.SECRET);

  response
    .status(200)
    .send({ token, username: user.username, email: user.email, id: user._id });
};

module.exports = { loginUser };
