const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const StorySchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  picture: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
  created_on: {
    type: Date,
    default: Date.now,
  },
  duration: {
    type: String,
    required: true,
  },
  categories: {
    type: Array,
    required: true,
  },
  mainCharacter: {
    type: String,
    required: true,
  },
});

module.exports = Story = mongoose.model("Story", StorySchema);
