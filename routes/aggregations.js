const moment = require('moment');
const UserStoryTextMessages = require('../models/UserStoryTextMessages');

const getStoryInfo = async (userId) => {
  const result = await UserStoryTextMessages.aggregate([
    { $match: { userId: userId } },
    {
      $group: {
        _id: "$storyId",
        messages: { $push: "$$ROOT" },
      },
    },
    {
      $lookup: {
        from: UserStoryTextMessages.collection.name,
        let: { storyId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$storyId", "$$storyId"] },
                  { $eq: ["$userId", userId] },
                ],
              },
            },
          },
          {
            $facet: {
              messagesCount: [{ $count: "count" }],
              seenMessagesCount: [
                { $match: { seenByUser: true } },
                { $count: "count" },
              ],
              availableMessagesCount: [
                {
                  $match: {
                    enabledAt: {
                      $lte: moment("2034-01-01T00:00:00Z").toDate(),
                    },
                  },
                },
                { $count: "count" },
              ],
            },
          },
        ],
        as: "counts",
      },
    },
    { $unwind: "$counts" },
    {
      $project: {
        _id: 0,
        storyId: "$_id",
        messagesCount: {
          $ifNull: [ { $arrayElemAt: ["$counts.messagesCount.count", 0] }, 0 ]
        },
        seenMessagesCount: {
          $ifNull: [ { $arrayElemAt: ["$counts.seenMessagesCount.count", 0] }, 0 ]
        },
        availableMessagesCount: {
          $ifNull: [ { $arrayElemAt: ["$counts.availableMessagesCount.count", 0] }, 0 ]
        },
      },
    },
  ]);

  console.log("result", result);

  return result;
};

module.exports = {
  getStoryInfo
}
