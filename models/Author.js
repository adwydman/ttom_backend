const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const AuthorSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  stories: {
    type: Array,
    required: [],
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

module.exports = Author = mongoose.model("Author", AuthorSchema);
