const PORT = 8000;
const os = require("os");
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
const { Driver } = require("./classes/driver");
const { Payroll } = require("./classes/payroll");
const cookieParser = require("cookie-parser");
const verifyJWT = require("./middleware/verifyJWT");
const credentials = require("./middleware/credentials");
const corsOptions = require("./config/corsOptions");
const ROLES_LIST = require("./config/roles_list");
const verifyRoles = require("./middleware/verifyRoles");

const { onRequest } = require("firebase-functions/v2/https");
const allowedOrigins = require("./config/allowedOrigins");
const { Sales } = require("./classes/sales");
const { Payments } = require("./classes/client_payments");

//Handle fetch cookies credentials requirement
app.use(credentials);

//using cors for allow testing
app.use(cors(corsOptions));

app.use(express.json()); // To parse the incoming requests with JSON payloads

//middleware for cookies
app.use(cookieParser());

app.use(express.static("public"));

//free routes
app.use("/", require("./routes/root"));
app.use("/api/login", require("./routes/auth"));
app.use("/refresh", require("./routes/refresh"));
app.use("/logout", require("./routes/logout"));

// //sign a new user up
// app.post("/tempsignup", bodyParser.json(), async (req, res) => {
//   let response = await User.signUp(req, res);
//   return response;
// });

//Middleware
app.use(verifyJWT);

//protected routes

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

//get usernames not associated with employees
app.get("/getavailableusers", async (req, res) => {
  let response = await User.getAvailableUsers();
  res.json(response);
});

//sign a new user up
app.post(
  "/signup",
  verifyRoles(ROLES_LIST.admin),
  bodyParser.json(),
  async (req, res) => {
    console.log(req.body);
    let response = await User.signUp(req, res);
    return response;
  }
);

//reset password - User reset its own password
app.post("/reset", bodyParser.json(), async (req, res) => {
  let response = await User.resetPassword(req, res);
  return response;
});

//reset password by admin
app.post(
  "/resetUserPass",
  verifyRoles(ROLES_LIST.admin),
  bodyParser.json(),
  async (req, res) => {
    let response = await User.resetUserPass(req, res);
    return response;
  }
);

//Delete user
app.delete(
  "/deleteuser/:username",
  verifyRoles(ROLES_LIST.admin),
  async (req, res) => {
    let response = await User.deleteUser(req, res);
    return response;
  }
);
//#endregion

//#region Vehicle
//Create new Vehicle
app.post(
  "/createvehicle",
  verifyRoles(ROLES_LIST.admin, ROLES_LIST.dispatch),
  bodyParser.json(),
  async (req, res) => {
    let response = await Vehicle.createVehicle(req, res);
    return response;
  }
);

//Get all vehicles
app.get("/getallvehicles", async (req, res) => {
  let response = await Vehicle.getAllVehicles();
  res.json(response);
});

//Delete vehicle
app.delete(
  "/deletevehicle/:vehicleIds/:changeUser",
  verifyRoles(ROLES_LIST.admin, ROLES_LIST.dispatch),
  async (req, res) => {
    let response = await Vehicle.deleteVehicle(req, res);
    return response;
  }
);

//Update vehicle
app.put(
  "/updatevehicle",
  verifyRoles(ROLES_LIST.admin, ROLES_LIST.dispatch),
  async (req, res) => {
    let response = await Vehicle.updateVehicle(req, res);
    return response;
  }
);

//Get all vehicle names
app.get("/getallvehiclenames", async (req, res) => {
  let response = await Vehicle.getAllVehicleNames();
  res.json(response);
});

//Get vehicle by id
app.get("/getvehicle/:vehicleId", async (req, res) => {
  let response = await Vehicle.getVehicleById(req, res);
  return response;
});
//#endregion

//#region Client
//create client
app.post(
  "/createclient",
  verifyRoles(ROLES_LIST.admin, ROLES_LIST.dispatch, ROLES_LIST.sales),
  bodyParser.json(),
  async (req, res) => {
    let response = await Client.newClient(req, res);
    return response;
  }
);

//Get all clients
app.get("/getallclients", async (req, res) => {
  let response = await Client.getAllClients();
  //console.log(response);
  res.json(response);
});

//Update a client
app.put(
  "/updateclient",
  verifyRoles(ROLES_LIST.admin, ROLES_LIST.dispatch, ROLES_LIST.sales),
  bodyParser.json(),
  async (req, res) => {
    let response = await Client.updateClient(req, res);
    //console.log(response);
    return response;
  }
);

//Delete clients
app.delete(
  "/deleteclient/:clientIds/:changeUser",
  verifyRoles(ROLES_LIST.admin, ROLES_LIST.dispatch, ROLES_LIST.sales),
  async (req, res) => {
    let response = await Client.deleteClient(req, res);
    return response;
  }
);
//#endregion

//#region Location
//create location
app.post(
  "/createlocation",
  verifyRoles(ROLES_LIST.admin, ROLES_LIST.dispatch, ROLES_LIST.sales),
  bodyParser.json(),
  async (req, res) => {
    let response = await Location.newLocation(req, res);
    return response;
  }
);

//Get all locations
app.get("/getlocations", async (req, res) => {
  let response = await Location.getLocations();
  //console.log(response);
  res.json(response);
});

//Update a location
app.put(
  "/updatelocation",
  verifyRoles(ROLES_LIST.admin, ROLES_LIST.dispatch, ROLES_LIST.sales),
  bodyParser.json(),
  async (req, res) => {
    let response = await Location.updateLocation(req, res);
    //console.log(response);
    return response;
  }
);

//Delete location
app.delete(
  "/deletelocation/:locationIds/:changeUser",
  verifyRoles(ROLES_LIST.admin, ROLES_LIST.dispatch, ROLES_LIST.sales),
  async (req, res) => {
    let response = await Location.deleteLocation(req, res);
    return response;
  }
);

//Get all location names
app.get("/getalllocationnames", async (req, res) => {
  let response = await Location.getAllLocationNames();
  res.json(response);
});

app.get("/getlocation/:locationId", async (req, res) => {
  let response = await Location.getLocationById(req, res);
  return response;
});
//#endregion

//#region FarmOut
//create company
app.post(
  "/createcompany",
  verifyRoles(ROLES_LIST.admin, ROLES_LIST.dispatch, ROLES_LIST.sales),
  bodyParser.json(),
  async (req, res) => {
    let response = await FarmOut.newCompany(req, res);
    console.log(response);
    return response;
  }
);

//Get all companies
app.get("/getallcompanies", async (req, res) => {
  let response = await FarmOut.getAllCompanies();
  //console.log(response);
  res.json(response);
});

//Get all company names
app.get("/getallcompanynames", async (req, res) => {
  let response = await FarmOut.getAllCompanyNames();
  res.json(response);
});

//Update a company
app.put(
  "/updatecompany",
  verifyRoles(ROLES_LIST.admin, ROLES_LIST.dispatch, ROLES_LIST.sales),
  bodyParser.json(),
  async (req, res) => {
    let response = await FarmOut.updateCompany(req, res);
    //console.log(response);
    return response;
  }
);

//Delete companies
app.delete(
  "/deletecompany/:companyIds/:changeUser",
  verifyRoles(ROLES_LIST.admin, ROLES_LIST.dispatch, ROLES_LIST.sales),
  async (req, res) => {
    let response = await FarmOut.deleteCompany(req, res);
    return response;
  }
);
//#endregion

//#region employee
//create employee
app.post(
  "/createemployee",
  verifyRoles(ROLES_LIST.admin),
  bodyParser.json(),
  async (req, res) => {
    let response = await Employee.newEmployee(req, res);
    console.log(response);
    return response;
  }
);

//Get all
app.get("/getallemployees", async (req, res) => {
  let response = await Employee.getAllEmployees();
  //console.log(response);
  res.json(response);
});

//Update
app.put(
  "/updateemployee",
  verifyRoles(ROLES_LIST.admin),
  bodyParser.json(),
  async (req, res) => {
    let response = await Employee.updateEmployee(req, res);
    //console.log(response);
    return response;
  }
);

//Delete
app.delete(
  "/deleteemployee/:employeeIds/:changeUser",
  verifyRoles(ROLES_LIST.admin),
  async (req, res) => {
    let response = await Employee.deleteEmployee(req, res);
    return response;
  }
);

//Get all employee names (first and last name)
app.get("/getallemployeenames", async (req, res) => {
  let response = await Employee.getAllEmployeeNames();
  res.json(response);
});

//Get Sales people fullname and id
app.get("/getsalespeople", async (req, res) => {
  let response = await Employee.getSalesPeople();
  res.json(response);
});

//Get driver fullname and id
app.get("/getdrivers", async (req, res) => {
  let response = await Employee.getDrivers();
  res.json(response);
});

//Get employee by id
app.get("/getemployee/:employeeId", async (req, res) => {
  let response = await Employee.getEmployeeById(req, res);
  return response;
});
//#endregion

//#region Quote
//create quote
// app.post(
//   "/createquote",
//   verifyRoles(ROLES_LIST.admin, ROLES_LIST.dispatch, ROLES_LIST.sales),
//   bodyParser.json(),
//   async (req, res) => {
//     let response = await Quote.newQuote(req, res);
//     //console.log(response);
//     return response;
//   }
// );

// //Get all quotes
// app.get("/getallquotes", async (req, res) => {
//   let response = await Quote.getAllQuotes();
//   //console.log(response);
//   res.json(response);
// });

// //Update a Quote
// app.put(
//   "/updatequote",
//   verifyRoles(ROLES_LIST.admin, ROLES_LIST.dispatch, ROLES_LIST.sales),
//   bodyParser.json(),
//   async (req, res) => {
//     let response = await Quote.updateQuote(req, res);
//     //console.log(response);
//     return response;
//   }
// );

// //Delete quote
// app.delete(
//   "/deletequote/:quoteIds",
//   verifyRoles(ROLES_LIST.admin, ROLES_LIST.dispatch, ROLES_LIST.sales),
//   async (req, res) => {
//     let response = await Quote.deleteQuote(req, res);
//     return response;
//   }
// );
//#endregion

//#region Booking
//create booking
app.post(
  "/createbooking",
  verifyRoles(ROLES_LIST.admin, ROLES_LIST.dispatch, ROLES_LIST.sales),
  bodyParser.json(),
  async (req, res) => {
    let response = await Booking.newBooking(req, res);
    //console.log(response);
    return response;
  }
);

//Get all bookings
app.get("/getallbookings", async (req, res) => {
  let response = await Booking.getAllBookings();
  //console.log(response);
  res.json(response);
});

//Get all quotes
app.get("/getallquotes", async (req, res) => {
  let response = await Booking.getAllQuotes();
  //console.log(response);
  res.json(response);
});

//Update a Booking
app.put(
  "/updatebooking",
  verifyRoles(ROLES_LIST.admin, ROLES_LIST.dispatch, ROLES_LIST.sales),
  bodyParser.json(),
  async (req, res) => {
    let response = await Booking.updateBooking(req, res);
    //console.log(response);
    return response;
  }
);

//Delete bookings
app.delete(
  "/deletebooking/:bookingIds/:changeUser",
  verifyRoles(ROLES_LIST.admin, ROLES_LIST.dispatch, ROLES_LIST.sales),
  async (req, res) => {
    let response = await Booking.deleteBooking(req, res);
    return response;
  }
);

//Get bookings by client
app.get(
  "/getbookingsbyclient/:clientId",
  verifyRoles(ROLES_LIST.admin, ROLES_LIST.dispatch, ROLES_LIST.sales),
  async (req, res) => {
    let response = await Booking.getBookingsByClient(req, res);
    return response;
  }
);
//#endregion

//#region Service
//create service
app.post(
  "/createservice",
  verifyRoles(ROLES_LIST.admin, ROLES_LIST.dispatch, ROLES_LIST.sales),
  bodyParser.json(),
  async (req, res) => {
    let response = await Service.newService(req, res);
    return response;
  }
);

//Get all services
app.get("/getallservices", async (req, res) => {
  let response = await Service.getAllServices();
  res.json(response);
});

//get service for a specific booking
app.get("/getservices/:invoice", async (req, res) => {
  let response = await Service.getServices(req, res);
  return response;
});

//Update a Service
app.put(
  "/updateservice",
  verifyRoles(ROLES_LIST.admin, ROLES_LIST.dispatch, ROLES_LIST.sales),
  bodyParser.json(),
  async (req, res) => {
    let response = await Service.updateService(req, res);
    //console.log(response);
    return response;
  }
);

//Delete Service
app.delete(
  "/deleteservice/:serviceid/:changeUser",
  verifyRoles(ROLES_LIST.admin, ROLES_LIST.dispatch, ROLES_LIST.sales),
  async (req, res) => {
    let response = await Service.deleteService(req, res);
    return response;
  }
);

//Delete some services
app.delete(
  "/deletesomeservices/:serviceIds/:changeUser",
  verifyRoles(ROLES_LIST.admin, ROLES_LIST.dispatch, ROLES_LIST.sales),
  async (req, res) => {
    let response = await Service.deleteSomeServices(req, res);
    return response;
  }
);

app.post(
  "/duplicateservice",
  verifyRoles(ROLES_LIST.admin, ROLES_LIST.dispatch, ROLES_LIST.sales),
  async (req, res) => {
    let response = await Service.duplicateService(req, res);
    return response;
  }
);
//#endregion

//#region ServiceDetails
//create a service detail
app.post(
  "/createdetail",
  verifyRoles(ROLES_LIST.admin, ROLES_LIST.dispatch, ROLES_LIST.sales),
  bodyParser.json(),
  async (req, res) => {
    let response = await ServiceDetail.newDetail(req, res);
    console.log(response);
    return response;
  }
);

//Get all details
app.get("/getalldetails", async (req, res) => {
  let response = await ServiceDetail.getAllDetails();
  //console.log(response);
  res.json(response);
});

//get details for a specific service
app.get("/getdetails/:serviceId", async (req, res) => {
  let response = await ServiceDetail.getDetails(req, res);
  return response;
});

//get detais for 2 or more services at once
app.get("/getdetailsforservices/:serviceIds", async (req, res) => {
  let response = await ServiceDetail.getSomeDetails(req, res);
  return response;
});

//Update a service detail
app.put(
  "/updatedetail",
  verifyRoles(ROLES_LIST.admin, ROLES_LIST.dispatch, ROLES_LIST.sales),
  bodyParser.json(),
  async (req, res) => {
    let response = await ServiceDetail.updateDetail(req, res);
    //console.log(response);
    return response;
  }
);

//Delete a service detail
app.delete(
  "/deletedetail/:detailid/:username",
  verifyRoles(ROLES_LIST.admin, ROLES_LIST.dispatch, ROLES_LIST.sales),
  async (req, res) => {
    let response = await ServiceDetail.deleteDetail(req, res);
    return response;
  }
);

//Delete some details
app.delete(
  "/deletesomedetails/:detailIds/:username",
  verifyRoles(ROLES_LIST.admin, ROLES_LIST.dispatch, ROLES_LIST.sales),
  async (req, res) => {
    let response = await ServiceDetail.deleteSomeDetails(req, res);
    return response;
  }
);

//Check if driver has a trip for an specific date
app.get(
  "/checkdriverhastrip/:detailId/:driverId/:serviceDate",
  verifyRoles(ROLES_LIST.admin, ROLES_LIST.dispatch, ROLES_LIST.sales),
  async (req, res) => {
    let response = await ServiceDetail.checkDriverHasTrip(req, res);
    return response;
  }
);

//Check if vehicle has a trip for an specific date
app.get(
  "/checkvehiclehastrip/:detailId/:vehicleId/:serviceDate",
  verifyRoles(ROLES_LIST.admin, ROLES_LIST.dispatch, ROLES_LIST.sales),
  async (req, res) => {
    let response = await ServiceDetail.checkVehicleHasTrip(req, res);
    return response;
  }
);

app.post(
  "/duplicatedetail",
  verifyRoles(ROLES_LIST.admin, ROLES_LIST.dispatch, ROLES_LIST.sales),
  async (req, res) => {
    let response = await ServiceDetail.duplicateDetail(req, res);
    return response;
  }
);
//#endregion

//#region schedule
app.get(
  "/getschedule/:dates",
  verifyRoles(ROLES_LIST.admin, ROLES_LIST.dispatch, ROLES_LIST.sales),
  async (req, res) => {
    let response = await Schedule.getSchedule(req, res);
    return response;
  }
);

app.put(
  "/updateSchedule",
  verifyRoles(ROLES_LIST.admin, ROLES_LIST.dispatch),
  bodyParser.json(),
  async (req, res) => {
    let response = await Schedule.updateSchedule(req, res);
    return response;
  }
);
//#endregion

//#region driver trips
app.get(
  "/getTripsByDriver/:driverId",
  verifyRoles(ROLES_LIST.driver, ROLES_LIST.admin),
  async (req, res) => {
    let response = await Driver.getTripsByDriver(req, res);
    return response;
  }
);

//#endregion

//#region log history
app.get(
  "/getlogdetail/:detailid",
  verifyRoles(ROLES_LIST.admin, ROLES_LIST.dispatch, ROLES_LIST.sales),
  async (req, res) => {
    let response = await ServiceDetail.getLogDetail(req, res);
    return response;
  }
);
//#endregion

//#region reports
app.get(
  "/getdriverpayroll/:dates",
  verifyRoles(ROLES_LIST.admin, ROLES_LIST.financial),
  async (req, res) => {
    let response = await Payroll.getDriverPayroll(req, res);
    return response;
  }
);

app.get(
  "/getpayrollbydriver/:dates",
  verifyRoles(ROLES_LIST.admin, ROLES_LIST.financial),
  async (req, res) => {
    let response = await Payroll.getPayrollByDriver(req, res);
    return response;
  }
);

app.get(
  "/getsales/:dates",
  verifyRoles(ROLES_LIST.admin, ROLES_LIST.financial),
  async (req, res) => {
    let response = await Sales.getSales(req, res);
    return response;
  }
);
//#endregion

//#region payments
app.get(
  "/getinvoicestopay",
  verifyRoles(ROLES_LIST.admin, ROLES_LIST.financial),
  async (req, res) => {
    let response = await Payments.getInvoices();
    res.json(response);
  }
);

app.post(
  "/processpayment",
  verifyRoles(ROLES_LIST.admin, ROLES_LIST.financial),
  async (req, res) => {
    let response = await Payments.processPayment(req, res);
    return response;
  }
);

app.get(
  "/getpendingpayments",
  verifyRoles(ROLES_LIST.admin, ROLES_LIST.financial),
  async (req, res) => {
    let response = await Payments.getPendingPayments();
    res.json(response);
  }
);

app.get(
  "/getamountduebyinvoice",
  verifyRoles(ROLES_LIST.admin, ROLES_LIST.dispatch, ROLES_LIST.sales),
  async (req, res) => {
    let response = await Payments.getAmountDueByInvoice();
    res.json(response);
  }
);
//#endregion

if (os.hostname().indexOf("LAPTOP") > -1)
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

exports.app = onRequest(app);
