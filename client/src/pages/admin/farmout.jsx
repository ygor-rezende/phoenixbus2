import { useEffect, useReducer, useRef } from "react";
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

import { useNavigate, useLocation } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import {
  UsePrivatePost,
  UsePrivateDelete,
  UsePrivateGet,
  UsePrivatePut,
} from "../../hooks/useFetchServer";

import GoogleAutoComplete from "../../api/google_place";

import { validateEmail } from "../../utils/validators";

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
  searchAddress: "",
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

  const { setAuth, auth } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const effectRun = useRef(false);

  const getServer = UsePrivateGet();
  const postServer = UsePrivatePost();
  const putServer = UsePrivatePut();
  const deleteServer = UsePrivateDelete();

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    //Get all companies data
    const getCompaniesData = async () => {
      const response = await getServer("/getallcompanies", controller.signal);
      if (response.disconnect) {
        setAuth({});
        navigate("/login", { state: { from: location }, replace: true });
        //other errors
      } else if (response.error) {
        setState({
          success: false,
          error: response.error,
          openSnakbar: true,
        });
      }
      //no error
      else {
        let responseData = response.data;
        responseData = responseData?.map((item) => {
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
        isMounted && setState({ companiesData: responseData });
      }
    }; //getCompaniesData

    if (process.env.NODE_ENV === "development") {
      effectRun.current && getCompaniesData();
    } else {
      getCompaniesData();
    }

    return () => {
      isMounted = false;
      controller.abort();
      effectRun.current = true;
    };
  }, [state.isDataUpdated]);

  //Get all companies data
  const getData = () => {
    return state.companiesData;
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

    if (!state.email || !validateEmail(state.email)) {
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

    const response = await postServer("/createcompany", {
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
        changeUser: auth.userName,
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

  const clearState = (msg) => {
    setState({
      msg: msg,
      error: null,
      success: true,
      openSnakbar: true,
      name: "",
      contact: "",
      searchAddress: "",
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
      onEditMode: false,
    });
  };

  //Cancel editing
  const cancelEditing = () => {
    setState({
      expandPanel: false,
      onEditMode: false,
      invalidField: "",
      name: "",
      contact: "",
      searchAddress: "",
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
      changeUser: auth.userName,
    };

    const response = await putServer("/updatecompany", {
      company: companyToUpdate,
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
    const companyIds = JSON.stringify(itemsSelected);
    const response = await deleteServer(
      `/deletecompany/${companyIds}/${auth.userName}`
    );

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
    console.log(state.companiesData.filter((e) => e.id === id));
    setState({
      onEditMode: true,
      expandPanel: true,
      companyId: id,
      invalidField: "",
      searchAddress: "",
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

                <GoogleAutoComplete
                  updateFields={updateAddress}
                  value={state.searchAddress}
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
                    className="autocomplete"
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
            filterOptions={[{ id: "name", name: "Name" }]}
          />
        </div>
      </div>
    </div>
  );
}; //FarmOut
