var express = require("express");
var moment = require("moment");
var mongoose = require("mongoose");
var cors = require("cors");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("./models/Users");

const keys = require("./config/Keys.js");
const db = keys.mongoURI;
var app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(express.static("uploads"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
mongoose
  .connect(db, { useNewUrlParser: true })
  .then(() => console.log("MongoDB successfully connected"))
  .catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("Hi there");
});
app.post("/login", (req, res) => {
  let email = req.body.user;
  let password = req.body.password;
  User.findOne({ email }).then((user) => {
    // Check if user exists
    if (!user) {
      return res.json({ emailnotfound: "Email not found" });
    }

    // Check password
    bcrypt.compare(password, user.password).then((isMatch) => {
      if (isMatch) {
        // User matched
        // Create JWT Payload
        const payload = {
          id: user.id,
          name: user.name,
          status: user.status,
        };
        // Sign token
        jwt.sign(
          payload,
          keys.secretOrKey,
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
          .status(400)
          .json({ passwordincorrect: "Password incorrect" });
      }
    });
  });
});

app.post("/register", (req, res) => {
  console.log(req.body);
  User.findOne({ email: req.body.email }).then((user) => {
    if (user) {
      return res.json({ error: "Email already exists" });
    } else {
      const newUser = new User({
        first_name: req.body.fname,
        last_name: req.body.lname,
        email: req.body.email,
        password: req.body.password,
      });

      // Hash password before saving in database
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then((user) => {
              res.json({ user: user, success: "Successfully Registered" });
            })
            .catch((err) => console.log(err));
        });
      });
    }
  });
});

app.get("/googleLogin", (req, res) => {});

app.get("/faceBookLogin", (req, res) => {});
app.get("/getUserStories", (req, res) => {
  let user = req.body.user;
  User.findOne({ user }).then((res2) => {
    let stories = res2.stories;
    res.json(stories);
  });
});
app.get("/");

var port = process.env.PORT || "3000";
app.listen(port, () => {
  console.log("server running at port " + port);
});

//login

//signup

//get stories

//get profile

// get authors

// get subscribed stories by user/:id

//get
