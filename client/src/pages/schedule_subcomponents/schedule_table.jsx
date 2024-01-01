import { Fragment, useState } from "react";
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

export const ScheduleTable = (props) => {
  const { data, onDatePick, dateString } = props;
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
          <TableRow>
            <TableCell>Invoice</TableCell>
            <TableCell>Spot Time</TableCell>
            <TableCell>Service Time</TableCell>
            <TableCell>End Time</TableCell>
            <TableCell>Driver</TableCell>
            <TableCell>Vehicle</TableCell>
            <TableCell align="right">Payment</TableCell>
            <TableCell>Type</TableCell>
            <TableCell>From</TableCell>
            <TableCell>City From</TableCell>
            <TableCell>To</TableCell>
            <TableCell>City To</TableCell>
            <TableCell>Instruction</TableCell>
            <TableCell align="right">Charge</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data?.map((row, index) => {
            return (
              <TableRow key={index}>
                <TableCell>{row?.invoice.slice(0, 8)}</TableCell>
                <TableCell>{dayjs(row?.spot_time).format("HH:MM a")}</TableCell>
                <TableCell>
                  {dayjs(row?.start_time).format("HH:MM a")}
                </TableCell>
                <TableCell>{dayjs(row?.end_time).format("HH:MM a")}</TableCell>
                <TableCell>{`${row?.firstname} ${row?.lastname}`}</TableCell>
                <TableCell>{row?.vehicle_name}</TableCell>
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
