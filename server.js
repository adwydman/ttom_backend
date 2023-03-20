const http = require("http");
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const multer = require('multer');
const csv = require('csvtojson');
const XLSX = require("xlsx");

const User = require("./models/User");
const keys = require("./config/Keys.js");
const Story = require("./models/Story");

const loginRoute = require('./routes/login');
const registerRoute = require('./routes/register');
const userStoryTextMessagesRoutes = require('./routes/userStoryTextMessages');
const usersRoutes = require('./routes/users');

const app = (module.exports.app = express());

const db = keys.mongoURI;
const port = process.env.PORT || 3000;
const server = http.createServer(app);
server.listen(port, '10.0.0.74', () => {
  console.log("listening on port 3000");
});

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const authenticateUser = async (req, res, next) => {
  const nonSecurePaths = ['/', '/login', '/register', '/upload'];
  if (nonSecurePaths.includes(req.path)) {
    return next();
  }

  const userToken = req.body.userToken || req.query.userToken;

  const user = await User.findOne({ token: userToken });
  if (!user) {
    return res.status(404).json({ message: 'User token not found' });
  }

  req.__user__ = user;

  next();
}

app.use(cors());
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(authenticateUser)

mongoose
  .connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    // const story = new Story({
    //     name: "Sorry, Wrong Person",
    //     categories: ['Comedy'],
    //     author: "Leah Barsanti",
    //     picture: "https://i.imgur.com/u4STAok.png",
    //     description: "Sarah starts texting to Greta... so she thinks. Fellow these roommies through their hilarious miscommunications.",
    //     duration: "1 week",
    //     mainCharacter: "Sarah",
    //   });
    //   story
    //     .save()
    //     .catch((err) => console.log(err));

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

app.get("/show", (req, res) => {
  var workbook = XLSX.readFile("BestFriends_LoriTaylor_CSV.xlsx");
  var sheet_name_list = workbook.SheetNames;
  var xlData = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]], {
    raw: false,
  });
  console.log(xlData);
});

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

app.post("/importStory", (req, res) => {
  // check if exists
  // var workbook = XLSX.readFile("BestFriends_LoriTaylor_CSV.xlsx");
  // var sheet_name_list = workbook.SheetNames;
  // var xlData = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]], {
  //   raw: false,
  // });
  // const story = new Story({
  //   name: "Favourites Landscape",
  //   category: "Romacnce",
  //   author: "Haidar Iqbal",
  //   picture: "https://i.imgur.com/UPrs1EWl.jpg",
  // });
  // story
  //   .save()
  //   .then((model) => res.json(model))
  //   .catch((err) => console.log(err));
});

app.get('/stories', (req, res) => {
  Story.find({})
    .then((story) => {
      res.json(story);
    })
})

app.get('/story', (req, res) => {
  Story.find({ name: 'The Actress And The Painter' })
    .then((story) => {
      res.json(story);
    })
})

app.get("/getSoriesList", (req, res) => {
  Story.find({}).then((list) => {
    res.send(list);
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
