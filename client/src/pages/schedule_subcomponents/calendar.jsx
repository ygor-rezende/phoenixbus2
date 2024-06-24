import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import { useEffect, useRef, useState } from "react";
import useAuth from "../../hooks/useAuth";
import { useLocation, useNavigate } from "react-router-dom";
import { UsePrivateGet } from "../../hooks/useFetchServer";

export default function Calendar() {
  const [data, setData] = useState([]);
  const [events, setEvents] = useState([]);

  const effectRun = useRef(false);
  const { setAuth, auth } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const getServer = UsePrivateGet();

  useEffect(() => {
    let isMounted = true;
    let controller = new AbortController();
    //get today's date, month, year
    let today = new Date();
    let month = today.getMonth();
    let year = today.getFullYear();
    let startDate = new Date(year, month, 1);
    let endDate = new Date(year, month + 1, 0);
    let lastDay = endDate.getDate();

    async function getMontlyData() {
      try {
        const dates = JSON.stringify({
          startDate: startDate.toISOString()?.slice(0, 10),
          endDate: endDate.toISOString()?.slice(0, 10),
        });

        //get month schedule
        let response = await getServer(
          `/getschedule/${dates}`,
          controller.signal
        );

        if (response.disconnect) {
          setAuth({});
          navigate("/login", { state: { from: location }, replace: true });
        } else {
          let scheduleData = response.data;
          let eventsInfo = calculateSummary(scheduleData);
          isMounted && setData(scheduleData);
          setEvents(eventsInfo);
        }
      } catch (err) {
        console.error(err);
      }
    } //getMontlyData

    function calculateSummary(data) {
      //populate a date array with all days of month
      let dateArr = [];
      for (let i = 1; i <= lastDay; i++) {
        dateArr.push(new Date(year, month, i).toISOString()?.slice(0, 10));
      }

      //filter the data for each day of month to calculate the summary per day
      let events = dateArr.map((date) => {
        //filter data by date
        let filteredData = data?.filter(
          (e) => e.service_date?.slice(0, 10) === date
        );

        //total of trips
        const totTrips = filteredData?.length || 0;

        //total of internal buses
        const busQty =
          filteredData?.filter((e) => e.use_farmout === false)?.length || 0;

        //total charges
        const totalCharges = filteredData?.reduce((total, current) => {
          return total + Number(current.charge);
        }, 0);

        //Build an array of objects and return it
        let items = [
          { title: `Trips: ${totTrips}`, date: date },
          { title: `Buses: ${busQty}`, date: date },
          { title: `Charges: $${Number(totalCharges).toFixed(2)}`, date: date },
        ];
        return items;
      });

      return events.flat();
    }

    if (process.env.NODE_ENV === "development") {
      effectRun.current && getMontlyData();
    } else getMontlyData();

    return () => {
      isMounted = false;
      controller.abort();
      effectRun.current = true;
    };
  }, []);

  return (
    <FullCalendar
      plugins={[dayGridPlugin]}
      initialView="dayGridMonth"
      headerToolbar={{ left: "", center: "title", right: "prev,next" }}
      events={events}
    />
  );
}
