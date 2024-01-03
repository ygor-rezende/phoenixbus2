const jwt = require("jsonwebtoken");
require("dotenv").config();

const verifyJWT = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  // console.log(
  //   `${__filename.substring(__filename.lastIndexOf("\\"))}: ${authHeader}`
  // ); // Bearer token
  if (!authHeader?.startsWith("Bearer ")) return res.sendStatus(401);

  //split the header and get the token on the index 1
  const token = authHeader.split(" ")[1];
  //console.log(token);
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) return res.sendStatus(403); //invalid token
    req.user = decoded.username;
    req.role = decoded.role;
    next();
  });
};

module.exports = verifyJWT;
