const Story = require('../../models/Story');
const UserStoryTextMessages = require('../../models/UserStoryTextMessages');

const put = async (req, res) => {
  const {
    storyId,
    conversationIds,
    seenByUser,
    notificationSent
  } = req.body;

  const story = await Story.findOne({ _id: storyId });

  if (!story) {
    return res
      .status(404)
      .json({ message: 'Story not found' });
  }

  const requestBody = {};
  if ('seenByUser' in req.body) {
    requestBody.seenByUser = seenByUser;
  }
  if ('notificationSent' in req.body) {
    requestBody.notificationSent = notificationSent;
  }

  await UserStoryTextMessages.updateMany({
    conversationId: conversationIds,
    storyId: storyId,
    userId: req.__user__._id
  }, requestBody)

  return res
    .status(200)
    .json({ message: 'Success' })
}

module.exports = put;
