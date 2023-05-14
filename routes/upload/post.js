const fs = require("fs");
const Story = require("../../models/Story");
const Conversation = require("../../models/Conversation");

const post = async (req, res) => {
  const { title, author, pictureUrl, description, mainCharacter } = req.body;
  const file = req.file;

  const story = await Story.create({
    name: title,
    picture: pictureUrl,
    author: author,
    description: description,
    mainCharacter: mainCharacter,
  })

  const jsonData = [];

  fs.createReadStream(file.path)
    .pipe(csvParser({
      headers: ['dayNumber', 'time', 'messageType', 'whoFrom', 'whoTo', 'message'],
      skipLines: 1
    }))
    .on('data', (row) => {
      row.storyId = story._id;
      jsonData.push(row);
    })
    .on('end', () => {
      Conversation.insertMany(jsonData, (err, docs) => {
        if (err) {
          console.log('error', err)
        }
        console.log('docs', docs)
      })
      
      // Perform any operations on jsonData, such as filtering, sorting, or modifying the data
      // You can store the result in memory, database, or use it for any purpose

      // Remove the temporary CSV file
      fs.unlinkSync(file.path);

      res.status(200).json({
        title,
        author,
        mainCharacter,
        data: jsonData
      });
    });
}

module.exports = post;
