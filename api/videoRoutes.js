const router = require("express").Router();
const videos = require("../models/VideoModel");
const tokenVerification = require("../middlewares/tokenVerification");
const videoIDVerification = require("../middlewares/videoIDVerification");
const videoJoiVerification = require("../validations/videoJoiValidation");

router.get("/video/fetch-all", async (req, res) => {
  try {
    const data = await videos.find();
    res.status(200).send(data);
  } catch (err) {
    res.status(500).send({ message: "Something went wrong." });
  }
});

router.get("/video/fetch", (req, res) => {
  const videoID = req.query.videoID;
  if (!videoID)
    return res.status(301).send({ message: "Video ID is missing." });
  videos.findById(videoID, (err, doc) => {
    if (err) return res.status(404).send({ message: "Something went wrong." });
    res.status(200).send(doc);
  });
});

router.post("/video/post", tokenVerification, (req, res) => {
  const { error } = videoJoiVerification(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  users.findById(req.user, (err, doc) => {
    videos.create(
      {
        title: req.body.title,
        url: req.body.url,
        description: req.body.description,
        views: req.body.views,
        likes: req.body.likes,
        dislikes: req.body.dislikes,
        uploadedBy: {
          name: doc.firstName,
          id: doc._id,
        },
      },
      (err, doc) => {
        if (err)
          return res.status(500).send({ message: "Something went wrong." });
        res.status(200).send(doc);
      }
    );
  });
});

router.patch(
  "/video/like",
  tokenVerification,
  videoIDVerification,
  (req, res) => {
    const videoID = req.query.videoID;
    videos.findByIdAndUpdate(
      videoID,
      { $addToSet: { likes: req.user }, $pull: { dislikes: req.user } },
      { new: true },
      (err, doc) => {
        if (err) return res.status(404).send({ message: err });
        res.status(200).send(doc);
      }
    );
  }
);

router.patch(
  "/video/dislike",
  tokenVerification,
  videoIDVerification,
  (req, res) => {
    const videoID = req.query.videoID;
    videos.findByIdAndUpdate(
      videoID,
      { $addToSet: { dislikes: req.user }, $pull: { likes: req.user } },
      { new: true },
      (err, doc) => {
        if (err) return res.status(404).send({ message: err });
        res.status(200).send(doc);
      }
    );
  }
);

router.patch(
  "/video/remove-like",
  tokenVerification,
  videoIDVerification,
  (req, res) => {
    const videoID = req.query.videoID;
    videos.findByIdAndUpdate(
      videoID,
      { $pull: { likes: req.user } },
      { new: true },
      (err, doc) => {
        if (err) return res.status(400).send({ message: err });
        res.status(200).send(doc);
      }
    );
  }
);

router.patch(
  "/video/remove-dislike",
  tokenVerification,
  videoIDVerification,
  (req, res) => {
    const videoID = req.query.videoID;
    videos.findByIdAndUpdate(
      videoID,
      { $pull: { dislikes: req.user } },
      { new: true },
      (err, doc) => {
        if (err) return res.status(400).send({ message: err });
        res.status(200).send(doc);
      }
    );
  }
);

router.patch("/video/add-user-to-all", (req, res) => {
  videos.find({}, (err, doc) => {
    if (err) return res.send("error");
    res.send(doc);
  });
});

module.exports = router;
