const jwt = require("jsonwebtoken");
const { responseFormat } = require("../utils/utils");
const config = process.env;

const verifyToken = (req, res, next) => {
  const token = req.body.token || req.query.token || req.headers["token"];

  if (!token) {
    return res.status(401).send(responseFormat(false, null, "Unauthorized"));
  }
  try {
    const decoded = jwt.verify(token, config.TOKEN_KEY);
    req.user = decoded;
  } catch (err) {
    return res.status(401).send(responseFormat(false, null, "Unauthorized"));
  }
  return next();
};

module.exports = verifyToken;
