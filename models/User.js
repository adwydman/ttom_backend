const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: false
  },
  password: {
    type: String,
    required: true,
  },
  stories: {
    type: Array,
    default: [],
  },
  type: { // reader, author
    type: String,
    required: false
  },
  token: {
    type: String,
    default: false,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
  created_on: {
    type: Date,
    default: Date.now,
  },
})

const User = mongoose.model("Users", UserSchema);

User.__serialize__ = (user) => {
  return {
    email: user.email,
    stories: user.stories,
    createdAt: user.created_on,
    token: user.token,
    type: user.type
  };
}

// Create Schema
// const UserSchema = new Schema({
//   name: {
//     type: String,
//     required: false,
//   },
//   email: {
//     type: String,
//     required: true,
//   },
//   picture: {
//     type: String,
//     required: false,
//   },

//   mobile: {
//     type: String,
//     required: false,
//   },
//   phone: {
//     type: String,
//     required: false,
//   },
//   password: {
//     type: String,
//     required: true,
//   },
//   status: {
//     type: String,
//     required: false,
//   },
//   updated_at: {
//     type: Date,
//     default: Date.now,
//   },
//   created_on: {
//     type: Date,
//     default: Date.now,
//   },
//   loginType: {
//     type: String,
//     required: false,
//   },
//   stories: {
//     type: Array,
//     required: false,
//   },
// });

module.exports = User
