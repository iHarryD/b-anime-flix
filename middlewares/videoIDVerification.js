const videos = require("../models/VideoModel");

module.exports = function (req, res, next) {
  const videoID = req.body.videoID || req.query.videoID;
  if (!videoID) return res.status(500).send({ message: "Video ID not found." });
  videos.findById(videoID, (err, result) => {
    if (err) return res.status(404).send({ message: "Internal Server Error." });
    next();
  });
};
