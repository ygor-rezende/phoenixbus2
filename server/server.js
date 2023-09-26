const PORT = process.env.PORT ?? 8000;
const express = require("express");
const cors = require("cors");
const app = express();
const bodyParser = require("body-parser");
const { User } = require("./classes/user");
const { Vehicle } = require("./classes/vehicle");
const { Client } = require("./classes/client");

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

//#region User
//get usertype
app.get("/getUserType/:username", async (req, res) => {
  const { username } = req.params;
  let response = await User.getUserType(username);
  res.json(response);
});

//get all usernames
app.get("/getusernames", async (req, res) => {
  let response = await User.getUsernames();
  res.json(response);
});

//sign a new user up
app.post("/signup", bodyParser.json(), async (req, res) => {
  //console.log(req.body);
  const { userName, password, userType } = req.body;
  let response = await User.signUp(userName, password, userType);
  res.json(response);
});

//login
app.post("/api/login", bodyParser.json(), async (req, res) => {
  const { userName, password } = req.body;
  let response = await User.login(userName, password);
  res.json(response);
});

//reset password - User reset its own password
app.post("/reset", bodyParser.json(), async (req, res) => {
  const { userName, currentPassword, newPassword } = req.body;
  let response = await User.resetPassword(
    userName,
    currentPassword,
    newPassword
  );
  res.json(response);
});

//reset password by admin
app.post("/resetUserPass", bodyParser.json(), async (req, res) => {
  const { userName, newPassword } = req.body;
  let response = await User.resetUserPass(userName, newPassword);
  res.json(response);
});

//Delete user
app.delete("/deleteuser/:username", async (req, res) => {
  const { username } = req.params;
  let response = await User.deleteUser(username);
  res.json(response);
});
//#endregion

//#region Vehicle
//Create new Vehicle
app.post("/createvehicle", bodyParser.json(), async (req, res) => {
  const { vehicleName, vehicleModel, vehicleYear, vehicleColor } = req.body;
  let response = await Vehicle.createVehicle(
    vehicleName,
    vehicleModel,
    vehicleYear,
    vehicleColor
  );
  res.json(response);
});

//Get all vehicles
app.get("/getallvehicles", async (req, res) => {
  let response = await Vehicle.getAllVehicles();
  res.json(response);
});

//Delete vehicle
app.delete("/deletevehicle", async (req, res) => {
  const { vehicleIds } = req.body;
  let response = await Vehicle.deleteVehicle(vehicleIds);
  res.json(response);
});

//Update vehicle
app.put("/updatevehicle", async (req, res) => {
  const { vehicle } = req.body;
  let response = await Vehicle.updateVehicle(vehicle);
  res.json(response);
});
//#endregion

//#region Client
//create client
app.post("/createclient", bodyParser.json(), async (req, res) => {
  const { client } = req.body;
  let response = await Client.newClient(client);
  console.log(response);
  res.json(response);
});

//Get all clients
app.get("/getallclients", async (req, res) => {
  let response = await Client.getAllClients();
  console.log(response);
  res.json(response);
});

//Update a client
app.put("/updateclient", bodyParser.json(), async (req, res) => {
  const { client } = req.body;
  let response = await Client.updateClient(client);
  console.log(response);
  res.json(response);
});
//#endRegion
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
