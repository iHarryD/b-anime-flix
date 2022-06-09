const mongoose = require("mongoose");

const PlaylistSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  videos: [mongoose.SchemaTypes.ObjectId],
});

module.exports = PlaylistSchema;
