import { useReducer, useEffect } from "react";
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
import CustomDialog from "../../utils/customDialog";

import {
  UsePrivateGet,
  UsePrivatePost,
  UsePrivateDelete,
  UsePrivatePut,
} from "../../hooks/useFetchServer";

import { useNavigate, useLocation } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const reducer = (prevState, upadatedProp) => ({
  ...prevState,
  ...upadatedProp,
});

const initialState = {
  detailId: 0,
  employeeId: "",
  driverName: null,
  employees: [],
  curEmployee: null,
  vehicleId: "",
  vehicleName: null,
  vehicles: [],
  curVehicle: null,
  fromServiceLocationId: "",
  from: null,
  curFromLocation: null,
  toServiceLocationId: "",
  to: null,
  curToLocation: null,
  serviceLocations: [],
  spotTime: null,
  startTime: null,
  endTime: null,
  baseTime: null,
  releasedTime: null,
  type: "",
  instructions: "",
  payment: 0.0,
  perdiem: 0.0,
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
    invoice,
    data,
    onEditMode,
    onSave,
  } = props;
  const [state, setState] = useReducer(reducer, initialState);

  const { setAuth } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const getServer = UsePrivateGet();
  const postServer = UsePrivatePost();
  const putServer = UsePrivatePut();
  const deleteServer = UsePrivateDelete();

  useEffect(() => {
    if (open > 0) {
      clearState();

      //get all employees (firstname and lastname) to load the autocomplete
      (async function getAllEmployees() {
        const response = await getServer("/getallemployeenames");

        if (response.disconnect) {
          setAuth({});
          setState({ openModal: false });
          navigate("/login", { state: { from: location }, replace: true });
          return;
          //other errors
        } else if (response.error) {
          onError(response.error);
          setState({ openModal: false });
          return;
        }
        //no error
        else {
          setState({
            employees: response?.data,
          });
        }
      })();

      //get all vehicle names to load the autocomplete
      (async function getAllVehicles() {
        const response = await getServer("/getallvehiclenames");
        setState({
          vehicles: response?.data,
        });
      })();

      //get all location names to load the autocomplete
      (async function getAllLocations() {
        const response = await getServer("/getalllocationnames");
        setState({
          serviceLocations: response?.data,
        });
      })();

      //if on edit mode set the fields values
      if (onEditMode) {
        (async function getEmployeeById(employeeId) {
          const response = await getServer(`/getemployee/${employeeId}`);
          const employee = response?.data?.at(0);
          setState({
            curEmployee: employee,
            driverName: `${employee?.firstname} ${employee?.lastname}`,
          });
        })(data.employee_id);

        (async function getVehicleById(vehicleId) {
          const response = await getServer(`/getvehicle/${vehicleId}`);
          const vehicle = response?.data?.at(0);
          setState({
            curVehicle: vehicle,
            vehicleName: vehicle?.vehicle_name,
          });
        })(data.vehicle_id);

        (async function getLocationById(fromLocationId, toLocationId) {
          let response = await getServer(`/getlocation/${fromLocationId}`);
          const fromLocation = response?.data?.at(0);

          response = await getServer(`/getlocation/${toLocationId}`);
          const toLocation = response?.data?.at(0);

          setState({
            curFromLocation: fromLocation,
            curToLocation: toLocation,
            from: fromLocation?.location_name,
            to: toLocation?.location_name,
          });
        })(data.from_location_id, data.to_location_id);

        setState({
          detailId: data.detail_id,
          employeeId: data.employee_id,
          vehicleId: data.vehicle_id,
          fromServiceLocationId: data.from_location_id,
          toServiceLocationId: data.to_location_id,
          spotTime: dayjs(data.spot_time),
          startTime: dayjs(data.start_time),
          endTime: dayjs(data.end_time),
          baseTime: dayjs(data.base_time),
          releasedTime: dayjs(data.released_time),
          type: data.service_type,
          instructions: data.instructions,
          payment: data.payment,
          perdiem: data.perdiem,
          gratuity: data.gratuity,
          openModal: true,
        });
      } else {
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

      const response = await postServer("/createdetail", {
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
          releasedTime: state.releasedTime,
          type: state.type,
          instructions: state.instructions,
          payment: state.payment,
          perdiem: state.perdiem,
          gratuity: state.gratuity,
        },
      });

      if (response?.data) {
        onSuccess(response.data);
        clearState();
      } else if (response?.disconnect) {
        setAuth({});
        navigate("/login", { state: { from: location }, replace: true });
      } else if (response?.error) {
        onError(response.error);
      }
    } //if !onEditMode
    else {
      //update call
      const response = await putServer("/updatedetail", {
        detail: {
          detailId: state.detailId,
          serviceId: serviceId,
          employeeId: state.employeeId,
          vehicleId: state.vehicleId,
          fromServiceLocationId: state.fromServiceLocationId,
          toServiceLocationId: state.toServiceLocationId,
          spotTime: state.spotTime,
          startTime: state.startTime,
          endTime: state.endTime,
          baseTime: state.baseTime,
          releasedTime: state.releasedTime,
          type: state.type,
          instructions: state.instructions,
          payment: state.payment,
          perdiem: state.perdiem,
          gratuity: state.gratuity,
        },
      });

      if (response?.data) {
        onSuccess(response.data);
        clearState();
      } else if (response?.disconnect) {
        setAuth({});
        navigate("/login", { state: { from: location }, replace: true });
      } else if (response?.error) {
        onError(response.error);
      }
    } //else

    //call onSave to re-render the details table in the bookings component
    onSave(invoice);
  }; //handleSaveNewDetail

  const handleDeleteDetail = async () => {
    const response = await deleteServer(`/deletedetail/${state.detailId}`);

    if (response?.data) {
      onSuccess(response.data);
    } else if (response?.disconnect) {
      setAuth({});
      navigate("/login", { state: { from: location }, replace: true });
    } else if (response?.error) {
      onError(response.error);
    }

    clearState();
    onSave(invoice);
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
      releasedTime: null,
      type: "",
      instructions: "",
      payment: 0.0,
      perdiem: 0.0,
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
                options={state.vehicles?.map((element) => {
                  const vehicle = {
                    vehicleId: element?.vehicle_id,
                    vehicleName: element?.vehicle_name,
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
              id="to-box"
              className="modalField"
              style={{ display: "inline-block" }}
            >
              <Autocomplete
                id="to"
                required
                className="autocomplete"
                value={state.to}
                onChange={handleToLocationChange}
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
              <TimePicker
                label="Start time"
                className="modalField"
                id="startTime"
                value={state.startTime}
                onChange={(newValue) =>
                  setState({ startTime: dayjs(newValue) })
                }
              />
            </LocalizationProvider>
          </Box>
          <Box className="modal2Columns">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
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
              <TimePicker
                label="Released time"
                className="modalField"
                id="releasedTime"
                value={state.releasedTime}
                onChange={(newValue) =>
                  setState({ releasedTime: dayjs(newValue) })
                }
              />
            </LocalizationProvider>
            <TextField
              id="payment"
              className="modalField"
              label="Payment $"
              type="text"
              inputProps={{ inputMode: "decimal", step: "0.01" }}
              placeholder="Payment $"
              value={state.payment}
              onChange={(e) => setState({ payment: e.target.value })}
            />
            <TextField
              id="gratuity"
              className="modalField"
              label="Gratuity $"
              type="text"
              inputProps={{ inputMode: "decimal", step: "0.01" }}
              placeholder="Gratuity $"
              value={state.gratuity}
              onChange={(e) => setState({ gratuity: e.target.value })}
            />
            <TextField
              id="perdiem"
              className="modalField"
              label="Perdiem $"
              type="text"
              inputProps={{ inputMode: "decimal", step: "0.01" }}
              placeholder="Perdiem $"
              value={state.perdiem}
              onChange={(e) => setState({ perdiem: e.target.value })}
            />
            <TextField
              id="instructions"
              className="modalField"
              label="Instructions"
              type="text"
              multiline
              rows={3}
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
