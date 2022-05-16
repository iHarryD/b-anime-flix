const router = require("express").Router();
const videos = require("../models/VideoModel");
const tokenVerification = require("../middlewares/tokenVerification");
const videoJoiVerification = require("../validations/videoJoiValidation");

router.get("/video/fetch-all", async (req, res) => {
  try {
    const data = await videos.find();
    res.send(data);
  } catch (err) {
    res.status(500).send({ message: "Internal server error." });
  }
});

router.get("/video/fetch", (req, res) => {
  const videoID = req.query.videoID;
  if (!videoID)
    return res.status(301).send({ message: "Video ID is missing." });
  videos.findById(videoID, (err, video) => {
    if (err) return res.status(404).send({ message: "Video not found." });
    res.status(200).send(video);
  });
});

router.post("/video/post", tokenVerification, async (req, res) => {
  const { error } = videoJoiVerification(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  try {
    const newVideo = new videos({
      title: req.body.title,
      url: req.body.url,
      description: req.body.description,
      views: req.body.views,
      likes: req.body.likes,
      dislikes: req.body.dislikes,
      uploadedBy: req.user,
    });
    await newVideo.save();
    res.send(newVideo);
  } catch (err) {
    res.status(500).send({ message: "Internal server error." });
  }
});

router.patch("/video/like", tokenVerification, (req, res) => {
  const videoID = req.body.videoID;
  if (!videoID)
    return res.status(400).send({ message: "Video ID is missing." });
  videos.findByIdAndUpdate(
    videoID,
    { $inc: { likes: 1 } },
    { new: true },
    (err, video) => {
      if (err) return res.status(404).send({ message: err });
      res.send(video);
    }
  );
});

router.patch("/video/dislike", tokenVerification, (req, res) => {
  const videoID = req.body.videoID;
  if (!videoID)
    return res.status(400).send({ message: "Video ID is missing." });
  videos.findByIdAndUpdate(
    videoID,
    { $inc: { dislikes: 1 } },
    { new: true },
    (err, video) => {
      if (err) return res.status(404).send({ message: err });
      res.send(video);
    }
  );
});

module.exports = router;
