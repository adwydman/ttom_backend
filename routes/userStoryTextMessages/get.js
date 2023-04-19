const { getStoryConversations } = require('../aggregations');

const get = async (req, res) => {
  const { storyId } = req.query;

  const currentDate = new Date();
  const updatedTimestamp = currentDate.getTime() + (1 * 60 * 60 * 1000);
  const updatedDate = new Date(updatedTimestamp);
  const updatedISOString = updatedDate.toISOString();

  // fetch messages available from now on + 1 hour. 
  // The messages could be fetched from the server every hour

  const result = await getStoryConversations(req.__user__.id, storyId, updatedISOString);

  return res
    .status(200)
    .json({ data: result });
}

module.exports = get;
