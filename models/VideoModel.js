const mongoose = require("mongoose");

const VideoSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
  url: {
    type: String,
    required: true,
  },
  uploadedBy: {
    type: String,
  },
  views: {
    type: Number,
    default: 0,
  },
  likes: {
    type: Number,
    default: 0,
  },
  dislikes: {
    type: Number,
    default: 0,
  },
  uploadedOn: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("videos", VideoSchema);
