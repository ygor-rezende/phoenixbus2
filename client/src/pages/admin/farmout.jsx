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
import AddBusinessIcon from "@mui/icons-material/AddBusiness";

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
  companyId: "",
  name: "",
  contact: "",
  address: "",
  city: "",
  state: null,
  zip: "",
  phone: "",
  email: "",
  ein: "",
  dot: "",
  insurance: "",
  account: "",
  routing: "",
  wire: "",
  zelle: "",
  openSnakbar: false,
  error: null,
  success: false,
  companiesData: [],
  onEditMode: false,
  expandPanel: false,
  isDataUpdated: false,
  invalidField: "",
};

export const FarmOut = () => {
  const [state, setState] = useReducer(reducer, initialState);

  //Get all companies data
  const getData = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVERURL}/getallcompanies`
      );
      let responseData = await response.json();
      responseData = responseData.map((item) => {
        const company = {
          id: item.company_id,
          name: item.company_name,
          contact: item.contact,
          address: item.address,
          city: item.city,
          state: item.company_state,
          zip: item.zip,
          phone: item.phone,
          email: item.email,
          ein: item.ein,
          dot: item.dot,
          insurance: item.insurance,
          account: item.account,
          routing: item.routing,
          wire: item.wire,
          zelle: item.zelle,
        };
        return company;
      });
      setState({ companiesData: responseData });
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
    if (!state.name) {
      setState({ invalidField: "name" });
      return;
    }

    if (!state.contact) {
      setState({ invalidField: "contact" });
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
        `${process.env.REACT_APP_SERVERURL}/createcompany`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            company: {
              name: state.name,
              contact: state.contact,
              address: state.address,
              city: state.city,
              state: state.state,
              zip: state.zip,
              phone: state.phone,
              email: state.email,
              remark: state.remark,
              ein: state.ein,
              dot: state.dot,
              insurance: state.insurance,
              account: state.account,
              routing: state.routing,
              wire: state.wire,
              zelle: state.zelle,
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
          name: "",
          contact: "",
          address: "",
          city: "",
          state: null,
          zip: "",
          phone: "",
          email: "",
          ein: "",
          dot: "",
          insurance: "",
          account: "",
          routing: "",
          wire: "",
          zelle: "",
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
      name: "",
      contact: "",
      address: "",
      city: "",
      state: null,
      zip: "",
      phone: "",
      email: "",
      ein: "",
      dot: "",
      insurance: "",
      account: "",
      routing: "",
      wire: "",
      zelle: "",
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
      const companyToUpdate = {
        id: state.companyId,
        name: state.name,
        contact: state.contact,
        address: state.address,
        city: state.city,
        state: state.state,
        zip: state.zip,
        phone: state.phone,
        email: state.email,
        remark: state.remark,
        ein: state.ein,
        dot: state.dot,
        insurance: state.insurance,
        account: state.account,
        routing: state.routing,
        wire: state.wire,
        zelle: state.zelle,
      };

      console.log(companyToUpdate);
      const response = await fetch(
        `${process.env.REACT_APP_SERVERURL}/updatecompany`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ company: companyToUpdate }),
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
          companyId: "",
          name: "",
          contact: "",
          address: "",
          city: "",
          state: null,
          zip: "",
          phone: "",
          email: "",
          ein: "",
          dot: "",
          insurance: "",
          account: "",
          routing: "",
          wire: "",
          zelle: "",
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
        `${process.env.REACT_APP_SERVERURL}/deletecompany`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ companyIds: itemsSelected }),
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
          companyId: "",
          name: "",
          contact: "",
          address: "",
          city: "",
          state: null,
          zip: "",
          phone: "",
          email: "",
          ein: "",
          dot: "",
          insurance: "",
          account: "",
          routing: "",
          wire: "",
          zelle: "",
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
    console.log(state.companiesData.filter((e) => e.id === id));
    setState({
      onEditMode: true,
      expandPanel: true,
      companyId: id,
      invalidField: "",
      name: state.companiesData.filter((e) => e.id === id)[0].name,
      contact: state.companiesData.filter((e) => e.id === id)[0].contact,
      address: state.companiesData.filter((e) => e.id === id)[0].address,
      city: state.companiesData.filter((e) => e.id === id)[0].city,
      state: state.companiesData.filter((e) => e.id === id)[0].state,
      zip: state.companiesData.filter((e) => e.id === id)[0].zip,
      phone: state.companiesData.filter((e) => e.id === id)[0].phone,
      email: state.companiesData.filter((e) => e.id === id)[0].email,
      ein: state.companiesData.filter((e) => e.id === id)[0].ein,
      dot: state.companiesData.filter((e) => e.id === id)[0].dot,
      insurance: state.companiesData.filter((e) => e.id === id)[0].insurance,
      account: state.companiesData.filter((e) => e.id === id)[0].account,
      routing: state.companiesData.filter((e) => e.id === id)[0].routing,
      wire: state.companiesData.filter((e) => e.id === id)[0].wire,
      zelle: state.companiesData.filter((e) => e.id === id)[0].zelle,
    });
  }; //handleItemClick

  //cancel editing when a checkbox is selected
  const handleBoxChecked = (isItemChecked) => {
    if (isItemChecked) cancelEditing();
  };

  //table headings
  const headings = [
    {
      id: "name",
      isNumeric: false,
      isPaddingDisabled: false,
      label: "Name",
    },
    {
      id: "contact",
      isNumeric: false,
      isPaddingDisabled: false,
      label: "Contact",
    },
    { id: "city", isNumeric: false, isPaddingDisabled: false, label: "City" },
    { id: "phone", isNumeric: false, isPaddingDisabled: false, label: "Phone" },
    {
      id: "email",
      isNumeric: false,
      isPaddingDisabled: false,
      label: "E-Mail",
    },
  ];

  return (
    <div className="company-container">
      <div className="company-container-box">
        <form>
          <Accordion
            expanded={state.expandPanel}
            onChange={() => setState({ expandPanel: !state.expandPanel })}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              {state.onEditMode ? (
                <Box sx={{ display: "inline-flex" }}>
                  <Typography sx={{ fontWeight: "bold", color: "#1976d2" }}>
                    EDITING COMPANY
                  </Typography>
                  <EditIcon style={{ color: "#1976d2", marginLeft: "10px" }} />
                </Box>
              ) : (
                <Box sx={{ display: "inline-flex" }}>
                  <Typography sx={{ fontWeight: "bold", color: "#1976d2" }}>
                    NEW COMPANY
                  </Typography>
                  <AddBusinessIcon
                    style={{ color: "#1976d2", marginLeft: "10px" }}
                  />
                </Box>
              )}
            </AccordionSummary>
            <AccordionDetails>
              <Box className="fieldsbox1">
                <TextField
                  error={state.invalidField === "name"}
                  helperText={
                    state.invalidField === "name" ? "Information required" : ""
                  }
                  className="textfield"
                  id="name"
                  required
                  label="Name"
                  type="text"
                  placeholder="Name"
                  value={state.name}
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
                  className="textfield"
                  id="ein"
                  label="EIN number"
                  type="text"
                  placeholder="EIN number"
                  value={state.ein}
                  onChange={handleOnChange}
                />

                <TextField
                  className="textfield"
                  id="dot"
                  label="DOT number"
                  type="text"
                  placeholder="DOT number"
                  value={state.dot}
                  onChange={handleOnChange}
                />

                <TextField
                  className="textfield"
                  id="insurance"
                  label="Insurance $"
                  type="text"
                  placeholder="Insurance $"
                  value={state.insurance}
                  onChange={handleOnChange}
                />

                <TextField
                  className="textfield"
                  id="account"
                  label="Account number"
                  type="text"
                  placeholder="Account number"
                  value={state.account}
                  onChange={handleOnChange}
                />

                <TextField
                  className="textfield"
                  id="routing"
                  label="Routing"
                  type="text"
                  placeholder="Routing"
                  value={state.routing}
                  onChange={handleOnChange}
                />

                <TextField
                  className="textfield"
                  id="wire"
                  label="Wire"
                  type="text"
                  placeholder="Wire"
                  value={state.wire}
                  onChange={handleOnChange}
                />

                <TextField
                  className="textfield"
                  id="zelle"
                  label="Zelle"
                  type="text"
                  placeholder="Zelle"
                  value={state.zelle}
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
                  Save New Company
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
              <AlertTitle>Companies Updated</AlertTitle>
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
            filterOption="name"
          />
        </div>
      </div>
    </div>
  );
}; //FarmOut
