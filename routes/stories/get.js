const Story = require('../../models/Story');

const get = async (req, res) => {
  try {
    const fields = req.query.fields ? req.query.fields.replace(/,/g, ' ') : '';

    const stories = await Story.find({}, fields);
    const filteredStory = stories.filter((story) => {
      if (req.__user__.type === 'admin') {
        return true;
      }

      return story.isApproved;
    });

    res.json(filteredStory);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
};

module.exports = get;
