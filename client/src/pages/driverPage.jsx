import GoogleMaps from "../api/google_maps";
import { Box, Typography } from "@mui/material";
import { useState, useRef, useEffect } from "react";
import { UsePrivateGet } from "../hooks/useFetchServer";
import { useNavigate, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { BusIcon } from "../utils/busIcon";
import dayjs from "dayjs";

export const ScheduledRoutes = () => {
  const effectRun = useRef(false);

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [openSnakbar, setOpenSnakbar] = useState(false);
  const [tripsData, setTripsData] = useState([]);
  const [todaysTrip, setTodaysTrip] = useState({});

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
        setSuccess(false);
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
            baseTime: item.base_time,
            releasedTime: item.released_time,
            serviceType: item.service_type,
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
          setTodayData(responseData);
          setTripsData(responseData);
        }
      }
    }; //getTrips

    const setTodayData = (tripsData) => {
      let today = new Date().toISOString();
      today = today?.slice(0, 10);

      const todayTrip = tripsData?.find((trip) => trip.serviceDate === today);
      setTodaysTrip(todayTrip);
    };

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

  return (
    <>
      <Typography component="h2" variant="h5" gutterBottom>
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
          {todaysTrip.icon}
          <Typography>{todaysTrip?.vehicleName}</Typography>
        </Box>

        <Typography>{todaysTrip?.numPeople} Passengers</Typography>
      </div>

      <GoogleMaps
        origin={todaysTrip?.fromAddress?.concat(
          ", ",
          todaysTrip?.fromCity,
          ", ",
          todaysTrip?.fromZip,
          " ",
          todaysTrip?.fromState
        )}
        destination={todaysTrip?.toAddress?.concat(
          ", ",
          todaysTrip?.toCity,
          ", ",
          todaysTrip?.toZip,
          " ",
          todaysTrip?.toState
        )}
      />

      <Typography textAlign="start" fontSize={14} color="purple" gutterBottom>
        Trip Requirements: {todaysTrip?.instructions}
      </Typography>

      <Box className="tripDetails">
        <div>
          <Typography>
            Origin: {todaysTrip?.fromAddress}, {todaysTrip?.fromCity},{" "}
            {todaysTrip?.fromZip} {todaysTrip?.fromState}
          </Typography>
          <Typography>
            Spot Time: {todaysTrip?.serviceDate} -{" "}
            {dayjs(todaysTrip?.spotTime).format("hh:mm A")}
          </Typography>
          <Typography>
            Pickup Time: {todaysTrip?.serviceDate} -{" "}
            {dayjs(todaysTrip?.startTime).format("hh:mm A")}
          </Typography>
        </div>
        <div>
          <Typography>
            Destination: {todaysTrip?.toAddress}, {todaysTrip?.toCity},{" "}
            {todaysTrip?.toZip} {todaysTrip?.toState}
          </Typography>
          <Typography>
            Estimated Arrival: {todaysTrip?.serviceDate} -{" "}
            {dayjs(todaysTrip?.endTime).format("hh:mm A")}
          </Typography>
        </div>
      </Box>
    </>
  );
};
