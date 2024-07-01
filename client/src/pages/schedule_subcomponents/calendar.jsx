import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import { useEffect, useRef, useState } from "react";
import useAuth from "../../hooks/useAuth";
import { useLocation, useNavigate } from "react-router-dom";
import { UsePrivateGet } from "../../hooks/useFetchServer";
import dayjs from "dayjs";

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
    const numOfMonths = 4;
    let today = dayjs(new Date());
    let month = today.get("month");
    let year = today.get("year");
    let startDate = new Date(year, month, 1);
    let endDate = today.add(numOfMonths, "months").set("day", 1);

    let months = [];
    let years = [];
    for (let i = 0; i < numOfMonths; i++) {
      let curDate = today.add(i, "month");
      months.push(curDate.get("month"));
      years.push(curDate.get("year"));
    }

    async function getMontlyData() {
      try {
        const dates = JSON.stringify({
          startDate: startDate.toISOString()?.slice(0, 10),
          endDate: endDate.toISOString()?.slice(0, 10),
        });

        //get month schedule
        let response = await getServer(
          `/getscheduleforcalendar/${dates}`,
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
      for (let m = 0; m < numOfMonths; m++) {
        let curMonth = months[m];
        let curYear = years[m];
        let lastDay = new Date(curYear, curMonth + 1, 0).getDate();
        for (let i = 1; i <= lastDay; i++) {
          dateArr.push(
            new Date(curYear, curMonth, i).toISOString()?.slice(0, 10)
          );
        }
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
