const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const register = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user) {
    return res
      .status(400)
      .json({ message: 'Email already exists' });
  }

  const newUser = new User({ email, password });

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(newUser.password, salt);

  const token = crypto.randomBytes(64).toString('hex');

  newUser.password = hash;
  newUser.token = token;

  await newUser.save();

  const serializedUser = User.__serialize__(newUser);
  serializedUser.storyInfo = []

  return res
    .status(201)
    .json({ user: serializedUser });
}

module.exports = register;
