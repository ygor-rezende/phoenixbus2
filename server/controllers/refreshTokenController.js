const jwt = require("jsonwebtoken");
require("dotenv").config();
const pool = require("../db");
const ROLES_LIST = require("../config/roles_list");

const handleRefreshToken = async (req, res) => {
  const cookies = req.cookies;
  console.log(cookies);
  //check if cookies exist
  if (!cookies?.jwt) return res.sendStatus(401); //unauthorized

  console.log(cookies.jwt);
  const refreshToken = cookies.jwt;

  try {
    //Find the user in the database for that token
    const users = await pool.query(
      "SELECT * FROM users WHERE refresh_token = $1",
      [refreshToken]
    );

    //if user not found
    if (!users.rows.length) return res.sendStatus(403);

    //check the jwt
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      (err, decoded) => {
        //if the username found for the refresh token is diferent from the user in DB forbid the access
        if (err || users.rows[0].username != decoded.userName)
          return res.sendStatus(403);

        //get the userType to include in the token
        const userType = users.rows[0].user_type;

        //get user type code
        const userTypeCode = ROLES_LIST[userType];

        const accessToken = jwt.sign(
          { username: decoded.userName, role: userTypeCode },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: "15m" }
        );
        res.json({
          accessToken: accessToken,
          role: userTypeCode,
          userName: decoded.userName,
        });
      }
    );
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
}; //handleRefreshToken

module.exports = handleRefreshToken;
