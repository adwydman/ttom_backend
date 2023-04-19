const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const UserPicturesSchema = new Schema({
  userId: {
    type: String,
    required: true,
  },
  storyId: {
    type: String,
    required: true,
  },
  pictureId: {
    type: String,
    required: true,
  },
  enabledAt: {
    type: Date,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
  created_on: {
    type: Date,
    default: Date.now,
  }
});

module.exports = UserPictures = mongoose.model("UserPictures", UserPicturesSchema);
