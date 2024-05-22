import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import { Fragment, useEffect, useMemo, useState } from "react";

const BusesTable = (props) => {
  const { data } = props;
  const timeArray = useMemo(
    () => [
      0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
      21, 22, 23,
    ],
    []
  );

  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    let hourlyData = data?.map((item) => {
      let hourArray = [];

      //check if vehicle is in maintenance
      if (item.maintenance === true) {
        //populate an array of 24 items with value -1 and return
        hourArray = Array(24).fill(-1);
        return { vehicle_name: item.vehicle_name, hours: hourArray };
      }

      //if times are not null
      if (item.yard_time && item.end_time) {
        //Get the starting and ending hour
        const startHour = new Date(item.yard_time).getHours();
        const endHour = new Date(item.end_time).getHours();

        //populate an hour array with 0 or 1
        timeArray.forEach((hour) => {
          hour >= startHour && hour <= endHour
            ? hourArray.push(1)
            : hourArray.push(0);
        });

        return { vehicle_name: item.vehicle_name, hours: hourArray };
      } else {
        //if yard time or end time is null
        hourArray = Array(24).fill(0);
        return { vehicle_name: item.vehicle_name, hours: hourArray };
      }
    });

    //if any bus is used more than once combine the results in a single line
    //create a unique object to combine items repeated
    const unique = {};
    hourlyData.forEach((item) => {
      const { vehicle_name, hours } = item;
      if (unique[vehicle_name]) {
        unique[vehicle_name] = unique[vehicle_name].map(
          (e, idx) => e + hours[idx]
        );
      } else {
        unique[vehicle_name] = hours;
      }
    });

    //convert the object back to an array
    hourlyData = Object.keys(unique).map((name) => ({
      vehicle_name: name,
      hours: unique[name],
    }));

    setTableData(hourlyData);
  }, [data, timeArray]);

  const selectColor = (num) => {
    if (num === 0) return "white";
    else if (num === 1) return "#80dfff";
    else if (num === 2) return "#4d4dff";
    else if (num === -1) return "#660000";
  };

  return (
    <Fragment>
      <Table size="small" sx={{ outlineWidth: "thin", outlineStyle: "inset" }}>
        <TableHead>
          <TableRow sx={{ backgroundColor: "primary.main" }}>
            <TableCell
              width="5px"
              style={{ color: "white", paddingRight: 6, paddingLeft: 6 }}
              align="center"
            >
              Bus
            </TableCell>
            {timeArray.map((e, index) => (
              <TableCell
                width="5px"
                style={{
                  color: "white",
                  paddingRight: 6,
                  borderRight: "1px solid rgba(224, 224, 224, 1)",
                }}
                key={e}
              >
                {e}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {tableData?.map((bus, index) => (
            <TableRow key={index}>
              <TableCell
                width="5px"
                style={{ paddingRight: 6, paddingLeft: 6 }}
                align="center"
              >
                {bus.vehicle_name}
              </TableCell>
              {bus.hours?.map((hour, i) => (
                <TableCell
                  key={i}
                  sx={{
                    backgroundColor: selectColor(hour),
                    borderRight: "1px solid rgba(224, 224, 224, 1)",
                  }}
                ></TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Fragment>
  );
};

export default BusesTable;
