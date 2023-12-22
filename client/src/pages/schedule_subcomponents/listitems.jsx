import { Fragment } from "react";
import {
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
} from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import DirectionsBusIcon from "@mui/icons-material/DirectionsBus";
import PersonIcon from "@mui/icons-material/Person";
import ReceiptIcon from "@mui/icons-material/Receipt";
import DateRangeIcon from "@mui/icons-material/DateRange";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";

export const ScheduleListItems = (props) => {
  return (
    <Fragment>
      <ListItemButton>
        <ListItemIcon>
          <AccessTimeIcon />
        </ListItemIcon>
        <ListItemText primary="Schedule by Time" />
      </ListItemButton>
      <ListItemButton>
        <ListItemIcon>
          <DirectionsBusIcon />
        </ListItemIcon>
        <ListItemText primary="Schedule by Vehicle" />
      </ListItemButton>
      <ListItemButton>
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
      </ListItemButton>
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
    start: thisMonthStart.toISOString(),
    end: thisMonthEnd.toISOString(),
  };

  //get current week
  const firstDayOfWeek = today.getDate() - today.getDay();
  const lastDayOfWeek = today.getDate() + (6 - today.getDay());
  const thisWeekStart = new Date(thisYear, thisMonth, firstDayOfWeek);
  const thisWeekEnd = new Date(thisYear, thisMonth, lastDayOfWeek);
  const currentWeek = {
    start: thisWeekStart.toISOString(),
    end: thisWeekEnd.toISOString(),
  };

  //today's trips
  const todayDates = {
    start: today.toISOString(),
    end: today.toISOString(),
  };

  return (
    <Fragment>
      <ListItemButton
        onClick={(event) => onDatePick(curentMonth.start, curentMonth.end)}
      >
        <ListItemIcon>
          <CalendarMonthIcon />
        </ListItemIcon>
        <ListItemText primary="Current Month" />
      </ListItemButton>
      <ListItemButton
        onClick={(event) => onDatePick(currentWeek.start, currentWeek.end)}
      >
        <ListItemIcon>
          <DateRangeIcon />
        </ListItemIcon>
        <ListItemText primary="Current Week" />
      </ListItemButton>
      <ListItemButton
        onClick={(event) => onDatePick(todayDates.start, todayDates.end)}
      >
        <ListItemIcon>
          <CalendarTodayIcon />
        </ListItemIcon>
        <ListItemText primary="Today's Trips" />
      </ListItemButton>
    </Fragment>
  );
};
