const router = require("express").Router();
const tokenVerification = require("../middlewares/tokenVerification");
const users = require("../models/UserModel");
const videos = require("../models/VideoModel");

router.get("/history", tokenVerification, (req, res) => {
  users.findById(req.user, (err, doc) => {
    if (err) return res.status(500).send({ message: "Something went wrong." });
    res.status(200).send(doc.history);
  });
});

router.get("/history/fetch-videos", tokenVerification, (req, res) => {
  users.findById(req.user, (err, userDoc) => {
    if (err) return res.status(500).send({ message: "Something went wrong." });
    videos.find({ _id: { $in: userDoc.history } }, (err, doc) => {
      if (err)
        return res.status(500).send({ message: "Something went wrong." });
      const sortedHistoryVideos = doc.sort((videoOne, videoTwo) => {
        if (
          userDoc.history.indexOf(videoOne._id) >
          userDoc.history.indexOf(videoTwo._id)
        ) {
          return -1;
        } else {
          return 1;
        }
      });
      res.status(200).send(sortedHistoryVideos);
    });
  });
});

router.post("/history/:id", tokenVerification, (req, res) => {
  const { id: videoID } = req.params;
  users.findByIdAndUpdate(
    req.user,
    { $pull: { history: videoID } },
    (err, doc) => {
      if (err) return res.status(500).send({ message: err });
      users.findByIdAndUpdate(
        req.user,
        { $addToSet: { history: videoID } },
        { new: true },
        (err, doc) => {
          if (err) return res.status(500).send({ message: err });
          res.status(200).send(doc.history);
        }
      );
    }
  );
});

router.delete("/history", tokenVerification, (req, res) => {
  users.findByIdAndUpdate(
    req.user,
    { history: [] },
    { new: true },
    (err, doc) => {
      if (err)
        return res.status(500).send({ message: "Something went wrong." });
      res.status(200).send(doc.history);
    }
  );
});

module.exports = router;
