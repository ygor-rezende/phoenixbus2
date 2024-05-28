import { useState, useRef, useEffect, Fragment } from "react";
import {
  Alert,
  AlertTitle,
  TextField,
  Button,
  Autocomplete,
  Snackbar,
  Box,
  Paper,
  Typography,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Stack,
  Table,
  TableRow,
  TableCell,
  TableHead,
} from "@mui/material";

import { UsePrivateGet, UsePrivatePost } from "../hooks/useFetchServer";

import { useNavigate, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import dayjs from "dayjs";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { pdf } from "@react-pdf/renderer";
import * as FileSaver from "file-saver";
import PendingFarmoutPayReport from "./pdfReports/pendingFarmoutPay";

const FarmoutPayment = () => {
  const [data, setData] = useState([]);
  const [payments, setPayments] = useState([]);
  const [companyPayments, setCompanyPayments] = useState([]);
  const [company, setCompany] = useState(null);
  const [amount, setAmount] = useState(0.0);
  const [accountId, setAccountId] = useState(0);
  const [balance, setBalance] = useState(0.0);
  const [date, setDate] = useState(dayjs(new Date()));
  const [payType, setPayType] = useState("transfer");
  const [docNum, setDocNum] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");
  const [openSnakbar, setOpenSnakbar] = useState(false);
  const [isDataUpdated, setIsdataUpdated] = useState(false);

  const effectRun = useRef(false);
  const { setAuth } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const getServer = UsePrivateGet();
  const postServer = UsePrivatePost();

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const getData = async () => {
      const transactionsResp = await getServer(
        "/getFarmoutTransactions",
        controller.signal
      );
      const response = await getServer(
        "/getFarmoutAccounts",
        controller.signal
      );
      if (response.disconnect) {
        setAuth({});
        navigate("/login", { state: { from: location }, replace: true });
        //other errors
      } else if (response.error) {
        setSuccess(false);
        setError(response.error);
        setOpenSnakbar(true);
      }
      //no error
      else {
        let responseData = response?.data;

        //get payments information
        let payments = transactionsResp?.data;

        if (isMounted) {
          setData(responseData);
          setPayments(payments);
        }
      }
    };

    if (process.env.NODE_ENV === "development") {
      effectRun.current && getData();
    } else {
      getData();
    }

    return () => {
      isMounted = false;
      controller.abort();
      effectRun.current = true;
    };
  }, [isDataUpdated]);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnakbar(false);
  };

  const handleSubmit = async () => {
    const response = await postServer("/processFarmoutPayment", {
      payment: {
        accountId: accountId,
        amount: amount,
        transactionDate: date,
        paymentType: payType,
        docNumber: docNum,
      },
    });

    if (response?.data) {
      clearState(response.data);
    } else if (response?.disconnect) {
      setAuth({});
      navigate("/login", { state: { from: location }, replace: true });
    } else if (response?.error) {
      setSuccess(false);
      setError(response.error);
      setOpenSnakbar(true);
    }
  }; //handleSubmit

  const handleGetPendingPayments = async () => {
    try {
      //fetch data
      const response = await getServer(`/getPendingFarmoutPayments`);
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
        generateReport(
          `Pending-Farmout-Payments_${new Date().toLocaleDateString()}`,
          responseData
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  //function to generate Sales report PDF
  const generateReport = async (filename, data) => {
    try {
      const blob = await pdf(
        <PendingFarmoutPayReport
          data={data}
          date={new Date().toLocaleDateString()}
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

  const clearState = (msg) => {
    setMsg(msg);
    setError("");
    setSuccess(true);
    setOpenSnakbar(true);
    setCompany(null);
    setAmount(0.0);
    setAccountId(0);
    setBalance(0.0);
    setDate(dayjs(new Date()));
    setPayType("");
    setDocNum("");
    setIsdataUpdated(!isDataUpdated);
  };

  const handleCompanyChange = (e, newValue, reason) => {
    if (newValue) {
      let companyPayments = payments?.filter(
        (e) => e.account_id === newValue.accountId
      );
      setAccountId(newValue.accountId);
      setCompany(newValue.companyName);
      setBalance(newValue.balance);
      setCompanyPayments(companyPayments);
    } else {
      setAccountId(0);
      setCompany(null);
      setBalance(0);
    }
  };
  const isDisabled = !company || !amount || !accountId || !date || !payType;

  const currencyFormatter = Intl.NumberFormat("en-Us", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  });

  return (
    <Fragment>
      <Box className="payments-box">
        <Paper elevation={2} style={{ padding: "2em" }}>
          <Typography variant="h5" component="h2" color="primary" gutterBottom>
            Farm-Out Payment
          </Typography>
          <Paper elevation={2} className="invoice-box">
            <Autocomplete
              id="company"
              value={company}
              style={{ width: "40%" }}
              onChange={handleCompanyChange}
              options={data?.map((e) => {
                const company = {
                  accountId: e.account_id,
                  balance: e.balance,
                  companyId: e.company_id,
                  companyName: e.company_name,
                };
                return company;
              })}
              isOptionEqualToValue={(option, value) =>
                option.companyName === value
              }
              getOptionLabel={(option) => option.companyName ?? option}
              renderInput={(params) => (
                <TextField {...params} label="Company" />
              )}
            />
            <TextField
              className="texfield"
              id="balance"
              label="Current Balance $"
              type="text"
              disabled
              inputProps={{ inputMode: "decimal", step: "0.01" }}
              placeholder="Current Balance $"
              value={currencyFormatter.format(balance)}
              onChange={(e) => setAmount(e.target.value)}
            />
          </Paper>
          <Box
            sx={{
              display: "inline-flex",
              justifyContent: "space-around",
              width: "90%",
              marginBottom: "1em",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "baseline",
              }}
            >
              <TextField
                className="payments-fields"
                id="amount"
                label="Amount $"
                type="text"
                inputProps={{ inputMode: "decimal", step: "0.01" }}
                placeholder="Amount $"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                size="small"
              />
              <LocalizationProvider
                dateAdapter={AdapterDayjs}
                adapterLocale="en"
              >
                <DatePicker
                  id="date"
                  label="Date"
                  className="payments-fields"
                  timezone="America/New_York"
                  value={dayjs(date)}
                  onChange={(newValue) => setDate(newValue)}
                  slotProps={{
                    textField: { size: "small" },
                  }}
                />
              </LocalizationProvider>
              <TextField
                className="payments-fields"
                id="docnum"
                label="Document #"
                type="text"
                placeholder="Check/Card/Transfer #"
                value={docNum}
                onChange={(e) => setDocNum(e.target.value)}
                size="small"
              />
            </Box>
            <FormControl>
              <FormLabel sx={{ color: "secondary.main" }}>
                Payment Type
              </FormLabel>
              <RadioGroup
                value={payType}
                defaultValue="transfer"
                onChange={(e) => setPayType(e.target.value)}
              >
                <FormControlLabel
                  value="transfer"
                  label="Transfer"
                  control={<Radio />}
                />
                <FormControlLabel
                  value="check"
                  label="Check"
                  control={<Radio />}
                />
                <FormControlLabel
                  value="credit"
                  label="Credit Card"
                  control={<Radio />}
                />
              </RadioGroup>
            </FormControl>
          </Box>
          <p></p>
          <Button
            variant="contained"
            disabled={isDisabled}
            onClick={handleSubmit}
          >
            Submit
          </Button>
        </Paper>
      </Box>

      {companyPayments?.length > 0 && (
        <Box id="history-box" className="payments-box">
          <Paper elevation={2} style={{ padding: "2em" }}>
            <Typography
              variant="h5"
              component="h2"
              color="primary"
              gutterBottom
            >
              Payments' History
            </Typography>
            <Table size="small">
              <TableHead sx={{ bgcolor: "primary.main" }}>
                <TableCell style={{ fontWeight: "bold", color: "whitesmoke" }}>
                  Document #
                </TableCell>
                <TableCell style={{ fontWeight: "bold", color: "whitesmoke" }}>
                  Payment Type
                </TableCell>
                <TableCell style={{ fontWeight: "bold", color: "whitesmoke" }}>
                  Date
                </TableCell>
                <TableCell
                  style={{ fontWeight: "bold", color: "whitesmoke" }}
                  align="right"
                >
                  Amount
                </TableCell>
              </TableHead>
              {companyPayments?.map((row) => (
                <TableRow>
                  <TableCell>{row.doc_number}</TableCell>
                  <TableCell style={{ textTransform: "capitalize" }}>
                    {row.payment_type}
                  </TableCell>
                  <TableCell>
                    {dayjs(row.transaction_date).format("l")}
                  </TableCell>
                  <TableCell align="right">
                    {currencyFormatter.format(row.amount)}
                  </TableCell>
                </TableRow>
              ))}
            </Table>
          </Paper>
        </Box>
      )}

      <Box id="reports-box" className="payments-box">
        <Paper elevation={2} style={{ padding: "2em" }}>
          <Typography variant="h5" component="h2" color="primary" gutterBottom>
            Reports
          </Typography>
          <Stack>
            <Button
              variant="outlined"
              size="small"
              style={{ margin: "auto" }}
              onClick={handleGetPendingPayments}
            >
              Pending Farmout Payments
            </Button>
          </Stack>
        </Paper>
      </Box>
      <Snackbar
        open={error.length > 0 && openSnakbar}
        autoHideDuration={5000}
        onClose={handleClose}
      >
        <Alert severity="error" onClose={handleClose}>
          <AlertTitle>Error</AlertTitle>
          {error}
        </Alert>
      </Snackbar>

      <Snackbar
        open={success && openSnakbar}
        autoHideDuration={5000}
        onClose={handleClose}
      >
        <Alert severity="success" onClose={handleClose}>
          <AlertTitle>Success</AlertTitle>
          {msg}
        </Alert>
      </Snackbar>
    </Fragment>
  );
};

export default FarmoutPayment;
