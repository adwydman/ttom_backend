const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const UserStoryTextMessagesSchema = new Schema({
  userId: {
    type: String,
    required: true,
  },
  storyId: {
    type: String,
    required: true,
  },
  conversationId: {
    type: String,
    required: true,
  },
  enabledAt: {
    type: Date,
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
  seenByUser: {
    type: Boolean,
    default: false
  },
  // notificationSentAt?
  notificationSent: {
    type: Boolean,
    default: false
  }
});

module.exports = UserStoryTextMessages = mongoose.model("UserStoryTextMessages", UserStoryTextMessagesSchema);
