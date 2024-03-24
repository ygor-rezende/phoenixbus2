import { Fragment, useEffect, useState } from "react";
import {
  Alert,
  AlertTitle,
  Box,
  Button,
  Snackbar,
  Stack,
  Typography,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { UsePrivateGet } from "../hooks/useFetchServer";
import { useLocation, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import PayrollReport from "./pdfReports/payrollReport";
import PayrollByDriver from "./pdfReports/payrollByDriver";
import { pdf } from "@react-pdf/renderer";
import * as FileSaver from "file-saver";

export const DriverPayroll = () => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [error, setError] = useState("");
  const [openSnakbar, setOpenSnakbar] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(true);

  const getServer = UsePrivateGet();
  const navigate = useNavigate();
  const location = useLocation();
  const { setAuth } = useAuth();

  useEffect(() => {
    if (dayjs(startDate).isValid() && dayjs(endDate).isValid())
      setButtonDisabled(false);
    else setButtonDisabled(true);
  }, [startDate, endDate]);

  //closes the snakbar
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnakbar(false);
  };

  const handleGetPayroll = async (byDriver) => {
    try {
      //set the start and end hours to 00:00 and 23:59
      let start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      let end = new Date(endDate);
      end.setHours(23, 59, 59, 59);

      //convert the time to iso string
      const dates = JSON.stringify({
        startDate: start.toISOString(),
        endDate: end.toISOString(),
      });

      //fetch data
      let response;
      if (byDriver) {
        response = await getServer(`/getpayrollbydriver/${dates}`);
      } else {
        response = await getServer(`/getdriverpayroll/${dates}`);
      }

      if (response.disconnect) {
        setAuth({});
        navigate("/login", { state: { from: location }, replace: true });
        //other errors
      } else if (response.error) {
        setError(response.error);
        setOpenSnakbar(true);
      }
      //no error
      else {
        const responseData = await response.data;
        generatePayroll(
          `Payroll_${byDriver ? "byDriver_" : ""}${
            startDate === endDate
              ? new Date(startDate).toLocaleDateString()
              : new Date(startDate)
                  .toLocaleDateString()
                  .concat("_", new Date(endDate).toLocaleDateString())
          }`,
          responseData,
          byDriver
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  //function to generate contract PDF
  const generatePayroll = async (filename, data, byDriver) => {
    try {
      let blob;
      if (byDriver)
        blob = await pdf(
          <PayrollByDriver
            data={data}
            startDate={new Date(startDate).toLocaleDateString()}
            endDate={new Date(endDate).toLocaleDateString()}
          />
        ).toBlob();
      else
        blob = await pdf(
          <PayrollReport
            data={data}
            startDate={new Date(startDate).toLocaleDateString()}
            endDate={new Date(endDate).toLocaleDateString()}
          />
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
      <Typography component="h2" variant="h6" color="primary" gutterBottom>
        Drivers' Payroll
      </Typography>
      <Box sx={{ display: "flex", justifyContent: "center", margin: "1em" }}>
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="en">
          <DatePicker
            label="Start Date"
            id="startDate"
            timezone="America/New_York"
            value={startDate}
            maxDate={endDate}
            slotProps={{
              field: {
                clearable: true,
              },
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
            slotProps={{
              field: {
                clearable: true,
              },
            }}
            onChange={(newValue) => setEndDate(dayjs(newValue))}
          />
        </LocalizationProvider>
      </Box>
      <Stack
        direction="row"
        spacing={2}
        marginBottom={2}
        justifyContent="center"
      >
        <Button
          onClick={() => handleGetPayroll(false)}
          disabled={buttonDisabled}
          variant="contained"
        >
          Payroll
        </Button>
        <Button
          onClick={() => handleGetPayroll(true)}
          disabled={buttonDisabled}
          variant="contained"
        >
          Payroll By Driver
        </Button>
      </Stack>

      <Snackbar
        open={openSnakbar}
        autoHideDuration={5000}
        onClose={handleClose}
      >
        <Alert severity="error" onClose={handleClose}>
          <AlertTitle>Error</AlertTitle>
          {error}
        </Alert>
      </Snackbar>
    </Fragment>
  );
};
