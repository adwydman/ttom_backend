const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const UserSchema = new Schema({
  name: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: true,
  },
  picture: {
    type: String,
    required: false,
  },

  mobile: {
    type: String,
    required: false,
  },
  phone: {
    type: String,
    required: false,
  },
  password: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: false,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
  created_on: {
    type: Date,
    default: Date.now,
  },
  loginType: {
    type: String,
    required: false,
  },
  stories: {
    type: Array,
    required: false,
  },
});

module.exports = User = mongoose.model("Users", UserSchema);
