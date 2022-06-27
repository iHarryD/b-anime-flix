const router = require("express").Router();
const comments = require("../models/CommentModel");
const users = require("../models/UserModel");
const tokenVerification = require("../middlewares/tokenVerification");

router.get("/videos/:id/comments", (req, res) => {
  const { id: videoID } = req.params;
  comments.find({ postedOn: videoID }, (err, doc) => {
    if (err) return res.status(500).send({ message: "Something went wrong." });
    res.status(200).send(doc);
  });
});

router.post("/videos/:id/comments", tokenVerification, (req, res) => {
  users.findById(req.user, (err, doc) => {
    if (err) return res.status(500).send({ message: "Something went wrong." });
    comments.create(
      {
        postedBy: {
          name: `${doc.firstName} ${doc.lastName}`,
          id: doc._id,
        },
        comment: req.body.comment,
        postedOn: req.params.id,
      },
      (err, doc) => {
        if (err)
          return res.status(500).send({ message: "Something went wrong." });
        res.status(200).send({ message: "Comment posted." });
      }
    );
  });
});

router.delete("/comments/:id", tokenVerification, (req, res) => {
  comments.findOne({ _id: req.params.id }, async (err, doc) => {
    if (err) return res.status(500).send({ message: "Something went wrong." });
    try {
      if (doc.postedBy.id === req.user) {
        await doc.remove();
        res.status(200).send({ message: "Comment deleted." });
      }
    } catch (err) {
      res.status(500).send({ message: "Something went wrong." });
    }
  });
});

module.exports = router;
