import GoogleMaps from "../api/google_maps";
import {
  Box,
  CircularProgress,
  IconButton,
  Paper,
  Tooltip,
  Typography,
  Snackbar,
  Alert,
  AlertTitle,
} from "@mui/material";
import { useState, useRef, useEffect } from "react";
import { UsePrivateGet } from "../hooks/useFetchServer";
import { useNavigate, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { BusIcon } from "../utils/busIcon";
import HomeIcon from "@mui/icons-material/Home";
import SportsScoreIcon from "@mui/icons-material/SportsScore";
import PlaceIcon from "@mui/icons-material/Place";
import HorizontalRuleIcon from "@mui/icons-material/HorizontalRule";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import WbTwilightIcon from "@mui/icons-material/WbTwilight";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

import dayjs from "dayjs";

export const ScheduledRoutes = () => {
  const effectRun = useRef(false);

  const [error, setError] = useState(null);
  const [openSnakbar, setOpenSnakbar] = useState(false);
  const [tripsData, setTripsData] = useState([]);
  const [todaysTrip, setTodaysTrip] = useState({});
  const [upcomingTrips, setUpcomingTrips] = useState([]);
  const [showMap, setShowMap] = useState(false);
  const [duration, setDuration] = useState({});
  const [distance, setDistance] = useState({});
  const [currentDate, setCurrentDate] = useState(
    new Date().toLocaleDateString()
  );
  const [isLoading, setIsLoading] = useState(true);

  const { setAuth, auth } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const getServer = UsePrivateGet();

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const driverId = auth?.userName;

    const getTrips = async () => {
      const response = await getServer(
        `/getTripsByDriver/${driverId}`,
        controller.signal
      );

      if (response.disconnect) {
        setAuth({});
        navigate("/login", { state: { from: location }, replace: true });
        //other errors
      } else if (response.error) {
        setError(response.error);
        setOpenSnakbar(true);
      }
      //no error
      else {
        let responseData = response?.data;
        responseData = responseData.map((item) => {
          const trips = {
            employeeId: item.employee_id,
            serviceDate: item.service_date?.slice(0, 10),
            vehicleName: item.vehicle_name,
            vehicleColor: item.vehicle_color,
            spotTime: item.spot_time,
            startTime: item.start_time,
            endTime: item.end_time,
            returnTime: item.return_time,
            instructions: item.instructions,
            fromLocationName: item.from_location_name,
            fromAddress: item.from_address,
            fromCity: item.from_city,
            fromState: item.from_state,
            fromZip: item.from_zip,
            toLocationName: item.to_location_name,
            toAddress: item.to_address,
            toCity: item.to_city,
            toState: item.to_state,
            toZip: item.to_zip,
            numPeople: item.num_people,
            icon: <BusIcon color={item.vehicle_color} />,
          };
          return trips;
        });

        if (isMounted) {
          refineData(responseData);
          setTripsData(responseData);
          setIsLoading(false);
        }
      }
    }; //getTrips

    const refineData = (tripsData) => {
      //Get today's trip
      let today = new Date().toLocaleDateString();
      setCurrentDate(today);

      const todayTrip = tripsData?.find(
        (trip) => dayjs(trip.serviceDate).format("l") === today
      );
      if (todayTrip) setShowMap(true);
      setTodaysTrip(todayTrip);

      //set upcoming trips
      const upcoming = tripsData?.filter(
        (trip) => dayjs(trip.serviceDate).diff(dayjs(today)) > 0
      );
      setUpcomingTrips(upcoming);
    }; //refineData

    if (process.env.NODE_ENV === "development") {
      effectRun.current && getTrips();
    } else {
      getTrips();
    }

    return () => {
      isMounted = false;
      controller.abort();
      effectRun.current = true;
    };
  }, []);

  useEffect(() => {
    let today = new Date(currentDate).toLocaleDateString();

    const todayTrip = tripsData?.find(
      (trip) => dayjs(trip.serviceDate).format("l") === today
    );
    if (todayTrip) {
      setShowMap(true);
      setTodaysTrip(todayTrip);
    } else {
      setShowMap(false);
    }
  }, [currentDate]);

  const handleUpdateRouteInfo = (duration, distance) => {
    setDistance(distance);
    setDuration(duration);
  };

  //closes the snakbar
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnakbar(false);
  };

  return (
    <>
      {isLoading ? (
        <Box>
          <CircularProgress variant="indeterminate" />
        </Box>
      ) : (
        <Box>
          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
            }}
          >
            <Tooltip title="Previous Day">
              <IconButton
                onClick={() =>
                  setCurrentDate(dayjs(currentDate).subtract(1, "day"))
                }
              >
                <ArrowBackIosIcon color="success" />
              </IconButton>
            </Tooltip>
            <Typography color="green">
              {dayjs(currentDate).format("dddd, MMMM D, YYYY")}
            </Typography>
            <Tooltip title="Next Day">
              <IconButton
                onClick={() => setCurrentDate(dayjs(currentDate).add(1, "day"))}
              >
                <ArrowForwardIosIcon color="success" />
              </IconButton>
            </Tooltip>
          </Box>
          {showMap ? (
            <Box>
              <Typography
                component="h2"
                variant="h5"
                gutterBottom
                color="primary"
              >
                {todaysTrip?.fromLocationName} to {todaysTrip?.toLocationName}
              </Typography>
              <div
                style={{
                  textAlign: "start",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <Box sx={{ display: "flex" }}>
                  {todaysTrip?.icon}
                  <Typography>{todaysTrip?.vehicleName}</Typography>
                </Box>

                <Typography>{todaysTrip?.numPeople} Passengers</Typography>
              </div>

              {showMap && (
                <GoogleMaps
                  origin={
                    todaysTrip?.fromAddress?.concat(
                      ", ",
                      todaysTrip?.fromCity,
                      ", ",
                      todaysTrip?.fromZip,
                      " ",
                      todaysTrip?.fromState
                    ) ?? ""
                  }
                  destination={
                    todaysTrip?.toAddress?.concat(
                      ", ",
                      todaysTrip?.toCity,
                      ", ",
                      todaysTrip?.toZip,
                      " ",
                      todaysTrip?.toState
                    ) ?? ""
                  }
                  showMap={showMap}
                  updateRouteInfo={handleUpdateRouteInfo}
                />
              )}

              <Typography
                textAlign="start"
                fontSize={14}
                color="purple"
                gutterBottom
              >
                Instructions: {todaysTrip?.instructions}
              </Typography>

              <Box className="tripDetails">
                <Typography color="primary" alignSelf="center" gutterBottom>
                  ***Military Time (24-hour clock)***
                </Typography>
                <Box sx={{ display: "inline-flex", alignItems: "center" }}>
                  <Box sx={{ display: "flex", flexDirection: "column" }}>
                    <HomeIcon color="primary" />
                    <HorizontalRuleIcon
                      className="lineVertical"
                      color="primary"
                    />
                    <HorizontalRuleIcon
                      className="lineVertical"
                      color="primary"
                    />
                    <HorizontalRuleIcon
                      className="lineVertical"
                      color="primary"
                    />
                  </Box>
                  <Box sx={{ marginLeft: "2em" }}>
                    <Typography fontWeight="bold">
                      {todaysTrip?.fromLocationName}
                    </Typography>
                    <Typography>
                      {todaysTrip?.fromAddress}, {todaysTrip?.fromCity},{" "}
                      {todaysTrip?.fromZip} {todaysTrip?.fromState}
                    </Typography>
                    <Typography>
                      Spot Time:{" "}
                      {todaysTrip?.spotTime
                        ? dayjs(todaysTrip?.spotTime).format(
                            "MMMM D, YYYY HH:mm"
                          )
                        : ""}
                    </Typography>
                    <Box sx={{ display: "inline-flex" }}>
                      <Typography>
                        Start Time:{" "}
                        {todaysTrip?.startTime
                          ? dayjs(todaysTrip?.startTime).format(
                              "MMMM D, YYYY HH:mm"
                            )
                          : ""}{" "}
                        {todaysTrip.startTime
                          ? new Date(todaysTrip.startTime).getHours() < 12
                            ? "(in the morning) "
                            : "(in the afternoon) "
                          : ""}
                      </Typography>
                      {todaysTrip.startTime ? (
                        new Date(todaysTrip.startTime).getHours() < 12 ? (
                          <WbSunnyIcon color="warning" />
                        ) : (
                          <WbTwilightIcon color="warning" />
                        )
                      ) : null}
                    </Box>
                  </Box>
                </Box>
                <HorizontalRuleIcon className="lineVertical" color="primary" />
                <Box
                  sx={{
                    display: "inline-flex",
                    alignItems: "center",
                  }}
                >
                  <Box sx={{ display: "flex", flexDirection: "column" }}>
                    <HorizontalRuleIcon
                      className="lineVertical"
                      color="primary"
                    />
                    <HorizontalRuleIcon
                      className="lineVertical"
                      color="primary"
                    />
                    <SportsScoreIcon color="success" />
                  </Box>
                  <Box sx={{ marginLeft: "2em" }}>
                    <Typography fontWeight="bold">
                      {todaysTrip?.toLocationName}
                    </Typography>
                    <Typography>
                      {todaysTrip?.toAddress}, {todaysTrip?.toCity},{" "}
                      {todaysTrip?.toZip} {todaysTrip?.toState}
                    </Typography>
                    <Typography>
                      Estimated Arrival:{" "}
                      {todaysTrip?.startTime
                        ? dayjs(
                            new Date(todaysTrip?.startTime).getTime() +
                              duration.value * 1000
                          ).format("MMMM D, YYYY HH:mm")
                        : ""}
                    </Typography>
                    <Typography>Estimated Distance: {distance.text}</Typography>
                    {todaysTrip?.returnTime && (
                      <Typography>
                        Return Time:{" "}
                        {dayjs(todaysTrip?.returnTime).format(
                          "MMMM D, YYYY HH:mm"
                        )}
                      </Typography>
                    )}
                  </Box>
                </Box>
              </Box>
            </Box>
          ) : (
            <Box>
              <Typography
                component="h2"
                variant="h5"
                color="secondary"
                gutterBottom
              >
                You have no trips today
              </Typography>
              {upcomingTrips?.length > 0 ? (
                <Paper
                  sx={{
                    margin: "auto",
                    padding: "1em",
                  }}
                  elevation={3}
                >
                  <Typography color="primary" fontWeight="bold" gutterBottom>
                    Upcoming Trips
                  </Typography>
                  {upcomingTrips.map((trip) => {
                    return (
                      <Typography key={trip.serviceDate}>
                        {dayjs(trip?.serviceDate).format("l")} |{" "}
                        {trip?.fromLocationName} to {trip?.toLocationName}
                      </Typography>
                    );
                  })}
                </Paper>
              ) : null}
            </Box>
          )}
        </Box>
      )}

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
    </>
  );
};
