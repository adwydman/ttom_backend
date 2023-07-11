const axios = require('axios');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const register = async (req, res) => {
  const { email, password, thirdParty, thirdPartyToken } = req.body;

  let emailToProcess = email;
  let passwordToProcess = password;

  if (thirdPartyToken) {
    if (thirdParty === 'google') {
      try {
        const response = await axios.get("https://www.googleapis.com/userinfo/v2/me", {
          headers: { Authorization: `Bearer ${thirdPartyToken}` }
        });
  
        emailToProcess = response.data.email;
        passwordToProcess = '';
      } catch (error) {
        console.log('error', error)
  
        if (error.response && error.response.status === 401) {
          return res
            .status(401)
            .json({ message: 'Invalid third-party token' });
        } else {
          return res
            .status(500)
            .json({ message: 'Something went wrong' });
        }
      }
    }
    if (thirdParty === 'facebook') {
      try {
        const response = await axios.get(`https://graph.facebook.com/me?access_token=${thirdPartyToken}&fields=id,name,email`);

        emailToProcess = response.data.email;
        passwordToProcess = '';
      } catch (error) {
        if (error.response && error.response.status === 401) {
          return res
            .status(401)
            .json({ message: 'Invalid third-party token' });
        } else {
          return res
            .status(500)
            .json({ message: 'Something went wrong' });
        }
      }
    }
  }

  const user = await User.findOne({ email: emailToProcess });

  if (user) {
    return res
      .status(400)
      .json({ message: 'Email already exists' });
  }

  const newUser = new User({ email: emailToProcess, password: passwordToProcess });

  if (passwordToProcess) {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(newUser.password, salt);
    newUser.password = hash;
  } else {
    newUser.isThirdParty = true;
  }

  const token = crypto.randomBytes(64).toString('hex');
  newUser.token = token;
  
  await newUser.save();

  const serializedUser = User.__serialize__(newUser);
  serializedUser.storyInfo = []

  return res
    .status(201)
    .json({ user: serializedUser });
}

module.exports = register;
