import {
  Box,
  IconButton,
  Modal,
  TextField,
  Tooltip,
  Typography,
  Autocomplete,
  Button,
  FormControl,
  FormHelperText,
  FormControlLabel,
  Switch,
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
import { useEffect, useReducer } from "react";
import { LocalizationProvider, DateTimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import "dayjs/locale/en";

import { UsePrivatePut, UsePrivateGet } from "../../hooks/useFetchServer";
import { useNavigate, useLocation } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import CustomDialog from "../../utils/customDialog";

dayjs.extend(utc);
dayjs.extend(timezone);

const initialState = {
  invoice: "",
  serviceId: 0,
  detailId: 0,
  employeeId: null,
  vehicleId: null,
  companyId: null,
  fromLocationId: "",
  toLocationId: "",
  serviceDate: "",
  spotTime: null,
  startTime: null,
  endTime: null,
  driver: null,
  vehicle: null,
  company: null,
  payment: 0.0,
  from: null,
  to: null,
  instructions: "",
  charge: 0.0,
  openModal: false,
  invalidField: "",
  useFarmout: false,
  openValidationDialog: false,
  validationDialogType: "",
  vehicleValidationData: [],
};

const reducer = (prevState, updatedProp) => ({ ...prevState, ...updatedProp });

export const ScheduleModal = (props) => {
  const {
    onError,
    onSuccess,
    open,
    rowData,
    empData,
    locData,
    vehData,
    compData,
    onSave,
    startDate,
    endDate,
  } = props;

  const [state, setState] = useReducer(reducer, initialState);

  const { setAuth } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const putServer = UsePrivatePut();
  const getServer = UsePrivateGet();

  useEffect(() => {
    if (open > 0) {
      // set filds state
      setState({
        invoice: rowData?.invoice,
        serviceId: rowData?.service_id,
        detailId: rowData?.detail_id,
        employeeId: rowData?.employee_id,
        vehicleId: rowData?.vehicle_id,
        companyId: rowData?.company_id,
        fromLocationId: rowData?.from_location_id,
        toLocationId: rowData?.to_location_id,
        serviceDate: rowData?.service_date,
        spotTime: dayjs(rowData?.spot_time),
        startTime: dayjs(rowData?.start_time),
        endTime: dayjs(rowData?.end_time),
        driver: rowData?.firstname
          ? `${rowData?.firstname} ${rowData?.lastname}`
          : null,
        vehicle: rowData?.vehicle_name,
        company: rowData?.company_name,
        payment: rowData?.payment,
        from: rowData?.from_location,
        to: rowData?.to_location,
        instructions: rowData?.instructions,
        charge: rowData?.charge,
        useFarmout: rowData?.use_farmout,
        openModal: true,
      });
    }
  }, [open, rowData]);

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

    //check if driver has another booking for the same day
    const driverResponse = await getServer(
      `/checkdriverhastrip/${state.detailId}/${state.employeeId}/${state.serviceDate}`
    );

    //check if vehicle has another booking for the same day
    const vehicleResponse = await getServer(
      `/checkvehiclehastrip/${state.detailId}/${state.vehicleId}/${state.serviceDate}`
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
        handleUpdate();
      }
    } else if (driverResponse?.disconnect || vehicleResponse?.disconnect) {
      setAuth({});
      navigate("/login", { state: { from: location }, replace: true });
    } else if (driverResponse?.error || vehicleResponse?.error) {
      onError(driverResponse?.error ?? vehicleResponse?.error);
    }
  }; //validateSave

  const validateVehicle = async () => {
    if (state.vehicleValidationData?.length > 0) {
      //Display alert saying driver is booked to another trip in the same day
      setState({ openValidationDialog: true, validationDialogType: "vehicle" });
      return;
    } else {
      handleUpdate();
    }
  };

  const handleUpdate = async () => {
    const response = await putServer("/updateSchedule", {
      service: { serviceId: state.serviceId, charge: state.charge },
      detail: {
        detailId: state.detailId,
        spotTime: state.spotTime,
        startTime: state.startTime,
        endTime: state.endTime,
        instructions: state.instructions,
        payment: state.payment,
        employeeId: state.employeeId,
        vehicleId: state.vehicleId,
        companyId: state.companyId,
        fromLocationId: state.fromLocationId,
        toLocationId: state.toLocationId,
        useFarmout: state.useFarmout,
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

    onSave(startDate, endDate);
  }; //handleUpdate

  const handleConfirmDialog = async () => {
    if (state.validationDialogType === "driver") validateVehicle();
    else handleUpdate();
  };

  const handleCancelDialog = () => {
    setState({ openValidationDialog: false });
  };

  //clear state fields utility
  const clearState = () => {
    setState({
      invoice: "",
      serviceId: 0,
      detailId: 0,
      employeeId: null,
      vehicleId: null,
      companyId: null,
      fromLocationId: "",
      toLocationId: "",
      spotTime: null,
      startTime: null,
      endTime: null,
      driver: null,
      vehicle: null,
      company: null,
      payment: 0.0,
      from: null,
      to: null,
      instructions: "",
      charge: 0.0,
      openModal: false,
      invalidField: "",
      useFarmout: false,
      openValidationDialog: false,
      validationDialogType: "",
      vehicleValidationData: [],
    });
  }; //clearState

  //validate the form fields
  const isFormValid = () => {
    if (!state.spotTime) {
      setState({ invalidField: "spotTime" });
      return;
    }

    if (!state.startTime) {
      setState({ invalidField: "startTime" });
      return;
    }

    if (!state.endTime) {
      setState({ invalidField: "endTime" });
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

    if (!state.driver && !state.useFarmout) {
      setState({ invalidField: "driver" });
      return;
    }

    if (!state.vehicle && !state.useFarmout) {
      setState({ invalidField: "vehicle" });
      return;
    }

    if (!state.company && state.useFarmout) {
      setState({ invalidField: "company" });
      return;
    }

    setState({ invalidField: "" });
    return true;
  }; //isFormValid

  const handleCloseModal = () => {
    setState({
      invalidField: "",
      openModal: false,
    });
  };

  //handle changes on Driver autocomplete
  const handleDriverChange = (e, newValue) => {
    if (newValue) {
      setState({
        employeeId: newValue.employeeId,
        driver: newValue.driver,
      });
    }
  };

  //handle changes on Driver autocomplete
  const handleVehicleChange = (e, newValue) => {
    if (newValue) {
      setState({
        vehicleId: newValue.vehicleId,
        vehicle: newValue.vehicleName,
      });
    }
  };

  //handle changes on From Location autocomplete
  const handleFromLocationChange = (e, newValue) => {
    if (newValue) {
      setState({
        fromLocationId: newValue.locationId,
        from: newValue.locationName,
      });
    }
  };

  //handle changes on To Location autocomplete
  const handleToLocationChange = (e, newValue) => {
    if (newValue) {
      setState({
        toLocationId: newValue.locationId,
        to: newValue.locationName,
      });
    }
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

  const handleCheckFarmout = (e) => {
    const isChecked = e.target.checked;
    if (isChecked)
      setState({
        driver: null,
        vehicle: null,
        employeeId: null,
        vehicleId: null,
        useFarmout: isChecked,
      });
    else setState({ company: null, companyId: null, useFarmout: isChecked });
  };

  return (
    <Modal
      open={state.openModal}
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
          Editing Schedule
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
            <TextField
              id="invoice"
              className="modalField"
              value={state.invoice}
              label="Invoice"
              type="text"
              onChange={(e) => setState({ invoice: e.target.value })}
              disabled
            />

            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="en">
              <DateTimePicker
                label="Spot time"
                className="modalField"
                id="spotTime"
                ampm={false}
                timezone="America/New_York"
                value={state.spotTime}
                onChange={(newValue) => setState({ spotTime: dayjs(newValue) })}
              />

              <FormControl
                error={state.invalidField === "startTime"}
                className="modalField"
              >
                <DateTimePicker
                  label="Service time"
                  id="startTime"
                  ampm={false}
                  value={state.startTime}
                  timezone="America/New_York"
                  onChange={(newValue) =>
                    setState({ startTime: dayjs(newValue) })
                  }
                />
                <FormHelperText style={{}}>
                  {state.invalidField === "startTime"
                    ? "Information required"
                    : ""}
                </FormHelperText>
              </FormControl>

              <FormControl
                error={state.invalidField === "endTime"}
                className="modalField"
              >
                <DateTimePicker
                  label="End time"
                  id="endTime"
                  ampm={false}
                  value={state.endTime}
                  timezone="America/New_York"
                  onChange={(newValue) =>
                    setState({
                      endTime: dayjs(newValue),
                    })
                  }
                />
                <FormHelperText>
                  {state.invalidField === "endTime"
                    ? "Information required"
                    : ""}
                </FormHelperText>
              </FormControl>
            </LocalizationProvider>

            <TextField
              id="charge"
              className="modalField"
              label="Charge $"
              type="text"
              inputProps={{ inputMode: "decimal", step: "0.01" }}
              placeholder="Charge $"
              value={state.charge}
              onChange={(e) => setState({ charge: e.target.value })}
            />

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
          </Box>
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
                  options={
                    compData?.map((element) => {
                      const company = {
                        companyId: element.company_id,
                        company: element.company_name,
                      };
                      return company;
                    }) ?? []
                  }
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
                    className="autocomplete"
                    value={state.driver}
                    onChange={handleDriverChange}
                    isOptionEqualToValue={(option, value) =>
                      option.driver === value
                    }
                    options={
                      empData?.map((element) => {
                        const employee = {
                          employeeId: element.employee_id,
                          driver: `${element.firstname} ${element.lastname}`,
                        };
                        return employee;
                      }) ?? []
                    }
                    sx={{ width: 200 }}
                    getOptionLabel={(option) => option.driver ?? option}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        required
                        label="Driver"
                        error={state.invalidField === "driver"}
                        helperText={
                          state.invalidField === "driver"
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
                    value={state.vehicle}
                    onChange={handleVehicleChange}
                    isOptionEqualToValue={(option, value) =>
                      option.vehicleName === value
                    }
                    options={
                      vehData?.map((element) => {
                        const vehicle = {
                          vehicleId: element.vehicle_id,
                          vehicleName: element.vehicle_name,
                        };
                        return vehicle;
                      }) ?? []
                    }
                    sx={{ width: 200 }}
                    getOptionLabel={(option) => option.vehicleName ?? option}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        required
                        label="Vehicle"
                        error={state.invalidField === "vehicle"}
                        helperText={
                          state.invalidField === "vehicle"
                            ? "Information required"
                            : ""
                        }
                      />
                    )}
                  />
                </div>{" "}
              </Box>
            )}

            <div
              id="from-box"
              className="modalField"
              style={{ display: "inline-block" }}
            >
              <Autocomplete
                id="from"
                className="autocomplete"
                value={state.from}
                onChange={handleFromLocationChange}
                isOptionEqualToValue={(option, value) =>
                  option.locationName === value
                }
                options={
                  locData?.map((element) => {
                    const location = {
                      locationId: element.location_id,
                      locationName: element.location_name,
                    };
                    return location;
                  }) ?? []
                }
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
                className="autocomplete"
                value={state.to}
                onChange={handleToLocationChange}
                isOptionEqualToValue={(option, value) =>
                  option.locationName === value
                }
                options={
                  locData?.map((element) => {
                    const location = {
                      locationId: element.location_id,
                      locationName: element.location_name,
                    };
                    return location;
                  }) ?? []
                }
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
        </Box>
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
              ? state.driver
              : state.vehicle
          } is already booked for a trip in this same day. Do you want to proceed?`}
        />
      </Box>
    </Modal>
  );
};
