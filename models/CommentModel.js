const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema({
  postedBy: {
    _id: false,
    type: {
      id: {
        type: String,
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
    },
    required: true,
  },
  postedOn: {
    type: String,
    required: true,
  },
  comment: {
    type: String,
    max: 200,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("comments", CommentSchema);
