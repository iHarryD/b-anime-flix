const mongoose = require("mongoose");
const PlaylistSchema = require("./PlaylistModel");

const UserSchema = mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  dateOfBirth: {
    type: Date,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    min: 6,
    required: true,
  },
  history: {
    type: [mongoose.SchemaTypes.ObjectId],
  },
  playlists: {
    type: [PlaylistSchema],
  },
  watchLater: {
    type: [mongoose.SchemaTypes.ObjectId],
  },
  preferences: {
    type: Object,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("users", UserSchema);
