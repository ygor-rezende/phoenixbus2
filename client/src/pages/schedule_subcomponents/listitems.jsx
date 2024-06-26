import { Fragment } from "react";
import {
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Tooltip,
} from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import DirectionsBusIcon from "@mui/icons-material/DirectionsBus";
import PersonIcon from "@mui/icons-material/Person";
import ReceiptIcon from "@mui/icons-material/Receipt";
import DateRangeIcon from "@mui/icons-material/DateRange";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { BusIcon } from "../../utils/busIcon";
import { pdf } from "@react-pdf/renderer";
import * as FileSaver from "file-saver";
import BusesReport from "../pdfReports/busReport";

export const ScheduleListItems = (props) => {
  const { data, startDate, endDate } = props;

  const handlePrintBusList = () => {
    generateBusReport(
      `Buses_${
        startDate === endDate ? startDate : startDate.concat("_", endDate)
      }`
    );
  };

  const generateBusReport = async (filename) => {
    try {
      const blob = await pdf(
        <BusesReport data={data} startDate={startDate} endDate={endDate} />
      ).toBlob();
      FileSaver.saveAs(blob, filename);
      const pdfUrl = URL.createObjectURL(blob);
      window.open(pdfUrl, "_blank");
      URL.revokeObjectURL(pdfUrl);
    } catch (error) {
      console.error("Error creating pdf:", error);
    }
  };

  return (
    <Fragment>
      {/* <ListItemButton>
        <ListItemIcon>
          <AccessTimeIcon />
        </ListItemIcon>
        <ListItemText primary="Schedule by Time" />
      </ListItemButton> */}
      <ListItemButton onClick={handlePrintBusList}>
        <ListItemIcon>
          <DirectionsBusIcon />
        </ListItemIcon>
        <ListItemText primary="Print List of Buses" />
      </ListItemButton>
      {/* <ListItemButton>
        <ListItemIcon>
          <PersonIcon />
        </ListItemIcon>
        <ListItemText primary="Schedule by Client" />
      </ListItemButton>
      <ListItemButton>
        <ListItemIcon>
          <ReceiptIcon />
        </ListItemIcon>
        <ListItemText primary="Schedule by Invoice" />
      </ListItemButton> */}
    </Fragment>
  );
};

export const TimeListItems = (props) => {
  const { onDatePick } = props;

  const today = new Date();

  //get current month
  const thisMonth = today.getMonth();
  const thisYear = today.getFullYear();
  const thisMonthStart = new Date(thisYear, thisMonth, 1);
  const thisMonthEnd = new Date(thisYear, thisMonth + 1, 0);
  const curentMonth = {
    start: thisMonthStart.toLocaleDateString(),
    end: thisMonthEnd.toLocaleDateString(),
  };

  //get current week
  const firstDayOfWeek = today.getDate() - today.getDay();
  const lastDayOfWeek = today.getDate() + (6 - today.getDay());
  const thisWeekStart = new Date(thisYear, thisMonth, firstDayOfWeek);
  const thisWeekEnd = new Date(thisYear, thisMonth, lastDayOfWeek);
  const currentWeek = {
    start: thisWeekStart.toLocaleDateString(),
    end: thisWeekEnd.toLocaleDateString(),
  };

  //today's trips
  const todayDates = {
    start: today.toLocaleDateString(),
    end: today.toLocaleDateString(),
  };

  return (
    <Fragment>
      <Tooltip title="Current Month">
        <ListItemButton
          onClick={(event) => onDatePick(curentMonth.start, curentMonth.end)}
        >
          <ListItemIcon>
            <CalendarMonthIcon />
          </ListItemIcon>
          <ListItemText primary="Current Month" />
        </ListItemButton>
      </Tooltip>
      <Tooltip title="Current Week">
        <ListItemButton
          onClick={(event) => onDatePick(currentWeek.start, currentWeek.end)}
        >
          <ListItemIcon>
            <DateRangeIcon />
          </ListItemIcon>
          <ListItemText primary="Current Week" />
        </ListItemButton>
      </Tooltip>
      <Tooltip title="Today's Trips">
        <ListItemButton
          onClick={(event) => onDatePick(todayDates.start, todayDates.end)}
        >
          <ListItemIcon>
            <CalendarTodayIcon />
          </ListItemIcon>
          <ListItemText primary="Today's Trips" />
        </ListItemButton>
      </Tooltip>
    </Fragment>
  );
};
