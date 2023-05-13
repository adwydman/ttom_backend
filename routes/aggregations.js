const moment = require('moment');
const UserPictures = require('../models/UserPictures');
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
                      $lte: moment().toDate(), // change to moment()
                      // $lte: moment("2034-01-01T00:00:00Z").toDate(), // change to moment()
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

  // console.log("result", result);

  return result;
};

const getStoryConversations = async (userId, storyId, enabledAt) => {
  const result = await UserStoryTextMessages.aggregate([
    {
      $match: {
        userId,
        storyId,
        // enabledAt: { $lte: updatedISOString },
      },
    },
    {
      $addFields: {
        conversationIdObjectId: { $toObjectId: '$conversationId' },
      },
    },
    {
      $lookup: {
        from: 'conversations',
        localField: 'conversationIdObjectId',
        foreignField: '_id',
        as: 'conversation',
      },
    },
    {
      $unwind: '$conversation',
    },
    {
      $addFields: {
        'conversation.seenByUser': '$seenByUser',
        'conversation.notificationSent': '$notificationSent',
        'conversation.enabledAt': '$enabledAt',
      },
    },
    {
      $replaceRoot: { newRoot: '$conversation' },
    },
    {
      $addFields: {
        order: '$dayNumber',
        timeInSeconds: {
          $let: {
            vars: {
              timeComponents: { $split: ['$time', ':'] },
            },
            in: {
              $sum: [
                { $multiply: [{ $toInt: { $arrayElemAt: ['$$timeComponents', 0] } }, 3600] },
                { $multiply: [{ $toInt: { $arrayElemAt: ['$$timeComponents', 1] } }, 60] },
                { $toInt: { $arrayElemAt: ['$$timeComponents', 2] } },
              ],
            },
          },
        },
      },
    },
    {
      $sort: {
        dayNumber: 1,
        timeInSeconds: 1,
      },
    },
  ]);
  
  return result;
}

const getStoryPhotos = async (userId, storyId, enabledAt) => {
  const result = await UserPictures.aggregate([
    { $match: { userId, storyId } },
    {
      $addFields: {
        pictureIdObjectId: { $toObjectId: '$pictureId' },
      }
    },
    {
      $lookup: {
        from: 'pictures',
        localField: 'pictureIdObjectId',
        foreignField: '_id',
        as: 'picture',
      }
    },
    {
      $unwind: '$picture',
    },
    // {
    //   $addFields: {
    //     'picture.url': '$url',
    //     'picture.enabledAt': '$enabledAt',
    //   }
    // },
    {
      $replaceRoot: { newRoot: '$picture' },
    },
    // {
    //   $addFields: {
    //     order: '$dayNumber',
    //   }
    // },
    // {
    //   $sort: {
    //     dayNumber: 1,
    //     time: 1,
    //   },
    // },
  ]);

  console.log('result', result)

  return result;
};

module.exports = {
  getStoryInfo,
  getStoryConversations,
  getStoryPhotos,
}
