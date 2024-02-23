import { useReducer, useEffect, useRef } from "react";
import {
  Alert,
  AlertTitle,
  TextField,
  Autocomplete,
  Button,
  Snackbar,
  Divider,
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  FormControlLabel,
  Checkbox,
  Radio,
  RadioGroup,
  FormControl,
  FormLabel,
  FormHelperText,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import EditIcon from "@mui/icons-material/Edit";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import "dayjs/locale/en";

import {
  UsePrivateGet,
  UsePrivatePost,
  UsePrivateDelete,
  UsePrivatePut,
} from "../../hooks/useFetchServer";
import { useNavigate, useLocation } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

import { MuiTelInput } from "mui-tel-input";
import EnhancedTable from "../../utils/table_generic";
import GoogleAutoComplete from "../../api/google_place";

dayjs.extend(utc);
dayjs.extend(timezone);

const reducer = (prevState, upadatedProp) => ({
  ...prevState,
  ...upadatedProp,
});

const listOfStates = [
  "AK",
  "AL",
  "AR",
  "AS",
  "AZ",
  "CA",
  "CO",
  "CT",
  "DC",
  "DE",
  "FL",
  "GA",
  "GU",
  "HI",
  "IA",
  "ID",
  "IL",
  "IN",
  "KS",
  "KY",
  "LA",
  "MA",
  "MD",
  "ME",
  "MI",
  "MN",
  "MO",
  "MS",
  "MT",
  "NC",
  "ND",
  "NE",
  "NH",
  "NJ",
  "NM",
  "NV",
  "NY",
  "OH",
  "OK",
  "OR",
  "PA",
  "PR",
  "RI",
  "SC",
  "SD",
  "TN",
  "TX",
  "UT",
  "VA",
  "VI",
  "VT",
  "WA",
  "WI",
  "WV",
  "WY",
];

const initialState = {
  employeeId: "",
  username: null,
  firstname: "",
  lastname: "",
  birth: null,
  title: "",
  hireDate: null,
  ssn: "",
  searchAddress: "",
  address: "",
  city: "",
  state: null,
  zip: "",
  phone: "",
  email: "",
  medicalCard: false,
  i9: false,
  drugFree: false,
  driverLicenceExpDate: null,
  it: "",
  nationalReg: "",
  experience: "",
  cldTag: "",
  insurance: "",
  insuranceExpDate: null,
  mc: "",
  pointOfContact: "",
  emergencyContact: "",
  maritalStatus: "",
  notes: "",
  openSnakbar: false,
  error: null,
  success: false,
  employeesData: [],
  usersData: [],
  onEditMode: false,
  expandPanel: false,
  isDataUpdated: false,
  invalidField: "",
};

export const Employee = () => {
  const [state, setState] = useReducer(reducer, initialState);

  const effectRun = useRef(false);

  const { setAuth } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const getServer = UsePrivateGet();
  const postServer = UsePrivatePost();
  const putServer = UsePrivatePut();
  const deleteServer = UsePrivateDelete();

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    //Get all employee data
    const getEmployeeData = async () => {
      //get available users to display on dropdown
      let response = await getServer("/getavailableusers", controller.signal);
      const usersRespData = response?.data;

      response = await getServer("/getallemployees", controller.signal);
      if (response.disconnect) {
        setAuth({});
        navigate("/login", { state: { from: location }, replace: true });
        //other errors
      } else if (response.error) {
        setState({ success: false, error: response.error, openSnakbar: true });
      }
      //no error
      else {
        let responseData = response?.data;
        responseData = responseData?.map((item) => {
          const employee = {
            id: item.employee_id,
            firstname: item.firstname,
            lastname: item.lastname,
            birth: dayjs(item.birth),
            title: item.title,
            hireDate: dayjs(item.hire_date),
            address: item.address,
            city: item.city,
            state: item.state,
            zip: item.zip,
            phone: item.phone,
            email: item.email,
            medicalCard: item.medical_card,
            i9: item.i9,
            drugFree: item.drug_free,
            driverLicenceExpDate: dayjs(item.drive_license_exp_date),
            it: item.it_number,
            nationalReg: item.national_reg,
            experience: item.experience,
            cldTag: item.cdl_tag,
            insurance: item.insurance,
            insuranceExpDate: dayjs(item.insurance_exp_date),
            mc: item.mc,
            pointOfContact: item.point_contact,
            emergencyContact: item.emergency_contact,
            maritalStatus: item.marital_status,
            notes: item.notes,
            username: item.user_id,
          };
          return employee;
        });
        isMounted &&
          setState({ employeesData: responseData, usersData: usersRespData });
      }
    }; //getEmployeeData

    if (process.env.NODE_ENV === "development") {
      effectRun.current && getEmployeeData();
    } else {
      getEmployeeData();
    }

    return () => {
      isMounted = false;
      controller.abort();
      effectRun.current = true;
    };
  }, [state.isDataUpdated]);

  //Get all employees data
  const getData = () => {
    return state.employeesData;
  }; //loadData

  //handle updates in the fields
  const handleOnChange = (e) => setState({ [e.target.id]: e.target.value });

  //handle changes on phone field
  const handlePhoneChange = (value, info) => {
    setState({ phone: value });
  };

  //validate the form fields
  const isFormValid = () => {
    if (!state.firstname) {
      setState({ invalidField: "firstname" });
      return;
    }

    if (!state.lastname) {
      setState({ invalidField: "lastname" });
      return;
    }

    if (!state.username) {
      setState({ invalidField: "username" });
      return;
    }

    if (!state.title) {
      setState({ invalidField: "title" });
      return;
    }

    if (!state.address) {
      setState({ invalidField: "address" });
      return;
    }

    if (!state.city) {
      setState({ invalidField: "city" });
      return;
    }

    if (!state.state) {
      setState({ invalidField: "state" });
      return;
    }

    if (!state.zip) {
      setState({ invalidField: "zip" });
      return;
    }

    if (!state.phone) {
      setState({ invalidField: "phone" });
      return;
    }

    if (!state.email) {
      setState({ invalidField: "email" });
      return;
    }

    setState({ invalidField: "" });
    return true;
  }; //isFormValid

  //handle form submit
  const handleSubmit = async () => {
    //validate form
    if (!isFormValid()) {
      return;
    }

    const response = await postServer("/createemployee", {
      employee: {
        firstname: state.firstname,
        lastname: state.lastname,
        birth: state.birth,
        title: state.title,
        hireDate: state.hireDate,
        address: state.address,
        city: state.city,
        state: state.state,
        zip: state.zip,
        phone: state.phone,
        email: state.email,
        medicalCard: state.medicalCard,
        i9: state.i9,
        drugFree: state.drugFree,
        driverLicenceExpDate: state.driverLicenceExpDate,
        it: state.it,
        nationalReg: state.nationalReg,
        experience: state.experience,
        cldTag: state.cldTag,
        insurance: state.insurance,
        insuranceExpDate: state.insuranceExpDate,
        mc: state.mc,
        pointOfContact: state.pointOfContact,
        emergencyContact: state.emergencyContact,
        maritalStatus: state.maritalStatus,
        notes: state.notes,
        username: state.username,
      },
    });

    if (response?.data) {
      clearState(response.data);
    } else if (response?.disconnect) {
      setAuth({});
      navigate("/login", { state: { from: location }, replace: true });
    } else if (response?.error) {
      setState({ error: response.error, success: false, openSnakbar: true });
    }
  }; //handleSubmit

  //clear state fields utility
  const clearState = (msg) => {
    setState({
      msg: msg,
      error: null,
      success: true,
      openSnakbar: true,
      employeeId: "",
      username: null,
      firstname: "",
      lastname: "",
      birth: null,
      title: "",
      hireDate: null,
      ssn: "",
      searchAddress: "",
      address: "",
      city: "",
      state: null,
      zip: "",
      phone: "",
      email: "",
      medicalCard: false,
      i9: false,
      drugFree: false,
      driverLicenceExpDate: null,
      it: "",
      nationalReg: "",
      experience: "",
      cldTag: "",
      insurance: "",
      insuranceExpDate: null,
      mc: "",
      pointOfContact: "",
      emergencyContact: "",
      maritalStatus: "",
      notes: "",
      expandPanel: false,
      onEditMode: false,
      isDataUpdated: !state.isDataUpdated,
    });
  }; //clearState

  //Cancel editing
  const cancelEditing = () => {
    setState({
      expandPanel: false,
      onEditMode: false,
      invalidField: "",
      employeeId: "",
      firstname: "",
      username: null,
      lastname: "",
      birth: null,
      title: "",
      hireDate: null,
      ssn: "",
      searchAddress: "",
      address: "",
      city: "",
      state: null,
      zip: "",
      phone: "",
      email: "",
      medicalCard: false,
      i9: false,
      drugFree: false,
      driverLicenceExpDate: null,
      it: "",
      nationalReg: "",
      experience: "",
      cldTag: "",
      insurance: "",
      insuranceExpDate: null,
      mc: "",
      pointOfContact: "",
      emergencyContact: "",
      maritalStatus: "",
      notes: "",
    });
  }; //cancelEditing

  //closes the snakbar
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setState({ openSnakbar: false });
  };

  //save data being edited
  const handleSaveChanges = async () => {
    if (!isFormValid()) {
      return;
    }

    const employeeToUpdate = {
      id: state.employeeId,
      firstname: state.firstname,
      lastname: state.lastname,
      birth: state.birth,
      title: state.title,
      hireDate: state.hireDate,
      address: state.address,
      city: state.city,
      state: state.state,
      zip: state.zip,
      phone: state.phone,
      email: state.email,
      medicalCard: state.medicalCard,
      i9: state.i9,
      drugFree: state.drugFree,
      driverLicenceExpDate: state.driverLicenceExpDate,
      it: state.it,
      nationalReg: state.nationalReg,
      experience: state.experience,
      cldTag: state.cldTag,
      insurance: state.insurance,
      insuranceExpDate: state.insuranceExpDate,
      mc: state.mc,
      pointOfContact: state.pointOfContact,
      emergencyContact: state.emergencyContact,
      maritalStatus: state.maritalStatus,
      notes: state.notes,
      username: state.username,
    };

    const response = await putServer("/updateemployee", {
      employee: employeeToUpdate,
    });

    if (response?.data) {
      clearState(response.data);
    } else if (response?.disconnect) {
      setAuth({});
      navigate("/login", { state: { from: location }, replace: true });
    } else if (response?.error) {
      setState({ error: response.error, success: false, openSnakbar: true });
    }
  }; //handleSaveChanges

  //Delete one or more records from the database
  const handleDelete = async (itemsSelected) => {
    const employeeIds = JSON.stringify(itemsSelected);
    const response = await deleteServer(`/deleteemployee/${employeeIds}`);

    if (response?.data) {
      clearState(response.data);
    } else if (response?.disconnect) {
      setAuth({});
      navigate("/login", { state: { from: location }, replace: true });
    } else if (response?.error) {
      setState({ error: response.error, success: false, openSnakbar: true });
    }
  }; //handleDelete

  //Show information when clicking on a table row
  const handleItemClick = (id) => {
    //load fields
    console.log(state.employeesData.filter((e) => e.id === id));
    setState({
      onEditMode: true,
      expandPanel: true,
      employeeId: id,
      invalidField: "",
      searchAddress: "",
      firstname: state.employeesData.filter((e) => e.id === id)[0].firstname,
      lastname: state.employeesData.filter((e) => e.id === id)[0].lastname,
      username: state.employeesData.filter((e) => e.id === id)[0].username,
      address: state.employeesData.filter((e) => e.id === id)[0].address,
      city: state.employeesData.filter((e) => e.id === id)[0].city,
      state: state.employeesData.filter((e) => e.id === id)[0].state,
      zip: state.employeesData.filter((e) => e.id === id)[0].zip,
      phone: state.employeesData.filter((e) => e.id === id)[0].phone,
      email: state.employeesData.filter((e) => e.id === id)[0].email,
      birth: dayjs(state.employeesData.filter((e) => e.id === id)[0].birth),
      title: state.employeesData.filter((e) => e.id === id)[0].title,
      insurance: state.employeesData.filter((e) => e.id === id)[0].insurance,
      hireDate: dayjs(
        state.employeesData.filter((e) => e.id === id)[0].hireDate
      ),
      medicalCard: state.employeesData.filter((e) => e.id === id)[0]
        .medicalCard,
      i9: state.employeesData.filter((e) => e.id === id)[0].i9,
      drugFree: state.employeesData.filter((e) => e.id === id)[0].drugFree,
      driverLicenceExpDate: dayjs(
        state.employeesData.filter((e) => e.id === id)[0].driverLicenceExpDate
      ),
      it: state.employeesData.filter((e) => e.id === id)[0].it,
      nationalReg: state.employeesData.filter((e) => e.id === id)[0]
        .nationalReg,
      experience: state.employeesData.filter((e) => e.id === id)[0].experience,
      cldTag: state.employeesData.filter((e) => e.id === id)[0].cldTag,
      insuranceExpDate: dayjs(
        state.employeesData.filter((e) => e.id === id)[0].insuranceExpDate
      ),
      mc: state.employeesData.filter((e) => e.id === id)[0].mc,
      pointOfContact: state.employeesData.filter((e) => e.id === id)[0]
        .pointOfContact,
      emergencyContact: state.employeesData.filter((e) => e.id === id)[0]
        .emergencyContact,
      maritalStatus: state.employeesData.filter((e) => e.id === id)[0]
        .maritalStatus,
      notes: state.employeesData.filter((e) => e.id === id)[0].notes,
    });
  }; //handleItemClick

  //cancel editing when a checkbox is selected
  const handleBoxChecked = (isItemChecked) => {
    if (isItemChecked) cancelEditing();
  };

  const updateAddress = (
    address1,
    city,
    state,
    zip,
    country,
    searchAddress
  ) => {
    setState({
      searchAddress: searchAddress,
      address: address1,
      city: city,
      state: state,
      zip: zip,
    });
  };

  //table headings
  const headings = [
    {
      id: "firstname",
      isNumeric: false,
      isPaddingDisabled: false,
      label: "First Name",
    },
    {
      id: "lastname",
      isNumeric: false,
      isPaddingDisabled: false,
      label: "Last Name",
    },
    { id: "title", isNumeric: false, isPaddingDisabled: false, label: "Title" },
    { id: "phone", isNumeric: false, isPaddingDisabled: false, label: "Phone" },
    {
      id: "email",
      isNumeric: false,
      isPaddingDisabled: false,
      label: "E-Mail",
    },
  ];

  return (
    <div className="employee-container">
      <div className="employee-container-box">
        <form>
          <Accordion
            expanded={state.expandPanel}
            onChange={() => setState({ expandPanel: !state.expandPanel })}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              {state.onEditMode ? (
                <Box sx={{ display: "inline-flex" }}>
                  <Typography sx={{ fontWeight: "bold", color: "#1976d2" }}>
                    EDITING EMPLOYEE
                  </Typography>
                  <EditIcon style={{ color: "#1976d2", marginLeft: "10px" }} />
                </Box>
              ) : (
                <Box sx={{ display: "inline-flex" }}>
                  <Typography sx={{ fontWeight: "bold", color: "#1976d2" }}>
                    NEW EMPLOYEE
                  </Typography>
                  <PersonAddIcon
                    style={{ color: "#1976d2", marginLeft: "10px" }}
                  />
                </Box>
              )}
            </AccordionSummary>
            <AccordionDetails>
              <Box className="fieldsbox1">
                <TextField
                  error={state.invalidField === "firstname"}
                  helperText={
                    state.invalidField === "firstname"
                      ? "Information required"
                      : ""
                  }
                  className="textfield"
                  id="firstname"
                  required
                  label="First Name"
                  type="text"
                  placeholder="First name"
                  value={state.firstname}
                  onChange={handleOnChange}
                />
                <TextField
                  error={state.invalidField === "lastname"}
                  helperText={
                    state.invalidField === "lastname"
                      ? "Information required"
                      : ""
                  }
                  className="textfield"
                  id="lastname"
                  required
                  label="Last name"
                  type="text"
                  placeholder="Last name"
                  value={state.lastname}
                  onChange={handleOnChange}
                />

                <div
                  id="username-box"
                  className="textfield"
                  style={{ display: "inline-block" }}
                >
                  <Autocomplete
                    id="username"
                    required
                    className="autocomplete"
                    value={state.username}
                    onChange={(e, newValue) => setState({ username: newValue })}
                    options={state.usersData?.map((e) => e.username)}
                    sx={{ width: 200 }}
                    getOptionLabel={(option) => option ?? ""}
                    isOptionEqualToValue={(option, value) => option === value}
                    renderInput={(params) => (
                      <TextField
                        required
                        {...params}
                        label="Username"
                        error={state.invalidField === "username"}
                        helperText={
                          state.invalidField === "username"
                            ? "Information required"
                            : ""
                        }
                      />
                    )}
                  />
                </div>

                <FormControl
                  className="textfield"
                  style={{ alignItems: "center" }}
                >
                  <FormLabel
                    id="titleLabel"
                    error={state.invalidField === "title"}
                  >
                    Title *
                  </FormLabel>
                  <RadioGroup
                    row
                    aria-labelledby="titleLabel"
                    name="title-buttons-group"
                    value={state.title}
                    onChange={(e) => setState({ title: e.target.value })}
                    erro
                  >
                    <FormControlLabel
                      value="Driver"
                      control={<Radio />}
                      label="Driver"
                    />
                    <FormControlLabel
                      value="Sales"
                      control={<Radio />}
                      label="Sales"
                    />
                  </RadioGroup>
                  <FormHelperText style={{ color: "red" }}>
                    {state.invalidField === "title"
                      ? "Information required"
                      : ""}
                  </FormHelperText>
                </FormControl>

                <TextField
                  error={state.invalidField === "email"}
                  helperText={
                    state.invalidField === "email" ? "Information required" : ""
                  }
                  className="textfield"
                  id="email"
                  required
                  label="E-Mail"
                  type="email"
                  placeholder="E-Mail"
                  value={state.email}
                  onChange={handleOnChange}
                />

                <LocalizationProvider
                  dateAdapter={AdapterDayjs}
                  adapterLocale="en"
                >
                  <DatePicker
                    error={state.invalidField === "birth"}
                    helperText={
                      state.invalidField === "birth"
                        ? "Information required"
                        : ""
                    }
                    label="Birth Date"
                    className="textfield"
                    id="birth"
                    timezone="America/New_York"
                    required
                    placeholder="Birth Date"
                    value={state.birth}
                    onChange={(newValue) => setState({ birth: newValue })}
                  />
                </LocalizationProvider>

                <GoogleAutoComplete
                  updateFields={updateAddress}
                  value={state.searchAddress}
                  searchType={"address"}
                />

                <TextField
                  error={state.invalidField === "address"}
                  helperText={
                    state.invalidField === "address"
                      ? "Information required"
                      : ""
                  }
                  className="textfield"
                  id="address"
                  required
                  label="Address"
                  type="text"
                  placeholder="Address"
                  value={state.address}
                  onChange={handleOnChange}
                />

                <TextField
                  error={state.invalidField === "city"}
                  helperText={
                    state.invalidField === "city" ? "Information required" : ""
                  }
                  className="textfield"
                  id="city"
                  required
                  label="City"
                  type="text"
                  placeholder="City"
                  value={state.city}
                  onChange={handleOnChange}
                />
                <div
                  id="states-box"
                  className="textfield"
                  style={{ display: "inline-block" }}
                >
                  <Autocomplete
                    id="states"
                    required
                    className="autocomplete"
                    value={state.state}
                    onChange={(e, newValue) => setState({ state: newValue })}
                    options={listOfStates}
                    sx={{ width: 200 }}
                    getOptionLabel={(option) => option.toString()}
                    renderInput={(params) => (
                      <TextField
                        required
                        {...params}
                        label="State"
                        error={state.invalidField === "state"}
                        helperText={
                          state.invalidField === "state"
                            ? "Information required"
                            : ""
                        }
                      />
                    )}
                  />
                </div>

                <TextField
                  error={state.invalidField === "zip"}
                  helperText={
                    state.invalidField === "zip" ? "Information required" : ""
                  }
                  className="textfield"
                  id="zip"
                  required
                  label="Zipcode"
                  type="text"
                  placeholder="Zipcode"
                  value={state.zip}
                  inputProps={{ maxLength: 6 }}
                  onChange={handleOnChange}
                />

                <MuiTelInput
                  error={state.invalidField === "phone"}
                  helperText={
                    state.invalidField === "phone" ? "Information required" : ""
                  }
                  className="textfield"
                  id="phone"
                  defaultCountry="US"
                  required
                  label="Phone"
                  placeholder="Phone"
                  value={state.phone}
                  onChange={handlePhoneChange}
                  onlyCountries={["US", "CA"]}
                  inputProps={{ maxLength: 15 }}
                />

                <TextField
                  className="textfield"
                  id="experience"
                  label="Experience"
                  type="text"
                  placeholder="Experience"
                  value={state.experience}
                  onChange={handleOnChange}
                />

                <Box className="textfield" sx={{ display: "inline-block" }}>
                  <FormControlLabel
                    style={{ alignSelf: "center" }}
                    label="Medical card"
                    control={
                      <Checkbox
                        checked={state.medicalCard}
                        onChange={(e) =>
                          setState({ medicalCard: e.target.checked })
                        }
                      />
                    }
                  />
                  <FormControlLabel
                    style={{ alignSelf: "center" }}
                    label="I9"
                    control={
                      <Checkbox
                        checked={state.i9}
                        onChange={(e) => setState({ i9: e.target.checked })}
                      />
                    }
                  />

                  <FormControlLabel
                    style={{ alignSelf: "center" }}
                    label="Drug Free"
                    control={
                      <Checkbox
                        checked={state.drugFree}
                        onChange={(e) =>
                          setState({ drugFree: e.target.checked })
                        }
                      />
                    }
                  />
                </Box>

                <LocalizationProvider
                  dateAdapter={AdapterDayjs}
                  adapterLocale="en"
                >
                  <DatePicker
                    error={state.invalidField === "hireDate"}
                    helperText={
                      state.invalidField === "hireDate"
                        ? "Information required"
                        : ""
                    }
                    className="textfield"
                    id="hireDate"
                    timezone="America/New_York"
                    required
                    label="Hire Date"
                    placeholder="Hire Date"
                    value={state.hireDate}
                    onChange={(newValue) => setState({ hireDate: newValue })}
                  />

                  <DatePicker
                    className="textfield"
                    id="driverLicenceExpDate"
                    timezone="America/New_York"
                    label="Driver Licence Expire Date"
                    placeholder="Driver Licence Expire Date"
                    value={state.driverLicenceExpDate}
                    onChange={(newValue) =>
                      setState({ driverLicenceExpDate: newValue })
                    }
                  />
                </LocalizationProvider>

                <TextField
                  className="textfield"
                  id="it"
                  label="IT"
                  type="text"
                  placeholder="IT"
                  value={state.it}
                  onChange={handleOnChange}
                />

                <TextField
                  className="textfield"
                  id="nationalReg"
                  label="National Register"
                  type="text"
                  placeholder="National Register"
                  value={state.nationalReg}
                  onChange={handleOnChange}
                />

                <TextField
                  className="textfield"
                  id="cldTag"
                  label="CDL Tag"
                  type="text"
                  placeholder="CDL Tag"
                  value={state.cldTag}
                  onChange={handleOnChange}
                />

                <TextField
                  className="textfield"
                  id="insurance"
                  label="Insurance"
                  type="text"
                  placeholder="Insurance"
                  value={state.insurance}
                  onChange={handleOnChange}
                />

                <LocalizationProvider
                  dateAdapter={AdapterDayjs}
                  adapterLocale="en"
                >
                  <DatePicker
                    className="textfield"
                    id="insuranceExpDate"
                    timezone="America/New_York"
                    label="Insurance Expire Date"
                    placeholder="Insurance Expire Date"
                    value={state.insuranceExpDate}
                    onChange={(newValue) =>
                      setState({ insuranceExpDate: newValue })
                    }
                  />
                </LocalizationProvider>

                <TextField
                  className="textfield"
                  id="mc"
                  label="MC"
                  type="text"
                  placeholder="MC"
                  value={state.mc}
                  onChange={handleOnChange}
                />

                <TextField
                  className="textfield"
                  id="pointOfContact"
                  label="Point of contact"
                  type="text"
                  placeholder="Point of contact"
                  value={state.pointOfContact}
                  onChange={handleOnChange}
                />

                <TextField
                  className="textfield"
                  id="emergencyContact"
                  label="Emergency Contact"
                  type="text"
                  placeholder="Emergency Contact"
                  value={state.emergencyContact}
                  onChange={handleOnChange}
                />

                <TextField
                  className="textfield"
                  id="maritalStatus"
                  label="Marital Status"
                  type="text"
                  placeholder="Marital Status"
                  value={state.maritalStatus}
                  onChange={handleOnChange}
                />

                <TextField
                  className="textfield"
                  id="notes"
                  label="Notes"
                  type="text"
                  multiline
                  rows={4}
                  placeholder="Notes"
                  value={state.notes}
                  onChange={handleOnChange}
                />

                <p></p>
              </Box>
              {state.onEditMode ? (
                <Box>
                  <Button variant="contained" onClick={handleSaveChanges}>
                    Save Changes
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    style={{ marginLeft: "10px" }}
                    onClick={cancelEditing}
                  >
                    Cancel
                  </Button>
                </Box>
              ) : (
                <Button variant="contained" onClick={handleSubmit}>
                  Save New Employee
                </Button>
              )}
              <p></p>
            </AccordionDetails>
          </Accordion>

          <Snackbar
            open={state.error && state.openSnakbar}
            autoHideDuration={5000}
            onClose={handleClose}
          >
            <Alert severity="error" onClose={handleClose}>
              <AlertTitle>Error</AlertTitle>
              {state.error}
            </Alert>
          </Snackbar>

          <Snackbar
            open={state.success && state.openSnakbar}
            autoHideDuration={5000}
            onClose={handleClose}
          >
            <Alert severity="success" onClose={handleClose}>
              <AlertTitle>Employees Updated</AlertTitle>
              {state.msg}
            </Alert>
          </Snackbar>
        </form>
        <p></p>
        <div id="table-container">
          <Divider />
          <p></p>
          <EnhancedTable
            headings={headings}
            loadData={getData}
            dataUpdated={state.isDataUpdated}
            editData={handleItemClick}
            boxChecked={handleBoxChecked}
            onDelete={handleDelete}
            filterOption="firstname"
          />
        </div>
      </div>
    </div>
  );
}; //Employee
