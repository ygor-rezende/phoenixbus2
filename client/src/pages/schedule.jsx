import { Fragment, useState, useEffect, useRef } from "react";
import {
  Divider,
  IconButton,
  Drawer,
  Toolbar,
  List,
  Box,
  Container,
  Grid,
  Paper,
  Snackbar,
  Alert,
  AlertTitle,
} from "@mui/material";
import { styled, createTheme } from "@mui/material/styles";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import {
  ScheduleListItems,
  TimeListItems,
} from "./schedule_subcomponents/listitems";

import { ScheduleModal } from "./schedule_subcomponents/scheduleModal";

import { UsePrivateGet, UsePrivatePut } from "../hooks/useFetchServer";

import { useNavigate, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";

import { ScheduleTable } from "./schedule_subcomponents/schedule_table";
import Summary from "./schedule_subcomponents/summary";

const drawerWidth = 240;

const MyDrawer = styled(Drawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  "& .MuiDrawer-paper": {
    position: "static",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    boxSizing: "border-box",
    ...(!open && {
      overflowX: "hidden",
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      width: theme.spacing(7),
      [theme.breakpoints.up("sm")]: {
        width: theme.spacing(9),
      },
    }),
  },
}));

export const Schedule = () => {
  const [openDrawer, setOpenDrawer] = useState(true);
  const [data, setData] = useState([]);
  const [rowData, setRowData] = useState(null);
  const [dateString, setDateString] = useState("Today");
  const [triggerModal, setTriggerModal] = useState(0);
  const [employees, setEmployees] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [locations, setLocations] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [msg, setMsg] = useState("");
  const [openSnakbar, setOpenSnakbar] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const effectRun = useRef(false);

  const { setAuth, auth } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const getServer = UsePrivateGet();

  const allowedRoles = [2501, 8259];

  useEffect(() => {
    let isMounted = true;
    let controller = new AbortController();

    (async function getSupportData() {
      let response = await getServer("/getallemployeenames", controller.signal);
      const empRespData = response?.data;

      response = await getServer("/getalllocationnames", controller.signal);
      const locRespData = response?.data;

      response = await getServer("/getallvehiclenames", controller.signal);
      const vehRespData = response?.data;

      setEmployees(empRespData);
      setLocations(locRespData);
      setVehicles(vehRespData);
    })();

    async function getTodaySchedule() {
      try {
        const startDate = new Date().toISOString();
        const endDate = new Date().toISOString();
        setStartDate(startDate);
        setEndDate(endDate);

        const dates = JSON.stringify({
          startDate: startDate.slice(0, 10),
          endDate: endDate.slice(0, 10),
        });

        const response = await getServer(
          `/getschedule/${dates}`,
          controller.signal
        );

        if (response.disconnect) {
          setAuth({});
          navigate("/login", { state: { from: location }, replace: true });
          //other errors
        }
        //no error
        else {
          const responseMsg = await response.data;
          isMounted && setData(responseMsg);
          setDateString("Today");
        }
      } catch (err) {
        console.error(err);
      }
    }

    if (process.env.NODE_ENV === "development") {
      effectRun.current && getTodaySchedule();
    } else {
      getTodaySchedule();
    }

    return () => {
      isMounted = false;
      controller.abort();
      effectRun.current = true;
    };
  }, []);

  const getSchedule = async (startDate, endDate) => {
    try {
      setStartDate(startDate);
      setEndDate(endDate);

      const sDate = startDate.slice(0, 10);
      const eDate = endDate.slice(0, 10);
      const dates = JSON.stringify({
        startDate: sDate,
        endDate: eDate,
      });

      const response = await getServer(`/getschedule/${dates}`);
      if (response.disconnect) {
        setAuth({});
        navigate("/login", { state: { from: location }, replace: true });
        //other errors
      }
      //no error
      else {
        const responseData = await response.data;
        setData(responseData);
        setDateString(`${sDate} to ${eDate}`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const toggleDrawer = () => {
    setOpenDrawer(!openDrawer);
  };

  //when user clicks on one of the date options displayed on ListItems component
  const pickDate = (startDate, endDate) => {
    getSchedule(startDate, endDate);
  };

  //display error from Service modal child
  const handleOnError = (msg) => {
    setSuccess(false);
    setError(msg);
    setOpenSnakbar(true);
  };

  //display error from Service modal child
  const handleOnSuccess = (msg) => {
    setSuccess(true);
    setError(null);
    setOpenSnakbar(true);
    setMsg(msg);
  };

  const handleOnRowClick = (detailId) => {
    //open modal only to allowed roles
    if (allowedRoles.includes(auth?.role)) {
      const dataFound = data?.find((item) => item.detail_id === detailId);

      setRowData(dataFound);
      setTriggerModal(triggerModal + 1);
    }
  };

  //closes the snakbar
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnakbar(false);
  };

  return (
    <Fragment>
      <Box sx={{ display: "flex" }}>
        <MyDrawer variant="permanent" open={openDrawer}>
          <Toolbar
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              px: [1],
            }}
          >
            <IconButton onClick={toggleDrawer}>
              {openDrawer ? <ChevronLeftIcon /> : <ChevronRightIcon />}
            </IconButton>
          </Toolbar>
          <Divider />
          <List component="nav">
            <ScheduleListItems />
            <Divider sx={{ my: 1 }} />
            <TimeListItems onDatePick={pickDate} />
          </List>
        </MyDrawer>
        <Box
          component="main"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === "light"
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
            flexGrow: 1,
            height: "100vh",
            overflow: "auto",
          }}
        >
          <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={8} lg={9}>
                <Paper
                  sx={{
                    p: 2,
                    display: "flex",
                    flexDirection: "column",
                    height: 240,
                  }}
                ></Paper>
                {/*chart*/}
              </Grid>
              <Grid item xs={12} md={4} lg={3}>
                <Paper
                  sx={{
                    p: 2,
                    display: "flex",
                    flexDirection: "column",
                    height: 240,
                    textAlign: "end",
                  }}
                >
                  <Summary data={data} />
                </Paper>
              </Grid>
              <Grid item xs={12}>
                <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
                  <ScheduleTable
                    data={data}
                    onDatePick={pickDate}
                    dateString={dateString}
                    editData={handleOnRowClick}
                  />
                </Paper>
              </Grid>
            </Grid>
          </Container>
        </Box>
        <ScheduleModal
          onError={handleOnError}
          onSuccess={handleOnSuccess}
          onSave={getSchedule}
          open={triggerModal}
          rowData={rowData}
          empData={employees}
          locData={locations}
          vehData={vehicles}
          startDate={startDate}
          endDate={endDate}
        />
        <Snackbar
          open={error && openSnakbar}
          autoHideDuration={5000}
          onClose={handleClose}
        >
          <Alert severity="error" onClose={handleClose}>
            <AlertTitle>Error</AlertTitle>
            {error}
          </Alert>
        </Snackbar>

        <Snackbar
          open={success && openSnakbar}
          autoHideDuration={5000}
          onClose={handleClose}
        >
          <Alert severity="success" onClose={handleClose}>
            <AlertTitle>Schedule Updated</AlertTitle>
            {msg}
          </Alert>
        </Snackbar>
      </Box>
    </Fragment>
  );
};
