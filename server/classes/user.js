const pool = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

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
      console.log(err);
    }
  } //getUsernames

  static async signUp(userName, password, userType) {
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);
    try {
      //insert the user data into users table
      const signUp = await pool.query(
        `INSERT INTO users (username, hashed_password, user_type) VALUES ($1, $2, $3)`,
        [userName, hashedPassword, userType]
      );

      //send the reponse to client
      return { userName };
    } catch (error) {
      console.error(error);

      //if error send the detail to client
      if (error) {
        return { detail: error.detail };
      }
    }
  } //signUp

  static async login(userName, password, res) {
    try {
      //Find the user in the database
      const users = await pool.query(
        "SELECT * FROM users WHERE username = $1",
        [userName]
      );

      //if user not found
      if (!users.rows.length) return { detail: "User does not exist." };

      //check user password with the password in database
      const success = await bcrypt.compare(
        password,
        users.rows[0].hashed_password
      );

      //get the userType to include in the token
      const userType = users.rows[0].user_type;

      //create a token with the user deitalis
      const token = jwt.sign({ userName, userType }, "statesecret", {
        expiresIn: "1hr",
      });

      if (success) {
        return {
          username: users.rows[0].username,
          token,
        };
      } else {
        return { detail: "Login failed" };
      }
    } catch (error) {
      res.status(503).send("Database unavailable");
      console.error(error);
    }
  } //login

  static async resetPassword(userName, currentPassword, newPassword) {
    try {
      //select the user by his username
      const users = await pool.query(
        "SELECT * FROM users WHERE username = $1",
        [userName]
      );

      if (!users.rows.length) return { detail: "User does not exist." };

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
          return "Password updated";
        } else {
          return { detail: "Error updating password" };
        }
      } else {
        return { detail: "Password does not match" };
      }
    } catch (err) {
      console.error(err);
      if (err) return { detail: err.detail };
    }
  } //resetPassword

  static async resetUserPass(userName, newPassword) {
    try {
      //select the user by his username
      const users = await pool.query(
        "SELECT * FROM users WHERE username = $1",
        [userName]
      );

      if (!users.rows.length) return { detail: "User does not exist." };

      //update password
      const salt = bcrypt.genSaltSync(10);
      const hashed_password = bcrypt.hashSync(newPassword, salt);
      const passwordUpdated = await pool.query(
        "UPDATE users SET hashed_password = $1 WHERE username = $2",
        [hashed_password, userName]
      );

      if (passwordUpdated) {
        return "Password updated";
      } else {
        return { detail: "Error updating password" };
      }
    } catch (err) {
      console.error(err);
      if (err) return { detail: err.detail };
    }
  } //resetUserPass

  static async deleteUser(userName) {
    try {
      const deletedUser = await pool.query(
        "DELETE from users WHERE username = $1",
        [userName]
      );
      return deletedUser;
    } catch (err) {
      console.error(err);
      if (err) return { detail: err.detail };
    }
  } //deleteUser
}
module.exports = { User };
