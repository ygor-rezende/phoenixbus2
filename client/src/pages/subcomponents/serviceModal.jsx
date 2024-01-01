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
  FormControl,
  FormHelperText,
  InputLabel,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import CustomDialog from "../../utils/customDialog";

export const ServiceModal = (props) => {
  const {
    modalTitle,
    onError,
    onSuccess,
    open,
    invoice,
    data,
    onEditMode,
    onSave,
  } = props;
  const [serviceId, setServiceId] = useState(0);
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
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    if (open > 0) {
      clearState();
      //if on edit mode set the fields values
      if (onEditMode) {
        setServiceId(data[0].id);
        setServiceName(data[0].serviceName);
        setServiceCode(data[0].serviceCode);
        setServiceDate(dayjs(data[0].serviceDate));
        setQty(data[0].qty);
        setCharge(data[0].charge);
        setTips(data[0].tips);
        setSalesTax(data[0].salesTax);
        setOptional(data[0].optional);
      }
      setOpenModal(true);
    }
  }, [open, onEditMode, data]);

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
  const handleSaveNewService = async () => {
    //validate form
    if (!isFormValid()) {
      return;
    }

    if (!onEditMode) {
      //New service api call
      try {
        const response = await fetch(
          `${process.env.REACT_APP_SERVERURL}/createservice`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              service: {
                bookingId: invoice,
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
    } //if !onEditMode
    else {
      //update call
      try {
        const response = await fetch(
          `${process.env.REACT_APP_SERVERURL}/updateservice`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              service: {
                serviceId: serviceId,
                bookingId: invoice,
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

        if (!response.ok) {
          throw new Error(response.status);
        }

        const responseMsg = await response.json();
        console.log(responseMsg);
        //if an error happens set the error
        if (responseMsg.failed) {
          console.log(responseMsg.failed);
          //open snackbar to display error message
          onError(responseMsg.failed);
        } else {
          //if no error set success and reset intial state
          onSuccess(responseMsg);
          clearState();
        }
      } catch (err) {
        console.error(err);
      }
    } //else

    //call onSave to re-render the services table in the bookings component
    onSave(invoice);
  }; //handleSaveNewService

  const handleDeleteService = async () => {
    try {
      //Before deleting a service it must delete the details first
      //Get the details for the current service
      const details = await fetch(
        `${process.env.REACT_APP_SERVERURL}/getdetails/${serviceId}`
      );
      const detailsData = await details.json();

      //Get the ids
      const detailIdsToDelete = detailsData.map((detail) => {
        return detail.detail_id;
      });

      //delete details
      if (detailIdsToDelete.length > 0) {
        const response = await fetch(
          `${process.env.REACT_APP_SERVERURL}/deletesomedetails`,
          {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ detailIds: detailIdsToDelete }),
          }
        );
        if (!response.ok) {
          throw new Error(response.status);
        }
        const responseMsg = await response.json();
        console.log(responseMsg);
        if (responseMsg.failed) {
          console.log(responseMsg.failed);
          onError(responseMsg.failed);
          return;
        }
      }

      const response = await fetch(
        `${process.env.REACT_APP_SERVERURL}/deleteservice/${serviceId}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        }
      );
      if (!response.ok) {
        throw new Error(response.status);
      }
      const responseMsg = await response.json();
      console.log(responseMsg);
      if (responseMsg.failed) {
        console.log(responseMsg.failed);
        onError(responseMsg.failed);
      } else {
        //update state and reload the data
        onSuccess(responseMsg);
      }
      clearState();
      onSave(invoice);
    } catch (err) {
      console.error(err);
    }
  };

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
    setOpenDialog(false);
    setInvalidField("");
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

    if (qty < 1) {
      setInvalidField("qty");
      return;
    }

    setInvalidField("");
    return true;
  }; //isFormValid

  const handleCloseModal = () => {
    setInvalidField("");
    setOpenModal(false);
  };

  return (
    <Modal
      open={openModal}
      onClose={handleCloseModal}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <Box sx={modalStile}>
        <Tooltip title="Close" style={{ alignSelf: "flex-end" }}>
          <IconButton onClick={handleCloseModal}>
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
              error={invalidField === "serviceName"}
              helperText={
                invalidField === "serviceName" ? "Information required" : ""
              }
            />
            <FormControl
              error={invalidField === "serviceCode"}
              className="modalField"
            >
              <InputLabel>Pick a SVC</InputLabel>
              <Select
                id="serviceCode"
                value={serviceCode}
                onChange={(e) => setServiceCode(e.target.value)}
                label="Pick a SVC"
                placeholder="Pick a SVC"
              >
                {codes.map((code) => {
                  return (
                    <MenuItem key={code} value={code}>
                      {code}
                    </MenuItem>
                  );
                })}
              </Select>
              <FormHelperText>
                {invalidField === "serviceCode" ? "Information required" : ""}
              </FormHelperText>
            </FormControl>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <FormControl
                error={invalidField === "serviceDate"}
                className="modalField"
              >
                <DatePicker
                  label="Service Date"
                  id="serviceDate"
                  format="YYYY-MM-DD"
                  value={serviceDate}
                  onChange={(newValue) => setServiceDate(dayjs(newValue))}
                />

                <FormHelperText>
                  {invalidField === "serviceDate" ? "Information required" : ""}
                </FormHelperText>
              </FormControl>
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
              error={invalidField === "qty"}
              helperText={invalidField === "qty" ? "Information required" : ""}
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
        <Box sx={{ marginLeft: "auto", marginRight: "auto" }}>
          <Button variant="contained" onClick={handleSaveNewService}>
            Save
          </Button>
          {onEditMode && (
            <Button
              variant="contained"
              color="secondary"
              style={{ marginLeft: "10px" }}
              onClick={() => setOpenDialog(true)}
            >
              Delete
            </Button>
          )}
        </Box>
        <CustomDialog
          openDialog={openDialog}
          onCancel={() => setOpenDialog(false)}
          onDelete={handleDeleteService}
          title={"Confirm deleting service?"}
          description={
            "Are you sure you want to delete this service and all details associated with it?"
          }
        />
      </Box>
    </Modal>
  );
};
