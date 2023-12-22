const PORT = process.env.PORT ?? 8000;
const express = require("express");
const cors = require("cors");
const app = express();
const bodyParser = require("body-parser");
const { User } = require("./classes/user");
const { Vehicle } = require("./classes/vehicle");
const { Client } = require("./classes/client");
const { Location } = require("./classes/location");
const { FarmOut } = require("./classes/farmout");
const { Quote } = require("./classes/quote");
const { Booking } = require("./classes/bookings");
const { Employee } = require("./classes/employee");
const { Service } = require("./classes/services");
const { ServiceDetail } = require("./classes/serviceDetail");
const { Schedule } = require("./classes/schedule");

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
  let response = await User.login(userName, password, res);
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

//Get all vehicle names
app.get("/getallvehiclenames", async (req, res) => {
  let response = await Vehicle.getAllVehicleNames();
  res.json(response);
});

//Get vehicle by id
app.get("/getvehicle/:vehicleId", async (req, res) => {
  const { vehicleId } = req.params;
  let response = await Vehicle.getVehicleById(vehicleId);
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
  //console.log(response);
  res.json(response);
});

//Update a client
app.put("/updateclient", bodyParser.json(), async (req, res) => {
  const { client } = req.body;
  let response = await Client.updateClient(client);
  //console.log(response);
  res.json(response);
});

//Delete clients
app.delete("/deleteclient", async (req, res) => {
  const { clientIds } = req.body;
  let response = await Client.deleteClient(clientIds);
  res.json(response);
});
//#endregion

//#region Location
//create location
app.post("/createlocation", bodyParser.json(), async (req, res) => {
  const { location } = req.body;
  let response = await Location.newLocation(location);
  console.log(response);
  res.json(response);
});

//Get all locations
app.get("/getlocations", async (req, res) => {
  let response = await Location.getLocations();
  //console.log(response);
  res.json(response);
});

//Update a location
app.put("/updatelocation", bodyParser.json(), async (req, res) => {
  const { location } = req.body;
  let response = await Location.updateLocation(location);
  //console.log(response);
  res.json(response);
});

//Delete location
app.delete("/deletelocation", async (req, res) => {
  const { locationIds } = req.body;
  let response = await Location.deleteLocation(locationIds);
  res.json(response);
});

//Get all location names
app.get("/getalllocationnames", async (req, res) => {
  let response = await Location.getAllLocationNames();
  res.json(response);
});

app.get("/getlocation/:locationId", async (req, res) => {
  const { locationId } = req.params;
  let response = await Location.getLocationById(locationId);
  res.json(response);
});
//#endregion

//#region FarmOut
//create company
app.post("/createcompany", bodyParser.json(), async (req, res) => {
  const { company } = req.body;
  let response = await FarmOut.newCompany(company);
  console.log(response);
  res.json(response);
});

//Get all companies
app.get("/getallcompanies", async (req, res) => {
  let response = await FarmOut.getAllCompanies();
  //console.log(response);
  res.json(response);
});

//Update a company
app.put("/updatecompany", bodyParser.json(), async (req, res) => {
  const { company } = req.body;
  let response = await FarmOut.updateCompany(company);
  //console.log(response);
  res.json(response);
});

//Delete companies
app.delete("/deletecompany", async (req, res) => {
  const { companyIds } = req.body;
  let response = await FarmOut.deleteCompany(companyIds);
  res.json(response);
});
//#endregion

//#region employee
//create employee
app.post("/createemployee", bodyParser.json(), async (req, res) => {
  const { employee } = req.body;
  let response = await Employee.newEmployee(employee);
  console.log(response);
  res.json(response);
});

//Get all
app.get("/getallemployees", async (req, res) => {
  let response = await Employee.getAllEmployees();
  //console.log(response);
  res.json(response);
});

//Update
app.put("/updateemployee", bodyParser.json(), async (req, res) => {
  const { employee } = req.body;
  let response = await Employee.updateEmployee(employee);
  //console.log(response);
  res.json(response);
});

//Delete
app.delete("/deleteemployee", async (req, res) => {
  const { employeeIds } = req.body;
  let response = await Employee.deleteEmployee(employeeIds);
  res.json(response);
});

//Get all employee names (first and last name)
app.get("/getallemployeenames", async (req, res) => {
  let response = await Employee.getAllEmployeeNames();
  res.json(response);
});

//Get employee by id
app.get("/getemployee/:employeeId", async (req, res) => {
  const { employeeId } = req.params;
  let response = await Employee.getEmployeeById(employeeId);
  res.json(response);
});
//#endregion

//#region Quote
//create quote
app.post("/createquote", bodyParser.json(), async (req, res) => {
  const { quote } = req.body;
  let response = await Quote.newQuote(quote);
  console.log(response);
  res.json(response);
});

//Get all quotes
app.get("/getallquotes", async (req, res) => {
  let response = await Quote.getAllQuotes();
  //console.log(response);
  res.json(response);
});

//Update a Quote
app.put("/updatequote", bodyParser.json(), async (req, res) => {
  const { quote } = req.body;
  let response = await Quote.updateQuote(quote);
  //console.log(response);
  res.json(response);
});

//Delete companies
app.delete("/deletequote", async (req, res) => {
  const { quoteIds } = req.body;
  let response = await Quote.deleteQuote(quoteIds);
  res.json(response);
});
//#endregion

//#region Booking
//create booking
app.post("/createbooking", bodyParser.json(), async (req, res) => {
  const { booking } = req.body;
  let response = await Booking.newBooking(booking);
  console.log(response);
  res.json(response);
});

//Get all bookings
app.get("/getallbookings", async (req, res) => {
  let response = await Booking.getAllBookings();
  //console.log(response);
  res.json(response);
});

//Update a Booking
app.put("/updatebooking", bodyParser.json(), async (req, res) => {
  const { booking } = req.body;
  let response = await Booking.updateBooking(booking);
  //console.log(response);
  res.json(response);
});

//Delete companies
app.delete("/deletebooking", async (req, res) => {
  const { bookingIds } = req.body;
  let response = await Booking.deleteBooking(bookingIds);
  res.json(response);
});
//#endregion

//#region Service
//create service
app.post("/createservice", bodyParser.json(), async (req, res) => {
  const { service } = req.body;
  let response = await Service.newService(service);
  console.log(response);
  res.json(response);
});

//Get all services
app.get("/getallservices", async (req, res) => {
  let response = await Service.getAllServices();
  //console.log(response);
  res.json(response);
});

//get service for a specific booking
app.get("/getservices/:invoice", async (req, res) => {
  const { invoice } = req.params;
  let response = await Service.getServices(invoice);
  res.json(response);
});

//Update a Service
app.put("/updateservice", bodyParser.json(), async (req, res) => {
  const { service } = req.body;
  let response = await Service.updateService(service);
  //console.log(response);
  res.json(response);
});

//Delete Service
app.delete("/deleteservice/:serviceid", async (req, res) => {
  const { serviceid } = req.params;
  let response = await Service.deleteService(serviceid);
  res.json(response);
});
//#endregion

//#region ServiceDetails
//create a service detail
app.post("/createdetail", bodyParser.json(), async (req, res) => {
  const { detail } = req.body;
  let response = await ServiceDetail.newDetail(detail);
  console.log(response);
  res.json(response);
});

//Get all details
app.get("/getalldetails", async (req, res) => {
  let response = await ServiceDetail.getAllDetails();
  //console.log(response);
  res.json(response);
});

//get details for a specific service
app.get("/getdetails/:serviceId", async (req, res) => {
  const { serviceId } = req.params;
  let response = await ServiceDetail.getDetails(serviceId);
  res.json(response);
});

//Update a service detail
app.put("/updatedetail", bodyParser.json(), async (req, res) => {
  const { detail } = req.body;
  let response = await ServiceDetail.updateDetail(detail);
  //console.log(response);
  res.json(response);
});

//Delete a service detail
app.delete("/deletedetail/:detailid", async (req, res) => {
  const { detailid } = req.params;
  let response = await ServiceDetail.deleteDetail(detailid);
  res.json(response);
});
//#endregion

//#region schedule
app.get("/getschedule/:dates", async (req, res) => {
  const { dates } = req.params;
  let newDates = JSON.parse(dates);
  let response = await Schedule.getSchedule(
    newDates.startDate,
    newDates.endDate
  );
  res.json(response);
});
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
