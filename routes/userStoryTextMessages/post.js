const User = require('../../models/User');
const Story = require('../../models/Story');
const Picture = require('../../models/Picture');
const Conversation = require('../../models/Conversation');
const UserStoryTextMessages = require('../../models/UserStoryTextMessages');
const UserPictures = require('../../models/UserPictures');
const { getStoryInfo } = require('../aggregations');

const post = async (req, res) => {
  const { storyId } = req.body;
  const userId = req.__user__._id;

  const story = await Story.findOne({ _id: storyId });
  if (!story) {
    return res
      .status(404)
      .json({ message: `Story with id: ${storyId} not found` });
  }

  const existingConversation = await UserStoryTextMessages.findOne({ userId: userId, storyId: storyId });
  if (existingConversation) {
    return res
      .status(422)
      .json({ message: 'Conversations already added for user'})
  }

  const conversations = await Conversation.find({ storyId }).sort({ dayNumber: 1, time: 1 });
  const pictures = await Picture.find({ storyId });

  const userStoryTextMessagesArray = [];
  for (let i = 0; i < conversations.length; i++) {
    const enabledAt = new Date();
    const conversation = conversations[i];

    if (story.name === 'Test Story') {
      // enabledAt.setMinutes(enabledAt.getMinutes() + 1 * (i + 1));
      enabledAt.setSeconds(enabledAt.getSeconds() + 30 * (i + 1));
    } else {
      const [hours, minutes, seconds] = conversation.time.split(':');
      enabledAt.setHours(hours, minutes, seconds);
      enabledAt.setDate(enabledAt.getDate() + (conversation.dayNumber - 1));
    }

    userStoryTextMessagesArray.push({
      userId: userId,
      storyId: storyId,
      conversationId: conversation._id,
      enabledAt: enabledAt,
    })
  }

  const userPictures = [];
  for (let i = 0; i < pictures.length; i++) {
    const picture = pictures[i];
    const pictureData = {
      userId: userId,
      storyId: storyId,
      pictureId: picture._id,
    };

    if (picture.dayNumber && picture.time) {
      const enabledAt = new Date();
      const [hours, minutes, seconds] = picture.time.split(':');
      enabledAt.setHours(hours, minutes, seconds);
      enabledAt.setDate(enabledAt.getDate() + (picture.dayNumber - 1));
      pictureData.enabledAt = enabledAt;
    }
  
    userPictures.push(pictureData) 
  }

  req.__user__.stories.push(storyId)

  const [_, _2, updatedUser] = await Promise.all([
    UserStoryTextMessages.insertMany(userStoryTextMessagesArray),
    UserPictures.insertMany(userPictures),
    req.__user__.save(),
  ]);

  const storyInfo = await getStoryInfo(updatedUser._id.toString())

  const serializedUser = User.__serialize__(updatedUser);
  serializedUser.storyInfo = storyInfo;

  return res
    .status(201)
    .json({ user: serializedUser, firstMessage: conversations[0] })
}

module.exports = post;
