const Story = require('../../models/Story');

const getById = async (req, res) => {
  try {
    const storyId = req.params.id;
    const story = await Story.findById(storyId);

    if (!story) {
      return res.status(404).send('Story not found');
    }

    res.json(story);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
};

module.exports = getById;
