const http = require("http");
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const multer = require('multer');
const csv = require('csvtojson');
const XLSX = require("xlsx");

const keys = require("./config/Keys.js");
const Story = require("./models/Story");
const Conversation = require("./models/Conversation");

const loginRoute = require('./routes/login');
const registerRoute = require('./routes/register');
const userStoryTextMessagesRoutes = require('./routes/userStoryTextMessages');
const usersRoutes = require('./routes/users');
const storiesRoutes = require('./routes/stories');
const middleware = require('./routes/middleware');

const app = (module.exports.app = express());

const db = keys.mongoURI;
const port = process.env.PORT || 3000;
const server = http.createServer(app);
server.listen(port, '10.0.0.74', () => {
  console.log("listening on port 3000");
});

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.use(cors());
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(middleware.authenticateUser)

mongoose
  .connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB successfully connected")
  })
  .catch((err) => console.log(err));
app.get("/", (req, res) => {
  res.send("yo connected");
});

app.post("/login", loginRoute);
app.post("/register", registerRoute);

app.get('/users', usersRoutes.get)

app.get('/userStoryTextMessages', userStoryTextMessagesRoutes.get);
app.post('/userStoryTextMessages', userStoryTextMessagesRoutes.post);
app.put('/userStoryTextMessages', userStoryTextMessagesRoutes.put);

app.get('/stories', storiesRoutes.get);
app.get('/stories/:id', storiesRoutes.getById);

app.post('/upload', upload.single('csv'), (req, res) => {
  // Use csvtojson to parse the CSV file to JSON

  csv().fromString(req.file.buffer.toString())
    .then((json) => {
      // Send the JSON back to the client
      res.status(200).json({message: 'OK' });
    })
    .catch((err) => {
      console.log(err);
      res.sendStatus(500);
    });
});


app.get("/getStoryDetails/:storyKey", (req, res) => {
  let storyId = req.params.storyKey;
  console.log(req.params);
  Story.findOne({ _id: storyId }).then((list) => {
    console.log(list);
    res.json(list);
  });
});


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



 // const conversations = [
  //   {
  //     "dayNumber": 1,
  //     "time": "23:45:00",
  //     "messageType": "SMS",
  //     "whoTo": "Robert",
  //     "whoFrom": "Me",
  //     "message": "This is Patrick",
  //     "storyId": "643364ca07e4ed91ad81015a"
  //   },
  //   {
  //     "dayNumber": 1,
  //     "time": "23:52:00",
  //     "messageType": "SMS",
  //     "whoTo": "ME",
  //     "whoFrom": "Robert",
  //     "message": "Hi Patrick this is Robert. I am a Scorpio who likes long walks on the beach and candle lit dinners.",
  //     "storyId": "643364ca07e4ed91ad81015a"
  //   },
  //   {
  //     "dayNumber": 1,
  //     "time": "23:52:36",
  //     "messageType": "SMS",
  //     "whoTo": "Robert",
  //     "whoFrom": "Me",
  //     "message": "Hi Robert this is Patrick. I am a Gemini who likes to hike and doesn’t know how to whistle.",
  //     "storyId": "643364ca07e4ed91ad81015a"
  //   },
  //   {
  //     "dayNumber": 1,
  //     "time": "23:53:00",
  //     "messageType": "SMS",
  //     "whoTo": "ME",
  //     "whoFrom": "Robert",
  //     "message": "I knew you were too good to be true 😂 I really liked talking to you. Also I think you’re pretty dreamy. What are you up to?",
  //     "storyId": "643364ca07e4ed91ad81015a"
  //   },
  //   {
  //     "dayNumber": 1,
  //     "time": "23:54:00",
  //     "messageType": "SMS",
  //     "whoTo": "Robert",
  //     "whoFrom": "Me",
  //     "message": "I’m getting ready for bed.",
  //     "storyId": "643364ca07e4ed91ad81015a"
  //   },
  //   {
  //     "dayNumber": 1,
  //     "time": "23:54:20",
  //     "messageType": "SMS",
  //     "whoTo": "ME",
  //     "whoFrom": "Robert",
  //     "message": "Need any help?",
  //     "storyId": "643364ca07e4ed91ad81015a"
  //   },
  //   {
  //     "dayNumber": 1,
  //     "time": "23:54:40",
  //     "messageType": "SMS",
  //     "whoTo": "Robert",
  //     "whoFrom": "Me",
  //     "message": "With?",
  //     "storyId": "643364ca07e4ed91ad81015a"
  //   },
  //   {
  //     "dayNumber": 1,
  //     "time": "23:55:00",
  //     "messageType": "SMS",
  //     "whoTo": "ME",
  //     "whoFrom": "Robert",
  //     "message": "You tell me.",
  //     "storyId": "643364ca07e4ed91ad81015a"
  //   },
  //   {
  //     "dayNumber": 1,
  //     "time": "23:56:00",
  //     "messageType": "SMS",
  //     "whoTo": "Robert",
  //     "whoFrom": "Me",
  //     "message": "So you like being told what to do?",
  //     "storyId": "643364ca07e4ed91ad81015a"
  //   },
  //   {
  //     "dayNumber": 1,
  //     "time": "23:57:00",
  //     "messageType": "SMS",
  //     "whoTo": "ME",
  //     "whoFrom": "Robert",
  //     "message": "Yes sir.",
  //     "storyId": "643364ca07e4ed91ad81015a"
  //   },
  //   {
  //     "dayNumber": 2,
  //     "time": "0:01:00",
  //     "messageType": "SMS",
  //     "whoTo": "Robert",
  //     "whoFrom": "Me",
  //     "message": "Oh I see. 😉",
  //     "storyId": "643364ca07e4ed91ad81015a"
  //   },
  //   {
  //     "dayNumber": 2,
  //     "time": "0:02:00",
  //     "messageType": "SMS",
  //     "whoTo": "ME",
  //     "whoFrom": "Robert",
  //     "message": "...",
  //     "storyId": "643364ca07e4ed91ad81015a"
  //   },
  //   {
  //     "dayNumber": 2,
  //     "time": "0:04:00",
  //     "messageType": "SMS",
  //     "whoTo": "Robert",
  //     "whoFrom": "Me",
  //     "message": "So you like being told what to do?",
  //     "storyId": "643364ca07e4ed91ad81015a"
  //   },
  //   {
  //     "dayNumber": 2,
  //     "time": "0:05:00",
  //     "messageType": "SMS",
  //     "whoTo": "ME",
  //     "whoFrom": "Robert",
  //     "message": "Only when I'm in the bedroom.",
  //     "storyId": "643364ca07e4ed91ad81015a"
  //   },
  //   {
  //     "dayNumber": 2,
  //     "time": "0:06:00",
  //     "messageType": "SMS",
  //     "whoTo": "Robert",
  //     "whoFrom": "Me",
  //     "message": "Good to know.",
  //     "storyId": "643364ca07e4ed91ad81015a"
  //   },
  //   {
  //     "dayNumber": 2,
  //     "time": "0:06:23",
  //     "messageType": "SMS",
  //     "whoTo": "ME",
  //     "whoFrom": "Robert",
  //     "message": "What does your bedroom look like?",
  //     "storyId": "643364ca07e4ed91ad81015a"
  //   },
  //   {
  //     "dayNumber": 2,
  //     "time": "0:07:00",
  //     "messageType": "SMS",
  //     "whoTo": "Robert",
  //     "whoFrom": "Me",
  //     "message": "Why don't you come over and see for yourself?",
  //     "storyId": "643364ca07e4ed91ad81015a"
  //   },
  //   {
  //     "dayNumber": 2,
  //     "time": "0:08:00",
  //     "messageType": "SMS",
  //     "whoTo": "ME",
  //     "whoFrom": "Robert",
  //     "message": "I thought you'd never ask.",
  //     "storyId": "643364ca07e4ed91ad81015a"
  //   },
  //   {
  //     "dayNumber": 2,
  //     "time": "0:09:00",
  //     "messageType": "SMS",
  //     "whoTo": "Robert",
  //     "whoFrom": "Me",
  //     "message": "What kind of underwaer are you wearing?",
  //     "storyId": "643364ca07e4ed91ad81015a"
  //   },
  //   {
  //     "dayNumber": 2,
  //     "time": "0:10:00",
  //     "messageType": "SMS",
  //     "whoTo": "ME",
  //     "whoFrom": "Robert",
  //     "message": "I have on Calvin Klein briefs.",
  //     "storyId": "643364ca07e4ed91ad81015a"
  //   },
  //   {
  //     "dayNumber": 2,
  //     "time": "0:14:00",
  //     "messageType": "SMS",
  //     "whoTo": "Robert",
  //     "whoFrom": "Me",
  //     "message": "What color?",
  //     "storyId": "643364ca07e4ed91ad81015a"
  //   },
  //   {
  //     "dayNumber": 2,
  //     "time": "0:16:00",
  //     "messageType": "SMS",
  //     "whoTo": "ME",
  //     "whoFrom": "Robert",
  //     "message": "Black",
  //     "storyId": "643364ca07e4ed91ad81015a"
  //   },
  //   {
  //     "dayNumber": 2,
  //     "time": "0:17:00",
  //     "messageType": "SMS",
  //     "whoTo": "Robert",
  //     "whoFrom": "Me",
  //     "message": "Take them off before you get here.",
  //     "storyId": "643364ca07e4ed91ad81015a"
  //   },
  //   {
  //     "dayNumber": 2,
  //     "time": "0:18:00",
  //     "messageType": "SMS",
  //     "whoTo": "ME",
  //     "whoFrom": "Robert",
  //     "message": "Yes sir.",
  //     "storyId": "643364ca07e4ed91ad81015a"
  //   },
  //   {
  //     "dayNumber": 2,
  //     "time": "0:18:25",
  //     "messageType": "SMS",
  //     "whoTo": "Robert",
  //     "whoFrom": "Me",
  //     "message": "My address is 88730 Hollywood Boulevard #123",
  //     "storyId": "643364ca07e4ed91ad81015a"
  //   },
  //   {
  //     "dayNumber": 2,
  //     "time": "0:18:56",
  //     "messageType": "SMS",
  //     "whoTo": "ME",
  //     "whoFrom": "Robert",
  //     "message": "I'll be there in 20.",
  //     "storyId": "643364ca07e4ed91ad81015a"
  //   },
  //   {
  //     "dayNumber": 2,
  //     "time": "0:19:00",
  //     "messageType": "SMS",
  //     "whoTo": "Robert",
  //     "whoFrom": "Me",
  //     "message": "Sounds good  😉",
  //     "storyId": "643364ca07e4ed91ad81015a"
  //   },
  //   {
  //     "dayNumber": 2,
  //     "time": "0:19:15",
  //     "messageType": "SMS",
  //     "whoTo": "ME",
  //     "whoFrom": "Robert",
  //     "message": "See you soon stud.",
  //     "storyId": "643364ca07e4ed91ad81015a"
  //   },
  //   {
  //     "dayNumber": 2,
  //     "time": "0:41:00",
  //     "messageType": "SMS",
  //     "whoTo": "Robert",
  //     "whoFrom": "Me",
  //     "message": "You're late.",
  //     "storyId": "643364ca07e4ed91ad81015a"
  //   },
  //   {
  //     "dayNumber": 2,
  //     "time": "0:41:15",
  //     "messageType": "SMS",
  //     "whoTo": "ME",
  //     "whoFrom": "Robert",
  //     "message": "I like to keep an air of mystery.",
  //     "storyId": "643364ca07e4ed91ad81015a"
  //   },
  //   {
  //     "dayNumber": 2,
  //     "time": "0:42:00",
  //     "messageType": "SMS",
  //     "whoTo": "Robert",
  //     "whoFrom": "Me",
  //     "message": "Clearly.",
  //     "storyId": "643364ca07e4ed91ad81015a"
  //   },
  //   {
  //     "dayNumber": 2,
  //     "time": "0:42:25",
  //     "messageType": "SMS",
  //     "whoTo": "ME",
  //     "whoFrom": "Robert",
  //     "message": "Also I brought whickey.  😉",
  //     "storyId": "643364ca07e4ed91ad81015a"
  //   },
  //   {
  //     "dayNumber": 2,
  //     "time": "0:43:00",
  //     "messageType": "SMS",
  //     "whoTo": "Robert",
  //     "whoFrom": "Me",
  //     "message": "Is that what you tell all the boys?",
  //     "storyId": "643364ca07e4ed91ad81015a"
  //   },
  //   {
  //     "dayNumber": 2,
  //     "time": "0:44:00",
  //     "messageType": "SMS",
  //     "whoTo": "ME",
  //     "whoFrom": "Robert",
  //     "message": "What do you think? 😉",
  //     "storyId": "643364ca07e4ed91ad81015a"
  //   },
  //   {
  //     "dayNumber": 2,
  //     "time": "10:45:00",
  //     "messageType": "SMS",
  //     "whoTo": "ME",
  //     "whoFrom": "Robert",
  //     "message": "I can still smell you all over my body.",
  //     "storyId": "643364ca07e4ed91ad81015a"
  //   },
  //   {
  //     "dayNumber": 2,
  //     "time": "10:46:00",
  //     "messageType": "SMS",
  //     "whoTo": "Robert",
  //     "whoFrom": "Me",
  //     "message": "Sorry? 😂",
  //     "storyId": "643364ca07e4ed91ad81015a"
  //   },
  //   {
  //     "dayNumber": 2,
  //     "time": "10:46:20",
  //     "messageType": "SMS",
  //     "whoTo": "ME",
  //     "whoFrom": "Robert",
  //     "message": "Don't be. I like it.",
  //     "storyId": "643364ca07e4ed91ad81015a"
  //   },
  //   {
  //     "dayNumber": 2,
  //     "time": "10:48:00",
  //     "messageType": "SMS",
  //     "whoTo": "Robert",
  //     "whoFrom": "Me",
  //     "message": "Oh yeah?",
  //     "storyId": "643364ca07e4ed91ad81015a"
  //   },
  //   {
  //     "dayNumber": 2,
  //     "time": "10:50:00",
  //     "messageType": "SMS",
  //     "whoTo": "ME",
  //     "whoFrom": "Robert",
  //     "message": "Yeah, it’s turning me on just thinking about you.",
  //     "storyId": "643364ca07e4ed91ad81015a"
  //   },
  //   {
  //     "dayNumber": 2,
  //     "time": "11:00:00",
  //     "messageType": "SMS",
  //     "whoTo": "Robert",
  //     "whoFrom": "Me",
  //     "message": "Yeah?",
  //     "storyId": "643364ca07e4ed91ad81015a"
  //   },
  //   {
  //     "dayNumber": 2,
  //     "time": "11:04:00",
  //     "messageType": "SMS",
  //     "whoTo": "ME",
  //     "whoFrom": "Robert",
  //     "message": "Yeah you in my bed. With all your clothes in a pile on my floor.",
  //     "storyId": "643364ca07e4ed91ad81015a"
  //   },
  //   {
  //     "dayNumber": 2,
  //     "time": "11:08:00",
  //     "messageType": "SMS",
  //     "whoTo": "Robert",
  //     "whoFrom": "Me",
  //     "message": "I keep thinking about it…",
  //     "storyId": "643364ca07e4ed91ad81015a"
  //   },
  //   {
  //     "dayNumber": 2,
  //     "time": "11:08:30",
  //     "messageType": "SMS",
  //     "whoTo": "ME",
  //     "whoFrom": "Robert",
  //     "message": "Which part?",
  //     "storyId": "643364ca07e4ed91ad81015a"
  //   },
  //   {
  //     "dayNumber": 2,
  //     "time": "11:10:00",
  //     "messageType": "SMS",
  //     "whoTo": "Robert",
  //     "whoFrom": "Me",
  //     "message": "Don’t you mean which time? 🕺",
  //     "storyId": "643364ca07e4ed91ad81015a"
  //   },
  //   {
  //     "dayNumber": 2,
  //     "time": "11:12:00",
  //     "messageType": "SMS",
  //     "whoTo": "ME",
  //     "whoFrom": "Robert",
  //     "message": "Yes sir. What are you thinking about right now? 😉",
  //     "storyId": "643364ca07e4ed91ad81015a"
  //   },
  //   {
  //     "dayNumber": 2,
  //     "time": "11:14:00",
  //     "messageType": "SMS",
  //     "whoTo": "Robert",
  //     "whoFrom": "Me",
  //     "message": "All of it. All of your body.",
  //     "storyId": "643364ca07e4ed91ad81015a"
  //   },
  //   {
  //     "dayNumber": 2,
  //     "time": "11:15:00",
  //     "messageType": "SMS",
  //     "whoTo": "ME",
  //     "whoFrom": "Robert",
  //     "message": "Oh yeah?",
  //     "storyId": "643364ca07e4ed91ad81015a"
  //   },
  //   {
  //     "dayNumber": 2,
  //     "time": "11:18:00",
  //     "messageType": "SMS",
  //     "whoTo": "Robert",
  //     "whoFrom": "Me",
  //     "message": "😉 🔥 🔥 🔥",
  //     "storyId": "643364ca07e4ed91ad81015a"
  //   },
  //   {
  //     "dayNumber": 2,
  //     "time": "11:21:00",
  //     "messageType": "SMS",
  //     "whoTo": "ME",
  //     "whoFrom": "Robert",
  //     "message": "You like my body?",
  //     "storyId": "643364ca07e4ed91ad81015a"
  //   },
  //   {
  //     "dayNumber": 2,
  //     "time": "11:22:00",
  //     "messageType": "SMS",
  //     "whoTo": "Robert",
  //     "whoFrom": "Me",
  //     "message": "I like your body a lot.",
  //     "storyId": "643364ca07e4ed91ad81015a"
  //   },
  //   {
  //     "dayNumber": 2,
  //     "time": "11:25:00",
  //     "messageType": "SMS",
  //     "whoTo": "ME",
  //     "whoFrom": "Robert",
  //     "message": "What do you like about?",
  //     "storyId": "643364ca07e4ed91ad81015a"
  //   },
  //   {
  //     "dayNumber": 2,
  //     "time": "11:27:00",
  //     "messageType": "SMS",
  //     "whoTo": "Robert",
  //     "whoFrom": "Me",
  //     "message": "I like your hairy chest.",
  //     "storyId": "643364ca07e4ed91ad81015a"
  //   },
  //   {
  //     "dayNumber": 2,
  //     "time": "11:29:00",
  //     "messageType": "SMS",
  //     "whoTo": "ME",
  //     "whoFrom": "Robert",
  //     "message": "What else?",
  //     "storyId": "643364ca07e4ed91ad81015a"
  //   },
  //   {
  //     "dayNumber": 2,
  //     "time": "11:31:00",
  //     "messageType": "SMS",
  //     "whoTo": "Robert",
  //     "whoFrom": "Me",
  //     "message": "I’ll tell you when I see you tonight.",
  //     "storyId": "643364ca07e4ed91ad81015a"
  //   },
  //   {
  //     "dayNumber": 2,
  //     "time": "11:31:20",
  //     "messageType": "SMS",
  //     "whoTo": "ME",
  //     "whoFrom": "Robert",
  //     "message": "One more thing. Tell me…",
  //     "storyId": "643364ca07e4ed91ad81015a"
  //   },
  //   {
  //     "dayNumber": 2,
  //     "time": "11:32:00",
  //     "messageType": "SMS",
  //     "whoTo": "Robert",
  //     "whoFrom": "Me",
  //     "message": "That silver chain around your neck. Thumping against me…",
  //     "storyId": "643364ca07e4ed91ad81015a"
  //   },
  //   {
  //     "dayNumber": 2,
  //     "time": "11:37:00",
  //     "messageType": "SMS",
  //     "whoTo": "ME",
  //     "whoFrom": "Robert",
  //     "message": "I want your body back here next to mine. 😉",
  //     "storyId": "643364ca07e4ed91ad81015a"
  //   },
  //   {
  //     "dayNumber": 2,
  //     "time": "11:38:00",
  //     "messageType": "SMS",
  //     "whoTo": "Robert",
  //     "whoFrom": "Me",
  //     "message": "Me too. Last night was 🔥",
  //     "storyId": "643364ca07e4ed91ad81015a"
  //   },
  //   {
  //     "dayNumber": 2,
  //     "time": "11:40:00",
  //     "messageType": "SMS",
  //     "whoTo": "ME",
  //     "whoFrom": "Robert",
  //     "message": "I want you to come over and take you.",
  //     "storyId": "643364ca07e4ed91ad81015a"
  //   },
  //   {
  //     "dayNumber": 2,
  //     "time": "11:50:00",
  //     "messageType": "SMS",
  //     "whoTo": "Robert",
  //     "whoFrom": "Me",
  //     "message": "Ha ha, what are we in a Victorian novel?",
  //     "storyId": "643364ca07e4ed91ad81015a"
  //   },
  //   {
  //     "dayNumber": 2,
  //     "time": "11:55:00",
  //     "messageType": "SMS",
  //     "whoTo": "ME",
  //     "whoFrom": "Robert",
  //     "message": "I want to take you.",
  //     "storyId": "643364ca07e4ed91ad81015a"
  //   },
  //   {
  //     "dayNumber": 2,
  //     "time": "11:56:00",
  //     "messageType": "SMS",
  //     "whoTo": "Robert",
  //     "whoFrom": "Me",
  //     "message": "Calm down. 😉",
  //     "storyId": "643364ca07e4ed91ad81015a"
  //   },
  //   {
  //     "dayNumber": 2,
  //     "time": "11:56:15",
  //     "messageType": "SMS",
  //     "whoTo": "ME",
  //     "whoFrom": "Robert",
  //     "message": "I’m getting started.",
  //     "storyId": "643364ca07e4ed91ad81015a"
  //   },
  //   {
  //     "dayNumber": 2,
  //     "time": "12:00:00",
  //     "messageType": "SMS",
  //     "whoTo": "Robert",
  //     "whoFrom": "Me",
  //     "message": "Clearly.",
  //     "storyId": "643364ca07e4ed91ad81015a"
  //   },
  //   {
  //     "dayNumber": 2,
  //     "time": "12:10:00",
  //     "messageType": "SMS",
  //     "whoTo": "ME",
  //     "whoFrom": "Robert",
  //     "message": "How’s your day so far? What are you up to? But more important what are you wearing? I’m not wearing anything.",
  //     "storyId": "643364ca07e4ed91ad81015a"
  //   },
  //   {
  //     "dayNumber": 2,
  //     "time": "12:15:00",
  //     "messageType": "SMS",
  //     "whoTo": "Robert",
  //     "whoFrom": "Me",
  //     "message": "Oh really.",
  //     "storyId": "643364ca07e4ed91ad81015a"
  //   },
  //   {
  //     "dayNumber": 2,
  //     "time": "12:18:00",
  //     "messageType": "SMS",
  //     "whoTo": "ME",
  //     "whoFrom": "Robert",
  //     "message": "Just that silver chain 😉",
  //     "storyId": "643364ca07e4ed91ad81015a"
  //   },
  //   {
  //     "dayNumber": 2,
  //     "time": "12:19:00",
  //     "messageType": "SMS",
  //     "whoTo": "Robert",
  //     "whoFrom": "Me",
  //     "message": "Hot. My day has been good. I’m working on a new zine, woke up early to do my morning pages and then went to work out. Then I get to play restaurant later. There is a private party tonight so I’m hoping for a little less drama and more money. Lol.",
  //     "storyId": "643364ca07e4ed91ad81015a"
  //   },
  //   {
  //     "dayNumber": 2,
  //     "time": "12:20:00",
  //     "messageType": "SMS",
  //     "whoTo": "ME",
  //     "whoFrom": "Robert",
  //     "message": "What’s a zine?",
  //     "storyId": "643364ca07e4ed91ad81015a"
  //   },
  //   {
  //     "dayNumber": 2,
  //     "time": "12:21:00",
  //     "messageType": "SMS",
  //     "whoTo": "Robert",
  //     "whoFrom": "Me",
  //     "message": "It’s a little weekly thing I make, bits and bops",
  //     "storyId": "643364ca07e4ed91ad81015a"
  //   },
  //   {
  //     "dayNumber": 2,
  //     "time": "12:25:00",
  //     "messageType": "SMS",
  //     "whoTo": "ME",
  //     "whoFrom": "Robert",
  //     "message": "Bits and bops?",
  //     "storyId": "643364ca07e4ed91ad81015a"
  //   },
  //   {
  //     "dayNumber": 2,
  //     "time": "12:26:00",
  //     "messageType": "SMS",
  //     "whoTo": "Robert",
  //     "whoFrom": "Me",
  //     "message": "Yeah, poetry, some photography, quotes from artists I like. Stuff like that.",
  //     "storyId": "643364ca07e4ed91ad81015a"
  //   },
  //   {
  //     "dayNumber": 2,
  //     "time": "12:26:20",
  //     "messageType": "SMS",
  //     "whoTo": "Robert",
  //     "whoFrom": "Me",
  //     "message": "[image]",
  //     "storyId": "643364ca07e4ed91ad81015a"
  //   },
  //   {
  //     "dayNumber": 2,
  //     "time": "12:29:00",
  //     "messageType": "SMS",
  //     "whoTo": "ME",
  //     "whoFrom": "Robert",
  //     "message": "That sounds cool. You’re so creative. It’s turning me on.",
  //     "storyId": "643364ca07e4ed91ad81015a"
  //   },
  //   {
  //     "dayNumber": 2,
  //     "time": "12:40:00",
  //     "messageType": "SMS",
  //     "whoTo": "Robert",
  //     "whoFrom": "Me",
  //     "message": "Everything turns you on.",
  //     "storyId": "643364ca07e4ed91ad81015a"
  //   },
  //   {
  //     "dayNumber": 2,
  //     "time": "12:40:38",
  //     "messageType": "SMS",
  //     "whoTo": "ME",
  //     "whoFrom": "Robert",
  //     "message": "Have you met me?",
  //     "storyId": "643364ca07e4ed91ad81015a"
  //   },
  //   {
  //     "dayNumber": 2,
  //     "time": "12:45:00",
  //     "messageType": "SMS",
  //     "whoTo": "Robert",
  //     "whoFrom": "Me",
  //     "message": "Sure have.",
  //     "storyId": "643364ca07e4ed91ad81015a"
  //   },
  //   {
  //     "dayNumber": 2,
  //     "time": "12:59:00",
  //     "messageType": "SMS",
  //     "whoTo": "ME",
  //     "whoFrom": "Robert",
  //     "message": "Alright, I’m off to practice. Totally distracted now. Thanks to you 😉",
  //     "storyId": "643364ca07e4ed91ad81015a"
  //   },
  //   {
  //     "dayNumber": 2,
  //     "time": "13:00:00",
  //     "messageType": "SMS",
  //     "whoTo": "Robert",
  //     "whoFrom": "Me",
  //     "message": "Awesome. Good for you. Have a great time.",
  //     "storyId": "643364ca07e4ed91ad81015a"
  //   },
  //   {
  //     "dayNumber": 2,
  //     "time": "13:04:00",
  //     "messageType": "SMS",
  //     "whoTo": "ME",
  //     "whoFrom": "Robert",
  //     "message": "By the way what’s your IG?",
  //     "storyId": "643364ca07e4ed91ad81015a"
  //   },
  //   {
  //     "dayNumber": 2,
  //     "time": "13:06:00",
  //     "messageType": "SMS",
  //     "whoTo": "Robert",
  //     "whoFrom": "Me",
  //     "message": "Why so you can show your friends how cute I am?",
  //     "storyId": "643364ca07e4ed91ad81015a"
  //   },
  //   {
  //     "dayNumber": 2,
  //     "time": "13:08:00",
  //     "messageType": "SMS",
  //     "whoTo": "ME",
  //     "whoFrom": "Robert",
  //     "message": "Maybe 😍",
  //     "storyId": "643364ca07e4ed91ad81015a"
  //   },
  //   {
  //     "dayNumber": 2,
  //     "time": "13:10:00",
  //     "messageType": "SMS",
  //     "whoTo": "Robert",
  //     "whoFrom": "Me",
  //     "message": "I’ll tell you when I see you",
  //     "storyId": "643364ca07e4ed91ad81015a"
  //   },
  //   {
  //     "dayNumber": 2,
  //     "time": "13:14:00",
  //     "messageType": "SMS",
  //     "whoTo": "ME",
  //     "whoFrom": "Robert",
  //     "message": "I see how it is",
  //     "storyId": "643364ca07e4ed91ad81015a"
  //   },
  //   {
  //     "dayNumber": 2,
  //     "time": "13:17:00",
  //     "messageType": "SMS",
  //     "whoTo": "Robert",
  //     "whoFrom": "Me",
  //     "message": "I like to keep an air of mystery too.",
  //     "storyId": "643364ca07e4ed91ad81015a"
  //   },
  //   {
  //     "dayNumber": 3,
  //     "time": "0:34:00",
  //     "messageType": "SMS",
  //     "whoTo": "Robert",
  //     "whoFrom": "Me",
  //     "message": "Hey mister just got done. You still out?",
  //     "storyId": "643364ca07e4ed91ad81015a"
  //   },
  //   {
  //     "dayNumber": 3,
  //     "time": "0:36:00",
  //     "messageType": "SMS",
  //     "whoTo": "ME",
  //     "whoFrom": "Robert",
  //     "message": "Yea, I’m at Spy Bar with my drummer and his boyfriend. Come meet us. We have a table in the back. It’s open bar.",
  //     "storyId": "643364ca07e4ed91ad81015a"
  //   },
  //   {
  //     "dayNumber": 3,
  //     "time": "0:37:00",
  //     "messageType": "SMS",
  //     "whoTo": "Robert",
  //     "whoFrom": "Me",
  //     "message": "I’m exhausted. Think I’m going to take a raincheck.",
  //     "storyId": "643364ca07e4ed91ad81015a"
  //   },
  //   {
  //     "dayNumber": 3,
  //     "time": "0:38:00",
  //     "messageType": "SMS",
  //     "whoTo": "ME",
  //     "whoFrom": "Robert",
  //     "message": "I really want to kiss you right now 😍😍😍",
  //     "storyId": "643364ca07e4ed91ad81015a"
  //   },
  //   {
  //     "dayNumber": 3,
  //     "time": "0:39:00",
  //     "messageType": "SMS",
  //     "whoTo": "Robert",
  //     "whoFrom": "Me",
  //     "message": "It’s been a long drink.",
  //     "storyId": "643364ca07e4ed91ad81015a"
  //   },
  //   {
  //     "dayNumber": 3,
  //     "time": "0:39:30",
  //     "messageType": "SMS",
  //     "whoTo": "ME",
  //     "whoFrom": "Robert",
  //     "message": "Just come. Please. 🔥",
  //     "storyId": "643364ca07e4ed91ad81015a"
  //   },
  //   {
  //     "dayNumber": 3,
  //     "time": "0:40:00",
  //     "messageType": "SMS",
  //     "whoTo": "Robert",
  //     "whoFrom": "Me",
  //     "message": "Why don’t we meet up tomorrow afternoon? We could have lunch before my shift or maybe talk a walk in the neighborhood?",
  //     "storyId": "643364ca07e4ed91ad81015a"
  //   },
  //   {
  //     "dayNumber": 3,
  //     "time": "0:41:00",
  //     "messageType": "SMS",
  //     "whoTo": "ME",
  //     "whoFrom": "Robert",
  //     "message": "Just come for one drink.",
  //     "storyId": "643364ca07e4ed91ad81015a"
  //   },
  //   {
  //     "dayNumber": 3,
  //     "time": "0:42:00",
  //     "messageType": "SMS",
  //     "whoTo": "Robert",
  //     "whoFrom": "Me",
  //     "message": "Famous last words.",
  //     "storyId": "643364ca07e4ed91ad81015a"
  //   },
  //   {
  //     "dayNumber": 3,
  //     "time": "0:43:00",
  //     "messageType": "SMS",
  //     "whoTo": "ME",
  //     "whoFrom": "Robert",
  //     "message": "I really want to kiss that handsome face of yours.",
  //     "storyId": "643364ca07e4ed91ad81015a"
  //   },
  //   {
  //     "dayNumber": 3,
  //     "time": "0:45:00",
  //     "messageType": "SMS",
  //     "whoTo": "Robert",
  //     "whoFrom": "Me",
  //     "message": "I’m beat.",
  //     "storyId": "643364ca07e4ed91ad81015a"
  //   },
  //   {
  //     "dayNumber": 3,
  //     "time": "0:45:48",
  //     "messageType": "SMS",
  //     "whoTo": "ME",
  //     "whoFrom": "Robert",
  //     "message": "Come on. One drink then we go back to my place and I will do whatever you say 😉",
  //     "storyId": "643364ca07e4ed91ad81015a"
  //   },
  //   {
  //     "dayNumber": 3,
  //     "time": "0:47:00",
  //     "messageType": "SMS",
  //     "whoTo": "Robert",
  //     "whoFrom": "Me",
  //     "message": "Oh yeah?",
  //     "storyId": "643364ca07e4ed91ad81015a"
  //   },
  //   {
  //     "dayNumber": 3,
  //     "time": "0:48:00",
  //     "messageType": "SMS",
  //     "whoTo": "ME",
  //     "whoFrom": "Robert",
  //     "message": "Yes sir.",
  //     "storyId": "643364ca07e4ed91ad81015a"
  //   },
  //   {
  //     "dayNumber": 3,
  //     "time": "0:49:00",
  //     "messageType": "SMS",
  //     "whoTo": "Robert",
  //     "whoFrom": "Me",
  //     "message": "What if I want to handcuff you?",
  //     "storyId": "643364ca07e4ed91ad81015a"
  //   },
  //   {
  //     "dayNumber": 3,
  //     "time": "0:50:00",
  //     "messageType": "SMS",
  //     "whoTo": "ME",
  //     "whoFrom": "Robert",
  //     "message": "I own handcuffs.",
  //     "storyId": "643364ca07e4ed91ad81015a"
  //   },
  //   {
  //     "dayNumber": 3,
  //     "time": "0:51:00",
  //     "messageType": "SMS",
  //     "whoTo": "Robert",
  //     "whoFrom": "Me",
  //     "message": "Of course you do.",
  //     "storyId": "643364ca07e4ed91ad81015a"
  //   },
  //   {
  //     "dayNumber": 3,
  //     "time": "0:52:00",
  //     "messageType": "SMS",
  //     "whoTo": "Robert",
  //     "whoFrom": "Me",
  //     "message": "What if I want you to cook me a three course meal?",
  //     "storyId": "643364ca07e4ed91ad81015a"
  //   },
  //   {
  //     "dayNumber": 3,
  //     "time": "0:53:00",
  //     "messageType": "SMS",
  //     "whoTo": "ME",
  //     "whoFrom": "Robert",
  //     "message": "You’re the boss applesauce.",
  //     "storyId": "643364ca07e4ed91ad81015a"
  //   },
  //   {
  //     "dayNumber": 3,
  //     "time": "0:54:00",
  //     "messageType": "SMS",
  //     "whoTo": "Robert",
  //     "whoFrom": "Me",
  //     "message": "In an outfit of my choosing?",
  //     "storyId": "643364ca07e4ed91ad81015a"
  //   },
  //   {
  //     "dayNumber": 3,
  //     "time": "0:56:00",
  //     "messageType": "SMS",
  //     "whoTo": "ME",
  //     "whoFrom": "Robert",
  //     "message": "Tell me more.",
  //     "storyId": "643364ca07e4ed91ad81015a"
  //   },
  //   {
  //     "dayNumber": 3,
  //     "time": "0:57:00",
  //     "messageType": "SMS",
  //     "whoTo": "Robert",
  //     "whoFrom": "Me",
  //     "message": "Don’t worry I will",
  //     "storyId": "643364ca07e4ed91ad81015a"
  //   },
  //   {
  //     "dayNumber": 3,
  //     "time": "0:58:00",
  //     "messageType": "SMS",
  //     "whoTo": "ME",
  //     "whoFrom": "Robert",
  //     "message": "Whatever you slay. Ha ha say. Lol",
  //     "storyId": "643364ca07e4ed91ad81015a"
  //   },
  //   {
  //     "dayNumber": 3,
  //     "time": "0:59:00",
  //     "messageType": "SMS",
  //     "whoTo": "Robert",
  //     "whoFrom": "Me",
  //     "message": "Alright, I’m heading over.",
  //     "storyId": "643364ca07e4ed91ad81015a"
  //   },
  //   {
  //     "dayNumber": 3,
  //     "time": "1:04:00",
  //     "messageType": "SMS",
  //     "whoTo": "ME",
  //     "whoFrom": "Robert",
  //     "message": "Hurry your sex ass up. Sexy. Ha ha.",
  //     "storyId": "643364ca07e4ed91ad81015a"
  //   },
  //   {
  //     "dayNumber": 3,
  //     "time": "1:06:00",
  //     "messageType": "SMS",
  //     "whoTo": "Robert",
  //     "whoFrom": "Me",
  //     "message": "At the bar.",
  //     "storyId": "643364ca07e4ed91ad81015a"
  //   },
  //   {
  //     "dayNumber": 3,
  //     "time": "1:08:00",
  //     "messageType": "SMS",
  //     "whoTo": "Robert",
  //     "whoFrom": "Me",
  //     "message": "Hey. Where are you?",
  //     "storyId": "643364ca07e4ed91ad81015a"
  //   },
  //   {
  //     "dayNumber": 3,
  //     "time": "1:09:00",
  //     "messageType": "SMS",
  //     "whoTo": "Robert",
  //     "whoFrom": "Me",
  //     "message": "Hey tried to call you. I can’t find you.",
  //     "storyId": "643364ca07e4ed91ad81015a"
  //   },
  //   {
  //     "dayNumber": 3,
  //     "time": "1:11:00",
  //     "messageType": "SMS",
  //     "whoTo": "Robert",
  //     "whoFrom": "Me",
  //     "message": "Okay. I’m going home.",
  //     "storyId": "643364ca07e4ed91ad81015a"
  //   },
  //   {
  //     "dayNumber": 3,
  //     "time": "1:17:00",
  //     "messageType": "SMS",
  //     "whoTo": "ME",
  //     "whoFrom": "Robert",
  //     "message": "Oh hey, sorry we are across the street. Patio in the back.",
  //     "storyId": "643364ca07e4ed91ad81015a"
  //   },
  //   {
  //     "dayNumber": 3,
  //     "time": "1:17:45",
  //     "messageType": "SMS",
  //     "whoTo": "Robert",
  //     "whoFrom": "Me",
  //     "message": "Okay, headed home.",
  //     "storyId": "643364ca07e4ed91ad81015a"
  //   },
  //   {
  //     "dayNumber": 3,
  //     "time": "1:18:00",
  //     "messageType": "SMS",
  //     "whoTo": "ME",
  //     "whoFrom": "Robert",
  //     "message": "No, you gotta come join. Please Patrick.",
  //     "storyId": "643364ca07e4ed91ad81015a"
  //   },
  //   {
  //     "dayNumber": 3,
  //     "time": "1:18:25",
  //     "messageType": "SMS",
  //     "whoTo": "Robert",
  //     "whoFrom": "Me",
  //     "message": "No, I’m too tired.",
  //     "storyId": "643364ca07e4ed91ad81015a"
  //   },
  //   {
  //     "dayNumber": 3,
  //     "time": "1:19:00",
  //     "messageType": "SMS",
  //     "whoTo": "ME",
  //     "whoFrom": "Robert",
  //     "message": "Come on",
  //     "storyId": "643364ca07e4ed91ad81015a"
  //   },
  //   {
  //     "dayNumber": 3,
  //     "time": "1:20:00",
  //     "messageType": "SMS",
  //     "whoTo": "Robert",
  //     "whoFrom": "Me",
  //     "message": "I’m totally exhausted. Call me tomorrow.",
  //     "storyId": "643364ca07e4ed91ad81015a"
  //   },
  //   {
  //     "dayNumber": 3,
  //     "time": "1:21:00",
  //     "messageType": "SMS",
  //     "whoTo": "ME",
  //     "whoFrom": "Robert",
  //     "message": "Don’t make me beg.",
  //     "storyId": "643364ca07e4ed91ad81015a"
  //   },
  //   {
  //     "dayNumber": 3,
  //     "time": "1:22:00",
  //     "messageType": "SMS",
  //     "whoTo": "Robert",
  //     "whoFrom": "Me",
  //     "message": "Lets meet tomorrow",
  //     "storyId": "643364ca07e4ed91ad81015a"
  //   },
  //   {
  //     "dayNumber": 3,
  //     "time": "1:22:30",
  //     "messageType": "SMS",
  //     "whoTo": "ME",
  //     "whoFrom": "Robert",
  //     "message": "I’m down on my knees begging you.  😉",
  //     "storyId": "643364ca07e4ed91ad81015a"
  //   },
  //   {
  //     "dayNumber": 3,
  //     "time": "1:23:00",
  //     "messageType": "SMS",
  //     "whoTo": "Robert",
  //     "whoFrom": "Me",
  //     "message": "[David Rose GIF]",
  //     "storyId": "643364ca07e4ed91ad81015a"
  //   },
  //   {
  //     "dayNumber": 3,
  //     "time": "1:23:35",
  //     "messageType": "SMS",
  //     "whoTo": "Robert",
  //     "whoFrom": "Me",
  //     "message": "I like my men to beg.",
  //     "storyId": "643364ca07e4ed91ad81015a"
  //   },
  //   {
  //     "dayNumber": 3,
  //     "time": "1:23:00",
  //     "messageType": "SMS",
  //     "whoTo": "Robert",
  //     "whoFrom": "Me",
  //     "message": "Okay",
  //     "storyId": "643364ca07e4ed91ad81015a"
  //   },
  //   {
  //     "dayNumber": 3,
  //     "time": "1:24:00",
  //     "messageType": "SMS",
  //     "whoTo": "ME",
  //     "whoFrom": "Robert",
  //     "message": "I’ll do whatever you tell me to do sir.",
  //     "storyId": "643364ca07e4ed91ad81015a"
  //   },
  //   {
  //     "dayNumber": 3,
  //     "time": "1:25:00",
  //     "messageType": "SMS",
  //     "whoTo": "Robert",
  //     "whoFrom": "Me",
  //     "message": "Don’t go anywhere. But also order me a whiskey.",
  //     "storyId": "643364ca07e4ed91ad81015a"
  //   },
  //   {
  //     "dayNumber": 3,
  //     "time": "1:26:00",
  //     "messageType": "SMS",
  //     "whoTo": "ME",
  //     "whoFrom": "Robert",
  //     "message": "Yes sir.",
  //     "storyId": "643364ca07e4ed91ad81015a"
  //   },
  //   {
  //     "dayNumber": 3,
  //     "time": "1:27:00",
  //     "messageType": "SMS",
  //     "whoTo": "Robert",
  //     "whoFrom": "Me",
  //     "message": "Rye. Neat.",
  //     "storyId": "643364ca07e4ed91ad81015a"
  //   },
  //   {
  //     "dayNumber": 3,
  //     "time": "9:35:00",
  //     "messageType": "SMS",
  //     "whoTo": "Robert",
  //     "whoFrom": "Me",
  //     "message": "I’m so hungover. Oh My god.",
  //     "storyId": "643364ca07e4ed91ad81015a"
  //   },
  //   {
  //     "dayNumber": 3,
  //     "time": "10:00:00",
  //     "messageType": "SMS",
  //     "whoTo": "ME",
  //     "whoFrom": "Robert",
  //     "message": "I keep thinking about you in your mailman outfit",
  //     "storyId": "643364ca07e4ed91ad81015a"
  //   },
  //   {
  //     "dayNumber": 3,
  //     "time": "10:10:00",
  //     "messageType": "SMS",
  //     "whoTo": "Robert",
  //     "whoFrom": "Me",
  //     "message": "[image]",
  //     "storyId": "643364ca07e4ed91ad81015a"
  //   },
  //   {
  //     "dayNumber": 3,
  //     "time": "10:10:20",
  //     "messageType": "SMS",
  //     "whoTo": "Robert",
  //     "whoFrom": "Me",
  //     "message": "Why does everyone get so turned on by it?",
  //     "storyId": "643364ca07e4ed91ad81015a"
  //   },
  //   {
  //     "dayNumber": 3,
  //     "time": "10:15:00",
  //     "messageType": "SMS",
  //     "whoTo": "ME",
  //     "whoFrom": "Robert",
  //     "message": "Didn’t you ever hot and bothered by your mail man when you were a kid?",
  //     "storyId": "643364ca07e4ed91ad81015a"
  //   },
  //   {
  //     "dayNumber": 3,
  //     "time": "10:16:00",
  //     "messageType": "SMS",
  //     "whoTo": "Robert",
  //     "whoFrom": "Me",
  //     "message": "No, I was more into firefighters myself.",
  //     "storyId": "643364ca07e4ed91ad81015a"
  //   },
  //   {
  //     "dayNumber": 3,
  //     "time": "10:24:00",
  //     "messageType": "SMS",
  //     "whoTo": "ME",
  //     "whoFrom": "Robert",
  //     "message": "That’s hot. What else are you into?",
  //     "storyId": "643364ca07e4ed91ad81015a"
  //   },
  //   {
  //     "dayNumber": 3,
  //     "time": "10:45:00",
  //     "messageType": "SMS",
  //     "whoTo": "Robert",
  //     "whoFrom": "Me",
  //     "message": "Alright, time to get some writing done. Text me after your session.",
  //     "storyId": "643364ca07e4ed91ad81015a"
  //   },
  //   {
  //     "dayNumber": 3,
  //     "time": "10:46:00",
  //     "messageType": "SMS",
  //     "whoTo": "ME",
  //     "whoFrom": "Robert",
  //     "message": "Yes Daddy. Do you like being called that?",
  //     "storyId": "643364ca07e4ed91ad81015a"
  //   },
  //   {
  //     "dayNumber": 3,
  //     "time": "10:47:00",
  //     "messageType": "SMS",
  //     "whoTo": "Robert",
  //     "whoFrom": "Me",
  //     "message": "I’ll have to hear it in person before I decide. 😉",
  //     "storyId": "643364ca07e4ed91ad81015a"
  //   },
  //   {
  //     "dayNumber": 3,
  //     "time": "10:48:00",
  //     "messageType": "SMS",
  //     "whoTo": "ME",
  //     "whoFrom": "Robert",
  //     "message": "Does tomorrow night still work for the screening?",
  //     "storyId": "643364ca07e4ed91ad81015a"
  //   },
  //   {
  //     "dayNumber": 3,
  //     "time": "11:00:00",
  //     "messageType": "SMS",
  //     "whoTo": "Robert",
  //     "whoFrom": "Me",
  //     "message": "Yes, I got my shift covered. I think going to that movie tomorrow night sounds pretty great.",
  //     "storyId": "643364ca07e4ed91ad81015a"
  //   },
  //   {
  //     "dayNumber": 3,
  //     "time": "16:00:00",
  //     "messageType": "SMS",
  //     "whoTo": "Robert",
  //     "whoFrom": "Me",
  //     "message": "Hey handsome, heading into work. Hope you’re having a great day. How was the session?",
  //     "storyId": "643364ca07e4ed91ad81015a"
  //   },
  //   {
  //     "dayNumber": 1,
  //     "time": "23:45:00",
  //     "messageType": "SMS",
  //     "whoTo": "Robert",
  //     "whoFrom": "Me",
  //     "message": "Hey just got out of work. How are you? How was your evening?",
  //     "storyId": "643364ca07e4ed91ad81015a"
  //   },
  //   {
  //     "dayNumber": 4,
  //     "time": "0:08:00",
  //     "messageType": "SMS",
  //     "whoTo": "Robert",
  //     "whoFrom": "Me",
  //     "message": "Just got home. Going to head to bed.",
  //     "storyId": "643364ca07e4ed91ad81015a"
  //   },
  //   {
  //     "dayNumber": 4,
  //     "time": "0:19:00",
  //     "messageType": "SMS",
  //     "whoTo": "Robert",
  //     "whoFrom": "Me",
  //     "message": "Sweet dreams. Shoot me a text and tell me how your evening was 😉",
  //     "storyId": "643364ca07e4ed91ad81015a"
  //   },
  //   {
  //     "dayNumber": 4,
  //     "time": "1:01:00",
  //     "messageType": "SMS",
  //     "whoTo": "Robert",
  //     "whoFrom": "Me",
  //     "message": "I can’t sleep. I want your sweaty hairy body next to mine.",
  //     "storyId": "643364ca07e4ed91ad81015a"
  //   },
  //   {
  //     "dayNumber": 4,
  //     "time": "11:11:00",
  //     "messageType": "SMS",
  //     "whoTo": "ME",
  //     "whoFrom": "Robert",
  //     "message": "Hi. I’m really sorry for the delayed response. I didn’t want you to think that I was ghosting you. It’s been a really crazy 24 hours. I actually had to fly home to Wisconsin for a family emergency. 😔",
  //     "storyId": "643364ca07e4ed91ad81015a"
  //   },
  //   {
  //     "dayNumber": 4,
  //     "time": "11:12:00",
  //     "messageType": "SMS",
  //     "whoTo": "Robert",
  //     "whoFrom": "Me",
  //     "message": "Oh wow, no worries. No need to explain. Sorry for sending all those texts. I totally understand. Family is the most important thing. I hope everything is okay.",
  //     "storyId": "643364ca07e4ed91ad81015a"
  //   },
  //   {
  //     "dayNumber": 4,
  //     "time": "11:14:00",
  //     "messageType": "SMS",
  //     "whoTo": "ME",
  //     "whoFrom": "Robert",
  //     "message": "Yeah, unfortunately my Mom slipped and fell on the ice. She’s going to need a lot of help getting around. Trying to coordinate with my sisters about a plan for helping her get around for the next few days.",
  //     "storyId": "643364ca07e4ed91ad81015a"
  //   },
  //   {
  //     "dayNumber": 4,
  //     "time": "11:15:00",
  //     "messageType": "SMS",
  //     "whoTo": "Robert",
  //     "whoFrom": "Me",
  //     "message": "Oh no, I’m so sorry to hear that.",
  //     "storyId": "643364ca07e4ed91ad81015a"
  //   },
  //   {
  //     "dayNumber": 4,
  //     "time": "11:16:00",
  //     "messageType": "SMS",
  //     "whoTo": "ME",
  //     "whoFrom": "Robert",
  //     "message": "Thanks, yeah it’s been intense.",
  //     "storyId": "643364ca07e4ed91ad81015a"
  //   },
  //   {
  //     "dayNumber": 4,
  //     "time": "11:17:00",
  //     "messageType": "SMS",
  //     "whoTo": "Robert",
  //     "whoFrom": "Me",
  //     "message": "I totally understand. I’m so glad you can be there to help. Your family is lucky. Please let me know if you need anything at all. ❤️",
  //     "storyId": "643364ca07e4ed91ad81015a"
  //   },
  //   {
  //     "dayNumber": 5,
  //     "time": "13:30:00",
  //     "messageType": "SMS",
  //     "whoTo": "Robert",
  //     "whoFrom": "Me",
  //     "message": "I hope your Mom is doing well. Thinking about you.",
  //     "storyId": "643364ca07e4ed91ad81015a"
  //   },
  //   {
  //     "dayNumber": 5,
  //     "time": "16:45:00",
  //     "messageType": "SMS",
  //     "whoTo": "ME",
  //     "whoFrom": "Robert",
  //     "message": "Thank you. I’ll give you a call when I get back.",
  //     "storyId": "643364ca07e4ed91ad81015a"
  //   },
  //   {
  //     "dayNumber": 5,
  //     "time": "19:45:00",
  //     "messageType": "SMS",
  //     "whoTo": "Robert",
  //     "whoFrom": "Me",
  //     "message": "That sounds good. Have a great night 😘",
  //     "storyId": "643364ca07e4ed91ad81015a"
  //   },
  //   {
  //     "dayNumber": 6,
  //     "time": "14:50:00",
  //     "messageType": "SMS",
  //     "whoTo": "Robert",
  //     "whoFrom": "Me",
  //     "message": "I hope you’re doing well.",
  //     "storyId": "643364ca07e4ed91ad81015a"
  //   },
  //   {
  //     "dayNumber": 6,
  //     "time": "16:45:00",
  //     "messageType": "SMS",
  //     "whoTo": "ME",
  //     "whoFrom": "Robert",
  //     "message": "Thank you. I am. I hope you are too.",
  //     "storyId": "643364ca07e4ed91ad81015a"
  //   },
  //   {
  //     "dayNumber": 6,
  //     "time": "16:48:00",
  //     "messageType": "SMS",
  //     "whoTo": "Robert",
  //     "whoFrom": "ME",
  //     "message": "How is your mom doing? ❤️",
  //     "storyId": "643364ca07e4ed91ad81015a"
  //   },
  //   {
  //     "dayNumber": 6,
  //     "time": "18:50:00",
  //     "messageType": "SMS",
  //     "whoTo": "ME",
  //     "whoFrom": "Robert",
  //     "message": "Better thanks. Feels very surreal to be back home in my childhood bedroom.",
  //     "storyId": "643364ca07e4ed91ad81015a"
  //   },
  //   {
  //     "dayNumber": 6,
  //     "time": "19:00:00",
  //     "messageType": "SMS",
  //     "whoTo": "Robert",
  //     "whoFrom": "Me",
  //     "message": "I’m sure. I remember my parents sold our house after I went to college and it always made me sad to think of another family there. I used to have glow in the dark stickers on my ceiling.",
  //     "storyId": "643364ca07e4ed91ad81015a"
  //   },
  //   {
  //     "dayNumber": 6,
  //     "time": "23:56:00",
  //     "messageType": "SMS",
  //     "whoTo": "Robert",
  //     "whoFrom": "Me",
  //     "message": "Yes, just getting into bed. Have a great night.",
  //     "storyId": "643364ca07e4ed91ad81015a"
  //   },
  //   {
  //     "dayNumber": 6,
  //     "time": "23:59:00",
  //     "messageType": "SMS",
  //     "whoTo": "ME",
  //     "whoFrom": "Robert",
  //     "message": "Thank you. You too.",
  //     "storyId": "643364ca07e4ed91ad81015a"
  //   },
  //   {
  //     "dayNumber": 7,
  //     "time": "12:30:00",
  //     "messageType": "SMS",
  //     "whoTo": "Robert",
  //     "whoFrom": "Me",
  //     "message": "Hey how are you?",
  //     "storyId": "643364ca07e4ed91ad81015a"
  //   },
  //   {
  //     "dayNumber": 7,
  //     "time": "13:30:00",
  //     "messageType": "SMS",
  //     "whoTo": "ME",
  //     "whoFrom": "Robert",
  //     "message": "I am doing well. Glad I have been able to be here to help.",
  //     "storyId": "643364ca07e4ed91ad81015a"
  //   },
  //   {
  //     "dayNumber": 7,
  //     "time": "13:45:00",
  //     "messageType": "SMS",
  //     "whoTo": "Robert",
  //     "whoFrom": "Me",
  //     "message": "I’m sure your Dad is so happy you can be there. How’s everyone doing?",
  //     "storyId": "643364ca07e4ed91ad81015a"
  //   },
  //   {
  //     "dayNumber": 7,
  //     "time": "14:00:00",
  //     "messageType": "SMS",
  //     "whoTo": "ME",
  //     "whoFrom": "Robert",
  //     "message": "Everyone is okay. It feels strange to be home.",
  //     "storyId": "643364ca07e4ed91ad81015a"
  //   },
  //   {
  //     "dayNumber": 7,
  //     "time": "14:30:00",
  //     "messageType": "SMS",
  //     "whoTo": "Robert",
  //     "whoFrom": "Me",
  //     "message": "How’s everything going there?",
  //     "storyId": "643364ca07e4ed91ad81015a"
  //   },
  //   {
  //     "dayNumber": 7,
  //     "time": "14:35:00",
  //     "messageType": "SMS",
  //     "whoTo": "ME",
  //     "whoFrom": "Robert",
  //     "message": "Intense. But good. Glad I could be here to help.",
  //     "storyId": "643364ca07e4ed91ad81015a"
  //   },
  //   {
  //     "dayNumber": 7,
  //     "time": "14:36:00",
  //     "messageType": "SMS",
  //     "whoTo": "Robert",
  //     "whoFrom": "Me",
  //     "message": "So you’re still in Wisconsin?",
  //     "storyId": "643364ca07e4ed91ad81015a"
  //   },
  //   {
  //     "dayNumber": 7,
  //     "time": "15:00:00",
  //     "messageType": "SMS",
  //     "whoTo": "ME",
  //     "whoFrom": "Robert",
  //     "message": "Yes.",
  //     "storyId": "643364ca07e4ed91ad81015a"
  //   },
  //   {
  //     "dayNumber": 7,
  //     "time": "15:00:35",
  //     "messageType": "SMS",
  //     "whoTo": "Robert",
  //     "whoFrom": "Me",
  //     "message": "Interesting….",
  //     "storyId": "643364ca07e4ed91ad81015a"
  //   },
  //   {
  //     "dayNumber": 7,
  //     "time": "15:40:00",
  //     "messageType": "SMS",
  //     "whoTo": "ME",
  //     "whoFrom": "Robert",
  //     "message": "...",
  //     "storyId": "643364ca07e4ed91ad81015a"
  //   },
  //   {
  //     "dayNumber": 7,
  //     "time": "15:45:00",
  //     "messageType": "SMS",
  //     "whoTo": "Robert",
  //     "whoFrom": "Me",
  //     "message": "That’s interesting because I just saw on your insta story you were at Venice beach.",
  //     "storyId": "643364ca07e4ed91ad81015a"
  //   },
  //   {
  //     "dayNumber": 7,
  //     "time": "15:46:00",
  //     "messageType": "SMS",
  //     "whoTo": "ME",
  //     "whoFrom": "Robert",
  //     "message": "Oh yeah, just got back this morning.",
  //     "storyId": "643364ca07e4ed91ad81015a"
  //   },
  //   {
  //     "dayNumber": 7,
  //     "time": "15:48:00",
  //     "messageType": "SMS",
  //     "whoTo": "Robert",
  //     "whoFrom": "Me",
  //     "message": "I thought you said you were still there.",
  //     "storyId": "643364ca07e4ed91ad81015a"
  //   },
  //   {
  //     "dayNumber": 7,
  //     "time": "15:49:00",
  //     "messageType": "SMS",
  //     "whoTo": "ME",
  //     "whoFrom": "Robert",
  //     "message": "I’m exhausted. Think I misread that text.",
  //     "storyId": "643364ca07e4ed91ad81015a"
  //   },
  //   {
  //     "dayNumber": 7,
  //     "time": "16:00:00",
  //     "messageType": "SMS",
  //     "whoTo": "Robert",
  //     "whoFrom": "Me",
  //     "message": "I see.",
  //     "storyId": "643364ca07e4ed91ad81015a"
  //   },
  //   {
  //     "dayNumber": 7,
  //     "time": "16:01:00",
  //     "messageType": "SMS",
  //     "whoTo": "ME",
  //     "whoFrom": "Robert",
  //     "message": "You see what?",
  //     "storyId": "643364ca07e4ed91ad81015a"
  //   },
  //   {
  //     "dayNumber": 7,
  //     "time": "16:04:00",
  //     "messageType": "SMS",
  //     "whoTo": "Robert",
  //     "whoFrom": "Me",
  //     "message": "Okay. Wow. Fast trip.",
  //     "storyId": "643364ca07e4ed91ad81015a"
  //   },
  //   {
  //     "dayNumber": 7,
  //     "time": "16:05:00",
  //     "messageType": "SMS",
  //     "whoTo": "ME",
  //     "whoFrom": "Robert",
  //     "message": "Yeah, it was.",
  //     "storyId": "643364ca07e4ed91ad81015a"
  //   },
  //   {
  //     "dayNumber": 7,
  //     "time": "16:08:00",
  //     "messageType": "SMS",
  //     "whoTo": "Robert",
  //     "whoFrom": "Me",
  //     "message": "How are you?",
  //     "storyId": "643364ca07e4ed91ad81015a"
  //   },
  //   {
  //     "dayNumber": 7,
  //     "time": "16:10:00",
  //     "messageType": "SMS",
  //     "whoTo": "ME",
  //     "whoFrom": "Robert",
  //     "message": "I’m okay. What’s up?",
  //     "storyId": "643364ca07e4ed91ad81015a"
  //   },
  //   {
  //     "dayNumber": 7,
  //     "time": "16:12:00",
  //     "messageType": "SMS",
  //     "whoTo": "Robert",
  //     "whoFrom": "Me",
  //     "message": "Glad that trip worked out for you.",
  //     "storyId": "643364ca07e4ed91ad81015a"
  //   },
  //   {
  //     "dayNumber": 7,
  //     "time": "16:16:00",
  //     "messageType": "SMS",
  //     "whoTo": "ME",
  //     "whoFrom": "Robert",
  //     "message": "Thanks",
  //     "storyId": "643364ca07e4ed91ad81015a"
  //   },
  //   {
  //     "dayNumber": 7,
  //     "time": "16:18:00",
  //     "messageType": "SMS",
  //     "whoTo": "Robert",
  //     "whoFrom": "Me",
  //     "message": "...",
  //     "storyId": "643364ca07e4ed91ad81015a"
  //   },
  //   {
  //     "dayNumber": 7,
  //     "time": "16:19:00",
  //     "messageType": "SMS",
  //     "whoTo": "Robert",
  //     "whoFrom": "Me",
  //     "message": "Have a great day.",
  //     "storyId": "643364ca07e4ed91ad81015a"
  //   },
  //   {
  //     "dayNumber": 7,
  //     "time": "16:21:00",
  //     "messageType": "SMS",
  //     "whoTo": "ME",
  //     "whoFrom": "Robert",
  //     "message": "Thanks.",
  //     "storyId": "643364ca07e4ed91ad81015a"
  //   },
  //   {
  //     "dayNumber": 7,
  //     "time": "16:22:00",
  //     "messageType": "SMS",
  //     "whoTo": "Robert",
  //     "whoFrom": "Me",
  //     "message": "So I’m going to go out on a limb here, based on the advice of a friend and call bullshit on your story. I don’t believe that you actually went anywhere. Which is fine, right. We don’t owe one another anything.",
  //     "storyId": "643364ca07e4ed91ad81015a"
  //   },
  //   {
  //     "dayNumber": 7,
  //     "time": "16:26:00",
  //     "messageType": "SMS",
  //     "whoTo": "ME",
  //     "whoFrom": "Robert",
  //     "message": "You’re right. We don’t",
  //     "storyId": "643364ca07e4ed91ad81015a"
  //   },
  //   {
  //     "dayNumber": 7,
  //     "time": "16:27:00",
  //     "messageType": "SMS",
  //     "whoTo": "Robert",
  //     "whoFrom": "Me",
  //     "message": "It’s just that I really like you. Or I really liked you I guess since you’re making it pretty clear you’re no longer interested. The whole thing is just making me question your honest and also pretty curious why you’d make up a story like that in the first place.",
  //     "storyId": "643364ca07e4ed91ad81015a"
  //   },
  //   {
  //     "dayNumber": 7,
  //     "time": "16:28:00",
  //     "messageType": "SMS",
  //     "whoTo": "ME",
  //     "whoFrom": "Robert",
  //     "message": "Look, I’m sorry.",
  //     "storyId": "643364ca07e4ed91ad81015a"
  //   },
  //   {
  //     "dayNumber": 7,
  //     "time": "16:30:00",
  //     "messageType": "SMS",
  //     "whoTo": "Robert",
  //     "whoFrom": "Me",
  //     "message": "You don’t need to be sorry. I just don’t understand.",
  //     "storyId": "643364ca07e4ed91ad81015a"
  //   },
  //   {
  //     "dayNumber": 7,
  //     "time": "16:45:00",
  //     "messageType": "SMS",
  //     "whoTo": "ME",
  //     "whoFrom": "Robert",
  //     "message": "I have a lot going on right now.",
  //     "storyId": "643364ca07e4ed91ad81015a"
  //   },
  //   {
  //     "dayNumber": 7,
  //     "time": "17:00:00",
  //     "messageType": "SMS",
  //     "whoTo": "Robert",
  //     "whoFrom": "Me",
  //     "message": "You lied to me.",
  //     "storyId": "643364ca07e4ed91ad81015a"
  //   },
  //   {
  //     "dayNumber": 7,
  //     "time": "18:05:00",
  //     "messageType": "SMS",
  //     "whoTo": "ME",
  //     "whoFrom": "Robert",
  //     "message": "Look, my life is really complicated right now.",
  //     "storyId": "643364ca07e4ed91ad81015a"
  //   },
  //   {
  //     "dayNumber": 7,
  //     "time": "19:07:00",
  //     "messageType": "SMS",
  //     "whoTo": "Robert",
  //     "whoFrom": "Me",
  //     "message": "Join the club…..",
  //     "storyId": "643364ca07e4ed91ad81015a"
  //   },
  //   {
  //     "dayNumber": 7,
  //     "time": "19:08:00",
  //     "messageType": "SMS",
  //     "whoTo": "ME",
  //     "whoFrom": "Robert",
  //     "message": "...",
  //     "storyId": "643364ca07e4ed91ad81015a"
  //   },
  //   {
  //     "dayNumber": 7,
  //     "time": "22:00:00",
  //     "messageType": "SMS",
  //     "whoTo": "Robert",
  //     "whoFrom": "Me",
  //     "message": "I just really liked you. Like, I really liked you. And it’s the first time in a long time that I have felt this way. I guess I just thought you were different. And now I realize you’re just like every other gay man in West Hollywood.",
  //     "storyId": "643364ca07e4ed91ad81015a"
  //   },
  //   {
  //     "dayNumber": 7,
  //     "time": "22:10:00",
  //     "messageType": "SMS",
  //     "whoTo": "ME",
  //     "whoFrom": "Robert",
  //     "message": "You don’t even know me.",
  //     "storyId": "643364ca07e4ed91ad81015a"
  //   },
  //   {
  //     "dayNumber": 7,
  //     "time": "22:11:00",
  //     "messageType": "SMS",
  //     "whoTo": "Robert",
  //     "whoFrom": "Me",
  //     "message": "I was starting to get to know you. Or at least I thought I was. Because you were so interested.",
  //     "storyId": "643364ca07e4ed91ad81015a"
  //   },
  //   {
  //     "dayNumber": 7,
  //     "time": "22:12:00",
  //     "messageType": "SMS",
  //     "whoTo": "ME",
  //     "whoFrom": "Robert",
  //     "message": "...",
  //     "storyId": "643364ca07e4ed91ad81015a"
  //   },
  //   {
  //     "dayNumber": 7,
  //     "time": "22:18:00",
  //     "messageType": "SMS",
  //     "whoTo": "Robert",
  //     "whoFrom": "Me",
  //     "message": "And you don’t know me. But you acted like you wanted to get to know me. I feel like you were so crazy about me for the last few days you had me believing you really did want to get to know me. And it made me feel like I wanted to get to know you. So I guess, if nothing else you reminded me that it’s possible and that I’m ready again.",
  //     "storyId": "643364ca07e4ed91ad81015a"
  //   },
  //   {
  //     "dayNumber": 7,
  //     "time": "22:18:00",
  //     "messageType": "SMS",
  //     "whoTo": "ME",
  //     "whoFrom": "Robert",
  //     "message": "...",
  //     "storyId": "643364ca07e4ed91ad81015a"
  //   },
  //   {
  //     "dayNumber": 7,
  //     "time": "22:25:00",
  //     "messageType": "SMS",
  //     "whoTo": "Robert",
  //     "whoFrom": "Me",
  //     "message": "I just don’t understand why you made up some story. Why couldn’t you just be honest with me?",
  //     "storyId": "643364ca07e4ed91ad81015a"
  //   },
  //   {
  //     "dayNumber": 7,
  //     "time": "23:00:00",
  //     "messageType": "SMS",
  //     "whoTo": "Robert",
  //     "whoFrom": "Me",
  //     "message": "Anyway. Goodbye. [text is now green showing he has been blocked by Robert]",
  //     "storyId": "643364ca07e4ed91ad81015a"
  //   }
  // ]
