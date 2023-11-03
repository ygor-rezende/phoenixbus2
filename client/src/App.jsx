/* eslint-disable no-restricted-globals */
import { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  NavLink,
  Link,
} from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
//import MenuIcon from "@mui/icons-material/Menu";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import "./index.css";
import theme from "./theme.js";
import {
  Toolbar,
  AppBar,
  Menu,
  Button,
  MenuItem,
  IconButton,
  Typography,
} from "@mui/material";
import { useCookies } from "react-cookie";
import Login from "./pages/login";
import { HomePage } from "./pages/home";
import { DriverPayroll } from "./pages/driverpayroll";
import { ScheduledRoutes } from "./pages/driverPage";
import { AddClient } from "./pages/addclient";
import AddVehicle from "./pages/addvehicle";
import { Schedule } from "./pages/schedule";
import { Quotes } from "./pages/quotes";
import Auth from "./pages/admin/Auth";
import ResetPassword from "./pages/resetPassword";
import ResetUserPassword from "./pages/admin/ResetUserPassword";
import ErrorPage from "./error-page";
import {
  PrivateRoutes,
  AdminRoutes,
  DispatchRoutes,
  DriverRoutes,
  SalesRoutes,
} from "./utils/private_routes";
import DeleteUser from "./pages/admin/deleteUser";
import { ServiceLocation } from "./pages/servicelocation";
import { FarmOut } from "./pages/admin/farmout";
import { Employee } from "./pages/admin/employee";

const App = () => {
  const [cookies, setCookie, removeCookie] = useCookies(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorE2, setAnchorE2] = useState(null);
  const [anchorE3, setAnchorE3] = useState(null);
  const [anchorE4, setAnchorE4] = useState(null);
  const [isAuth, setIsAuth] = useState(false);
  const [userType, setUserType] = useState("");
  const userName = cookies.Username;

  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseAccounting = () => {
    setAnchorE2(null);
  };
  const handleClickAccounting = (event) => {
    setAnchorE2(event.currentTarget);
  };

  const handleCloseUser = () => {
    setAnchorE3(null);
  };
  const handleClickUser = (event) => {
    setAnchorE3(event.currentTarget);
  };

  const handleCloseAdmin = () => {
    setAnchorE4(null);
  };
  const handleClickAdmin = (event) => {
    setAnchorE4(event.currentTarget);
  };

  const dispatchGroup = ["dispatch", "admin"];
  const salesGroup = ["sales", "dispatch", "admin"];
  const driverGroup = ["driver"];

  const signOut = () => {
    removeCookie("Username");
    removeCookie("AuthToken");
    removeCookie("UserType");
    setIsAuth(false);
    window.location.href = "/";
  };

  const getData = async (username) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVERURL}/getUserType/${username}`
      );
      const json = await response.json();
      setUserType(json);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (userName) {
      setIsAuth(true);
      getData(userName);
    } else {
      setIsAuth(false);
    }
  }, [userName]);

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <AppBar position="fixed">
          <Toolbar>
            <Link to="/home">
              <Typography variant="h6" color="white">
                Phoenix Bus
              </Typography>
            </Link>
            {isAuth && salesGroup.find((e) => e === userType) ? (
              <IconButton
                onClick={handleClick}
                color="inherit"
                style={{ marginLeft: "auto", paddingRight: "1vh" }}
              >
                <AddCircleIcon />
              </IconButton>
            ) : null}
            <Menu
              id="simple-menu"
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem
                component={NavLink}
                to="/addclient"
                onClick={handleClose}
              >
                Clients
              </MenuItem>
              <MenuItem
                component={NavLink}
                to="/servicelocations"
                onClick={handleClose}
              >
                Service Locations
              </MenuItem>
              <MenuItem
                component={NavLink}
                to="/addreservation"
                onClick={handleClose}
              >
                Reservations
              </MenuItem>
              <MenuItem
                component={NavLink}
                to="/addquote"
                onClick={handleClose}
              >
                Quotes
              </MenuItem>
              <MenuItem
                component={NavLink}
                to="/addvehicle"
                onClick={handleClose}
              >
                Vehicles
              </MenuItem>
            </Menu>
            {isAuth && dispatchGroup.find((e) => e === userType) ? (
              <Link to="/schedule">
                <Button
                  id="schedule"
                  sx={{ color: "white" }}
                  style={{ marginLeft: "5vh", marginRight: "5vh" }}
                >
                  View Schedule
                </Button>
              </Link>
            ) : null}
            {isAuth && salesGroup.find((e) => e === userType) ? (
              <Button
                id="quotes"
                sx={{ color: "white" }}
                style={{ marginLeft: "5vh", marginRight: "5vh" }}
              >
                Quotes
              </Button>
            ) : null}
            {isAuth && driverGroup.find((e) => e === userType) ? (
              <Link to="/driverpage">
                <Button
                  id="driverpage"
                  sx={{ color: "white" }}
                  style={{ marginLeft: "5vh", marginRight: "5vh" }}
                >
                  My Routes
                </Button>
              </Link>
            ) : null}
            {isAuth && userType === "admin" ? (
              <Button
                id="accounting"
                aria-controls={open ? "accounting-menu" : undefined}
                aria-haspopup="true"
                // eslint-disable-next-line no-restricted-globals
                aria-expanded={open ? "true" : undefined}
                onClick={handleClickAccounting}
                sx={{ color: "white" }}
                style={{ marginLeft: "5vh", marginRight: "5vh" }}
                endIcon={<KeyboardArrowDownIcon />}
              >
                Accounting
              </Button>
            ) : null}
            <Menu
              id="accounting-menu"
              anchorEl={anchorE2}
              open={Boolean(anchorE2)}
              onClose={handleCloseAccounting}
            >
              <MenuItem
                component={NavLink}
                to="/driverpayroll"
                onClick={handleCloseAccounting}
              >
                Driver Payroll
              </MenuItem>
              <MenuItem
                component={NavLink}
                to="/printInvoice"
                onClick={handleCloseAccounting}
              >
                Print Invoice
              </MenuItem>
              <MenuItem
                component={NavLink}
                to="/sales"
                onClick={handleCloseAccounting}
              >
                Sales
              </MenuItem>
            </Menu>

            {!isAuth ? (
              <Link to="/login">
                <Button
                  id="login"
                  sx={{ color: "white" }}
                  style={{ marginLeft: "5vh", marginRight: "5vh" }}
                >
                  Login
                </Button>
              </Link>
            ) : null}
            {isAuth && userType === "admin" ? (
              <Button
                id="adminBtn"
                aria-controls={open ? "admin-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
                onClick={handleClickAdmin}
                sx={{ color: "white" }}
                style={{ marginLeft: "5vh", marginRight: "5vh" }}
                endIcon={<KeyboardArrowDownIcon />}
              >
                Admin
              </Button>
            ) : null}
            <Menu
              id="admin-menu"
              anchorEl={anchorE4}
              open={Boolean(anchorE4)}
              onClose={handleCloseAdmin}
            >
              <MenuItem
                component={NavLink}
                to="/signup"
                onClick={handleCloseAdmin}
              >
                Register user
              </MenuItem>
              <MenuItem
                component={NavLink}
                to="/resetUserPass"
                onClick={handleCloseAdmin}
              >
                Reset user password
              </MenuItem>
              <MenuItem
                component={NavLink}
                to="/removeUser"
                onClick={handleCloseAdmin}
              >
                Remove user
              </MenuItem>
              <MenuItem
                component={NavLink}
                to="/farmout"
                onClick={handleCloseAdmin}
              >
                Farm-outs
              </MenuItem>
              <MenuItem
                component={NavLink}
                to="/employee"
                onClick={handleCloseAdmin}
              >
                Employees
              </MenuItem>
            </Menu>
            {isAuth ? (
              <IconButton
                onClick={handleClickUser}
                color="inherit"
                style={{ marginLeft: "auto", paddingRight: "1vh" }}
              >
                <AccountCircleIcon />
              </IconButton>
            ) : null}
            <Menu
              id="user-menu"
              anchorEl={anchorE3}
              open={Boolean(anchorE3)}
              onClose={handleCloseUser}
            >
              <MenuItem
                component={NavLink}
                to="/resetPassword"
                onClick={handleCloseUser}
              >
                Reset Password
              </MenuItem>
              <MenuItem
                component={NavLink}
                to="/"
                onClick={() => {
                  signOut();
                  handleCloseUser();
                }}
              >
                Sign Out
              </MenuItem>
            </Menu>
          </Toolbar>
        </AppBar>
        <Toolbar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={<PrivateRoutes />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/resetPassword" element={<ResetPassword />} />
            <Route element={<SalesRoutes />}>
              <Route path="/addclient" element={<AddClient />} />
              <Route path="/servicelocations" element={<ServiceLocation />} />
              <Route path="/addquote" element={<Quotes />} />
            </Route>
            <Route element={<DriverRoutes />}>
              <Route path="/driverpage" element={<ScheduledRoutes />} />
            </Route>
            <Route element={<DispatchRoutes />}>
              <Route path="/schedule" element={<Schedule />} />
              <Route path="/addvehicle" element={<AddVehicle />} exact />
            </Route>
            <Route element={<AdminRoutes />}>
              <Route path="/signup" element={<Auth />} exact />
              <Route
                path="/resetUserPass"
                element={<ResetUserPassword />}
                exact
              />
              <Route path="/driverpayroll" element={<DriverPayroll />} />
              <Route path="/removeuser" element={<DeleteUser />} />
              <Route path="/farmout" element={<FarmOut />} />
              <Route path="/employee" element={<Employee />} />
            </Route>
            <Route path="*" element={<ErrorPage />} />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;
