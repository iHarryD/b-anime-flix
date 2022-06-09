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
    type: Array,
  },
  likes: {
    type: Array,
  },
  dislikes: {
    type: Array,
  },
  uploadedOn: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("videos", VideoSchema);
