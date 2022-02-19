var http = require("http");
var express = require("express");
var cors = require("cors");
var bodyParser = require("body-parser");
const User = require("./models/User");
var mongoose = require("mongoose");
const keys = require("./config/Keys.js");
const bcrypt = require("bcryptjs");

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
  console.log(email);
  User.findOne({ email }, (error, user) => {
    console.log(user);
    if (!user) {
      return res.status(200).json({ passwordincorrect: "Password incorrect" });
    }
    bcrypt.compare(password, user.password).then((isMatch) => {
      if (isMatch) {
        const payload = {
          id: user.id,
          name: user.name,
          status: user.status,
        };
        jwt.sign(
          payload,
          {
            expiresIn: 31556926, // 1 year in seconds
          },
          (err, token) => {
            res.json({
              success: true,
              token: "Bearer " + token,
            });
          }
        );
      } else {
        return res
          .status(200)
          .json({ passwordincorrect: "Password incorrect" });
      }
    });
  });
});
app.post("/register", (req, res) => {
  // Form validation

  const { errors, isValid } = validateRegisterInput(req.body);

  // Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  User.findOne({ email: req.body.email }).then((user) => {
    if (user) {
      return res.status(400).json({ email: "Email already exists" });
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
              res.json(user);
            })
            .catch((err) => console.log(err));
        });
      });
    }
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
