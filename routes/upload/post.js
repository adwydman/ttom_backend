const fs = require("fs");
const csvParser = require('csv-parser');
const Story = require("../../models/Story");
const Conversation = require("../../models/Conversation");

const post = async (req, res) => {
  const { title, author, pictureUrl, description, mainCharacter, preview } = req.body;
  const file = req.file;

  const story = new Story({
    name: title,
    picture: pictureUrl,
    author: author,
    description: description,
    mainCharacter: mainCharacter,
  })

  const jsonData = [];
  let response = [];

  fs.createReadStream(file.path)
    .pipe(csvParser({
      headers: ['dayNumber', 'time', 'messageType', 'whoFrom', 'whoTo', 'message'],
      skipLines: 1
    }))
    .on('data', (row) => {
      // row.storyId = story._id;
      jsonData.push(row);
    })
    .on('end', () => {
      const response = jsonData.map((jsonRecord) => new Conversation(jsonRecord));

      // Remove the temporary CSV file
      fs.unlinkSync(file.path);

      res.status(200).json({
        title,
        author,
        mainCharacter,
        data: response
      });
    });
}

module.exports = post;
