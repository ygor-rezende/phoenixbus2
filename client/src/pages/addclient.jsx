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
  Tooltip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import EditIcon from "@mui/icons-material/Edit";
import { MuiTelInput } from "mui-tel-input";
import EnhancedTable from "../utils/table_generic";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

import MenuBookIcon from "@mui/icons-material/MenuBook";
import CloseIcon from "@mui/icons-material/Close";

import dayjs from "dayjs";

import {
  UsePrivateGet,
  UsePrivatePost,
  UsePrivateDelete,
  UsePrivatePut,
} from "../hooks/useFetchServer";

import { useNavigate, useLocation, Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import GoogleAutoComplete from "../api/google_place";

import { validateEmail } from "../utils/validators";
import { getServiceName } from "../utils/getServiceName";

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
  clientId: "",
  agency: "",
  contact: "",
  searchAddress: "",
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
  bookings: [],
  viewBookings: false,
  invoices: [],
  showServices: new Map(),
};

export const AddClient = () => {
  const [state, setState] = useReducer(reducer, initialState);

  const effectRun = useRef(false);

  const { setAuth, auth } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const getServer = UsePrivateGet();
  const postServer = UsePrivatePost();
  const putServer = UsePrivatePut();
  const deleteServer = UsePrivateDelete();

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    //Get all clients data
    const getClientsData = async () => {
      const response = await getServer("/getallclients", controller.signal);

      if (response.disconnect) {
        setAuth({});
        navigate("/login", { state: { from: location }, replace: true });
        //other errors
      } else if (response.error) {
        setState({ success: false, error: response.error, openSnakbar: true });
      }
      //no error
      else {
        let responseData = response.data;
        responseData = responseData?.map((item) => {
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
            historyIcon: (
              <Tooltip title="View Bookings">
                <IconButton
                  onClick={() => handleBookingHistory(item.client_id)}
                >
                  <MenuBookIcon color="primary" fontSize="small" />
                </IconButton>
              </Tooltip>
            ),
          };
          return client;
        });
        isMounted && setState({ clientsData: responseData });
      }
    }; //getClientsData

    if (process.env.NODE_ENV === "development") {
      effectRun.current && getClientsData();
    } else {
      getClientsData();
    }

    return () => {
      isMounted = false;
      controller.abort();
      effectRun.current = true;
    };
  }, [state.isDataUpdated]);

  const handleBookingHistory = async (clientId) => {
    const controller = new AbortController();
    const response = await getServer(
      `/getbookingsbyclient/${clientId}`,
      controller.signal
    );

    if (response.disconnect) {
      setAuth({});
      navigate("/login", { state: { from: location }, replace: true });
      //other errors
    } else if (response.error) {
      setState({ success: false, error: response.error, openSnakbar: true });
    }
    //no error
    else {
      let responseData = response.data;

      //find unique invoices
      let invoices = responseData?.map((element) => {
        return {
          invoice: element.invoice,
          category: element.category,
          numPeople: element.num_people,
          bookingDate: element.booking_date,
          tripStartDate: element.trip_start_date,
        };
      });
      invoices = [...new Map(invoices.map((e) => [e["invoice"], e])).values()];
      setState({
        bookings: responseData,
        viewBookings: true,
        invoices: invoices,
      });
    }
  };

  //Get all clients data
  const getData = () => {
    return state.clientsData;
  }; //loadData

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

    if (!state.email || !validateEmail(state.email)) {
      setState({ invalidField: "email" });
      return;
    }

    setState({ invalidField: "" });
    return true;
  }; //isFormValid

  //handle create client
  const handleSubmit = async () => {
    //validate form
    if (!isFormValid()) {
      return;
    }

    const response = await postServer("/createclient", {
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
      agency: "",
      contact: "",
      searchAddress: "",
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
      onEditMode: false,
    });
  };

  //Cancel editing
  const cancelEditing = () => {
    setState({
      expandPanel: false,
      onEditMode: false,
      invalidField: "",
      agency: "",
      contact: "",
      searchAddress: "",
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
      changeUser: auth.userName,
    };

    const response = await putServer("/updateclient", {
      client: clientToUpdate,
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
    const clientIds = JSON.stringify(itemsSelected);
    const response = await deleteServer(
      `/deleteclient/${clientIds}/${auth.userName}`
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
    //console.log(state.clientsData.filter((e) => e.id === id));
    setState({
      onEditMode: true,
      expandPanel: true,
      clientId: id,
      invalidField: "",
      searchAddress: "",
      agency: state.clientsData?.find((e) => e.id === id)?.agency,
      contact: state.clientsData?.find((e) => e.id === id)?.contact,
      address1: state.clientsData?.find((e) => e.id === id)?.address1,
      address2: state.clientsData?.find((e) => e.id === id)?.address2,
      city: state.clientsData?.find((e) => e.id === id)?.city,
      state: state.clientsData?.find((e) => e.id === id)?.state,
      zip: state.clientsData?.find((e) => e.id === id)?.zip,
      country: state.clientsData?.find((e) => e.id === id)?.country,
      phone: state.clientsData?.find((e) => e.id === id)?.phone,
      fax: state.clientsData?.find((e) => e.id === id)?.fax,
      email: state.clientsData?.find((e) => e.id === id)?.email,
      remark: state.clientsData?.find((e) => e.id === id)?.remark,
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
      address1: address1,
      city: city,
      state: state,
      zip: zip,
      country: country,
    });
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
    {
      id: "historyIcon",
      isNumeric: false,
      isPaddingDisabled: false,
      label: "Bookings",
    },
  ];

  //showServices to true or false
  const handleExpandShrink = (index) => {
    let lines = new Map(state.showServices);
    lines.set(index, !lines.get(index));
    setState({ showServices: lines });
  };

  const handleCloseBookingsDialog = () => {
    //shrink all services that are shown
    setState({ viewBookings: false, showServices: new Map() });
  };

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
                    className="autocomplete"
                    required
                    value={state.state}
                    onChange={(e, newValue) => setState({ state: newValue })}
                    options={listOfStates}
                    sx={{ width: 200 }}
                    getOptionLabel={(option) => option.toString()}
                    isOptionEqualToValue={(option, value) => option === value}
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
                  className="textfield"
                  id="phone"
                  defaultCountry="US"
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
            filterOptions={[{ id: "agency", name: "Agency" }]}
          />
        </div>

        <Dialog
          onClose={handleCloseBookingsDialog}
          open={state.viewBookings}
          maxWidth="lg"
          fullWidth
        >
          <Tooltip
            title="Close"
            style={{ alignSelf: "flex-end", paddingBottom: 0 }}
          >
            <IconButton onClick={handleCloseBookingsDialog}>
              <CloseIcon />
            </IconButton>
          </Tooltip>
          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <MenuBookIcon style={{ color: "#1976d2" }} />
            <DialogTitle color="primary">
              {state.bookings?.length > 0
                ? `Booking History for ${state.bookings[0]?.agency}`
                : "No Bookings"}
            </DialogTitle>
          </Box>

          <DialogContent>
            {state.invoices?.map((row, index) => {
              return (
                <Table
                  size="small"
                  style={{ marginBottom: "1em" }}
                  key={row.invoice}
                >
                  <TableHead>
                    <TableRow sx={{ bgcolor: "primary.main" }}>
                      <TableCell
                        colSpan={2}
                        style={{ color: "white", fontWeight: "bold" }}
                      >
                        <Link
                          to={`/bookings/${row.invoice}`}
                          title="Go to Invoice"
                          style={{ color: "white" }}
                        >
                          {row.invoice}
                        </Link>
                      </TableCell>
                      <TableCell style={{ color: "white" }}>
                        Booking Date: {dayjs(row.bookingDate).format("l")}
                      </TableCell>
                      <TableCell style={{ color: "white" }}>
                        Trip Date: {dayjs(row.tripStartDate).format("l")}
                      </TableCell>
                      <TableCell colSpan={2} style={{ color: "white" }}>
                        Category: {row.category}
                      </TableCell>
                      <TableCell style={{ color: "white" }}>
                        {row.numPeople} people
                      </TableCell>
                      <TableCell style={{ color: "white" }} align="right">
                        {state.showServices.get(index) === true ? (
                          <Tooltip title="Shrink">
                            <IconButton
                              onClick={() => handleExpandShrink(index)}
                              size="small"
                              sx={{ bgcolor: "whitesmoke" }}
                            >
                              <ExpandLessIcon color="primary" />
                            </IconButton>
                          </Tooltip>
                        ) : (
                          <Tooltip title="Expand">
                            <IconButton
                              onClick={() => handleExpandShrink(index)}
                              size="small"
                              sx={{ bgcolor: "whitesmoke" }}
                            >
                              <ExpandMoreIcon color="primary" />
                            </IconButton>
                          </Tooltip>
                        )}
                      </TableCell>
                    </TableRow>
                    {state.showServices.get(index) === true ? (
                      <TableRow>
                        <TableCell style={{ fontWeight: "bold" }} colSpan={3}>
                          Service
                        </TableCell>
                        <TableCell style={{ fontWeight: "bold" }}>
                          Service Date
                        </TableCell>
                        <TableCell style={{ fontWeight: "bold" }} colSpan={2}>
                          Type
                        </TableCell>
                        <TableCell style={{ fontWeight: "bold" }}>
                          Qty
                        </TableCell>
                        <TableCell style={{ fontWeight: "bold" }} align="right">
                          Charge
                        </TableCell>
                      </TableRow>
                    ) : null}
                  </TableHead>
                  {state.showServices.get(index) === true ? (
                    <TableBody>
                      {state.bookings
                        ?.filter((element) => element.invoice === row.invoice)
                        ?.map((service) => {
                          return (
                            <TableRow key={service.service_id}>
                              <TableCell colSpan={3}>
                                {service.service_name}
                              </TableCell>
                              <TableCell>
                                {dayjs(service.service_date).format(
                                  "MM/DD/YYYY"
                                )}
                              </TableCell>
                              <TableCell colSpan={2}>
                                {getServiceName(service.service_code)}
                              </TableCell>
                              <TableCell>{service.qty}</TableCell>
                              <TableCell align="right">
                                ${service.charge}
                              </TableCell>
                            </TableRow>
                          );
                        })}
                    </TableBody>
                  ) : null}
                </Table>
              );
            })}
          </DialogContent>
        </Dialog>

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
      </div>
    </div>
  );
};
