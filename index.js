const cors = require("cors");
const express = require("express");
const session = require("express-session");
const mongoose = require("mongoose");
const server = express();
const authRoutes = require("./api/authRoutes");
const videoRoutes = require("./api/videoRoutes");
const userRoutes = require("./api/userRoutes");
const playlistRoutes = require("./api/playlistRoutes");
const historyRoutes = require("./api/historyRoutes");
const watchLaterRoutes = require("./api/watchLaterRoutes");
const commentRoutes = require("./api/commentRoutes");
require("dotenv").config();

mongoose.connect(process.env.DB_PASSKEY, () => console.log("connected to db"));

const sessionOptions = {
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    sameSite: "none",
    secure: true,
  },
};

server.use(cors());
server.use(session(sessionOptions));
server.use(express.json());
server.use("/api", authRoutes);
server.use("/api", videoRoutes);
server.use("/api", userRoutes);
server.use("/api", playlistRoutes);
server.use("/api", historyRoutes);
server.use("/api", watchLaterRoutes);
server.use("/api", commentRoutes);

server.listen(process.env.PORT || 3001);
