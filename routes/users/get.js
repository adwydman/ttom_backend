const User = require('../../models/User');
const { getStoryInfo } = require('../aggregations');

const get = async (req, res) => {
  const user = User.__serialize__(req.__user__);
  const storyInfo = await getStoryInfo(req.__user__._id.toString());
  user.storyInfo = storyInfo;

  return res
    .status(200)
    .json({ user });
}

module.exports = get;
