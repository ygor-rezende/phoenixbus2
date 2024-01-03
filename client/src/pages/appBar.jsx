import { useState } from "react";
import useAuth from "../hooks/useAuth.js";
import { NavLink, Link, useNavigate, Outlet } from "react-router-dom";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

import {
  Toolbar,
  AppBar,
  Menu,
  Button,
  MenuItem,
  IconButton,
  Typography,
} from "@mui/material";
import useLogout from "../hooks/useLogout.js";

const APPBar = () => {
  const { auth } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorE2, setAnchorE2] = useState(null);
  const [anchorE3, setAnchorE3] = useState(null);
  const [anchorE4, setAnchorE4] = useState(null);

  const navigate = useNavigate();
  const logoutServer = useLogout();

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

  const ROLES = {
    all: [2501, 8259, 4174, 6935],
    admin: 2501,
    dispatch: 8259,
    sales: 4174,
    driver: 6935,
  };

  const dispatchGroup = [ROLES.dispatch, ROLES.admin];
  const salesGroup = [ROLES.sales, ROLES.dispatch, ROLES.admin];
  const driverGroup = [ROLES.driver];

  const userType = auth.role;

  const signOut = async () => {
    //logout endpoint
    await logoutServer();
    navigate("/login");
  };

  return (
    <>
      <AppBar position="fixed">
        <Toolbar>
          <Link to="/home">
            <Typography variant="h6" color="white">
              Phoenix Bus
            </Typography>
          </Link>
          {salesGroup.find((e) => e === userType) ? (
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
            <MenuItem component={NavLink} to="/addclient" onClick={handleClose}>
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
              to="/addvehicle"
              onClick={handleClose}
            >
              Vehicles
            </MenuItem>
          </Menu>
          {dispatchGroup.find((e) => e === userType) ? (
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
          {salesGroup.find((e) => e === userType) ? (
            <Link to="/quotes">
              <Button
                id="quotes"
                sx={{ color: "white" }}
                style={{ marginLeft: "5vh", marginRight: "5vh" }}
              >
                Quotes
              </Button>
            </Link>
          ) : null}
          {salesGroup.find((e) => e === userType) ? (
            <Link to="/bookings">
              <Button
                id="bookings"
                sx={{ color: "white" }}
                style={{ marginLeft: "5vh", marginRight: "5vh" }}
              >
                Bookings
              </Button>
            </Link>
          ) : null}
          {driverGroup.find((e) => e === userType) ? (
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
          {userType === ROLES.admin ? (
            <Button
              id="accounting"
              // eslint-disable-next-line no-restricted-globals
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

          {userType === ROLES.admin ? (
            <Button
              id="adminBtn"
              // eslint-disable-next-line no-restricted-globals
              aria-controls={open ? "admin-menu" : undefined}
              aria-haspopup="true"
              // eslint-disable-next-line no-restricted-globals
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

          <IconButton
            onClick={handleClickUser}
            color="inherit"
            style={{ marginLeft: "auto", paddingRight: "1vh" }}
          >
            <AccountCircleIcon />
          </IconButton>

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
      <Outlet />
    </>
  );
};

export default APPBar;