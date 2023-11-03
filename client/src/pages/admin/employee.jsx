import { useReducer } from "react";
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
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import EditIcon from "@mui/icons-material/Edit";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

import { MuiTelInput } from "mui-tel-input";
import EnhancedTable from "../../utils/table_generic";

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
  firstname: "",
  lastname: "",
  birth: dayjs("2010-01-01"),
  title: "",
  hireDate: "",
  ssn: "",
  address: "",
  city: "",
  state: null,
  country: "US",
  zip: "",
  phone: "",
  email: "",
  medicalCard: false,
  medicalExpDate: "",
  i9: false,
  drugFree: false,
  driverLicenceExpDate: "",
  it: "",
  nationalReg: "",
  experience: "",
  cldTag: "",
  insurance: "",
  insuranceExpDate: "",
  mc: "",
  pointOfContact: "",
  emergencyContact: "",
  maritalStatus: "",
  notes: "",
  openSnakbar: false,
  error: null,
  success: false,
  employeesData: [],
  onEditMode: false,
  expandPanel: false,
  isDataUpdated: false,
  invalidField: "",
};

export const Employee = () => {
  const [state, setState] = useReducer(reducer, initialState);

  //Get all employee data
  const getData = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVERURL}/getallemployees`
      );
      let responseData = await response.json();
      responseData = responseData.map((item) => {
        const employee = {
          id: item.employee_id,
          firstname: item.firstname,
          lastname: item.lastname,
          birth: item.birth,
          title: item.title,
          hireDate: item.hire_date,
          address: item.address,
          city: item.city,
          state: item.state,
          zip: item.zip,
          phone: item.phone,
          email: item.email,
          medicalCard: item.medical_card,
          i9: item.i9,
          drugFree: item.drug_free,
          driverLicenceExpDate: item.drive_license_exp_date,
          it: item.it_number,
          nationalReg: item.national_reg,
          experience: item.experience,
          cldTag: item.cdl_tag,
          insurance: item.insurance,
          insuranceExpDate: item.insurance_exp_date,
          mc: item.mc,
          pointOfContact: item.point_contact,
          emergencyContact: item.emergency_contact,
          maritalStatus: item.marital_status,
          notes: item.notes,
        };
        return employee;
      });
      setState({ employeesData: responseData });
      return responseData;
    } catch (err) {
      console.error(err);
    }
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
    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVERURL}/createemployee`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
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
            },
          }),
        }
      );

      const data = await response.json();
      console.log(data);
      //if an error happens when signing up set the error
      if (data.msg) {
        setState({ success: false, error: data.msg, openSnakbar: true });
      } else {
        //if no error set success and reset intial state
        clearState(data);
      }
    } catch (err) {
      console.error(err);
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
      firstname: "",
      lastname: "",
      birth: "",
      title: "",
      hireDate: "",
      ssn: "",
      address: "",
      city: "",
      state: null,
      country: "US",
      zip: "",
      phone: "",
      email: "",
      medicalCard: false,
      medicalExpDate: "",
      i9: false,
      drugFree: false,
      driverLicenceExpDate: "",
      it: "",
      nationalReg: "",
      experience: "",
      cldTag: "",
      insurance: "",
      insuranceExpDate: "",
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
      lastname: "",
      birth: "",
      title: "",
      hireDate: "",
      ssn: "",
      address: "",
      city: "",
      state: null,
      country: "US",
      zip: "",
      phone: "",
      email: "",
      medicalCard: false,
      medicalExpDate: "",
      i9: false,
      drugFree: false,
      driverLicenceExpDate: "",
      it: "",
      nationalReg: "",
      experience: "",
      cldTag: "",
      insurance: "",
      insuranceExpDate: "",
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
    try {
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
      };

      console.log(employeeToUpdate);
      const response = await fetch(
        `${process.env.REACT_APP_SERVERURL}/updateemployee`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ employee: employeeToUpdate }),
        }
      );
      if (!response.ok) {
        throw new Error(response.status);
      }
      const responseMsg = await response.json();
      console.log(responseMsg);
      if (responseMsg.failed) {
        console.log(responseMsg.failed);
        setState({
          success: false,
          error: responseMsg.failed,
          openSnakbar: true,
        });
      } else {
        //if no error set success and reset intial state
        clearState(responseMsg);
      }
    } catch (err) {
      console.error(err);
    }
  }; //handleSaveChanges

  //Delete one or more records from the database
  const handleDelete = async (itemsSelected) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVERURL}/deleteemployee`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ employeeIds: itemsSelected }),
        }
      );
      if (!response.ok) {
        throw new Error(response.status);
      }
      const responseMsg = await response.json();
      console.log(responseMsg);
      if (responseMsg.failed) {
        console.log(responseMsg.failed);
        setState({
          success: false,
          error: responseMsg.failed,
          openSnakbar: true,
        });
      } else {
        //update state and reload the data
        clearState(responseMsg);
      }
    } catch (err) {
      console.error(err);
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
      firstname: state.employeesData.filter((e) => e.id === id)[0].firstname,
      lastname: state.employeesData.filter((e) => e.id === id)[0].lastname,
      address: state.employeesData.filter((e) => e.id === id)[0].address,
      city: state.employeesData.filter((e) => e.id === id)[0].city,
      state: state.employeesData.filter((e) => e.id === id)[0].state,
      zip: state.employeesData.filter((e) => e.id === id)[0].zip,
      phone: state.employeesData.filter((e) => e.id === id)[0].phone,
      email: state.employeesData.filter((e) => e.id === id)[0].email,
      birth: state.employeesData.filter((e) => e.id === id)[0].birth,
      title: state.employeesData.filter((e) => e.id === id)[0].title,
      insurance: state.employeesData.filter((e) => e.id === id)[0].insurance,
      hireDate: state.employeesData.filter((e) => e.id === id)[0].hireDate,
      medicalCard: state.employeesData.filter((e) => e.id === id)[0]
        .medicalCard,
      i9: state.employeesData.filter((e) => e.id === id)[0].i9,
      drugFree: state.employeesData.filter((e) => e.id === id)[0].drugFree,
      driverLicenceExpDate: state.employeesData.filter((e) => e.id === id)[0]
        .driverLicenceExpDate,
      it: state.employeesData.filter((e) => e.id === id)[0].it,
      nationalReg: state.employeesData.filter((e) => e.id === id)[0]
        .nationalReg,
      experience: state.employeesData.filter((e) => e.id === id)[0].experience,
      cldTag: state.employeesData.filter((e) => e.id === id)[0].cldTag,
      insuranceExpDate: state.employeesData.filter((e) => e.id === id)[0]
        .insuranceExpDate,
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

                <LocalizationProvider dateAdapter={AdapterDayjs}>
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
                    required
                    placeholder="Birth Date"
                    value={dayjs(state.birth)}
                    onChange={(newValue) => setState({ birth: newValue })}
                  />
                </LocalizationProvider>

                <TextField
                  error={state.invalidField === "title"}
                  helperText={
                    state.invalidField === "title" ? "Information required" : ""
                  }
                  className="textfield"
                  id="title"
                  required
                  label="Title"
                  type="text"
                  placeholder="Title"
                  value={state.title}
                  onChange={handleOnChange}
                />

                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    error={state.invalidField === "hireDate"}
                    helperText={
                      state.invalidField === "hireDate"
                        ? "Information required"
                        : ""
                    }
                    className="textfield"
                    id="hireDate"
                    required
                    label="Hire Date"
                    placeholder="Hire Date"
                    value={dayjs(state.hireDate)}
                    onChange={(newValue) => setState({ hireDate: newValue })}
                  />
                </LocalizationProvider>

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

                <TextField
                  error={state.invalidField === "medicalCard"}
                  helperText={
                    state.invalidField === "medicalCard"
                      ? "Information required"
                      : ""
                  }
                  className="textfield"
                  id="medicalCard"
                  required
                  label="Medical card"
                  type="text"
                  placeholder="Medical card"
                  value={state.medicalCard}
                  onChange={handleOnChange}
                />

                <TextField
                  error={state.invalidField === "i9"}
                  helperText={
                    state.invalidField === "i9" ? "Information required" : ""
                  }
                  className="textfield"
                  id="i9"
                  required
                  label="I9"
                  type="text"
                  placeholder="I9"
                  value={state.i9}
                  onChange={handleOnChange}
                />

                <TextField
                  error={state.invalidField === "drugFree"}
                  helperText={
                    state.invalidField === "drugFree"
                      ? "Information required"
                      : ""
                  }
                  className="textfield"
                  id="drugFree"
                  required
                  label="Drug Free"
                  type="text"
                  placeholder="Drug Free"
                  value={state.drugFree}
                  onChange={handleOnChange}
                />

                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    className="textfield"
                    id="driverLicenceExpDate"
                    label="Driver Licence Expire Date"
                    placeholder="Driver Licence Expire Date"
                    value={dayjs(state.driverLicenceExpDate)}
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
                  id="experience"
                  label="Experience"
                  type="text"
                  placeholder="Experience"
                  value={state.experience}
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

                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    className="textfield"
                    id="insuranceExpDate"
                    label="Insurance Expire Date"
                    placeholder="Insurance Expire Date"
                    value={dayjs(state.insuranceExpDate)}
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
