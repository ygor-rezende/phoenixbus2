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
  Switch,
  FormControlLabel,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import EditIcon from "@mui/icons-material/Edit";
import AddBusinessIcon from "@mui/icons-material/AddBusiness";
import {
  DatePicker,
  LocalizationProvider,
  DateRangePicker,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

import { MuiTelInput } from "mui-tel-input";
import EnhancedTable from "../../utils/table_generic";

const reducer = (prevState, upadatedProp) => ({
  ...prevState,
  ...upadatedProp,
});

const categories = [
  "Tour&Travel",
  "Meeting Planner",
  "Senior Group",
  "School",
  "Church",
  "Transportation Co.",
  "Others",
];

const initialState = {
  quoteId: "",
  clientId: "",
  agencyName: "",
  agencyEmail: "",
  agencyContact: "",
  employeeId: "",
  salesPerson: "",
  quoteDate: dayjs(Date(Date.now())),
  category: null,
  paxGroup: "",
  numAdults: 0,
  numChild: 0,
  tripDate: ["", ""],
  deposit: 0.0,
  quotedCost: 0.0,
  arrivalProcMCOMCA: false,
  numHoursQuoteValid: 0,
  clientComments: "",
  intineraryDetails: "",
  internalComments: "",
  openSnakbar: false,
  error: null,
  success: false,
  quotesData: [],
  clientsData: [],
  employeesData: [],
  onEditMode: false,
  expandPanel: false,
  isDataUpdated: false,
  invalidField: "",
};

export const Quotes = () => {
  const [state, setState] = useReducer(reducer, initialState);

  //Get all quotes, client and employees data
  const getData = async () => {
    try {
      //get quotes data
      let response = await fetch(
        `${process.env.REACT_APP_SERVERURL}/getallquotes`
      );
      let quotesRespData = await response.json();
      quotesRespData = quotesRespData.map((item) => {
        const quote = {
          id: item.quote_id,
          clientId: item.client_id,
          employeeId: item.employee_id,
          quoteDate: item.quote_date,
          category: item.category,
          paxGroup: item.pax_group,
          numAdults: item.num_adults,
          numChild: item.num_child,
          tripDate: [item.trip_start_date, item.trip_end_date],
          deposit: item.deposit,
          cost: item.cost,
          arrivalProcMCOMCA: item.mco_mca,
          numHoursQuoteValid: item.hours_quote_valid,
          clientComments: item.client_comments,
          intineraryDetails: item.intinerary_details,
          internalComents: item.internal_coments,
        };
        return quote;
      });

      //get client and employees data
      response = await fetch(
        `${process.env.REACT_APP_SERVERURL}/getallclients`
      );
      const clientsRespData = await response.json();
      response = await fetch(
        `${process.env.REACT_APP_SERVERURL}/getallemployees`
      );
      const employeesRespData = await response.json();

      setState({
        quotesData: quotesRespData,
        clientsData: clientsRespData,
        employeesData: employeesRespData,
      });
      return quotesRespData;
    } catch (err) {
      console.error(err);
    }
  }; //loadData

  //handle updates in the fields
  const handleOnChange = (e) => setState({ [e.target.id]: e.target.value });

  //validate the form fields
  const isFormValid = () => {
    if (!state.agencyName) {
      setState({ invalidField: "agencyName" });
      return;
    }

    if (!state.salesPerson) {
      setState({ invalidField: "salesPerson" });
      return;
    }

    if (!state.quoteDate) {
      setState({ invalidField: "quoteDate" });
      return;
    }

    if (!state.category) {
      setState({ invalidField: "category" });
      return;
    }

    if (!state.numAdults) {
      setState({ invalidField: "numAdults" });
      return;
    }

    if (!state.numChild) {
      setState({ invalidField: "numChild" });
      return;
    }

    if (!state.tripDate) {
      setState({ invalidField: "tripDate" });
      return;
    }

    if (!state.quotedCost) {
      setState({ invalidField: "quotedCost" });
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
        `${process.env.REACT_APP_SERVERURL}/createquote`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            quote: {
              clientId: state.clientId,
              employeeId: state.employeeId,
              quoteDate: state.quoteDate,
              category: state.category,
              paxGroup: state.paxGroup,
              numAdults: state.numAdults,
              numChild: state.numChild,
              tripStartDate: state.tripDate[0],
              tripEndDate: state.tripDate[1],
              deposit: state.deposit,
              quotedCost: state.quotedCost,
              arrivalProcMCOMCA: state.arrivalProcMCOMCA,
              numHoursQuoteValid: state.numHoursQuoteValid,
              clientComments: state.clientComments,
              intineraryDetails: state.intineraryDetails,
              internalComments: state.internalComments,
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
      quoteId: "",
      clientId: "",
      agencyName: "",
      agencyEmail: "",
      agencyContact: "",
      employeeId: "",
      salesPerson: "",
      quoteDate: dayjs(Date(Date.now())),
      category: null,
      paxGroup: "",
      numAdults: 0,
      numChild: 0,
      tripDate: [],
      deposit: 0.0,
      quotedCost: 0.0,
      arrivalProcMCOMCA: false,
      numHoursQuoteValid: 0,
      clientComments: "",
      intineraryDetails: "",
      internalComments: "",
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
      quoteId: "",
      clientId: "",
      agencyName: "",
      agencyEmail: "",
      agencyContact: "",
      employeeId: "",
      salesPerson: "",
      quoteDate: dayjs(Date(Date.now())),
      category: null,
      paxGroup: "",
      numAdults: 0,
      numChild: 0,
      tripDate: [],
      deposit: 0.0,
      quotedCost: 0.0,
      arrivalProcMCOMCA: false,
      numHoursQuoteValid: 0,
      clientComments: "",
      intineraryDetails: "",
      internalComments: "",
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
      const quoteToUpdate = {
        quoteId: state.quoteId,
        clientId: state.clientId,
        employeeId: state.employeeId,
        quoteDate: state.quoteDate,
        category: state.category,
        paxGroup: state.paxGroup,
        numAdults: state.numAdults,
        numChild: state.numChild,
        tripStartDate: state.tripDate[0],
        tripEndDate: state.tripDate[1],
        deposit: state.deposit,
        quotedCost: state.quotedCost,
        arrivalProcMCOMCA: state.arrivalProcMCOMCA,
        numHoursQuoteValid: state.numHoursQuoteValid,
        clientComments: state.clientComments,
        intineraryDetails: state.intineraryDetails,
        internalComments: state.internalComments,
      };

      console.log(quoteToUpdate);
      const response = await fetch(
        `${process.env.REACT_APP_SERVERURL}/updatequote`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ quote: quoteToUpdate }),
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
        `${process.env.REACT_APP_SERVERURL}/deletequote`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ quoteIds: itemsSelected }),
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
    console.log(state.quotesData.filter((e) => e.id === id));
    //get client id and employee id from quotes data
    const clientId = state.quotesData.filter((e) => e.id === id).clientId;
    const employeeId = state.quotesData.filter((e) => e.id === id).employeeId;
    const employeeObject = state.quotesData.filter(
      (employee) => employee.employee_id === employeeId
    )[0];
    setState({
      onEditMode: true,
      expandPanel: true,
      companyId: id,
      invalidField: "",
      quoteId: state.quotesData.filter((e) => e.id === id)[0].id,
      agencyName: state.clientsData.filter(
        (client) => client.client_id === clientId
      )[0].agency,
      agencyEmail: state.clientsData.filter(
        (client) => client.client_id === clientId
      )[0].email,
      agencyContact: state.clientsData.filter(
        (client) => client.client_id === clientId
      )[0].contact,
      salesPerson: `${employeeObject.firstname} ${employeeObject.lastname}`,
      quoteDate: state.quotesData.filter((e) => e.id === id)[0].quote_date,
      category: state.quotesData.filter((e) => e.id === id)[0].category,
      paxGroup: state.quotesData.filter((e) => e.id === id)[0].quote_date,
      numAdults: state.quotesData.filter((e) => e.id === id)[0].quote_date,
      numChild: state.quotesData.filter((e) => e.id === id)[0].num_child,
      tripDate: [
        state.quotesData.filter((e) => e.id === id)[0].trip_start_date,
        state.quotesData.filter((e) => e.id === id)[0].trip_end_date,
      ],
      deposit: state.quotesData.filter((e) => e.id === id)[0].deposit,
      quotedCost: state.quotesData.filter((e) => e.id === id)[0].cost,
      arrivalProcMCOMCA: state.quotesData.filter((e) => e.id === id)[0].mco_mca,
      numHoursQuoteValid: state.quotesData.filter((e) => e.id === id)[0]
        .hours_quote_valid,
      clientComments: state.quotesData.filter((e) => e.id === id)[0]
        .client_comments,
      intineraryDetails: state.quotesData.filter((e) => e.id === id)[0]
        .intinerary_details,
      internalComments: state.quotesData.filter((e) => e.id === id)[0]
        .internal_coments,
    });
  }; //handleItemClick

  //cancel editing when a checkbox is selected
  const handleBoxChecked = (isItemChecked) => {
    if (isItemChecked) cancelEditing();
  };

  //table headings
  const headings = [
    {
      id: "agencyName",
      isNumeric: false,
      isPaddingDisabled: false,
      label: "Agency",
    },
    {
      id: "agencyContact",
      isNumeric: false,
      isPaddingDisabled: false,
      label: "Contact",
    },
    {
      id: "salesPerson",
      isNumeric: false,
      isPaddingDisabled: false,
      label: "Sales Person",
    },
    {
      id: "quoteDate",
      isNumeric: true,
      isPaddingDisabled: false,
      label: "Quote Date",
    },
    {
      id: "agencyEmail",
      isNumeric: false,
      isPaddingDisabled: false,
      label: "E-Mail",
    },
  ];

  const handleAgencyChange = (e, newValue) => {
    setState({
      agencyName: newValue.agency,
      agencyContact: newValue.contact,
      agencyEmail: newValue.email,
    });
  };

  return (
    <div className="quotes-container">
      <div className="quotes-container-box">
        <form>
          <Accordion
            expanded={state.expandPanel}
            onChange={() => setState({ expandPanel: !state.expandPanel })}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              {state.onEditMode ? (
                <Box sx={{ display: "inline-flex" }}>
                  <Typography sx={{ fontWeight: "bold", color: "#1976d2" }}>
                    EDITING QUOTE
                  </Typography>
                  <EditIcon style={{ color: "#1976d2", marginLeft: "10px" }} />
                </Box>
              ) : (
                <Box sx={{ display: "inline-flex" }}>
                  <Typography sx={{ fontWeight: "bold", color: "#1976d2" }}>
                    NEW QUOTE
                  </Typography>
                  <AddBusinessIcon
                    style={{ color: "#1976d2", marginLeft: "10px" }}
                  />
                </Box>
              )}
            </AccordionSummary>
            <AccordionDetails>
              <Box className="fieldsbox1">
                <div
                  id="agency-box"
                  className="textfield"
                  style={{ display: "inline-block" }}
                >
                  <Autocomplete
                    id="agency"
                    required
                    value={state.agencyName}
                    onChange={handleAgencyChange}
                    options={state.clientsData.map((element) => {
                      const client = {
                        agency: element.agency,
                        contact: element.contact,
                        email: element.email,
                      };
                      return client;
                    })}
                    sx={{ width: 200 }}
                    getOptionLabel={(option) => option.agency.toString()}
                    renderInput={(params) => (
                      <TextField
                        required
                        {...params}
                        label="Agency"
                        error={state.invalidField === "agencyName"}
                        helperText={
                          state.invalidField === "agencyName"
                            ? "Information required"
                            : ""
                        }
                      />
                    )}
                  />
                </div>
                <TextField
                  className="textfield"
                  id="email"
                  label="Email"
                  type="text"
                  disabled
                  placeholder="Email"
                  value={state.agencyEmail}
                  onChange={handleOnChange}
                />
                <TextField
                  className="textfield"
                  id="contact"
                  required
                  label="Contact"
                  type="text"
                  placeholder="Contact"
                  value={state.agencyContact}
                  onChange={handleOnChange}
                />

                <div
                  id="salesperson-box"
                  className="textfield"
                  style={{ display: "inline-block" }}
                >
                  <Autocomplete
                    id="salesPerson"
                    required
                    value={state.salesPerson}
                    onChange={(_, newValue) =>
                      setState({ salesPerson: newValue })
                    }
                    options={state.employeesData.map(
                      (element) => `${element.firstname} ${element.lastname}`
                    )}
                    sx={{ width: 200 }}
                    getOptionLabel={(option) => option.toString()}
                    renderInput={(params) => (
                      <TextField
                        required
                        {...params}
                        label="Sales person"
                        error={state.invalidField === "salesPerson"}
                        helperText={
                          state.invalidField === "salesPerson"
                            ? "Information required"
                            : ""
                        }
                      />
                    )}
                  />
                </div>

                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    error={state.invalidField === "quoteDate"}
                    helperText={
                      state.invalidField === "quoteDate"
                        ? "Information required"
                        : ""
                    }
                    label="Quote Date"
                    className="textfield"
                    id="quoteDate"
                    required
                    placeholder="Quote Date"
                    value={state.quoteDate}
                    onChange={(newValue) => setState({ quoteDate: newValue })}
                  />
                </LocalizationProvider>

                <div
                  id="category-box"
                  className="textfield"
                  style={{ display: "inline-block" }}
                >
                  <Autocomplete
                    id="category"
                    required
                    value={state.category}
                    onChange={(_, newValue) => setState({ category: newValue })}
                    options={categories}
                    sx={{ width: 200 }}
                    getOptionLabel={(option) => option.toString()}
                    renderInput={(params) => (
                      <TextField
                        required
                        {...params}
                        label="Category"
                        error={state.invalidField === "category"}
                        helperText={
                          state.invalidField === "category"
                            ? "Information required"
                            : ""
                        }
                      />
                    )}
                  />
                </div>

                <TextField
                  className="textfield"
                  id="paxGroup"
                  required
                  label="Pax/Group"
                  type="text"
                  placeholder="Pax/Group"
                  value={state.paxGroup}
                  onChange={handleOnChange}
                />

                <TextField
                  error={state.invalidField === "numAdults"}
                  helperText={
                    state.invalidField === "numAdults"
                      ? "Information required"
                      : ""
                  }
                  className="textfield"
                  id="numAdults"
                  required
                  label="Adult #"
                  type="text"
                  inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
                  placeholder="Adults #"
                  value={state.numAdults}
                  onChange={handleOnChange}
                />

                <TextField
                  error={state.invalidField === "numChild"}
                  helperText={
                    state.invalidField === "numChild"
                      ? "Information required"
                      : ""
                  }
                  className="textfield"
                  id="numChild"
                  required
                  label="Children #"
                  type="text"
                  inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
                  placeholder="Children #"
                  value={state.numChild}
                  onChange={handleOnChange}
                />

                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DateRangePicker
                    localeText={{ start: "Start", end: "End" }}
                    error={state.invalidField === "tripDate"}
                    helperText={
                      state.invalidField === "tripDate"
                        ? "Information required"
                        : ""
                    }
                    label="Trip Date"
                    className="textfield"
                    id="tripDate"
                    required
                    placeholder="Trip Date"
                    value={state.tripDate}
                    onChange={(newValue) => setState({ tripDate: newValue })}
                  />
                </LocalizationProvider>

                <TextField
                  className="textfield"
                  id="deposit"
                  label="Deposit %"
                  type="text"
                  inputProps={{ inputMode: "decimal", step: "0.01" }}
                  placeholder="Deposit %"
                  value={state.deposit}
                  onChange={handleOnChange}
                />

                <TextField
                  className="textfield"
                  id="quotedCost"
                  label="Quoted Cost $"
                  type="text"
                  inputProps={{ inputMode: "decimal", step: "0.01" }}
                  placeholder="Quoted Cost $"
                  value={state.quotedCost}
                  onChange={handleOnChange}
                />

                <FormControlLabel
                  control={
                    <Switch
                      checked={state.arrivalProcMCOMCA}
                      onChange={(e) =>
                        setState({ arrivalProcMCOMCA: e.target.checked })
                      }
                    />
                  }
                  label="Arrival Procedure MCO/MCA"
                  labelPlacement="start"
                />

                <TextField
                  className="textfield"
                  id="numHoursQuoteValid"
                  label="Quote valid for (Hr #)"
                  type="text"
                  inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
                  placeholder="Quote valid for (Hr #)"
                  value={state.numHoursQuoteValid}
                  onChange={handleOnChange}
                />

                <TextField
                  className="textfield"
                  id="clientComments"
                  label="Client Comments"
                  type="text"
                  multiline
                  rows={4}
                  placeholder="Client Comments"
                  value={state.clientComments}
                  onChange={handleOnChange}
                />

                <TextField
                  className="textfield"
                  id="intineraryDetails"
                  label="Intinerary Details"
                  type="text"
                  multiline
                  rows={4}
                  placeholder="Intinerary Details"
                  value={state.intineraryDetails}
                  onChange={handleOnChange}
                />

                <TextField
                  className="textfield"
                  id="internalComments"
                  label="Internal Comments"
                  type="text"
                  multiline
                  rows={4}
                  placeholder="Internal Comments"
                  value={state.internalComments}
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
                  Save New Quote
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
              <AlertTitle>Quotes Updated</AlertTitle>
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
            filterOption="agencyName"
          />
        </div>
      </div>
    </div>
  );
}; //Quotes
