import { useReducer } from "react";
import {
  Box,
  Autocomplete,
  IconButton,
  Modal,
  TextField,
  Tooltip,
  Typography,
  Select,
  MenuItem,
  Button,
  FormControl,
  InputLabel,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { LocalizationProvider, TimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { useEffect } from "react";
import CustomDialog from "../../utils/customDialog";

const reducer = (prevState, upadatedProp) => ({
  ...prevState,
  ...upadatedProp,
});

const initialState = {
  detailId: 0,
  employeeId: "",
  driverName: null,
  employees: [],
  vehicleId: "",
  vehicleName: null,
  vehicles: [],
  fromServiceLocationId: "",
  from: null,
  toServiceLocationId: "",
  to: null,
  serviceLocations: [],
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
          openModal: true,
        });
      } else {
        //get all employees (firstname and lastname) to load the autocomplete
        (async function getAllEmployees() {
          try {
            let response = await fetch(
              `${process.env.REACT_APP_SERVERURL}/getallemployeenames`
            );
            const respData = await response.json();
            setState({
              employees: respData,
            });
          } catch (err) {
            console.error(err);
          }
        })();

        //get all vehicle names to load the autocomplete
        (async function getAllVehicles() {
          try {
            let response = await fetch(
              `${process.env.REACT_APP_SERVERURL}/getallvehiclenames`
            );
            const respData = await response.json();
            setState({
              vehicles: respData,
            });
          } catch (err) {
            console.error(err);
          }
        })();

        //get all location names to load the autocomplete
        (async function getAllLocations() {
          try {
            let response = await fetch(
              `${process.env.REACT_APP_SERVERURL}/getalllocationnames`
            );
            const respData = await response.json();
            setState({
              serviceLocations: respData,
            });
          } catch (err) {
            console.error(err);
          }
        })();

        setState({
          openModal: true,
        });
      }
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
    //TO DO: onSave(serviceId);
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

  //handle changes on Driver autocomplete
  const handleDriverChange = (e, newValue) => {
    if (newValue) {
      setState({
        employeeId: newValue.employeeId,
        driverName: newValue.driverName,
      });
    }
  };

  //handle changes on Driver autocomplete
  const handleVehicleChange = (e, newValue) => {
    if (newValue) {
      setState({
        vehicleId: newValue.vehicleId,
        vehicleName: newValue.vehicleName,
      });
    }
  };

  //handle changes on From Location autocomplete
  const handleFromLocationChange = (e, newValue) => {
    if (newValue) {
      setState({
        fromServiceLocationId: newValue.locationId,
        from: newValue.locationName,
      });
    }
  };

  //handle changes on To Location autocomplete
  const handleToLocationChange = (e, newValue) => {
    if (newValue) {
      setState({
        toServiceLocationId: newValue.locationId,
        to: newValue.locationName,
      });
    }
  };

  //clear state fields utility
  const clearState = () => {
    setState({
      detailId: 0,
      employeeId: "",
      driverName: null,
      employees: [],
      vehicleId: "",
      vehicleName: null,
      vehicles: [],
      fromServiceLocationId: "",
      from: null,
      toServiceLocationId: "",
      to: null,
      serviceLocations: [],
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
    });
  };

  //validate the form fields
  const isFormValid = () => {
    if (!state.driverName) {
      setState({ invalidField: "driverName" });
      return;
    }

    if (!state.vehicleName) {
      setState({ invalidField: "vehicleName" });
      return;
    }

    if (!state.from) {
      setState({ invalidField: "from" });
      return;
    }

    if (!state.to) {
      setState({ invalidField: "to" });
      return;
    }

    setState({ invalidField: "" });
    return true;
  }; //isFormValid

  return (
    <Modal
      open={state.openModal}
      onClose={() => setState({ openModal: false })}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <Box sx={modalStile}>
        <Tooltip title="Close" style={{ alignSelf: "flex-end" }}>
          <IconButton onClick={() => setState({ openModal: false })}>
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
            <div
              id="driver-box"
              className="modalField"
              style={{ display: "inline-block" }}
            >
              <Autocomplete
                id="driver"
                required
                className="autocomplete"
                value={state.driverName}
                onChange={handleDriverChange}
                isOptionEqualToValue={(option, value) =>
                  option.driverName === value
                }
                options={state.employees.map((element) => {
                  const employee = {
                    employeeId: element.employee_id,
                    driverName: `${element.firstname} ${element.lastname}`,
                  };
                  return employee;
                })}
                sx={{ width: 200 }}
                getOptionLabel={(option) => option.driverName ?? option}
                renderInput={(params) => (
                  <TextField
                    required
                    {...params}
                    label="Driver"
                    error={state.invalidField === "driverName"}
                    helperText={
                      state.invalidField === "driverName"
                        ? "Information required"
                        : ""
                    }
                  />
                )}
              />
            </div>
            <div
              id="vehicle-box"
              className="modalField"
              style={{ display: "inline-block" }}
            >
              <Autocomplete
                id="vehicle"
                className="autocomplete"
                required
                value={state.vehicleName}
                onChange={handleVehicleChange}
                isOptionEqualToValue={(option, value) =>
                  option.vehicleName === value
                }
                options={state.vehicles.map((element) => {
                  const vehicle = {
                    vehicleId: element.vehicle_id,
                    vehicleName: element.vehicle_name,
                  };
                  return vehicle;
                })}
                sx={{ width: 200 }}
                getOptionLabel={(option) => option.vehicleName ?? option}
                renderInput={(params) => (
                  <TextField
                    required
                    {...params}
                    label="Vehicle"
                    error={state.invalidField === "vehicleName"}
                    helperText={
                      state.invalidField === "vehicleName"
                        ? "Information required"
                        : ""
                    }
                  />
                )}
              />
            </div>
            <div
              id="from-box"
              className="modalField"
              style={{ display: "inline-block" }}
            >
              <Autocomplete
                id="from"
                required
                className="autocomplete"
                value={state.from}
                onChange={handleFromLocationChange}
                isOptionEqualToValue={(option, value) =>
                  option.locationName === value
                }
                options={state.serviceLocations.map((element) => {
                  const location = {
                    locationId: element.location_id,
                    locationName: element.location_name,
                  };
                  return location;
                })}
                sx={{ width: 200 }}
                getOptionLabel={(option) => option.locationName ?? option}
                renderInput={(params) => (
                  <TextField
                    required
                    {...params}
                    label="From location"
                    error={state.invalidField === "from"}
                    helperText={
                      state.invalidField === "from"
                        ? "Information required"
                        : ""
                    }
                  />
                )}
              />
            </div>

            <div
              id="from-box"
              className="modalField"
              style={{ display: "inline-block" }}
            >
              <Autocomplete
                id="to"
                required
                className="autocomplete"
                value={state.to}
                onChange={handleToLocationChange}
                isOptionEqualToValue={(option, value) => option.from === value}
                options={state.serviceLocations.map((element) => {
                  const location = {
                    locationId: element.location_id,
                    locationName: element.location_name,
                  };
                  return location;
                })}
                sx={{ width: 200 }}
                getOptionLabel={(option) => option.locationName ?? option}
                renderInput={(params) => (
                  <TextField
                    required
                    {...params}
                    label="To location"
                    error={state.invalidField === "to"}
                    helperText={
                      state.invalidField === "to" ? "Information required" : ""
                    }
                  />
                )}
              />
            </div>
            <FormControl>
              <InputLabel>Pick a Type</InputLabel>
              <Select
                id="type"
                className="modalField"
                value={state.type}
                onChange={(e) => setState({ type: e.target.value })}
                label="Pick a Type"
                placeholder="Pick a Type"
              >
                {types.map((code) => {
                  return (
                    <MenuItem key={code} value={code}>
                      {code}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <TimePicker
                label="Spot time"
                className="modalField"
                id="spotTime"
                value={state.spotTime}
                onChange={(newValue) => setState({ spotTime: dayjs(newValue) })}
              />
            </LocalizationProvider>
          </Box>
          <Box className="modal2Columns">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <TimePicker
                label="Start time"
                className="modalField"
                id="startTime"
                value={state.startTime}
                onChange={(newValue) =>
                  setState({ startTime: dayjs(newValue) })
                }
              />
              <TimePicker
                label="End time"
                className="modalField"
                id="endTime"
                value={state.endTime}
                onChange={(newValue) => setState({ endTime: dayjs(newValue) })}
              />
              <TimePicker
                label="Base time"
                className="modalField"
                id="baseTime"
                value={state.baseTime}
                onChange={(newValue) => setState({ baseTime: dayjs(newValue) })}
              />
            </LocalizationProvider>
            <TextField
              id="gratuity"
              className="modalField"
              label="Gratuity $"
              type="text"
              inputProps={{ inputMode: "decimal", step: "0.01" }}
              placeholder="CharGratuityge $"
              value={state.gratuity}
              onChange={(e) => setState({ gratuity: e.target.value })}
            />
            <TextField
              id="instructions"
              className="modalField"
              label="Instructions"
              type="text"
              multiline
              rows={4}
              placeholder="Instructions"
              value={state.instructions}
              onChange={(e) => setState({ instructions: e.target.value })}
            />
          </Box>
        </Box>
        <Box sx={{ marginLeft: "auto", marginRight: "auto" }}>
          <Button variant="contained" onClick={handleSaveNewDetail}>
            Save
          </Button>
          {onEditMode && (
            <Button
              variant="contained"
              color="secondary"
              style={{ marginLeft: "10px" }}
              onClick={() => setState({ openDialog: true })}
            >
              Delete
            </Button>
          )}
        </Box>
        <CustomDialog
          openDialog={state.openDialog}
          onCancel={() => setState({ openDialog: false })}
          onDelete={handleDeleteDetail}
          title={"Confirm deleting detail?"}
          description={"Are you sure you want to delete this detail?"}
        />
      </Box>
    </Modal>
  );
};
