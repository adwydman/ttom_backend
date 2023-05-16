const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { getStoryInfo } = require('./aggregations');

const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res
      .status(404)
      .json({ message: 'User not found' });
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res
      .status(401)
      .json({ message: 'Incorrect username or password' });
  }
  
  const token = crypto.randomBytes(64).toString('hex');
  user.token = token;

  const [_, storyInfo] = await Promise.all([
    user.save(),
    getStoryInfo(user._id.toString())
  ]);

  const serializedUser = User.__serialize__(user);
  serializedUser.storyInfo = storyInfo;

  return res
    .status(200)
    .json({ user: serializedUser });
}

const loginAdminPanel = async (email, password) => {
  const user = await User.findOne({ email });

  if (!user) {
    return false;
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return false;
  }

  //todo: check if the user is admin

  return user;
}

module.exports = {
  login,
  loginAdminPanel
};
