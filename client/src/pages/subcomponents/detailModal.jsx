import { useReducer } from "react";
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
  InputLabel,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import CustomDialog from "../../utils/customDialog";

const reducer = (prevState, upadatedProp) => ({
  ...prevState,
  ...upadatedProp,
});

const initialState = {
  detailId: 0,
  employeeId: "",
  driverName: null,
  vehicleId: "",
  vehicleName: null,
  fromServiceLocationId: "",
  from: null,
  toServiceLocationId: "",
  to: null,
  spotTime: null,
  startTime: null,
  endTime: null,
  baseTime: null,
  type: null,
  instructions: "",
  gratuity: 0.0,
  openModal: false,
  invalidField: "",
  openDialog: false,
};

export const DetailModal = (props) => {
  const {
    modalTitle,
    onError,
    onSuccess,
    open,
    serviceId,
    data,
    onEditMode,
    onSave,
  } = props;
  const [state, setState] = useReducer(reducer, initialState);

  useEffect(() => {
    if (open > 0) {
      clearState();
      //if on edit mode set the fields values
      if (onEditMode) {
        const getEmployeeById = async (employeeId) => {
          try {
            let response = await fetch(
              `${process.env.REACT_APP_SERVERURL}/getemployee/${employeeId}`
            );
            const employeeRespData = await response.json();
            return employeeRespData;
          } catch (err) {
            console.error(err);
          }
        };

        const getVehicleById = async (vehicleId) => {
          try {
            let response = await fetch(
              `${process.env.REACT_APP_SERVERURL}/getvehicle/${vehicleId}`
            );
            const vehicleRespData = await response.json();
            return vehicleRespData;
          } catch (err) {
            console.error(err);
          }
        };

        const employee = getEmployeeById(data[0].employeeId);
        const vehicle = getVehicleById(data[0].vehicleId);
        setState({
          detailId: data[0].id,
          employeeId: data[0].employeeId,
          driverName: `${employee.firstname} ${employee.lastname}`,
          vehicleId: data[0].vehicleId,
          vehicleName: vehicle.vehicle_name,
          fromServiceLocationId: "",
          from: null,
          toServiceLocationId: "",
          to: null,
          spotTime: null,
          startTime: null,
          endTime: null,
          baseTime: null,
          type: null,
          instructions: "",
        });
      }
      setState({ openModal: true });
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

  //service types
  const types = ["OW", "RT", "CH", "OT"];

  //handle form submit
  const handleSaveNewDetail = async () => {
    //validate form
    if (!isFormValid()) {
      return;
    }

    if (!onEditMode) {
      //New detail api call
      try {
        const response = await fetch(
          `${process.env.REACT_APP_SERVERURL}/createdetail`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              detail: {
                serviceId: serviceId,
                employeeId: state.employeeId,
                vehicleId: state.vehicleId,
                fromServiceLocationId: state.fromServiceLocationId,
                toServiceLocationId: state.toServiceLocationId,
                spotTime: state.spotTime,
                startTime: state.startTime,
                endTime: state.endTime,
                baseTime: state.baseTime,
                type: state.type,
                instructions: state.instructions,
                gratuity: state.gratuity,
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
          `${process.env.REACT_APP_SERVERURL}/updatedetail`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              detail: {
                serviceId: serviceId,
                employeeId: state.employeeId,
                vehicleId: state.vehicleId,
                fromServiceLocationId: state.fromServiceLocationId,
                toServiceLocationId: state.toServiceLocationId,
                spotTime: state.spotTime,
                startTime: state.startTime,
                endTime: state.endTime,
                baseTime: state.baseTime,
                type: state.type,
                instructions: state.instructions,
                gratuity: state.gratuity,
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

    //call onSave to re-render the details table in the bookings component
    onSave(serviceId);
  }; //handleSaveNewDetail

  const handleDeleteDetail = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVERURL}/deletedetail/${state.detailId}`,
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
      onSave(serviceId);
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
            <FormControl>
              <InputLabel>Pick a SVC</InputLabel>
              <Select
                id="serviceCode"
                className="modalField"
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
            </FormControl>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Service Date"
                className="modalField"
                id="serviceDate"
                format="YYYY-MM-DD"
                value={serviceDate}
                onChange={(newValue) => setServiceDate(dayjs(newValue))}
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
          description={"Are you sure you want to delete this service?"}
        />
      </Box>
    </Modal>
  );
};
