import { Fragment, useEffect, useMemo, useState } from "react";
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
  TextField,
  TableSortLabel,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import "dayjs/locale/en";

import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import PlaceIcon from "@mui/icons-material/Place";
import { BusIcon } from "../../utils/busIcon";
import EditNoteIcon from "@mui/icons-material/EditNote";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import VerifiedIcon from "@mui/icons-material/Verified";
import SearchOffIcon from "@mui/icons-material/SearchOff";

import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

import { visuallyHidden } from "@mui/utils";

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

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array?.map((el, index) => [el, index]);
  stabilizedThis?.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis?.map((el) => el[0]);
}

export const ScheduleTable = (props) => {
  const {
    data,
    onDatePick,
    dateString,
    editData,
    createDriverPDF,
    createFarmoutPDF,
    isLoading,
    dateStart,
    dateEnd,
  } = props;
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [extendLine, setExtendLine] = useState(new Map());
  const [expandAll, setExpandAll] = useState(false);
  const [filteredData, setFilteredData] = useState(data);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("start_time");

  useEffect(() => {
    setFilteredData(data);
    let indexes = new Map();
    data?.forEach((e, index) => {
      indexes.set(index, false);
    });
    setExtendLine(indexes);
  }, [data]);

  const visibleRows = useMemo(
    () => stableSort(filteredData, getComparator(order, orderBy)),
    [order, orderBy, filteredData]
  );

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

  const handleFarmoutPDF = (companyId) => {
    createFarmoutPDF(companyId);
  };

  const getBgColor = (rowData) => {
    if (rowData?.use_farmout) return "aquamarine";
    else if (rowData?.service_code === "DH") return "beige";
    else return "whitesmoke";
  };

  const filterData = (event, selectedOption) => {
    const query = event.target.value;

    let updatedList = [...data];

    if (selectedOption === "vehicle_name" || selectedOption === "firstname")
      updatedList = updatedList.filter((e) => e.use_farmout === false);

    updatedList = updatedList.filter((e) => {
      if (
        selectedOption === "spot_time" ||
        selectedOption === "start_time" ||
        selectedOption === "end_time"
      )
        return (
          dayjs(e[selectedOption])
            .format("MM/DD/YYYY HH:mm")
            .indexOf(query.toLowerCase()) !== -1
        );
      else if (selectedOption === "confirmed")
        return e[selectedOption].toString().indexOf(query.toLowerCase()) !== -1;
      else {
        if (e[selectedOption] !== null)
          return (
            e[selectedOption].toLowerCase().indexOf(query.toLowerCase()) !== -1
          );
        else return e[selectedOption];
      }
    });
    setFilteredData(updatedList);
  };

  const handleClearFilter = () => {
    document.getElementById("filterForm")?.reset();
    setFilteredData(data);
  };

  //trigger sort onClick on table header
  const createSortHandler = (column) => (event) => {
    const isAsc = orderBy === column && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(column);
  };

  //setExtendLine to true or false
  const handleExpandShrinkLine = (index) => {
    let lines = new Map(extendLine);
    lines.set(index, !lines.get(index));
    setExtendLine(lines);
  };

  const handleExpandAll = (value) => {
    let lines = new Map();
    extendLine?.forEach((v, k) => {
      lines.set(k, value);
    });
    setExtendLine(lines);
    setExpandAll(value);
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
        <form id="filterForm">
          <Table
            size="small"
            sx={{ outlineWidth: "thin", outlineStyle: "inset" }}
          >
            <TableHead>
              <TableRow sx={{ backgroundColor: "primary.main" }}>
                <TableCell
                  width="5px"
                  style={{ color: "white", paddingRight: 6 }}
                >
                  #
                </TableCell>
                <TableCell sortDirection={order} width="80px">
                  <TableSortLabel
                    active={orderBy === "invoice"}
                    direction={order}
                    onClick={createSortHandler("invoice")}
                    style={{ color: "white" }}
                  >
                    Invoice
                    {orderBy === "invoice" ? (
                      <Box component="span" sx={visuallyHidden}>
                        {order === "desc"
                          ? "sorted descending"
                          : "sorted ascending"}
                      </Box>
                    ) : null}
                  </TableSortLabel>
                  <TextField
                    id="invoiceText"
                    size="small"
                    variant="filled"
                    inputProps={{ className: "filterTextfield" }}
                    onChange={(e) => filterData(e, "invoice")}
                  />
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === "agency"}
                    direction={order}
                    onClick={createSortHandler("agency")}
                    style={{ color: "white" }}
                  >
                    Client
                    {orderBy === "agency" ? (
                      <Box component="span" sx={visuallyHidden}>
                        {order === "desc"
                          ? "sorted descending"
                          : "sorted ascending"}
                      </Box>
                    ) : null}
                  </TableSortLabel>
                  <TextField
                    size="small"
                    variant="filled"
                    inputProps={{ className: "filterTextfield" }}
                    onChange={(e) => filterData(e, "agency")}
                  />
                </TableCell>
                <TableCell width="10px">
                  <TableSortLabel
                    active={orderBy === "service_code"}
                    direction={order}
                    onClick={createSortHandler("service_code")}
                    style={{ color: "white" }}
                  >
                    Type
                    {orderBy === "service_code" ? (
                      <Box component="span" sx={visuallyHidden}>
                        {order === "desc"
                          ? "sorted descending"
                          : "sorted ascending"}
                      </Box>
                    ) : null}
                  </TableSortLabel>

                  <TextField
                    size="small"
                    variant="filled"
                    inputProps={{ className: "filterTextfield" }}
                    onChange={(e) => filterData(e, "service_code")}
                  />
                </TableCell>
                <TableCell width="10px">
                  <TableSortLabel
                    active={orderBy === "start_time"}
                    direction={order}
                    onClick={createSortHandler("start_time")}
                    style={{ color: "white" }}
                  >
                    Start
                    {orderBy === "start_time" ? (
                      <Box component="span" sx={visuallyHidden}>
                        {order === "desc"
                          ? "sorted descending"
                          : "sorted ascending"}
                      </Box>
                    ) : null}
                  </TableSortLabel>
                  <TextField
                    size="small"
                    variant="filled"
                    inputProps={{ className: "filterTextfield" }}
                    onChange={(e) => filterData(e, "start_time")}
                  />
                </TableCell>

                <TableCell>
                  <TableSortLabel
                    active={orderBy === "from_location"}
                    direction={order}
                    onClick={createSortHandler("from_location")}
                    style={{ color: "white" }}
                  >
                    Pick-Up
                    {orderBy === "from_location" ? (
                      <Box component="span" sx={visuallyHidden}>
                        {order === "desc"
                          ? "sorted descending"
                          : "sorted ascending"}
                      </Box>
                    ) : null}
                  </TableSortLabel>
                  <TextField
                    size="small"
                    variant="filled"
                    inputProps={{ className: "filterTextfield" }}
                    onChange={(e) => filterData(e, "from_location")}
                  />
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === "to_location"}
                    direction={order}
                    onClick={createSortHandler("to_location")}
                    style={{ color: "white" }}
                  >
                    Drop-Off
                    {orderBy === "to_location" ? (
                      <Box component="span" sx={visuallyHidden}>
                        {order === "desc"
                          ? "sorted descending"
                          : "sorted ascending"}
                      </Box>
                    ) : null}
                  </TableSortLabel>
                  <TextField
                    size="small"
                    variant="filled"
                    inputProps={{ className: "filterTextfield" }}
                    onChange={(e) => filterData(e, "to_location")}
                  />
                </TableCell>
                <TableCell width="10px">
                  <TableSortLabel
                    active={orderBy === "end_time"}
                    direction={order}
                    onClick={createSortHandler("end_time")}
                    style={{ color: "white" }}
                  >
                    Return
                    {orderBy === "end_time" ? (
                      <Box component="span" sx={visuallyHidden}>
                        {order === "desc"
                          ? "sorted descending"
                          : "sorted ascending"}
                      </Box>
                    ) : null}
                  </TableSortLabel>
                  <TextField
                    size="small"
                    variant="filled"
                    inputProps={{ className: "filterTextfield" }}
                    onChange={(e) => filterData(e, "end_time")}
                  />
                </TableCell>
                <TableCell width="11px">
                  <TableSortLabel
                    active={orderBy === "vehicle_name"}
                    direction={order}
                    onClick={createSortHandler("vehicle_name")}
                    style={{ color: "white" }}
                  >
                    Bus#
                    {orderBy === "vehicle_name" ? (
                      <Box component="span" sx={visuallyHidden}>
                        {order === "desc"
                          ? "sorted descending"
                          : "sorted ascending"}
                      </Box>
                    ) : null}
                  </TableSortLabel>
                  <TextField
                    size="small"
                    variant="filled"
                    inputProps={{ className: "filterTextfield" }}
                    onChange={(e) => filterData(e, "vehicle_name")}
                  />
                </TableCell>
                <TableCell width="100px">
                  <TableSortLabel
                    active={orderBy === "firstname"}
                    direction={order}
                    onClick={createSortHandler("firstname")}
                    style={{ color: "white" }}
                  >
                    Driver
                    {orderBy === "firstname" ? (
                      <Box component="span" sx={visuallyHidden}>
                        {order === "desc"
                          ? "sorted descending"
                          : "sorted ascending"}
                      </Box>
                    ) : null}
                  </TableSortLabel>
                  <TextField
                    size="small"
                    variant="filled"
                    inputProps={{ className: "filterTextfield" }}
                    onChange={(e) => filterData(e, "firstname")}
                  />
                </TableCell>
                <TableCell width="80px">
                  <TableSortLabel
                    active={orderBy === "special_events"}
                    direction={order}
                    onClick={createSortHandler("special_events")}
                    style={{ color: "white" }}
                  >
                    Request
                    {orderBy === "special_events" ? (
                      <Box component="span" sx={visuallyHidden}>
                        {order === "desc"
                          ? "sorted descending"
                          : "sorted ascending"}
                      </Box>
                    ) : null}
                  </TableSortLabel>
                  <TextField
                    size="small"
                    variant="filled"
                    inputProps={{ className: "filterTextfield" }}
                    onChange={(e) => filterData(e, "special_events")}
                  />
                </TableCell>
                <TableCell align="center" width="10px">
                  <TableSortLabel
                    active={orderBy === "confirmed"}
                    direction={order}
                    onClick={createSortHandler("confirmed")}
                    style={{ color: "white" }}
                  >
                    Conf?
                    {orderBy === "confirmed" ? (
                      <Box component="span" sx={visuallyHidden}>
                        {order === "desc"
                          ? "sorted descending"
                          : "sorted ascending"}
                      </Box>
                    ) : null}
                  </TableSortLabel>
                  <TextField
                    size="small"
                    variant="filled"
                    inputProps={{ className: "filterTextfield" }}
                    onChange={(e) => filterData(e, "confirmed")}
                  />
                </TableCell>
                <TableCell padding="none">
                  <Tooltip title="Clear Search">
                    <IconButton size="small" onClick={handleClearFilter}>
                      <SearchOffIcon sx={{ color: "white" }} />
                    </IconButton>
                  </Tooltip>
                </TableCell>
                <TableCell></TableCell>
                <TableCell padding="none">
                  <Tooltip title={expandAll ? "Shrink All" : "Expand All"}>
                    <IconButton
                      size="small"
                      onClick={() => handleExpandAll(!expandAll)}
                    >
                      {expandAll ? (
                        <ExpandLessIcon sx={{ color: "white" }} />
                      ) : (
                        <ExpandMoreIcon sx={{ color: "white" }} />
                      )}
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            </TableHead>

            {visibleRows?.map((row, index) => {
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
                    <TableCell style={{ paddingRight: 6 }}>
                      {index + 1}
                    </TableCell>
                    <TableCell>{row?.invoice}</TableCell>
                    <TableCell>{row?.agency}</TableCell>
                    <TableCell>{row?.service_code}</TableCell>

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
                              : dayjs(row?.start_time).format(
                                  "MM/DD/YYYY HH:mm"
                                )
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
                                : dayjs(row?.end_time).format(
                                    "MM/DD/YYYY HH:mm"
                                  )
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
                      {row?.use_farmout
                        ? row?.company_name
                        : `${row?.firstname}`}
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
                          onClick={
                            row?.use_farmout
                              ? (e) => handleFarmoutPDF(row?.company_id)
                              : (e) => handleDriverPDF(row?.detail_id)
                          }
                          size="small"
                        >
                          <PictureAsPdfIcon color="primary" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                    <TableCell padding="none" align="right">
                      {extendLine.get(index) === true ? (
                        <Tooltip title="Shrink">
                          <IconButton
                            onClick={() => handleExpandShrinkLine(index)}
                            size="small"
                          >
                            <ExpandLessIcon color="primary" />
                          </IconButton>
                        </Tooltip>
                      ) : (
                        <Tooltip title="Expand">
                          <IconButton
                            onClick={() => handleExpandShrinkLine(index)}
                            size="small"
                          >
                            <ExpandMoreIcon color="primary" />
                          </IconButton>
                        </Tooltip>
                      )}
                    </TableCell>
                  </TableRow>

                  {extendLine.get(index) === true ? (
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

                              {row?.client_comments && (
                                <SmallBoldCell>PO/REF #</SmallBoldCell>
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
                                  style={{
                                    color: "black",
                                    fontWeight: "normal",
                                  }}
                                >
                                  {row?.additional_stop_info} /{" "}
                                  {row?.additional_stop_detail} {"trip(s)"}
                                </SmallBoldCell>
                              )}
                              {row?.service_code === "CH" && (
                                <SmallBoldCell
                                  style={{
                                    color: "black",
                                    fontWeight: "normal",
                                  }}
                                >
                                  {row?.trip_length}
                                </SmallBoldCell>
                              )}
                              {row?.client_comments && (
                                <SmallBoldCell
                                  style={{
                                    color: "black",
                                    fontWeight: "normal",
                                  }}
                                >
                                  {row?.client_comments}
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
        </form>
      )}
    </Fragment>
  );
};
