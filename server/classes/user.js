const pool = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const ROLES_LIST = require("../config/roles_list");
require("dotenv").config();

class User {
  static async getUserType(username) {
    try {
      const result = await pool.query(
        "SELECT user_type FROM users WHERE username = $1",
        [username]
      );
      console.log(result.rows[0].user_type);
      return result.rows[0].user_type;
    } catch (err) {
      console.log(err);
    }
  } //getUserType

  static async getUsernames() {
    try {
      const result = await pool.query("SELECT username FROM users");
      return result.rows;
    } catch (err) {
      console.error(err);
      return { message: err.message };
    }
  } //getUsernames

  static async getAvailableUsers() {
    try {
      const result = await pool.query(
        "SELECT username FROM users WHERE username NOT IN (SELECT user_id from employees WHERE user_id IS NOT NULL)"
      );
      return result.rows;
    } catch (err) {
      console.error(err);
      return { message: err.message };
    }
  } //getAvailableUsers

  static async signUp(req, res) {
    try {
      const { userName, password, userType } = req.body;
      //check if the username and password are filled in
      if (!userName || !password)
        return res
          .status(400)
          .json({ message: "Username and password are required." });

      //check if the user is duplicated
      const users = await this.getUsernames();
      const duplicate = users.find((user) => user.username === userName);
      if (duplicate)
        return res.status(409).json({ message: "User already exists" }); //conflict

      //encript password
      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = bcrypt.hashSync(password, salt);

      //store the user data into users table
      const dbResponse = await pool.query(
        `INSERT INTO users (username, hashed_password, user_type) VALUES ($1, $2, $3)`,
        [userName, hashedPassword, userType]
      );

      //send the reponse to client
      return res.status(201).json({ userName });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: error.message });
    }
  } //signUp

  static async login(req, res) {
    try {
      const { userName, password } = req.body;

      //check if the username and password are filled in
      if (!userName || !password)
        return res
          .status(400)
          .json({ message: "Username and password are required." });

      //Find the user in the database
      const users = await pool.query(
        "SELECT * FROM users WHERE username = $1",
        [userName]
      );

      //if user not found
      if (!users.rows.length)
        return res.status(401).json({ message: "User does not exist." });

      //check user password with the password in database
      const success = await bcrypt.compare(
        password,
        users.rows[0].hashed_password
      );

      if (success) {
        //get the userType to include in the token
        const userType = users.rows[0].user_type;

        //get user type code
        const userTypeCode = ROLES_LIST[userType];

        //create access token with the user deitalis
        const accessToken = jwt.sign(
          { username: userName, role: userTypeCode },
          process.env.ACCESS_TOKEN_SECRET,
          {
            expiresIn: "15m",
          }
        );

        //create refresh token with the user deitalis
        const refreshToken = jwt.sign(
          { userName },
          process.env.REFRESH_TOKEN_SECRET,
          {
            expiresIn: "10hr",
          }
        );

        //update the user in DB with the refresh token
        const updatedUser = await pool.query(
          `SELECT login('${userName}', '${refreshToken}')`
        );

        //check if the user was updated
        if (!updatedUser)
          return res
            .status(500)
            .json({ message: "Failed to update refresh token" });

        //send the refresh token to client within a httpCookie
        res.cookie("jwt", refreshToken, {
          httpOnly: true,
          sameSite: "None",
          secure: true,
          maxAge: 10 * 60 * 60 * 1000,
          partitioned: true,
        });

        return res.json({
          username: users.rows[0].username,
          accessToken,
          role: userTypeCode,
        });
      } else {
        return res.status(401).json({ message: "Login failed" });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: error.message });
    }
  } //login

  static async resetPassword(req, res) {
    const { userName, currentPassword, newPassword } = req.body;

    if (!userName || !currentPassword || !newPassword)
      return res
        .status(400)
        .json({ message: "Username and Password required." });

    try {
      //select the user by his username
      const users = await pool.query(
        "SELECT * FROM users WHERE username = $1",
        [userName]
      );

      //validate the current password
      const passwordMatch = await bcrypt.compare(
        currentPassword,
        users.rows[0].hashed_password
      );

      //if current password is correct update the password with the new one
      if (passwordMatch) {
        const salt = bcrypt.genSaltSync(10);
        const hashed_password = bcrypt.hashSync(newPassword, salt);
        const passwordUpdated = await pool.query(
          "UPDATE users SET hashed_password = $1 WHERE username = $2",
          [hashed_password, userName]
        );

        if (passwordUpdated) {
          return res.json("Password updated");
        } else {
          return res.status(503).json({ message: "Error updating password" });
        }
      } else {
        return res.status(400).json({ message: "Password does not match" });
      }
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: err.message });
    }
  } //resetPassword

  static async resetUserPass(req, res) {
    const { userName, newPassword } = req.body;

    if (!userName || !newPassword)
      return res
        .status(400)
        .json({ message: "Username and Password required." });

    try {
      //select the user by his username
      const users = await pool.query(
        "SELECT * FROM users WHERE username = $1",
        [userName]
      );

      if (!users.rows.length)
        return res.status(400).json({ message: "User does not exist." });

      //update password
      const salt = bcrypt.genSaltSync(10);
      const hashed_password = bcrypt.hashSync(newPassword, salt);
      const passwordUpdated = await pool.query(
        "UPDATE users SET hashed_password = $1 WHERE username = $2",
        [hashed_password, userName]
      );

      if (passwordUpdated) {
        return res.json("Password updated");
      } else {
        return res.status(503).json({ message: "Error updating password" });
      }
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: err.message });
    }
  } //resetUserPass

  static async deleteUser(req, res) {
    const { username } = req.params;

    if (!username)
      return res.status(400).json({ message: "Username is required" });

    try {
      const deletedUser = await pool.query(
        "DELETE from users WHERE username = $1",
        [username]
      );
      console.log(deletedUser);
      return res.json(deletedUser);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: err.message });
    }
  } //deleteUser
}
module.exports = { User };
