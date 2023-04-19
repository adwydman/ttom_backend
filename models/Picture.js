const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PictureSchema = new Schema({
  dayNumber: {
    type: Number,
  },
  time: {
    type: String,
  },
  url: {
    type: String,
    required: true,
  },
  storyId: {
    type: String,
    required: true,
    ref: "stories",
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

module.exports = Picture = mongoose.model("Picture", PictureSchema);
