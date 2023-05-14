const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv').config();

const middleware = require('./routes/middleware');
const setupRoutes = require('./routes/setup');

const connectDatabase = async () => {
  await mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true });
  console.log('MongoDB successfully connected')
};

const initApp = () => {
  const app = express();

  app.use(cors());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(middleware.authenticateUser)

  setupRoutes(app);

  const port = process.env.PORT || 3000;
  app.listen(port, '10.0.0.74', () => console.log(`listening on port ${port}`));
  app.listen(8080, () => console.log('AdminBro is under localhost:8080/admin'));
}

module.exports = {
  initApp,
  connectDatabase,
}

// await Conversation.deleteMany({ storyId: '644343b8bc82ee6608552116' });
// await UserStoryTextMessages.deleteMany({ storyId: '644343b8bc82ee6608552116' });

// const story = new Story({
//     name: "Love at First Flight",
//     categories: ['Category1', 'Category2'],
//     author: "Peter Browne",
//     picture: "https://i.imgur.com/u4STAok.png",
//     description: "Description",
//     duration: "1 week",
//   });
//   story
//     .save()
//     .catch((err) => console.log(err));
