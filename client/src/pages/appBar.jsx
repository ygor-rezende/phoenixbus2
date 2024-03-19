import { useState } from "react";
import useAuth from "../hooks/useAuth.js";
import { NavLink, Link, useNavigate, Outlet } from "react-router-dom";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import MenuIcon from "@mui/icons-material/Menu";

import {
  Toolbar,
  AppBar,
  Menu,
  Button,
  MenuItem,
  IconButton,
  Typography,
  Box,
} from "@mui/material";
import useLogout from "../hooks/useLogout.js";

const APPBar = () => {
  const { auth } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorE2, setAnchorE2] = useState(null);
  const [anchorE3, setAnchorE3] = useState(null);
  const [anchorE4, setAnchorE4] = useState(null);
  const [anchorElNav, setAnchorElNav] = useState(null);

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

  const pages = [
    { name: "Vehicles", link: "/addvehicle" },
    { name: "Locations", link: "/servicelocations" },
    { name: "Clients", link: "/addclient" },
    { name: "View Schedule", link: "/schedule" },
    { name: "Bookings", link: "/bookings" },
    { name: "My Trips", link: "/driverpage" },
    { name: "Payroll", link: "/driverpayroll" },
    { name: "FarmOut", link: "/farmout" },
  ];

  const dispatchGroup = [ROLES.dispatch, ROLES.admin];
  const salesGroup = [ROLES.sales, ROLES.dispatch, ROLES.admin];
  const driverGroup = [ROLES.driver];

  const userType = auth.role;

  const signOut = async () => {
    //logout endpoint
    await logoutServer();
    navigate("/login");
  };

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  return (
    <>
      <AppBar position="fixed" className="topnav">
        <Toolbar>
          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
              keepMounted
              transformOrigin={{ vertical: "top", horizontal: "left" }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
            >
              {pages.map((page) => (
                <MenuItem key={page.name} onClick={handleCloseNavMenu}>
                  <Link to={page.link}>
                    <Typography textAlign="center">{page.name}</Typography>
                  </Link>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <Link to="/home">
            <Typography variant="h6" color="white">
              Phoenix Bus
            </Typography>
          </Link>
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {salesGroup.find((e) => e === userType) ? (
              <Link to="/addvehicle">
                <Button
                  id="addvehicle"
                  sx={{ color: "white" }}
                  style={{ marginLeft: "5vh", marginRight: "5vh" }}
                  size="small"
                >
                  Vehicles
                </Button>
              </Link>
            ) : null}

            {salesGroup.find((e) => e === userType) ? (
              <Link to="/servicelocations">
                <Button
                  id="servicelocations"
                  sx={{ color: "white" }}
                  style={{ marginLeft: "5vh", marginRight: "5vh" }}
                  size="small"
                >
                  Locations
                </Button>
              </Link>
            ) : null}

            {salesGroup.find((e) => e === userType) ? (
              <Link to="/addclient">
                <Button
                  id="client"
                  sx={{ color: "white" }}
                  style={{ marginLeft: "5vh", marginRight: "5vh" }}
                  size="small"
                >
                  Clients
                </Button>
              </Link>
            ) : null}

            {salesGroup.find((e) => e === userType) ? (
              <Link to="/farmout">
                <Button
                  id="farmout"
                  sx={{ color: "white" }}
                  style={{ marginLeft: "5vh", marginRight: "5vh" }}
                  size="small"
                >
                  FarmOut
                </Button>
              </Link>
            ) : null}

            {salesGroup.find((e) => e === userType) ? (
              <Link to="/schedule">
                <Button
                  id="schedule"
                  sx={{ color: "white" }}
                  style={{ marginLeft: "5vh", marginRight: "5vh" }}
                  size="small"
                >
                  Schedule
                </Button>
              </Link>
            ) : null}

            {salesGroup.find((e) => e === userType) ? (
              <Link to="/bookings">
                <Button
                  id="bookings"
                  sx={{ color: "white" }}
                  style={{ marginLeft: "5vh", marginRight: "5vh" }}
                  size="small"
                >
                  Quotes & Bookings
                </Button>
              </Link>
            ) : null}
            {driverGroup.find((e) => e === userType) ? (
              <Link to="/driverpage">
                <Button
                  id="driverpage"
                  sx={{ color: "white" }}
                  style={{ marginLeft: "5vh", marginRight: "5vh" }}
                  size="small"
                >
                  My Trips
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
                size="small"
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
                size="small"
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
                Manage users
              </MenuItem>

              <MenuItem
                component={NavLink}
                to="/employee"
                onClick={handleCloseAdmin}
              >
                Employees
              </MenuItem>
            </Menu>
          </Box>

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
