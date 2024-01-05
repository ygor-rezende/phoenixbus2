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
} from "@mui/material";
import { styled, createTheme } from "@mui/material/styles";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import {
  ScheduleListItems,
  TimeListItems,
} from "./schedule_subcomponents/listitems";

import { UsePrivateGet, UsePrivatePut } from "../hooks/useFetchServer";

import { useNavigate, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";

import { ScheduleTable } from "./schedule_subcomponents/schedule_table";

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
  const [dateString, setDateString] = useState("Today");

  const effectRun = useRef(false);

  const { setAuth } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const getServer = UsePrivateGet();
  const putServer = UsePrivatePut();

  useEffect(() => {
    let isMounted = true;
    let controller = new AbortController();

    async function getTodaySchedule() {
      try {
        const startDate = new Date().toISOString().slice(0, 10);
        const endDate = new Date().toISOString().slice(0, 10);
        const dates = JSON.stringify({
          startDate: startDate,
          endDate: endDate,
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

    getTodaySchedule();

    return () => {
      isMounted = false;
      controller.abort();
      effectRun.current = true;
    };
  }, []);

  const getSchedule = async (startDate, endDate) => {
    try {
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
                  }}
                >
                  {/*Display*/}
                </Paper>
              </Grid>
              <Grid item xs={12}>
                <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
                  <ScheduleTable
                    data={data}
                    onDatePick={pickDate}
                    dateString={dateString}
                  />
                </Paper>
              </Grid>
            </Grid>
          </Container>
        </Box>
      </Box>
    </Fragment>
  );
};
