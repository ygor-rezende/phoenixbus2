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
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import EditIcon from "@mui/icons-material/Edit";

import { MuiTelInput } from "mui-tel-input";
import EnhancedTable from "../utils/table_generic";

const reducer = (prevState, upadatedProp) => ({
  ...prevState,
  ...upadatedProp,
});

const listOfStates = [
  "Alabama",
  "Alaska",
  "Arizona",
  "Arkansas",
  "California",
  "Colorado",
  "Connecticut",
  "Delaware",
  "Florida",
  "Georgia",
  "Hawaii",
  "Idaho",
  "Illinois",
  "Indiana",
  "Iowa",
  "Kansas",
  "Kentucky",
  "Louisiana",
  "Maine",
  "Maryland",
  "Massachusetts",
  "Michigan",
  "Minnesota",
  "Mississippi",
  "Missouri",
  "Montana",
  "Nebraska",
  "Nevada",
  "New Hampshire",
  "New Jersey",
  "New Mexico",
  "New York",
  "North Carolina",
  "North Dakota",
  "Ohio",
  "Oklahoma",
  "Oregon",
  "Pennsylvania",
  "Rhode Island",
  "South Carolina",
  "South Dakota",
  "Tennessee",
  "Texas",
  "Utah",
  "Vermont",
  "Virginia",
  "Washington",
  "West Virginia",
  "Wisconsin",
  "Wyoming",
];

const initialState = {
  clientId: "",
  agency: "",
  contact: "",
  address1: "",
  address2: "",
  city: "",
  state: null,
  zip: "",
  country: "US",
  phone: "",
  fax: "",
  email: "",
  remark: "",
  openSnakbar: false,
  error: null,
  success: false,
  clientsData: [],
  onEditMode: false,
  expandPanel: false,
  isDataUpdated: false,
  invalidField: "",
};

export const AddClient = () => {
  const [state, setState] = useReducer(reducer, initialState);

  //Get all clients data
  const getData = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVERURL}/getallclients`
      );
      let responseData = await response.json();
      responseData = responseData.map((item) => {
        const client = {
          id: item.client_id,
          agency: item.agency,
          contact: item.contact,
          address1: item.address1,
          address2: item.address2,
          city: item.city,
          state: item.client_state,
          zip: item.zip,
          country: item.country,
          phone: item.phone,
          fax: item.fax,
          email: item.email,
          remark: item.remark,
        };
        return client;
      });
      setState({ clientsData: responseData });
      return responseData;
    } catch (err) {
      console.error(err);
    }
  };

  //handle updates in the fields
  const handleOnChange = (e) => setState({ [e.target.id]: e.target.value });

  //handle changes on phone field
  const handlePhoneChange = (value, info) => {
    setState({ phone: value });
  };

  //handle changes on fax field
  const handleFaxChange = (value, info) => {
    setState({ fax: value });
  };

  //validate the form fields
  const isFormValid = () => {
    if (!state.agency) {
      setState({ invalidField: "agency" });
      return;
    }

    if (!state.contact) {
      setState({ invalidField: "contact" });
      return;
    }

    if (!state.address1) {
      setState({ invalidField: "address1" });
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

    if (!state.country) {
      setState({ invalidField: "country" });
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
        `${process.env.REACT_APP_SERVERURL}/createclient`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            client: {
              agency: state.agency,
              contact: state.contact,
              address1: state.address1,
              address2: state.address2,
              city: state.city,
              state: state.state,
              zip: state.zip,
              country: state.country,
              phone: state.phone,
              fax: state.fax,
              email: state.email,
              remark: state.remark,
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
        setState({
          msg: data,
          error: null,
          success: true,
          openSnakbar: true,
          agency: "",
          contact: "",
          address1: "",
          address2: "",
          city: "",
          state: null,
          zip: "",
          country: "US",
          phone: "",
          fax: "",
          email: "",
          remark: "",
          expandPanel: false,
          isDataUpdated: !state.isDataUpdated,
        });
      }
    } catch (err) {
      console.error(err);
    }
  }; //handleSubmit

  //Cancel editing
  const cancelEditing = () => {
    setState({
      expandPanel: false,
      onEditMode: false,
      invalidField: "",
      agency: "",
      contact: "",
      address1: "",
      address2: "",
      city: "",
      state: null,
      zip: "",
      country: "US",
      phone: "",
      fax: "",
      email: "",
      remark: "",
    });
  };

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
      const clientToUpdate = {
        id: state.clientId,
        agency: state.agency,
        contact: state.contact,
        address1: state.address1,
        address2: state.address2,
        city: state.city,
        state: state.state,
        zip: state.zip,
        country: state.country,
        phone: state.phone,
        fax: state.fax,
        email: state.email,
        remark: state.remark,
      };

      console.log(clientToUpdate);
      const response = await fetch(
        `${process.env.REACT_APP_SERVERURL}/updateclient`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ client: clientToUpdate }),
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
        setState({
          msg: responseMsg,
          error: null,
          success: true,
          openSnakbar: true,
          clientId: "",
          agency: "",
          contact: "",
          address1: "",
          address2: "",
          city: "",
          state: null,
          zip: "",
          country: "US",
          phone: "",
          fax: "",
          email: "",
          remark: "",
          expandPanel: false,
          onEditMode: false,
          isDataUpdated: !state.isDataUpdated,
        });
      }
    } catch (err) {
      console.error(err);
    }
  }; //handleSaveChanges

  //Delete one or more records from the database
  const handleDelete = async (itemsSelected) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVERURL}/deleteclient`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ clientIds: itemsSelected }),
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
        setState({
          msg: responseMsg,
          error: null,
          success: true,
          openSnakbar: true,
          clientId: "",
          agency: "",
          contact: "",
          address1: "",
          address2: "",
          city: "",
          state: null,
          zip: "",
          country: "US",
          phone: "",
          fax: "",
          email: "",
          remark: "",
          expandPanel: false,
          onEditMode: false,
          isDataUpdated: !state.isDataUpdated,
        });
      }
    } catch (err) {
      console.error(err);
    }
  }; //handleDelete

  //Show information when clicking on a table row
  const handleItemClick = (id) => {
    //load fields
    console.log(state.clientsData.filter((e) => e.id === id));
    setState({
      onEditMode: true,
      expandPanel: true,
      clientId: id,
      invalidField: "",
      agency: state.clientsData.filter((e) => e.id === id)[0].agency,
      contact: state.clientsData.filter((e) => e.id === id)[0].contact,
      address1: state.clientsData.filter((e) => e.id === id)[0].address1,
      address2: state.clientsData.filter((e) => e.id === id)[0].address2,
      city: state.clientsData.filter((e) => e.id === id)[0].city,
      state: state.clientsData.filter((e) => e.id === id)[0].state,
      zip: state.clientsData.filter((e) => e.id === id)[0].zip,
      country: state.clientsData.filter((e) => e.id === id)[0].country,
      phone: state.clientsData.filter((e) => e.id === id)[0].phone,
      fax: state.clientsData.filter((e) => e.id === id)[0].fax,
      email: state.clientsData.filter((e) => e.id === id)[0].email,
      remark: state.clientsData.filter((e) => e.id === id)[0].remark,
    });
  }; //handleItemClick

  //cancel editing when a checkbox is selected
  const handleBoxChecked = (isItemChecked) => {
    if (isItemChecked) cancelEditing();
  };

  //table headings
  const headings = [
    {
      id: "agency",
      isNumeric: false,
      isPaddingDisabled: false,
      label: "Agency",
    },
    {
      id: "contact",
      isNumeric: false,
      isPaddingDisabled: false,
      label: "Contact",
    },
    { id: "city", isNumeric: false, isPaddingDisabled: false, label: "City" },
    { id: "phone", isNumeric: false, isPaddingDisabled: false, label: "Phone" },
    { id: "fax", isNumeric: false, isPaddingDisabled: false, label: "Fax" },
    {
      id: "email",
      isNumeric: false,
      isPaddingDisabled: false,
      label: "E-Mail",
    },
  ];

  return (
    <div className="client-container">
      <div className="client-container-box">
        <form>
          <Accordion
            expanded={state.expandPanel}
            onChange={() => setState({ expandPanel: !state.expandPanel })}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              {state.onEditMode ? (
                <Box sx={{ display: "inline-flex" }}>
                  <Typography sx={{ fontWeight: "bold", color: "#1976d2" }}>
                    EDITING CLIENT
                  </Typography>
                  <EditIcon style={{ color: "#1976d2", marginLeft: "10px" }} />
                </Box>
              ) : (
                <Box sx={{ display: "inline-flex" }}>
                  <Typography sx={{ fontWeight: "bold", color: "#1976d2" }}>
                    NEW CLIENT
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
                  error={state.invalidField === "agency"}
                  helperText={
                    state.invalidField === "agency"
                      ? "Information required"
                      : ""
                  }
                  className="textfield"
                  id="agency"
                  required
                  label="Agency"
                  type="text"
                  placeholder="Agency"
                  value={state.agency}
                  onChange={handleOnChange}
                />
                <TextField
                  error={state.invalidField === "contact"}
                  helperText={
                    state.invalidField === "contact"
                      ? "Information required"
                      : ""
                  }
                  className="textfield"
                  id="contact"
                  required
                  label="Contact"
                  type="text"
                  placeholder="Contact"
                  value={state.contact}
                  onChange={handleOnChange}
                />

                <TextField
                  error={state.invalidField === "address1"}
                  helperText={
                    state.invalidField === "address1"
                      ? "Information required"
                      : ""
                  }
                  className="textfield"
                  id="address1"
                  required
                  label="Address 1"
                  type="text"
                  placeholder="Address 1"
                  value={state.address1}
                  onChange={handleOnChange}
                />

                <TextField
                  className="textfield"
                  id="address2"
                  label="Address 2"
                  type="text"
                  placeholder="Address 2"
                  value={state.address2}
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

                <TextField
                  error={state.invalidField === "country"}
                  helperText={
                    state.invalidField === "country"
                      ? "Information required"
                      : ""
                  }
                  className="textfield"
                  id="country"
                  required
                  label="Country"
                  type="text"
                  placeholder="Country"
                  value={state.country}
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

                <MuiTelInput
                  className="textfield"
                  id="fax"
                  defaultCountry="US"
                  label="Fax"
                  type="tel"
                  placeholder="Fax"
                  onlyCountries={["US", "CA"]}
                  inputProps={{ maxLength: 15 }}
                  value={state.fax}
                  onChange={handleFaxChange}
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
                  className="textfield"
                  id="remark"
                  label="Remarks"
                  type="text"
                  placeholder="Remarks"
                  multiline
                  rows={4}
                  value={state.remark}
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
                  Save New Client
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
              <AlertTitle>Clients Updated</AlertTitle>
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
            filterOption="agency"
          />
        </div>
      </div>
    </div>
  );
};
