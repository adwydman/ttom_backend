const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const StoriesListSchema = new Schema({
  name: {
    type: String,
    required: false,
  },
  picture: {
    type: String,
    required: false,
  },
  category: {
    type: String,
    required: false,
  },
  author: {
    type: String,
    required: false,
  },
  description: {
    type: String,
    required: false,
  },
  content: {
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
});

module.exports = StoriesList = mongoose.model("StoriesList", StoriesListSchema);
