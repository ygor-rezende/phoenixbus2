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
  CircularProgress,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import "dayjs/locale/en";

import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import PlaceIcon from "@mui/icons-material/Place";
import AccessAlarmIcon from "@mui/icons-material/AccessAlarm";
import { BusIcon } from "../../utils/busIcon";
import EditNoteIcon from "@mui/icons-material/EditNote";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import VerifiedIcon from "@mui/icons-material/Verified";

import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

dayjs.extend(utc);
dayjs.extend(timezone);

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
  const {
    data,
    onDatePick,
    dateString,
    editData,
    createDriverPDF,
    isLoading,
    dateStart,
    dateEnd,
  } = props;
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
          dayjs(startDate).toDate().toLocaleDateString(),
          dayjs(endDate).toDate().toLocaleDateString()
        );
      }
    }
  };

  const handlePreviousDate = () => {
    let currentDate = dayjs(dateStart)
      .subtract(1, "day")
      .toDate()
      .toLocaleDateString();
    onDatePick(currentDate, currentDate);
  };

  const handleNextDate = () => {
    let currentDate = dayjs(dateEnd)
      .add(1, "day")
      .toDate()
      .toLocaleDateString();
    onDatePick(currentDate, currentDate);
  };

  //Calls the parent function to show the data for editing
  //when the user clicks a row
  const handleClick = (event, detailId) => {
    editData(detailId);
  };

  const handleDriverPDF = (detailId) => {
    createDriverPDF(detailId);
  };

  const getBgColor = (rowData) => {
    if (rowData?.use_farmout) return "aquamarine";
    else if (rowData?.service_code === "DH") return "beige";
    else return "whitesmoke";
  };

  return (
    <Fragment>
      <Box
        sx={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Tooltip title="Previous Day">
          <IconButton onClick={handlePreviousDate}>
            <ArrowBackIosIcon color="primary" />
          </IconButton>
        </Tooltip>
        <Typography component="h2" variant="h6" color="primary" gutterBottom>
          {dateString}
        </Typography>
        <Tooltip title="Next Day">
          <IconButton onClick={handleNextDate}>
            <ArrowForwardIosIcon color="primary" />
          </IconButton>
        </Tooltip>
      </Box>

      <Divider />
      <Box sx={{ display: "flex", justifyContent: "center", margin: "1em" }}>
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="en">
          <DatePicker
            label="Start Date"
            id="startDate"
            timezone="America/New_York"
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
            id="endDate"
            timezone="America/New_York"
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
      {isLoading ? (
        <Box sx={{ justifyContent: "center", marginTop: "1em" }}>
          <CircularProgress variant="indeterminate" />
        </Box>
      ) : (
        <Table
          size="small"
          sx={{ outlineWidth: "thin", outlineStyle: "inset" }}
        >
          <TableHead>
            <TableRow sx={{ backgroundColor: "primary.main" }}>
              <BoldTableCell>Invoice</BoldTableCell>
              <BoldTableCell>Client</BoldTableCell>
              <BoldTableCell>Type</BoldTableCell>
              <BoldTableCell>Yard</BoldTableCell>
              <BoldTableCell>Start</BoldTableCell>

              <BoldTableCell>Pick-Up</BoldTableCell>
              <BoldTableCell>Drop-Off</BoldTableCell>
              <BoldTableCell>Return</BoldTableCell>
              <BoldTableCell>Bus #</BoldTableCell>
              <BoldTableCell>Driver</BoldTableCell>
              <BoldTableCell>Request</BoldTableCell>
              <BoldTableCell align="center">Confirmed?</BoldTableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>

          {data?.map((row, index) => {
            return (
              <TableBody key={row.detail_id}>
                <TableRow
                  key={index}
                  sx={{
                    bgcolor: getBgColor(row),
                    outlineWidth: "thin",
                    outlineStyle: "inset",
                    outlineColor: "gray",
                  }}
                >
                  <TableCell>{row?.invoice}</TableCell>
                  <TableCell>{row?.agency}</TableCell>
                  <TableCell>{row?.service_code}</TableCell>
                  <TableCell>
                    <Typography
                      variant="body2"
                      bgcolor="white"
                      className="scheduleFromTo"
                      gutterBottom
                    >
                      {row?.spot_time
                        ? dateStart === dateEnd
                          ? dayjs(row?.spot_time).format("HH:mm")
                          : dayjs(row?.spot_time).format("MM/DD/YYYY HH:mm")
                        : ""}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography
                        variant="body2"
                        bgcolor="white"
                        className="scheduleFromTo"
                        gutterBottom
                      >
                        {row?.start_time
                          ? dateStart === dateEnd
                            ? dayjs(row?.start_time).format("HH:mm")
                            : dayjs(row?.start_time).format("MM/DD/YYYY HH:mm")
                          : ""}
                      </Typography>

                      {row?.service_code === "RT" && (
                        <Box>
                          <Typography
                            variant="body2"
                            bgcolor="white"
                            className="scheduleFromTo"
                            gutterBottom
                          >
                            {row?.return_time
                              ? dateStart === dateEnd
                                ? dayjs(row?.return_time).format("HH:mm")
                                : dayjs(row?.return_time).format(
                                    "MM/DD/YYYY HH:mm"
                                  )
                              : ""}
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  </TableCell>

                  <TableCell>
                    <Typography
                      variant="body2"
                      bgcolor="white"
                      className="scheduleFromTo"
                      gutterBottom
                    >
                      <PlaceIcon color="success" /> {row?.from_location} /{" "}
                      {row?.from_city}
                    </Typography>
                    {row?.service_code === "RT" && (
                      <Typography
                        variant="body2"
                        bgcolor="white"
                        className="scheduleFromTo"
                      >
                        <PlaceIcon color="success" /> {row?.to_location} /{" "}
                        {row?.to_city}
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="body2"
                      bgcolor="white"
                      className="scheduleFromTo"
                      gutterBottom
                    >
                      <PlaceIcon color="error" /> {row?.to_location} /{" "}
                      {row?.to_city}
                    </Typography>
                    {row?.service_code === "RT" && (
                      <Typography
                        variant="body2"
                        bgcolor="white"
                        className="scheduleFromTo"
                      >
                        <PlaceIcon color="error" /> {row?.return_location} /{" "}
                        {row?.return_city}
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    <Box>
                      {row?.service_code !== "RT" ? (
                        <Typography
                          variant="body2"
                          bgcolor="white"
                          className="scheduleFromTo"
                          gutterBottom
                        >
                          {row?.end_time
                            ? dateStart === dateEnd
                              ? dayjs(row?.end_time).format("HH:mm")
                              : dayjs(row?.end_time).format("MM/DD/YYYY HH:mm")
                            : ""}
                        </Typography>
                      ) : (
                        ""
                      )}

                      {row?.service_code === "RT" && (
                        <Box>
                          <Typography
                            variant="body2"
                            bgcolor="white"
                            className="scheduleFromTo"
                            gutterBottom
                          >
                            {row?.end_time
                              ? dateStart === dateEnd
                                ? dayjs(row?.end_time).format("HH:mm")
                                : dayjs(row?.end_time).format(
                                    "MM/DD/YYYY HH:mm"
                                  )
                              : ""}
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box style={{ display: "flex", alignItems: "center" }}>
                      <BusIcon color={row?.vehicle_color} />
                      {row?.use_farmout ? "Farm-out" : row?.vehicle_name}
                    </Box>
                  </TableCell>
                  <TableCell>
                    {row?.use_farmout ? row?.company_name : `${row?.firstname}`}
                  </TableCell>
                  <TableCell align="left">{row?.special_events}</TableCell>
                  <TableCell align="center">
                    {row?.confirmed ? <VerifiedIcon color="success" /> : ""}
                  </TableCell>

                  <TableCell padding="none" align="right">
                    <Tooltip title="Edit">
                      <IconButton
                        onClick={(e) => handleClick(e, row?.detail_id)}
                        size="small"
                      >
                        <EditNoteIcon color="primary" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                  <TableCell padding="none" align="right">
                    <Tooltip title="Print Driver PDF">
                      <IconButton
                        onClick={(e) => handleDriverPDF(row?.detail_id)}
                        size="small"
                      >
                        <PictureAsPdfIcon color="primary" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                  <TableCell padding="none" align="right">
                    {extendLine === index ? (
                      <Tooltip title="Shrink">
                        <IconButton
                          onClick={() => setExtendLine("")}
                          size="small"
                        >
                          <ExpandLessIcon color="primary" />
                        </IconButton>
                      </Tooltip>
                    ) : (
                      <Tooltip title="Expand">
                        <IconButton
                          onClick={() => setExtendLine(index)}
                          size="small"
                        >
                          <ExpandMoreIcon color="primary" />
                        </IconButton>
                      </Tooltip>
                    )}
                  </TableCell>
                </TableRow>

                {extendLine === index ? (
                  <TableRow key={"r" + index}>
                    <TableCell colSpan="13">
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <SmallBoldCell>Charge</SmallBoldCell>
                            <SmallBoldCell>Driver</SmallBoldCell>
                            <SmallBoldCell>Instructions</SmallBoldCell>
                            <SmallBoldCell>Driver Payment</SmallBoldCell>

                            {row?.additional_stop && (
                              <SmallBoldCell>Additional Stop</SmallBoldCell>
                            )}
                            {row?.service_code === "CH" && (
                              <SmallBoldCell>Trip Length (Hr)</SmallBoldCell>
                            )}
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          <TableRow>
                            <SmallBoldCell
                              style={{ color: "black", fontWeight: "normal" }}
                            >
                              ${row?.charge}
                            </SmallBoldCell>
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
                            {row?.additional_stop && (
                              <SmallBoldCell
                                style={{ color: "black", fontWeight: "normal" }}
                              >
                                {row?.additional_stop_info} /{" "}
                                {row?.additional_stop_detail} {"trip(s)"}
                              </SmallBoldCell>
                            )}
                            {row?.service_code === "CH" && (
                              <SmallBoldCell
                                style={{ color: "black", fontWeight: "normal" }}
                              >
                                {row?.trip_length}
                              </SmallBoldCell>
                            )}
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
      )}
    </Fragment>
  );
};
