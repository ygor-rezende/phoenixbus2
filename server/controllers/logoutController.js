const pool = require("../db");

const handleLogout = async (req, res) => {
  //On client, also delete the access Token

  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204); //no content

  const refreshToken = cookies.jwt;

  try {
    //Find the user in the database for that token
    const users = await pool.query(
      "SELECT * FROM users WHERE refresh_token = $1",
      [refreshToken]
    );

    //if no user found
    if (!users.rows.length) {
      res.clearCookie("jwt", {
        httpOnly: true,
        sameSite: "None",
        secure: true,
      });
      return res.sendStatus(204);
    }

    //if there is an user for the token -> delete refresh token in DB
    const updatedUser = await pool.query(
      "UPDATE users SET refresh_token = $1 WHERE username = $2",
      ["", users.rows[0].username]
    );

    //check if the user was updated
    if (!updatedUser?.rowCount)
      return res.status(500).json({ detail: "Failed to remove refresh token" });

    res.clearCookie("jwt", {
      httpOnly: true,
      sameSite: "None",
      secure: true,
    });
    res.sendStatus(204);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

module.exports = handleLogout;
