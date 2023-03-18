const moment = require('moment');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const UserStoryTextMessages = require('../models/UserStoryTextMessages');

const getStoryInfo = async (userId) => {
  return await UserStoryTextMessages.aggregate([
    { $match: { userId: userId } },
    {
      $facet: {
        messagesCount: [
          { $count: 'count' }
        ],
        seenMessagesCount: [
          { $match: { seenByUser: true } },
          { $count: 'count' }
        ],
        unreadMessagesCount: [
          { $match: { enabledAt: { $lte: moment().toDate() } } },
          { $count: 'count' }
        ],
        storyIds: [
          { $project: { _id: 0, storyId: 1 } },
          { $limit: 1 }
        ]
      }
    },
    {
      $project: {
        _id: 0,
        storyId: { $arrayElemAt: [ '$storyIds.storyId', 0 ] },
        messagesCount: { $arrayElemAt: [ '$messagesCount.count', 0 ] },
        seenMessagesCount: { $arrayElemAt: [ '$seenMessagesCount.count', 0 ] },
        unreadMessagesCount: { $arrayElemAt: [ '$unreadMessagesCount.count', 0 ] },
      }
    }
  ])
};

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

  console.log('serializedUser', serializedUser)

  return res
    .status(200)
    .json({ user: User.__serialize__(user) });
}

module.exports = login;
