const router = require("express").Router();
const tokenVerification = require("../middlewares/tokenVerification");
const users = require("../models/UserModel");

router.get("/history/fetch", tokenVerification, (req, res) => {
  users.findById(req.user, (err, doc) => {
    if (err) return res.status(500).send({ message: "Something went wrong." });
    res.status(200).send(doc.history);
  });
});

router.patch("/history/clear", tokenVerification, (req, res) => {
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
