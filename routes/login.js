const axios = require('axios');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { getStoryInfo } = require('./aggregations');

const login = async (req, res) => {
  const { email, password, thirdParty, thirdPartyToken } = req.body;

  console.log('login', thirdParty)

  let emailToProcess = email;

  if (thirdPartyToken) {
    if (thirdParty === 'google') {
      try {
        const response = await axios.get("https://www.googleapis.com/userinfo/v2/me", {
          headers: { Authorization: `Bearer ${thirdPartyToken}` }
        });

        emailToProcess = response.data.email;
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
    } else if (thirdParty === 'facebook') {
      try {
        const response = await axios.get(`https://graph.facebook.com/me?access_token=${thirdPartyToken}&fields=id,name,email`);

        emailToProcess = response.data.email;
      }  catch (error) {
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

  if (!user) {
    return res
      .status(404)
      .json({ message: 'User not found' });
  }

  if (!thirdPartyToken && user.isThirdParty) {
    return res
      .status(401)
      .json({ message: 'Third party token missing from the request\'s body' });
  }

  if (!thirdPartyToken && !user.isThirdParty) {
    const isMatch = await bcrypt.compare(password, user.password);
  
    if (!isMatch) {
      return res
        .status(401)
        .json({ message: 'Incorrect username or password' });
    }
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
