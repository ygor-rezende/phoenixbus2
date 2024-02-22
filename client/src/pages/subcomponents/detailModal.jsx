import { useReducer, useEffect } from "react";
import {
  Box,
  Autocomplete,
  IconButton,
  Modal,
  TextField,
  Tooltip,
  Typography,
  Button,
  FormControlLabel,
  Switch,
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
  employeeId: null,
  driverName: null,
  drivers: [],
  curEmployee: null,
  vehicleId: null,
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
  instructions: "",
  payment: 0.0,
  gratuity: 0.0,
  useFarmout: false,
  companies: [],
  companyId: null,
  company: null,
  openModal: false,
  invalidField: "",
  openDialog: false,
  openValidationDialog: false,
  validationDialogType: "",
  vehicleValidationData: [],
};

export const DetailModal = (props) => {
  const {
    modalTitle,
    onError,
    onSuccess,
    open,
    serviceId,
    serviceData,
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

      //get all drivers to load the autocomplete
      (async function getAllDrivers() {
        const response = await getServer("/getdrivers");

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
          const curDriver =
            response?.data?.find(
              (driver) => driver.employee_id === data?.employee_id
            ) ?? null;

          setState({
            drivers: response?.data,
            driverName: curDriver?.fullname,
          });
        }
      })();

      //get all vehicle names to load the autocomplete
      (async function getAllVehicles() {
        const response = await getServer("/getallvehiclenames");
        const curVehicle =
          response?.data?.find(
            (vehicle) => vehicle.vehicle_id === data?.vehicle_id
          ) ?? null;
        setState({
          vehicles: response?.data,
          vehicleName: curVehicle?.vehicle_name,
        });
      })();

      //get all location names to load the autocomplete
      (async function getAllLocations() {
        const response = await getServer("/getalllocationnames");

        const fromLocation =
          response?.data?.find(
            (location) => location.location_id === data?.from_location_id
          ) ?? null;
        const toLocation =
          response?.data?.find(
            (location) => location.location_id === data?.to_location_id
          ) ?? null;
        setState({
          serviceLocations: response?.data,
          from: fromLocation?.location_name,
          to: toLocation?.location_name,
        });
      })();

      //get all company names to load the autocomplete
      (async function getAllCompanies() {
        const response = await getServer("/getallcompanynames");
        const curCompany =
          response?.data?.find(
            (company) => company.company_id === data?.company_id
          ) ?? null;
        setState({
          companies: response?.data,
          companyId: curCompany?.company_id,
          company: curCompany?.company_name,
        });
      })();

      //if on edit mode set the fields values
      if (onEditMode) {
        setState({
          detailId: data.detail_id,
          employeeId: data.employee_id,
          vehicleId: data.vehicle_id,
          fromServiceLocationId: data.from_location_id,
          toServiceLocationId: data.to_location_id,
          spotTime: dayjs(data.spot_time),
          startTime: dayjs(data.start_time),
          endTime: dayjs(data.end_time),
          instructions: data.instructions,
          payment: data.payment,
          gratuity: data.gratuity,
          useFarmout: data.use_farmout,
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

  const validateSave = async () => {
    //validate form
    if (!isFormValid()) {
      return;
    }

    //find the service date
    const serviceDate = serviceData?.find(
      (service) => service.id === serviceId
    )?.serviceDate;

    //check if driver has another booking for the same day
    const driverResponse = await getServer(
      `/checkdriverhastrip/${state.detailId}/${state.employeeId}/${serviceDate}`
    );

    //check if vehicle has another booking for the same day
    const vehicleResponse = await getServer(
      `/checkvehiclehastrip/${state.detailId}/${state.vehicleId}/${serviceDate}`
    );

    //if server responded
    if (driverResponse?.data && vehicleResponse?.data) {
      if (driverResponse?.data?.length > 0) {
        //Display alert saying driver is booked to another trip in the same day
        setState({
          vehicleValidationData: vehicleResponse?.data,
          openValidationDialog: true,
          validationDialogType: "driver",
        });
        return;
      } else if (vehicleResponse?.data?.length > 0) {
        //Display alert saying driver is booked to another trip in the same day
        setState({
          openValidationDialog: true,
          validationDialogType: "vehicle",
        });
        return;
      } else {
        handleSaveNewDetail();
      }
    } else if (driverResponse?.disconnect || vehicleResponse?.disconnect) {
      setAuth({});
      navigate("/login", { state: { from: location }, replace: true });
    } else if (driverResponse?.error || vehicleResponse?.error) {
      setState({
        error: driverResponse?.error ?? vehicleResponse?.error,
        success: false,
        openSnakbar: true,
      });
    }
  }; //validateSave

  const validateVehicle = async () => {
    if (state.vehicleValidationData?.length > 0) {
      //Display alert saying driver is booked to another trip in the same day
      setState({ openValidationDialog: true, validationDialogType: "vehicle" });
      return;
    } else {
      handleSaveNewDetail();
    }
  };

  //handle form submit
  const handleSaveNewDetail = async () => {
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
          instructions: state.instructions,
          payment: state.payment,
          gratuity: state.gratuity,
          useFarmout: state.useFarmout,
          companyId: state.companyId,
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
          instructions: state.instructions,
          payment: state.payment,
          gratuity: state.gratuity,
          useFarmout: state.useFarmout,
          companyId: state.companyId,
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

  const handleConfirmDialog = async () => {
    if (state.validationDialogType === "driver") validateVehicle();
    else handleSaveNewDetail();
  };

  const handleCancelDialog = () => {
    setState({ openValidationDialog: false });
  };

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

  const handleCheckFarmout = (e) => {
    const isChecked = e.target.checked;
    if (isChecked)
      setState({
        driverName: null,
        vehicleId: null,
        vehicleName: null,
        employeeId: null,
        useFarmout: isChecked,
      });
    else setState({ company: null, companyId: null, useFarmout: isChecked });
  };

  //handle changes on company autocomplete
  const handleCompanyChange = (e, newValue) => {
    if (newValue) {
      setState({
        companyId: newValue.companyId,
        company: newValue.company,
      });
    }
  };

  //clear state fields utility
  const clearState = () => {
    setState({
      detailId: 0,
      employeeId: null,
      driverName: null,
      companyId: null,
      company: null,
      drivers: [],
      vehicleId: null,
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
      instructions: "",
      payment: 0.0,
      gratuity: 0.0,
      useFarmout: false,
      openModal: false,
      invalidField: "",
      openDialog: false,
      openValidationDialog: false,
      validationDialogType: "",
      vehicleValidationData: [],
    });
  };

  //validate the form fields
  const isFormValid = () => {
    if (!state.from) {
      setState({ invalidField: "from" });
      return;
    }

    if (!state.to) {
      setState({ invalidField: "to" });
      return;
    }

    if (!state.driverName && !state.useFarmout) {
      setState({ invalidField: "driverName" });
      return;
    }

    if (!state.vehicleName && !state.useFarmout) {
      setState({ invalidField: "vehicleName" });
      return;
    }

    if (!state.company && state.useFarmout) {
      setState({ invalidField: "company" });
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

        <FormControlLabel
          style={{ alignSelf: "center" }}
          label="Use Farm-out"
          control={
            <Switch checked={state.useFarmout} onChange={handleCheckFarmout} />
          }
        />

        <Box sx={{ display: "flex" }}>
          <Box className="modal2Columns">
            {state.useFarmout && (
              <div
                id="company-box"
                className="modalField"
                style={{ display: "inline-block" }}
              >
                <Autocomplete
                  id="company"
                  className="autocomplete"
                  value={state.company}
                  onChange={handleCompanyChange}
                  isOptionEqualToValue={(option, value) =>
                    option.company === value
                  }
                  options={state.companies?.map((element) => {
                    const company = {
                      companyId: element.company_id,
                      company: element.company_name,
                    };
                    return company;
                  })}
                  sx={{ width: 200 }}
                  getOptionLabel={(option) => option.company ?? option}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      required
                      label="Company"
                      error={state.invalidField === "company"}
                      helperText={
                        state.invalidField === "company"
                          ? "Information required"
                          : ""
                      }
                    />
                  )}
                />
              </div>
            )}

            {!state.useFarmout && (
              <Box sx={{ display: "flex", flexDirection: "column" }}>
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
                    options={state.drivers?.map((element) => {
                      const driver = {
                        employeeId: element.employee_id,
                        driverName: element.fullname,
                      };
                      return driver;
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
              </Box>
            )}
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
            </LocalizationProvider>
            <TextField
              id="payment"
              className="modalField"
              label="Driver Payment $"
              type="text"
              inputProps={{ inputMode: "decimal", step: "0.01" }}
              placeholder="Driver Payment $"
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
          <Button variant="contained" onClick={validateSave}>
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
          onConfirm={handleDeleteDetail}
          title={"Confirm deleting detail?"}
          description={"Are you sure you want to delete this detail?"}
        />
        <CustomDialog
          openDialog={state.openValidationDialog}
          onConfirm={handleConfirmDialog}
          onCancel={handleCancelDialog}
          title={
            state.validationDialogType === "driver"
              ? "Driver already booked"
              : "Vehicle already booked"
          }
          description={`The ${state.validationDialogType} ${
            state.validationDialogType === "driver"
              ? state.driverName
              : state.vehicleName
          } is already booked for a trip in this same day. Do you want to proceed?`}
        />
      </Box>
    </Modal>
  );
};
