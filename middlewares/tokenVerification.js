const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  const token = req.headers.authorization;
  if (!token) return res.status(401).send({ message: "Unauthorized!" });
  jwt.verify(token, process.env.TOKEN_SECRET, (err, data) => {
    if (err) return res.status(401).send({ message: "Invalid token!" });
    req.user = data.user;
    next();
  });
};
