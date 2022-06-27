const router = require("express").Router();
const tokenVerification = require("../middlewares/tokenVerification");
const videoIDVerification = require("../middlewares/videoIDVerification");
const users = require("../models/UserModel");
const videos = require("../models/VideoModel");

router.get("/watch-later", tokenVerification, (req, res) => {
  users.findById(req.user, (err, doc) => {
    if (err) return res.status(500).send({ message: "Something went wrong." });
    res.status(200).send(doc.watchLater);
  });
});

router.get("/watch-later/fetch-videos", tokenVerification, (req, res) => {
  users.findById(req.user, (err, doc) => {
    if (err) return res.status(500).send({ message: "Something went wrong." });
    videos.find({ _id: { $in: doc.watchLater } }, (err, doc) => {
      if (err)
        return res.status(500).send({ message: "Something went wrong." });
      res.status(200).send(doc);
    });
  });
});

router.post("/watch-later/:id", tokenVerification, (req, res) => {
  const { id: videoID } = req.params;
  users.findByIdAndUpdate(
    req.user,
    { $addToSet: { watchLater: videoID } },
    { new: true },
    (err, doc) => {
      if (err)
        return res.status(300).send({ message: "Something went wrong." });
      res.status(200).send(doc.watchLater);
    }
  );
});

router.delete("/watch-later/:id", tokenVerification, (req, res) => {
  const { id: videoID } = req.params;
  users.findByIdAndUpdate(
    req.user,
    { $pull: { watchLater: videoID } },
    { new: true },
    (err, doc) => {
      if (err)
        return res.status(300).send({ message: "Something went wrong." });
      res.status(200).send(doc.watchLater);
    }
  );
});

module.exports = router;
