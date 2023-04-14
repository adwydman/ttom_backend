const UserStoryTextMessages = require('../../models/UserStoryTextMessages');

const get = async (req, res) => {
  const { storyId } = req.query;

  const currentDate = new Date();
  const updatedTimestamp = currentDate.getTime() + (1 * 60 * 60 * 1000);
  const updatedDate = new Date(updatedTimestamp);
  const updatedISOString = updatedDate.toISOString();

  // fetch messages available from now on + 1 hour. 
  // The messages could be fetched from the server every hour

  console.log('parsedConversations', parsedConversations)

  const result = await UserStoryTextMessages.aggregate([
    {
      $match: {
        userId: req.__user__.id,
        storyId: storyId,
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
      },
    },
    {
      $sort: {
        dayNumber: 1,
        time: 1,
      },
    },
  ]);

  return res
    .status(200)
    .json({ data: result });
}

module.exports = get;
