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
  Tooltip,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import dayjs from "dayjs";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import PlaceIcon from "@mui/icons-material/Place";
import AccessAlarmIcon from "@mui/icons-material/AccessAlarm";
import { BusIcon } from "../../utils/busIcon";
import EditNoteIcon from "@mui/icons-material/EditNote";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

const BoldTableCell = (props) => {
  return (
    <TableCell {...props} style={{ fontWeight: "bold", color: "white" }}>
      {props.children}
    </TableCell>
  );
};

const SmallBoldCell = (props) => {
  return (
    <TableCell
      {...props}
      sx={{
        fontSize: "13px",
        fontWeight: "bold",
        color: "primary.main",
      }}
    >
      {props.children}
    </TableCell>
  );
};

export const ScheduleTable = (props) => {
  const { data, onDatePick, dateString, editData } = props;
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [extendLine, setExtendLine] = useState("");

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
        {`Schedule ${dateString}`}
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
          <TableRow sx={{ backgroundColor: "primary.main" }}>
            <BoldTableCell>Invoice</BoldTableCell>
            <BoldTableCell>Start/PickUp</BoldTableCell>
            <BoldTableCell>End/Drop Off</BoldTableCell>
            <BoldTableCell>Driver</BoldTableCell>
            <BoldTableCell>Vehicle</BoldTableCell>
            <BoldTableCell>Type</BoldTableCell>
            <BoldTableCell align="right">Charge</BoldTableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableHead>

        {data?.map((row, index) => {
          return (
            <TableBody>
              <TableRow
                key={index}
                sx={{
                  cursor: "pointer",
                  bgcolor: row?.use_farmout ? "aquamarine" : "whitesmoke",
                }}
              >
                <TableCell>{row?.invoice?.slice(0, 8)}</TableCell>
                <TableCell>
                  <Box>
                    <Typography
                      variant="body2"
                      bgcolor="white"
                      className="scheduleFromTo"
                      gutterBottom
                    >
                      <AccessAlarmIcon color="primary" />
                      {dayjs(row?.start_time).format("hh:mm a")}
                      {" | "}
                      {row?.service_date?.slice(0, 10)}
                    </Typography>
                    <Typography
                      variant="body2"
                      bgcolor="white"
                      className="scheduleFromTo"
                    >
                      <PlaceIcon color="primary" /> {row?.from_location} /{" "}
                      {row?.from_city}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box>
                    <Typography
                      variant="body2"
                      bgcolor="white"
                      className="scheduleFromTo"
                      gutterBottom
                    >
                      <AccessAlarmIcon color="success" />{" "}
                      {dayjs(row?.end_time).format("hh:mm a")}
                      {" | "}
                      {row?.service_date?.slice(0, 10)}
                    </Typography>
                    <Typography
                      variant="body2"
                      bgcolor="white"
                      className="scheduleFromTo"
                    >
                      <PlaceIcon color="success" /> {row?.to_location} /{" "}
                      {row?.to_city}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  {row?.use_farmout ? row?.company_name : `${row?.firstname}`}
                </TableCell>
                <TableCell>
                  <Box style={{ display: "flex", alignItems: "center" }}>
                    <BusIcon color={row?.vehicle_color} />
                    {row?.use_farmout ? "Farm-out" : row?.vehicle_name}
                  </Box>
                </TableCell>

                <TableCell>{row?.service_code}</TableCell>

                <TableCell align="right">${row?.charge}</TableCell>
                <TableCell padding="none">
                  <Tooltip title="Edit">
                    <IconButton onClick={(e) => handleClick(e, row?.detail_id)}>
                      <EditNoteIcon color="primary" />
                    </IconButton>
                  </Tooltip>
                </TableCell>
                <TableCell padding="none">
                  {extendLine === index ? (
                    <Tooltip title="Shrink">
                      <IconButton onClick={() => setExtendLine("")}>
                        <ExpandLessIcon color="primary" />
                      </IconButton>
                    </Tooltip>
                  ) : (
                    <Tooltip title="Expand">
                      <IconButton onClick={() => setExtendLine(index)}>
                        <ExpandMoreIcon color="primary" />
                      </IconButton>
                    </Tooltip>
                  )}
                </TableCell>
              </TableRow>

              {extendLine === index ? (
                <TableRow key={"r" + index}>
                  <TableCell colSpan="9">
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <SmallBoldCell>Driver</SmallBoldCell>
                          <SmallBoldCell>Instructions</SmallBoldCell>
                          <SmallBoldCell>Driver Payment</SmallBoldCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        <TableRow>
                          <SmallBoldCell
                            style={{ color: "black", fontWeight: "normal" }}
                          >
                            {row?.use_farmout
                              ? row?.company_name
                              : `${row?.firstname} ${row?.lastname}`}
                          </SmallBoldCell>
                          <SmallBoldCell
                            style={{ color: "black", fontWeight: "normal" }}
                          >
                            {row?.instructions}
                          </SmallBoldCell>
                          <SmallBoldCell
                            style={{ color: "black", fontWeight: "normal" }}
                          >
                            ${row?.payment}
                          </SmallBoldCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableCell>
                </TableRow>
              ) : null}
            </TableBody>
          );
        })}
      </Table>
    </Fragment>
  );
};
