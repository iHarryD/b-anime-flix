const router = require("express").Router();
const tokenVerification = require("../middlewares/tokenVerification");
const videoIDVerification = require("../middlewares/videoIDVerification");
const users = require("../models/UserModel");

router.patch(
  "/user/watch-later/add",
  tokenVerification,
  videoIDVerification,
  (req, res) => {
    const videoID = req.body.videoID;
    users.findByIdAndUpdate(
      req.user,
      { $addToSet: { watchLater: videoID } },
      { new: true },
      (err, result) => {
        if (err)
          return res.status(500).send({ message: "Something went wrong." });
        res.status(200).send(result);
      }
    );
  }
);

router.patch(
  "/user/watch-later/remove",
  tokenVerification,
  videoIDVerification,
  (req, res) => {
    const videoID = req.body.videoID;
    users.findById(req.user, async (err, result) => {
      if (err)
        return res.status(303).send({ message: "Something went wrong." });
      result.watchLater = result.watchLater.filter((id) => id !== videoID);
      try {
        await result.save();
        res.status(200).send(result);
      } catch (err) {
        res.status(500).send({ message: "Something went wrong." });
      }
    });
  }
);

module.exports = router;
