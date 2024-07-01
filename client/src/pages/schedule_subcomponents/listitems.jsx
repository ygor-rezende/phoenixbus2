import { Fragment, forwardRef, useState } from "react";
import {
  Dialog,
  IconButton,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Slide,
  Tooltip,
  Box,
} from "@mui/material";
import DirectionsBusIcon from "@mui/icons-material/DirectionsBus";
import DateRangeIcon from "@mui/icons-material/DateRange";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import CloseIcon from "@mui/icons-material/Close";
import { pdf } from "@react-pdf/renderer";
import * as FileSaver from "file-saver";
import BusesReport from "../pdfReports/busReport";
import Calendar from "./calendar";
import NotesPane from "../notes_components/notesPane";
import MessageIcon from "@mui/icons-material/Message";

const Transition = forwardRef((props, ref) => {
  return <Slide direction="up" ref={ref} {...props} />;
});

export const ScheduleListItems = (props) => {
  const { data, startDate, endDate, auth } = props;

  const [openCalendarDialog, setOpenCalendarDialog] = useState(false);
  const [openNotes, setOpenNotes] = useState(false);

  const handlePrintBusList = () => {
    generateBusReport(
      `Buses_${
        startDate === endDate ? startDate : startDate.concat("_", endDate)
      }`
    );
  };

  const handleOpenCalendar = () => {
    setOpenCalendarDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenCalendarDialog(false);
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
      <Tooltip title="Monthly Calendar">
        <ListItemButton onClick={handleOpenCalendar}>
          <ListItemIcon>
            <CalendarMonthIcon color="primary" />
          </ListItemIcon>
          <ListItemText primary="Monthly Calendar" />
        </ListItemButton>
      </Tooltip>
      <Tooltip title="Print List of Buses">
        <ListItemButton onClick={handlePrintBusList}>
          <ListItemIcon>
            <DirectionsBusIcon />
          </ListItemIcon>
          <ListItemText primary="Print List of Buses" />
        </ListItemButton>
      </Tooltip>
      <Tooltip title="Notes">
        <ListItemButton onClick={() => setOpenNotes(true)}>
          <ListItemIcon>
            <MessageIcon color="secondary" />
          </ListItemIcon>
          <ListItemText primary="Notes" />
        </ListItemButton>
      </Tooltip>
      {/* <ListItemButton>
        <ListItemIcon>
          <ReceiptIcon />
        </ListItemIcon>
        <ListItemText primary="Schedule by Invoice" />
      </ListItemButton> */}

      <Dialog
        fullScreen
        open={openCalendarDialog}
        onClose={handleCloseDialog}
        TransitionComponent={Transition}
      >
        <IconButton
          onClick={handleCloseDialog}
          aria-label="close"
          style={{ alignSelf: "flex-end" }}
        >
          <CloseIcon />
        </IconButton>
        <Box sx={{ padding: "1em" }}>
          <Calendar />
        </Box>
      </Dialog>

      {/*Dialog to Notes*/}
      <Dialog open={openNotes} onClose={() => setOpenNotes(false)}>
        <NotesPane
          username={auth.userName}
          onClose={() => setOpenNotes(false)}
        />
      </Dialog>
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
