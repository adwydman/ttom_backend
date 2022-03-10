var http = require("http");
var express = require("express");
var cors = require("cors");
var bodyParser = require("body-parser");
const User = require("./models/User");
var mongoose = require("mongoose");
const keys = require("./config/Keys.js");
const bcrypt = require("bcryptjs");
const StoriesList = require("./models/Stories_list");
var XLSX = require("xlsx");
var app = (module.exports.app = express());

const db = keys.mongoURI;
var port = process.env.PORT || 3000;
var server = http.createServer(app);
var IO = require("socket.io")(server); //pass a http.Server instance
server.listen(port, () => {
  console.log("listening on port 3000");
});

app.use(cors());
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
mongoose
  .connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB successfully connected"))
  .catch((err) => console.log(err));
app.get("/", (req, res) => {
  res.send("yo connected");
});
app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  console.log(email, password);
  User.findOne({ email }, (error, user) => {
    if (!user) {
      return res.status(200).json({ passwordincorrect: "Password incorrect" });
    }
    bcrypt.compare(password, user.password).then((isMatch) => {
      if (isMatch) {
        const payload = {
          id: user._id,
          email: user.email,
        };
        res.json({
          success: true,
          token: payload,
        });
      } else {
        return res
          .status(200)
          .json({ success: false, text: "Password incorrect" });
      }
    });
  });
});
app.post("/register", (req, res) => {
  User.findOne({ email: req.body.email }).then((user) => {
    if (user) {
      return res
        .status(200)
        .json({ status: "error", text: "Email already exists" });
    } else {
      const newUser = new User({
        email: req.body.email,
        password: req.body.password,
      });
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then((user) => {
              return res
                .status(200)
                .json({ success: true, text: "Successful" });
            })
            .catch((err) => console.log(err));
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
  var workbook = XLSX.readFile("BestFriends_LoriTaylor_CSV.xlsx");
  var sheet_name_list = workbook.SheetNames;
  var xlData = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]], {
    raw: false,
  });
  const story = new StoriesList({
    name: "Favourites Landscape",
    picture: "",
    category: "Romacnce",
    author: "Haidar Iqbal",
    picture: "https://i.imgur.com/UPrs1EWl.jpg",
    content: JSON.stringify(xlData),
  });
  story
    .save()
    .then((model) => res.json(model))
    .catch((err) => console.log(err));
});
app.get("/getSoriesList", (req, res) => {
  StoriesList.find({}).then((list) => {
    res.send(list);
  });
});
app.get("/getSoryDetails/:storyKey", (req, res) => {
  let storyId = req.params.storyKey;
  console.log(req.params);
  StoriesList.findOne({ _id: storyId }).then((list) => {
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
