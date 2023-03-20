const moment = require('moment');
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
        availableMessagesCount: [
          // { $match: { enabledAt: { $lte: moment('2034-01-01T00:00:00Z').toDate() } } },
          { $match: { enabledAt: { $lte: moment().toDate() } } }, // enable for prod
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
        seenMessagesCount: {
          $ifNull: [ { $arrayElemAt: ['$seenMessagesCount.count', 0] }, 0 ]
        },
        availableMessagesCount: {
          $ifNull: [ { $arrayElemAt: ['$availableMessagesCount.count', 0] }, 0 ]
        }
      }
    }
  ])
};

module.exports = {
  getStoryInfo
}
