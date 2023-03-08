const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ConversationSchema = new Schema({
  dayNumber: {
    type: Number,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  messageType: {
    type: String,
    required: true,
  },
  whoTo: {
    type: String,
    required: true,
  },
  whoFrom: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  storyId: {
    type: String,
    required: false,
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

module.exports = Conversation = mongoose.model("Conversation", ConversationSchema);
