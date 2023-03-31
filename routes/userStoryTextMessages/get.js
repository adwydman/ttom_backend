const Conversation = require('../../models/Conversation');
const UserStoryTextMessages = require('../../models/UserStoryTextMessages');

const get = async (req, res) => {
  const { storyId } = req.query;

  const currentDate = new Date();
  const updatedTimestamp = currentDate.getTime() + (1 * 60 * 60 * 1000);
  const updatedDate = new Date(updatedTimestamp);
  const updatedISOString = updatedDate.toISOString();

  // fetch messages available from now on + 1 hour. 
  // The messages could be fetched from the server every hour
  // const availableMessages = await UserStoryTextMessages.find({ userId: req.__user__.id, storyId: storyId, enabledAt: { $lte: new Date().toISOString() }})
  const availableMessages = await UserStoryTextMessages.find({ userId: req.__user__.id, storyId: storyId })
  if (!availableMessages) {
    return res
      .status(404)
      .json({ data: null });
  }

  const conversationIds = availableMessages.map(({ conversationId }) => conversationId);
  const conversations = await Conversation.find({ _id: { $in: conversationIds } } );

  // console.log('availableMessages', availableMessages)

  const parsedConversations = conversations.map((c, index) => {
    const matchingUST = availableMessages.find(({conversationId}) => conversationId === c._id.toString())

    // if (c.message === 'For you to enjoy the show.') {
    //   console.log('c', c)
    //   console.log('matchingUST', matchingUST)
    // }

    return {
      ...c['_doc'],
      seenByUser: matchingUST.seenByUser,
      notificationSent: matchingUST.notificationSent,
      enabledAt: matchingUST.enabledAt,
      order: index + 1,
    }
  })

  return res
    .status(200)
    .json({ data: parsedConversations });
}

module.exports = get;
