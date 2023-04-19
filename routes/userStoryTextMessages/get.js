const { getStoryConversations } = require('../aggregations');
const UserPictures = require('../../models/UserPictures');

const get = async (req, res) => {
  const { storyId } = req.query;

  const currentDate = new Date();
  const updatedTimestamp = currentDate.getTime() + (1 * 60 * 60 * 1000);
  const updatedDate = new Date(updatedTimestamp);
  const updatedISOString = updatedDate.toISOString();

  // fetch messages available from now on + 1 hour. 
  // The messages could be fetched from the server every hour

  const userStoryTextMessages = await getStoryConversations(req.__user__.id, storyId, updatedISOString);
  const userPictures = await UserPictures.find({ userId: req.__user__.id, storyId });

  return res
    .status(200)
    .json({ userStoryTextMessages, userPictures });
}

module.exports = get;
