import {
  Box,
  IconButton,
  Modal,
  TextField,
  Tooltip,
  Typography,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Button,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { useEffect, useState } from "react";

export const ServiceModal = (props) => {
  const { modalTitle, onError, onSuccess, open } = props;
  const [serviceName, setServiceName] = useState("");
  const [serviceCode, setServiceCode] = useState("");
  const [serviceDate, setServiceDate] = useState(null);
  const [qty, setQty] = useState(0);
  const [charge, setCharge] = useState(0.0);
  const [tips, setTips] = useState(0.0);
  const [salesTax, setSalesTax] = useState(0.0);
  const [optional, setOptional] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [invalidField, setInvalidField] = useState("");

  useEffect(() => {
    if (open) {
      clearState();
      setOpenModal(true);
    }
  }, [open]);

  const modalStile = {
    position: "absolute",
    borderRadius: "10px",
    display: "flex",
    flexDirection: "column",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 600,
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
  };

  //service codes
  const codes = [
    "OW",
    "RT",
    "CH",
    "N/A",
    "FEE",
    "EAT",
    "TIP",
    "OVT",
    "N/S",
    "ADA",
    "OTR",
    "DIS",
  ];

  //handle form submit
  const handleSaveNewService = async (bookingId) => {
    //validate form
    if (!isFormValid()) {
      return;
    }
    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVERURL}/createservice`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            service: {
              bookingId: bookingId,
              serviceName: serviceName,
              serviceCode: serviceCode,
              serviceDate: serviceDate,
              qty: qty,
              charge: charge,
              tips: tips,
              salesTax: salesTax,
              optional: optional,
            },
          }),
        }
      );

      const responseMsg = await response.json();
      console.log(responseMsg);
      //if an error happens set the error
      if (responseMsg.msg) {
        //open snackbar to display error message
        onError(responseMsg.msg);
      } else {
        //if no error set success and reset intial state
        onSuccess(responseMsg);
        clearState();
      }
    } catch (err) {
      console.error(err);
    }
  }; //handleSaveNewService

  //clear state fields utility
  const clearState = () => {
    setServiceName("");
    setServiceCode("");
    setServiceDate(null);
    setQty(0);
    setCharge(0.0);
    setTips(0.0);
    setSalesTax(0.0);
    setOptional(false);
    setOpenModal(false);
  };

  //validate the form fields
  const isFormValid = () => {
    if (!serviceName) {
      setInvalidField("serviceName");
      return;
    }

    if (!serviceCode) {
      setInvalidField("serviceCode");
      return;
    }

    if (!serviceDate) {
      setInvalidField("serviceDate");
      return;
    }

    if (!qty) {
      setInvalidField("qty");
      return;
    }

    setInvalidField("");
    return true;
  }; //isFormValid

  return (
    <Modal
      open={openModal}
      onClose={() => setOpenModal(false)}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <Box sx={modalStile}>
        <Tooltip title="Close" style={{ alignSelf: "flex-end" }}>
          <IconButton onClick={() => setOpenModal(false)}>
            <CloseIcon />
          </IconButton>
        </Tooltip>

        <Typography
          id="modal-title"
          variant="h6"
          component="h2"
          style={{ alignSelf: "center" }}
        >
          {modalTitle}
        </Typography>
        <Box sx={{ display: "flex" }}>
          <Box className="modal2Columns">
            <TextField
              id="serviceName"
              className="modalField"
              value={serviceName}
              label="Service"
              type="text"
              onChange={(e) => setServiceName(e.target.value)}
            />
            <Select
              id="serviceCode"
              className="modalField"
              value={serviceCode}
              onChange={(e) => setServiceCode(e.target.value)}
              label="Service Code"
            >
              {codes.map((code) => {
                return (
                  <MenuItem key={code} value={code}>
                    {code}
                  </MenuItem>
                );
              })}
            </Select>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Service Date"
                className="modalField"
                id="serviceDate"
                value={serviceDate}
                onChange={(newValue) => setServiceDate(newValue)}
              />
            </LocalizationProvider>
            <TextField
              id="qty"
              label="Qty"
              className="modalField"
              type="text"
              inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
              placeholder="Qty"
              value={qty}
              onChange={(e) => setQty(e.target.value)}
            />
          </Box>
          <Box className="modal2Columns">
            <TextField
              id="charge"
              className="modalField"
              label="Charge $"
              type="text"
              inputProps={{ inputMode: "decimal", step: "0.01" }}
              placeholder="Charge $"
              value={charge}
              onChange={(e) => setCharge(e.target.value)}
            />
            <TextField
              id="tips"
              className="modalField"
              label="Tips $"
              type="text"
              inputProps={{ inputMode: "decimal", step: "0.01" }}
              placeholder="Tips $"
              value={tips}
              onChange={(e) => setTips(e.target.value)}
            />
            <TextField
              id="salesTax"
              className="modalField"
              label="Sales Tax %"
              type="text"
              inputProps={{ inputMode: "decimal", step: "0.01" }}
              placeholder="Sales Tax %"
              value={salesTax}
              onChange={(e) => setSalesTax(e.target.value)}
            />
            <FormControlLabel
              style={{ alignSelf: "center" }}
              control={
                <Checkbox
                  checked={optional}
                  onChange={(e) => setOptional(e.target.checked)}
                />
              }
              label="Optional"
            />
          </Box>
        </Box>

        <p></p>
        <Button variant="contained" onClick={handleSaveNewService}>
          Save
        </Button>
      </Box>
    </Modal>
  );
};
