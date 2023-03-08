var http = require("http");
var express = require("express");
var cors = require("cors");
var bodyParser = require("body-parser");
const User = require("./models/User");
var mongoose = require("mongoose");
const crypto = require('crypto');
const keys = require("./config/Keys.js");
const bcrypt = require("bcryptjs");
const Story = require("./models/Story");
const Conversation = require('./models/Conversation');
const UserStoryTextMessages = require('./models/UserStoryTextMessages');
var XLSX = require("xlsx");
var app = (module.exports.app = express());
var mongo = require('mongodb');


const db = keys.mongoURI;
var port = process.env.PORT || 3000;
var server = http.createServer(app);
var IO = require("socket.io")(server); //pass a http.Server instance
server.listen(port, '10.0.0.74', () => {
  console.log("listening on port 3000");
});

const authenticateUser = async (req, res, next) => {
  const nonSecurePaths = ['/', '/login', '/register'];
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
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  User.findOne({ email }, (error, user) => {
    if (!user) {
      res
        .status(404)
        .json({ status: 'error', text: 'Incorrect username or password'});
    } else {
      bcrypt.compare(password, user.password).then((isMatch) => {
        if (isMatch) {
          const token = crypto.randomBytes(64).toString('hex');
          user.token = token;
          user
            .save()
            .then(() => {
              res
              .status(200)
              .json({
                status: 'success',
                token
              });
            })
        } else {
          res
            .status(404)
            .json({ status: 'error', text: 'Incorrect username or password'});
        }
      });
    }
  });
});

app.post("/register", async (req, res) => {
  const { email, password } = req.body;

  User.findOne({ email }).then((user) => {
    if (user) {
      res
        .status(400)
        .json({ status: "error", text: "Email already exists" });
    } else {
      const newUser = new User({
        email,
        password,
      });
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (!err) {
            newUser.password = hash;
            newUser
              .save()
              .then((user) => {
                res
                  .status(200)
                  .json({ success: true, text: "Successful" });
              })
              .catch((err) => console.log(err));
          } else {
            console.log('error', err)
          }
        });
      });
    }
  });
});

app.get("/show", (req, res) => {
  var workbook = XLSX.readFile("BestFriends_LoriTaylor_CSV.xlsx");
  var sheet_name_list = workbook.SheetNames;
  var xlData = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]], {
    raw: false,
  });
  console.log(xlData);
});

app.post("/addStory", (req, res) => {
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

app.get('/users', async (req, res) => {
  const {
    storyId
  } = req.query;

  const user = await User.find({ userId: req.__user__.id });
  const storyAdded = user[0].stories.includes(storyId);

  return res.status(200).json({ message: 'Ok', data: { storyAdded }})
})

app.get('/userStoryTextMessages', async (req, res) => {
  const {
    storyId
  } = req.query;

  const availableUserStoryTextMessages = await UserStoryTextMessages.find({ userId: req.__user__.id, storyId: storyId })
  // const availableUserStoryTextMessages = await UserStoryTextMessages.find({ userId: req.__user__.id, storyId: storyId, enabledAt: { $lte: new Date().toISOString() }})
  if (!availableUserStoryTextMessages) {
    console.log('not found')
    return res.status(404).json({ message: 'User story conversations not found', data: null });
  }

  const conversationIds = availableUserStoryTextMessages.map(({ conversationId }) => conversationId);
  const conversations = await Conversation.find({ _id: {
    $in: conversationIds
  }})

  // console.log('availableUserStoryTextMessages', availableUserStoryTextMessages)

  const parsedConversations = conversations.map((c, index) => {
    const matchingUST = availableUserStoryTextMessages.find(({conversationId}) => conversationId === c._id.toString())

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

  return res.status(200).json({ message: 'Ok', data: parsedConversations });
})

app.post('/userStoryTextMessages', async (req, res) => {
  const {
    storyId
  } = req.body;

  console.log('storyId', storyId)

  const story = await Story.findOne({ _id: storyId });
  if (!story) {
    return res.status(404).json({ message: 'Story not found' });
  }

  const existingConversation = await UserStoryTextMessages.findOne({ userId: req.__user__._id })
  if (existingConversation) {
    return res.status(422).json({ message: 'Conversations already added for user'})
  }

  await User.findByIdAndUpdate(req.__user__._id, { "$push": { stories: storyId }})

  const conversations = await Conversation.find({ storyId })

  const insertInfo = conversations.map(conversation => {
    const [hours, minutes, seconds] = conversation.time.split(':');
    const enabledAt = new Date();
    enabledAt.setHours(hours, minutes, seconds);
    enabledAt.setDate(enabledAt.getDate() + (conversation.dayNumber - 1));

    return {
      userId: req.__user__._id,
      storyId: storyId,
      conversationId: conversation._id,
      enabledAt: enabledAt,
    }
  })

  console.log('insertInfo', insertInfo)

  await UserStoryTextMessages.insertMany(insertInfo);

  return res.status(201).json({ message: 'Success' })
});

app.put('/userStoryTextMessages', async (req, res) => {
  const {
    storyId,
    conversationIds,
    seenByUser,
    notificationSent
  } = req.body;

  const story = await Story.findOne({ _id: storyId });
  if (!story) {
    return res.status(404).json({ message: 'Story not found' });
  }

  const user = await User.findOne({ _id: req.__user__._id })

  const requestBody = {};
  if ('seenByUser' in req.body) {
    requestBody.seenByUser = seenByUser;
  }

  if ('notificationSent' in req.body) {
    requestBody.notificationSent = notificationSent;
  }


  UserStoryTextMessages.updateMany({ conversationId: conversationIds, storyId: storyId, userId: user.id }, requestBody, function (err, docs) {
  //   // UserStoryTextMessages.find(conversationIds, { seenByUser: true }, function (err, docs) {
    if (err) {
      console.log('err', err)
    }

    else {
      console.log('Updated docs', docs)
    }
  })

  return res.status(200).json({ message: 'Success' })
})

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

IO.on("connection", (socket) => {
  console.log("new User connected");

  socket.on("newMsg", (message) => {
    IO.emit("message", {
      from: message.from,
      text: message.text,
      video: message.videoTag,
      createdAt: new Date().toLocaleTimeString(),
      //code: message.timeCode
    });
  });

  socket.on("newPublicMsg", (message) => {
    IO.emit("publicMessage", {
      from: message.from,
      text: message.text,
      video: message.videoTag,
      createdAt: new Date().toLocaleTimeString(),
    });
  });
});

app.set("socketio", IO);
