const User = require('../../models/User');
const Story = require('../../models/Story');
const Conversation = require('../../models/Conversation');
const UserStoryTextMessages = require('../../models/UserStoryTextMessages');
const { getStoryInfo } = require('../aggregations');

const post = async (req, res) => {
  const { storyId } = req.body;

  const story = await Story.findOne({ _id: storyId });
  if (!story) {
    return res
      .status(404)
      .json({ message: `Story with id: ${storyId} not found` });
  }

  const existingConversation = await UserStoryTextMessages.findOne({ userId: req.__user__._id, storyId: storyId });
  if (existingConversation) {
    return res
      .status(422)
      .json({ message: 'Conversations already added for user'})
  }

  const conversations = await Conversation.find({ storyId })

  const insertInfo = [];
  for (let i = 0; i < conversations.length; i++) {
    const enabledAt = new Date();
    const conversation = conversations[i];
    const [hours, minutes, seconds] = conversation.time.split(':');
    enabledAt.setHours(hours, minutes, seconds);
    console.log('enabledAtAfter', enabledAt)
    enabledAt.setDate(enabledAt.getDate() + (conversation.dayNumber - 1));

    insertInfo.push({
      userId: req.__user__._id,
      storyId: storyId,
      conversationId: conversation._id,
      enabledAt: enabledAt,
    })
  }

  req.__user__.stories.push(storyId)

  const [_, updatedUser] = await Promise.all([
    UserStoryTextMessages.insertMany(insertInfo),
    req.__user__.save(),
  ]);

  const storyInfo = await getStoryInfo(updatedUser._id.toString())

  const serializedUser = User.__serialize__(updatedUser);
  serializedUser.storyInfo = storyInfo;

  return res
    .status(201)
    .json({ user: serializedUser })
}

module.exports = post;
