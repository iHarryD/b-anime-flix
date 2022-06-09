const router = require("express").Router();
const tokenVertification = require("../middlewares/tokenVerification");
const videoIDVerification = require("../middlewares/videoIDVerification");
const users = require("../models/UserModel");
const videos = require("../models/VideoModel");
const mongoose = require("mongoose");

router.get("/playlist/fetch-all", tokenVertification, (req, res) => {
  users.findById(req.user, (err, doc) => {
    if (err) return res.status(500).send({ message: "Something went wrong." });
    res.status(200).send(doc.playlists);
  });
});

router.get("/playlist/fetch-one", tokenVertification, async (req, res) => {
  const playlist_id = mongoose.Types.ObjectId(req.query.playlistID);
  try {
    const user = await users.findById(req.user);
    const searchedPlaylist = user.playlists.find((playlist) =>
      playlist._id.equals(playlist_id)
    );
    const allVideos = await videos.find({
      _id: { $in: searchedPlaylist.videos },
    });
    res.status(200).send({ name: searchedPlaylist.name, videos: allVideos });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});

router.patch("/playlist/create", tokenVertification, (req, res) => {
  const playlistName = req.body.playlistName;
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

router.patch("/playlist/delete", tokenVertification, (req, res) => {
  const playlist_id = mongoose.Types.ObjectId(req.body.playlistID);
  if (!playlist_id)
    return res.status(301).send({ messgae: "Playlist ID not found." });
  users.findById(req.user, async (err, doc) => {
    if (err) return res.status(500).send({ message: err });
    try {
      doc.playlists = doc.playlists.filter(
        (playlist) => !playlist._id.equals(playlist_id)
      );
      await doc.save();
      res.status(200).send(doc.playlists);
    } catch (err) {
      res.send(500).send({ message: err.message });
    }
  });
});

router.patch(
  "/playlist/add",
  tokenVertification,
  videoIDVerification,
  (req, res) => {
    const playlist_id = mongoose.Types.ObjectId(req.body.playlistID);
    const video_id = mongoose.Types.ObjectId(req.body.videoID);
    if (!playlist_id)
      return res.status(301).send({ messgae: "Playlist ID not found." });
    users.findById(req.user, async (err, doc) => {
      try {
        if (err) return res.status(500).send({ message: err });
        const searchedPlaylist = doc.playlists.find((playlist) =>
          playlist._id.equals(playlist_id)
        );
        if (searchedPlaylist) {
          const isVideoAlreadyInPlaylist = searchedPlaylist.videos.find(
            (video) => video.equals(video_id)
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
  }
);

router.patch(
  "/playlist/remove",
  tokenVertification,
  videoIDVerification,
  (req, res) => {
    const playlist_id = mongoose.Types.ObjectId(req.body.playlistID);
    const video_id = mongoose.Types.ObjectId(req.body.videoID);
    if (!playlist_id)
      return res.status(301).send({ messgae: "Playlist name not found." });
    users.findById(req.user, async (err, doc) => {
      try {
        if (err) return res.status(500).send({ message: err });
        const searchedPlaylist = doc.playlists.find((playlist) =>
          playlist._id.equals(playlist_id)
        );
        if (searchedPlaylist) {
          const indexOfPlaylist = doc.playlists.indexOf(searchedPlaylist);
          doc.playlists[indexOfPlaylist].videos =
            searchedPlaylist.videos.filter((video) => !video.equals(video_id));
          await doc.save();
        }

        res.status(200).send(doc.playlists);
      } catch (err) {
        res.status(500).send({ message: err.message });
      }
    });
  }
);

module.exports = router;
