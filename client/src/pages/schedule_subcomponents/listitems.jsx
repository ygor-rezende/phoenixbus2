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

export const scheduleListItems = (
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

export const timeListItems = (
  <Fragment>
    <ListItemButton>
      <ListItemIcon>
        <CalendarMonthIcon />
      </ListItemIcon>
      <ListItemText primary="Current Month" />
    </ListItemButton>
    <ListItemButton>
      <ListItemIcon>
        <DateRangeIcon />
      </ListItemIcon>
      <ListItemText primary="Current Week" />
    </ListItemButton>
    <ListItemButton>
      <ListItemIcon>
        <CalendarTodayIcon />
      </ListItemIcon>
      <ListItemText primary="Today's Trips" />
    </ListItemButton>
  </Fragment>
);
