const PORT = process.env.PORT ?? 8000;
const express = require("express");
const cors = require("cors");
const app = express();
const pool = require("./db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const { v4: uuid } = require("uuid");

//using cors for allow testing
app.use(cors());
app.use(express.json()); // To parse the incoming requests with JSON payloads
app.use(express.static("public"));

//hello msg
app.get("/", (req, res) => {
  res.send("Hello!");
});

//testing
app.get("/gettesting", (req, res) => {
  res.json("Testing");
});

//get usertype
app.get("/getUserType/:username", async (req, res) => {
  const { username } = req.params;
  try {
    const result = await pool.query(
      "SELECT user_type FROM users WHERE username = $1",
      [username]
    );
    res.json(result.rows[0].user_type);
  } catch (err) {
    console.log(err);
  }
});

//get all usernames
app.get("/getusernames", async (req, res) => {
  try {
    const result = await pool.query("SELECT username FROM users");
    res.json(result.rows);
  } catch (err) {
    console.log(err);
  }
});

//sign a new user up
app.post("/signup", bodyParser.json(), async (req, res) => {
  console.log(req.body);
  const { userName, password, userType } = req.body;
  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(password, salt);
  try {
    //insert the user data into users table
    const signUp = await pool.query(
      `INSERT INTO users (username, hashed_password, user_type) VALUES ($1, $2, $3)`,
      [userName, hashedPassword, userType]
    );

    //send the reponse to client
    res.json({ userName });
  } catch (error) {
    console.error(error);

    //if error send the detail to client
    if (error) {
      res.json({ detail: error.detail });
    }
  }
});

//login
app.post("/api/login", bodyParser.json(), async (req, res) => {
  const { userName, password } = req.body;
  //Find the user in the database
  try {
    const users = await pool.query("SELECT * FROM users WHERE username = $1", [
      userName,
    ]);

    //if user not found
    if (!users.rows.length) return res.json({ detail: "User does not exist." });

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
      res.json({
        username: users.rows[0].username,
        token,
      });
    } else {
      res.json({ detail: "Login failed" });
    }
  } catch (error) {
    console.error(error);
  }
});

//reset password - User reset its own password
app.post("/reset", bodyParser.json(), async (req, res) => {
  const { userName, currentPassword, newPassword } = req.body;
  try {
    //select the user by his username
    const users = await pool.query("SELECT * FROM users WHERE username = $1", [
      userName,
    ]);

    if (!users.rows.length) return res.json({ detail: "User does not exist." });

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
        res.json("Password updated");
      } else {
        res.json({ detail: "Error updating password" });
      }
    } else {
      res.json({ detail: "Password does not match" });
    }
  } catch (err) {
    console.error(err);
    if (err) res.json({ detail: err.detail });
  }
});

//reset password by admin
app.post("/resetUserPass", bodyParser.json(), async (req, res) => {
  const { userName, newPassword } = req.body;
  try {
    //select the user by his username
    const users = await pool.query("SELECT * FROM users WHERE username = $1", [
      userName,
    ]);

    if (!users.rows.length) return res.json({ detail: "User does not exist." });

    //update password
    const salt = bcrypt.genSaltSync(10);
    const hashed_password = bcrypt.hashSync(newPassword, salt);
    const passwordUpdated = await pool.query(
      "UPDATE users SET hashed_password = $1 WHERE username = $2",
      [hashed_password, userName]
    );

    if (passwordUpdated) {
      res.json("Password updated");
    } else {
      res.json({ detail: "Error updating password" });
    }

    if (!users.rows.length) return res.json({ detail: "User does not exist." });
  } catch (err) {
    console.error(err);
    if (err) res.json({ detail: err.detail });
  }
});

//Delete user
app.delete("/deleteuser/:username", async (req, res) => {
  try {
    const { username } = req.params;
    const deletedUser = await pool.query(
      "DELETE from users WHERE username = $1",
      [username]
    );
    res.json(deletedUser);
  } catch (err) {
    console.error(err);
    if (err) res.json({ detail: err.detail });
  }
});

//Create new Vehicle
app.post("/createvehicle", bodyParser.json(), async (req, res) => {
  const { vehicleName, vehicleModel, vehicleYear, vehicleColor } = req.body;
  try {
    //generate a new id
    const newId = uuid();
    //insert the new vehicle
    const newVehicle = await pool.query(
      `INSERT INTO vehicles (vehicle_id, vehicle_name, vehicle_model, vehicle_year, vehicle_color) VALUES ($1, $2, $3, $4, $5)`,
      [newId, vehicleName, vehicleModel, vehicleYear, vehicleColor]
    );
    console.log(newVehicle.rowCount);
    //send the reponse to client
    res.json(`Vehicle ${vehicleName} created`);
  } catch (err) {
    console.error(err);
    if (err) res.json({ detail: err.detail });
  }
});

//Get all vehicles
app.get("/getallvehicles", async (req, res) => {
  try {
    const result = await pool.query("Select * FROM vehicles");
    //console.log(result.rows);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
  }
});

//Delete vehicle
app.delete("/deletevehicle", async (req, res) => {
  try {
    const { vehicleIds } = req.body;
    const deletedVehicles = [];
    vehicleIds.forEach(async (vehicle) => {
      const deletedVehicle = await pool.query(
        "DELETE from vehicles WHERE vehicle_id = $1",
        [vehicle]
      );
      deletedVehicles.push(deletedVehicle);
    });
    //if (deletedVehicles.length < 1) res.sendStatus(500);
    res.json("Vechicle(s) deleted");
  } catch (err) {
    console.error(err);
    if (err) res.json({ detail: err.detail });
  }
});

//Update vehicle
app.put("/updatevehicle", async (req, res) => {
  try {
    const { vehicle } = req.body;
    const updatedVehicle = await pool.query(
      "UPDATE vehicles SET vehicle_name = $1, vehicle_model = $2, vehicle_year = $3, vehicle_color = $4 WHERE vehicle_id = $5",
      [vehicle.name, vehicle.model, vehicle.year, vehicle.color, vehicle.id]
    );
    if (updatedVehicle.rowCount >= 0)
      res.json(`Updated: ${updatedVehicle.rows}`);
  } catch (err) {
    console.error(err);
    if (err) res.json({ detail: err.detail });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
