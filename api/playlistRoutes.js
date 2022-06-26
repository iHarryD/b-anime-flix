const router = require("express").Router();
const tokenVertification = require("../middlewares/tokenVerification");
const users = require("../models/UserModel");
const videos = require("../models/VideoModel");
const mongoose = require("mongoose");

router.get("/playlists", tokenVertification, (req, res) => {
  users.findById(req.user, (err, doc) => {
    if (err) return res.status(500).send({ message: "Something went wrong." });
    res.status(200).send(doc.playlists);
  });
});

router.get("/playlists/:id", tokenVertification, async (req, res) => {
  const { id } = req.params;
  const playlistID = mongoose.Types.ObjectId(id);
  try {
    const user = await users.findById(req.user);
    const searchedPlaylist = user.playlists.find((playlist) =>
      playlist._id.equals(playlistID)
    );
    const allVideos = await videos.find({
      _id: { $in: searchedPlaylist.videos },
    });
    res.status(200).send({ name: searchedPlaylist.name, videos: allVideos });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});

router.post("/playlists", tokenVertification, (req, res) => {
  const { playlistName } = req.body;
  if (!playlistName)
    return res
      .status(301)
      .send({ messgae: "Name is required to create a playlist." });
  users.findById(req.user, async (err, doc) => {
    if (err) return res.status(500).send({ message: err });
    try {
      doc.playlists = [...doc.playlists, { name: playlistName }];
      await doc.save();
      res.status(200).send(doc.playlists);
    } catch (err) {
      res.status(500).send({ message: err.message });
    }
  });
});

router.delete("/playlists", tokenVertification, (req, res) => {
  const { id } = req.params;
  const playlistID = mongoose.Types.ObjectId(id);
  if (!playlistID)
    return res.status(301).send({ messgae: "Playlist ID not found." });
  users.findById(req.user, async (err, doc) => {
    if (err) return res.status(500).send({ message: err });
    try {
      doc.playlists = doc.playlists.filter(
        (playlist) => !playlist._id.equals(playlistID)
      );
      await doc.save();
      res.status(200).send(doc.playlists);
    } catch (err) {
      res.send(500).send({ message: err.message });
    }
  });
});

router.patch("/playlists/:id/add", tokenVertification, (req, res) => {
  const { id } = req.params;
  const playlistID = mongoose.Types.ObjectId(id);
  const video_id = mongoose.Types.ObjectId(req.body.videoID);
  if (!playlistID)
    return res.status(301).send({ messgae: "Playlist ID not found." });
  users.findById(req.user, async (err, doc) => {
    try {
      if (err) return res.status(500).send({ message: err });
      const searchedPlaylist = doc.playlists.find((playlist) =>
        playlist._id.equals(playlistID)
      );
      if (searchedPlaylist) {
        const isVideoAlreadyInPlaylist = searchedPlaylist.videos.find((video) =>
          video.equals(video_id)
        );
        if (isVideoAlreadyInPlaylist)
          return res.status(
            res.status(300).send({ message: "Video already exists." })
          );
        const indexOfPlaylist = doc.playlists.indexOf(searchedPlaylist);
        searchedPlaylist.videos.push(video_id);
        doc.playlists[indexOfPlaylist] = searchedPlaylist;
        await doc.save();
      }
      res.status(200).send(doc.playlists);
    } catch (err) {
      res.status(500).send({ message: err.message });
    }
  });
});

router.patch("/playlists/:id/remove", tokenVertification, (req, res) => {
  const { id } = req.params;
  const playlistID = mongoose.Types.ObjectId(id);
  const video_id = mongoose.Types.ObjectId(req.body.videoID);
  if (!playlistID)
    return res.status(301).send({ messgae: "Playlist name not found." });
  users.findById(req.user, async (err, doc) => {
    try {
      if (err) return res.status(500).send({ message: err });
      const searchedPlaylist = doc.playlists.find((playlist) =>
        playlist._id.equals(playlistID)
      );
      if (searchedPlaylist) {
        const indexOfPlaylist = doc.playlists.indexOf(searchedPlaylist);
        doc.playlists[indexOfPlaylist].videos = searchedPlaylist.videos.filter(
          (video) => !video.equals(video_id)
        );
        await doc.save();
      }
      res.status(200).send(doc.playlists);
    } catch (err) {
      res.status(500).send({ message: err.message });
    }
  });
});

module.exports = router;
