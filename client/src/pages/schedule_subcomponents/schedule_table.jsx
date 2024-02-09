import { Children, Fragment, useState } from "react";
import {
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  Divider,
  Box,
  IconButton,
  Avatar,
  TableBody,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import dayjs from "dayjs";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

const BoldTableCell = (props) => {
  return (
    <TableCell {...props} style={{ fontWeight: "bold" }}>
      {props.children}
    </TableCell>
  );
};

export const ScheduleTable = (props) => {
  const { data, onDatePick, dateString, editData } = props;
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const handleSearch = () => {
    if (startDate && endDate) {
      if (
        startDate.$d.toString() !== "Invalid Date" &&
        endDate.$d.toString() !== "Invalid Date"
      ) {
        onDatePick(
          dayjs(startDate).toISOString(),
          dayjs(endDate).toISOString()
        );
      }
    }
  };

  //Calls the parent function to show the data for editing
  //when the user clicks a row
  const handleClick = (event, detailId) => {
    editData(detailId);
  };

  return (
    <Fragment>
      <Typography component="h2" variant="h6" color="primary" gutterBottom>
        {`Schedule for ${dateString}`}
      </Typography>
      <Divider />
      <Box sx={{ display: "flex", justifyContent: "center", margin: "1em" }}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="Start Date"
            format="YYYY-MM-DD"
            id="startDate"
            value={startDate}
            minDate={dayjs(endDate).subtract(30, "day")}
            maxDate={endDate}
            slotProps={{
              textField: {
                helperText: "Maximum timeframe: 30 days",
              },
              field: { clearable: true },
            }}
            onChange={(newValue) => setStartDate(dayjs(newValue))}
          />
          <DatePicker
            label="End Date"
            sx={{ ml: "1em" }}
            format="YYYY-MM-DD"
            id="endDate"
            value={endDate}
            minDate={startDate}
            maxDate={dayjs(startDate).add(30, "day")}
            slotProps={{
              textField: {
                helperText: "Maximum timeframe: 30 days",
              },
              field: { clearable: true },
            }}
            onChange={(newValue) => setEndDate(dayjs(newValue))}
          />
        </LocalizationProvider>
        <IconButton sx={{ ml: "1em" }} onClick={handleSearch}>
          <Avatar sx={{ bgcolor: "primary.main" }}>
            <SearchIcon />
          </Avatar>
        </IconButton>
      </Box>
      <Divider />
      <Table size="small">
        <TableHead>
          <TableRow style={{ backgroundColor: "lightGrey" }}>
            <BoldTableCell>Invoice</BoldTableCell>
            <BoldTableCell>Spot Time</BoldTableCell>
            <BoldTableCell>Service Time</BoldTableCell>
            <BoldTableCell>End Time</BoldTableCell>
            <BoldTableCell>Driver</BoldTableCell>
            <BoldTableCell>Vehicle</BoldTableCell>
            <BoldTableCell align="right">Payment</BoldTableCell>
            <BoldTableCell>Type</BoldTableCell>
            <BoldTableCell>From</BoldTableCell>
            <BoldTableCell>City From</BoldTableCell>
            <BoldTableCell>To</BoldTableCell>
            <BoldTableCell>City To</BoldTableCell>
            <BoldTableCell>Instructions</BoldTableCell>
            <BoldTableCell align="right">Charge</BoldTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data?.map((row, index) => {
            return (
              <TableRow
                key={index}
                hover
                onClick={(e) => handleClick(e, row.detail_id)}
                sx={{
                  cursor: "pointer",
                  bgcolor: row?.use_farmout ? "aquamarine" : "whitesmoke",
                }}
              >
                <TableCell>{row?.invoice.slice(0, 8)}</TableCell>
                <TableCell>{dayjs(row?.spot_time).format("HH:mm a")}</TableCell>
                <TableCell>
                  {dayjs(row?.start_time).format("HH:mm a")}
                </TableCell>
                <TableCell>{dayjs(row?.end_time).format("HH:mm a")}</TableCell>
                <TableCell>
                  {row?.use_farmout
                    ? row?.company_name
                    : `${row?.firstname} ${row?.lastname}`}
                </TableCell>
                <TableCell>
                  {row?.use_farmout ? "Farm-out" : row?.vehicle_name}
                </TableCell>
                <TableCell align="right">{row?.payment}</TableCell>
                <TableCell>{row?.service_type}</TableCell>
                <TableCell>{row?.from_location}</TableCell>
                <TableCell>{row?.from_city}</TableCell>
                <TableCell>{row?.to_location}</TableCell>
                <TableCell>{row?.to_city}</TableCell>
                <TableCell>{row?.instructions}</TableCell>
                <TableCell align="right">{row?.charge}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </Fragment>
  );
};
