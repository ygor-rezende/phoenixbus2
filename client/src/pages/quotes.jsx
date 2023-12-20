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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  ToggleButtonGroup,
  ToggleButton,
} from "@mui/material";
import { MuiTelInput } from "mui-tel-input";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import EditIcon from "@mui/icons-material/Edit";
import RequestQuoteIcon from "@mui/icons-material/RequestQuote";
import {
  DatePicker,
  LocalizationProvider,
  TimePicker,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

import EnhancedTable from "../utils/table_generic";

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

const types = ["OW", "RT", "CH", "OT"];

const initialState = {
  quoteId: "",
  clientId: "",
  agencyName: null,
  agencyEmail: "",
  agencyContact: "",
  employeeId: "",
  salesPerson: null,
  pickupLocationId: "",
  pickupLocationName: null,
  destinationLocationId: "",
  destinationLocationName: null,
  returnLocationId: "",
  returnLocationName: null,
  responsibleName: "",
  responsibleEmail: "",
  responsiblePhone: "",
  serviceType: "",
  pickupTime: null,
  returnTime: null,
  addStop: false,
  addStopInfo: "",
  addStopDetail: "",
  tripLength: 0.0,
  quoteDate: dayjs(Date(Date.now())),
  category: null,
  paxGroup: "",
  numPeople: 0,
  tripStartDate: dayjs(Date(Date.now())),
  tripEndDate: dayjs(Date(Date.now())),
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
  locationsData: [],
  onEditMode: false,
  expandPanel: false,
  isDataUpdated: false,
  invalidField: "",
};

export const Quotes = () => {
  const [state, setState] = useReducer(reducer, initialState);

  //Get all quotes, client, employees, and locations data
  const getData = async () => {
    try {
      //get client, employees data
      let response = await fetch(
        `${process.env.REACT_APP_SERVERURL}/getallclients`
      );
      const clientsRespData = await response.json();

      response = await fetch(
        `${process.env.REACT_APP_SERVERURL}/getallemployees`
      );
      const employeesRespData = await response.json();

      response = await fetch(`${process.env.REACT_APP_SERVERURL}/getlocations`);
      const locationsRespData = await response.json();

      //get quotes data
      response = await fetch(`${process.env.REACT_APP_SERVERURL}/getallquotes`);
      let quotesRespData = await response.json();
      quotesRespData = quotesRespData.map((item) => {
        const quote = {
          id: item.quote_id,
          clientId: item.client_id,
          agencyName: clientsRespData.find(
            (client) => client.client_id === item.client_id
          ).agency,
          agencyContact: clientsRespData.find(
            (client) => client.client_id === item.client_id
          ).contact,
          agencyEmail: clientsRespData.find(
            (client) => client.client_id === item.client_id
          ).email,
          responsibleName: item.responsible_name,
          responsibleEmail: item.responsible_email,
          responsiblePhone: item.responsible_phone,
          pickupLocationId: item.pickup_location_id,
          pickupLocationName:
            locationsRespData.find(
              (location) => location.location_id === item.pickup_location_id
            )?.location_name ?? null,
          destinationLocationId: item.destination_location_id,
          destinationLocationName:
            locationsRespData.find(
              (location) =>
                location.location_id === item.destination_location_id
            )?.location_name ?? null,
          returnLocationId: item.return_location_id,
          returnLocationName:
            locationsRespData.find(
              (location) => location.location_id === item.return_location_id
            )?.location_name ?? null,
          employeeId: item.employee_id,
          salesPerson: `${
            employeesRespData.find(
              (employee) => employee.employee_id === item.employee_id
            ).firstname
          } ${
            employeesRespData.find(
              (employee) => employee.employee_id === item.employee_id
            ).lastname
          }`,
          quoteDate: dayjs(item.quote_date).format("YYYY-MM-DD"),
          category: item.category,
          paxGroup: item.pax_group,
          numPeople: item.num_people,
          tripStartDate: item.trip_start_date,
          tripEndDate: item.trip_end_date,
          deposit: item.deposit,
          cost: item.cost,
          arrivalProcMCOMCA: item.mco_mca,
          serviceType: item.service_type,
          pickupTime: item.pickup_time,
          returnTime: item.return_time,
          addStop: item.additional_stop,
          addStopInfo: item.additional_stop_info,
          addStopDetail: item.additional_stop_detail,
          tripLength: item.trip_length,
          numHoursQuoteValid: item.hours_quote_valid,
          clientComments: item.client_comments,
          intineraryDetails: item.intinerary_details,
          internalComents: item.internal_coments,
        };
        return quote;
      });

      setState({
        quotesData: quotesRespData,
        clientsData: clientsRespData,
        employeesData: employeesRespData,
        locationsData: locationsRespData,
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

    if (!state.numPeople) {
      setState({ invalidField: "numPeople" });
      return;
    }

    if (!state.tripStartDate) {
      setState({ invalidField: "tripStartDate" });
      return;
    }

    if (!state.tripEndDate) {
      setState({ invalidField: "tripEndDate" });
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
              pickupLocationId: state.pickupLocationId,
              destinationLocationId: state.destinationLocationId,
              returnLocationId: state.returnLocationId,
              responsibleName: state.responsibleName,
              responsibleEmail: state.responsibleEmail,
              responsiblePhone: state.responsiblePhone,
              serviceType: state.serviceType,
              pickupTime: state.pickupTime,
              returnTime: state.returnTime,
              addStop: state.addStop,
              addStopInfo: state.addStopInfo,
              addStopDetail: state.addStopDetail,
              tripLength: state.tripLength,
              quoteDate: state.quoteDate,
              category: state.category,
              paxGroup: state.paxGroup,
              numPeople: state.numPeople,
              tripStartDate: state.tripStartDate,
              tripEndDate: state.tripEndDate,
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
      agencyName: null,
      agencyEmail: "",
      agencyContact: "",
      employeeId: "",
      salesPerson: null,
      pickupLocationId: "",
      pickupLocationName: null,
      destinationLocationId: "",
      destinationLocationName: null,
      returnLocationId: "",
      returnLocationName: null,
      responsibleName: "",
      responsibleEmail: "",
      responsiblePhone: "",
      serviceType: "",
      pickupTime: null,
      returnTime: null,
      addStop: false,
      addStopInfo: "",
      addStopDetail: "",
      tripLength: 0.0,
      quoteDate: dayjs(Date(Date.now())),
      category: null,
      paxGroup: "",
      numPeople: 0,
      tripStartDate: dayjs(Date(Date.now())),
      tripEndDate: dayjs(Date(Date.now())),
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
      agencyName: null,
      agencyEmail: "",
      agencyContact: "",
      employeeId: "",
      salesPerson: null,
      pickupLocationId: "",
      pickupLocationName: null,
      destinationLocationId: "",
      destinationLocationName: null,
      returnLocationId: "",
      returnLocationName: null,
      responsibleName: "",
      responsibleEmail: "",
      responsiblePhone: "",
      serviceType: "",
      pickupTime: null,
      returnTime: null,
      addStop: false,
      addStopInfo: "",
      addStopDetail: "",
      tripLength: 0.0,
      quoteDate: dayjs(Date(Date.now())),
      category: null,
      paxGroup: "",
      numPeople: 0,
      tripStartDate: dayjs(Date(Date.now())),
      tripEndDate: dayjs(Date(Date.now())),
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
        pickupLocationId: state.pickupLocationId,
        destinationLocationId: state.destinationLocationId,
        returnLocationId: state.returnLocationId,
        responsibleName: state.responsibleName,
        responsibleEmail: state.responsibleEmail,
        responsiblePhone: state.responsiblePhone,
        serviceType: state.serviceType,
        pickupTime: state.pickupTime,
        returnTime: state.returnTime,
        addStop: state.addStop,
        addStopInfo: state.addStopInfo,
        addStopDetail: state.addStopDetail,
        tripLength: state.tripLength,
        quoteDate: state.quoteDate,
        category: state.category,
        paxGroup: state.paxGroup,
        numPeople: state.numPeople,
        tripStartDate: state.tripStartDate,
        tripEndDate: state.tripEndDate,
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
    console.log(state.quotesData.filter((e) => e.id === id));
    //get client id and employee id from quotes data
    const clientId = state.quotesData.filter((e) => e.id === id)[0].clientId;
    const employeeId = state.quotesData.filter((e) => e.id === id)[0]
      .employeeId;
    const pickupLocationId = state.quotesData.find(
      (e) => e.id === id
    ).pickupLocationId;
    const destinationLocationId = state.quotesData.find(
      (e) => e.id === id
    ).destinationLocationId;
    const returnLocationId = state.quotesData.find(
      (e) => e.id === id
    ).returnLocationId;
    const employeeObject = state.employeesData.filter(
      (employee) => employee.employee_id === employeeId
    )[0];

    //load fields
    setState({
      onEditMode: true,
      expandPanel: true,
      invalidField: "",
      quoteId: id,
      clientId: clientId,
      agencyName: state.clientsData.filter(
        (client) => client.client_id === clientId
      )[0].agency,
      agencyEmail: state.clientsData.filter(
        (client) => client.client_id === clientId
      )[0].email,
      agencyContact: state.clientsData.filter(
        (client) => client.client_id === clientId
      )[0].contact,
      responsibleName: state.quotesData.find((e) => e.id === id)
        .responsibleName,
      responsibleEmail: state.quotesData.find((e) => e.id === id)
        .responsibleEmail,
      responsiblePhone: state.quotesData.find((e) => e.id === id)
        .responsiblePhone,
      employeeId: employeeId,
      salesPerson: `${employeeObject.firstname} ${employeeObject.lastname}`,
      pickupLocationId: pickupLocationId,
      pickupLocationName:
        state.locationsData.find(
          (location) => location.location_id === pickupLocationId
        )?.location_name ?? null,
      destinationLocationId: destinationLocationId,
      destinationLocationName:
        state.locationsData.find(
          (location) => location.location_id === destinationLocationId
        )?.location_name ?? null,
      returnLocationId: returnLocationId,
      returnLocationName:
        state.locationsData.find(
          (location) => location.location_id === returnLocationId
        )?.location_name ?? null,
      serviceType: state.quotesData.find((e) => e.id === id).serviceType,
      pickupTime: state.quotesData.find((e) => e.id === id).pickupTime,
      returnTime: state.quotesData.find((e) => e.id === id).returnTime,
      addStop: state.quotesData.find((e) => e.id === id).addStop,
      addStopInfo: state.quotesData.find((e) => e.id === id).addStopInfo,
      addStopDetail: state.quotesData.find((e) => e.id === id).addStopDetail,
      tripLength: state.quotesData.find((e) => e.id === id).tripLength,
      quoteDate: dayjs(
        state.quotesData.filter((e) => e.id === id)[0].quoteDate
      ),
      category: state.quotesData.filter((e) => e.id === id)[0].category,
      paxGroup: state.quotesData.filter((e) => e.id === id)[0].paxGroup,
      numPeople: state.quotesData.filter((e) => e.id === id)[0].numPeople,
      tripStartDate: dayjs(
        state.quotesData.filter((e) => e.id === id)[0].tripStartDate
      ),
      tripEndDate: dayjs(
        state.quotesData.filter((e) => e.id === id)[0].tripEndDate
      ),
      deposit: state.quotesData.filter((e) => e.id === id)[0].deposit,
      quotedCost: state.quotesData.filter((e) => e.id === id)[0].cost,
      arrivalProcMCOMCA: state.quotesData.filter((e) => e.id === id)[0]
        .arrivalProcMCOMCA,
      numHoursQuoteValid: state.quotesData.filter((e) => e.id === id)[0]
        .numHoursQuoteValid,
      clientComments: state.quotesData.filter((e) => e.id === id)[0]
        .clientComments,
      intineraryDetails: state.quotesData.filter((e) => e.id === id)[0]
        .intineraryDetails,
      internalComments: state.quotesData.filter((e) => e.id === id)[0]
        .internalComents,
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
      isNumeric: false,
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
    if (newValue) {
      setState({
        clientId: newValue.clientId,
        agencyName: newValue.agency,
        agencyContact: newValue.contact,
        agencyEmail: newValue.email,
      });
    }
  };

  const handleSalesPersonChange = (_, newValue) => {
    if (newValue) {
      setState({
        salesPerson: newValue.salesPerson,
        employeeId: newValue.employeeId,
      });
    }
  };

  //handle changes on pickupLocation
  const handlePickupChange = (_, newValue) => {
    if (newValue) {
      setState({
        pickupLocationName: newValue.locationName,
        pickupLocationId: newValue.locationId,
      });
    }
  };

  //handle changes on destinationLocation
  const handleDestinationChange = (_, newValue) => {
    if (newValue) {
      setState({
        destinationLocationName: newValue.locationName,
        destinationLocationId: newValue.locationId,
      });
    }
  };

  //handle changes on destinationLocation
  const handleReturnChange = (_, newValue) => {
    if (newValue) {
      setState({
        returnLocationName: newValue.locationName,
        returnLocationId: newValue.locationId,
      });
    }
  };

  //handle changes on phone field
  const handlePhoneChange = (value, info) => {
    setState({ responsiblePhone: value });
  };

  //handle service type change
  const handleServiceTypeChange = (e) => {
    if (e.target.value === "OW" || e.target.value === "OT") {
      setState({
        serviceType: e.target.value,
        returnLocationId: "",
        returnLocationName: null,
        tripLength: "",
      });
    } else if (e.target.value === "RT") {
      setState({
        serviceType: e.target.value,
        tripLength: "",
      });
    } else if (e.target.value === "CH") {
      setState({
        serviceType: e.target.value,
        returnLocationId: "",
        returnLocationName: null,
      });
    } else {
      setState({
        serviceType: e.target.value,
        returnLocationId: "",
        returnLocationName: null,
        tripLength: "",
      });
    }
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
                  <RequestQuoteIcon
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
                    className="autocomplete"
                    value={state.agencyName}
                    onChange={handleAgencyChange}
                    isOptionEqualToValue={(option, value) =>
                      option.agency === value
                    }
                    options={state.clientsData.map((element) => {
                      const client = {
                        clientId: element.client_id,
                        agency: element.agency,
                        contact: element.contact,
                        email: element.email,
                      };
                      return client;
                    })}
                    sx={{ width: 200 }}
                    getOptionLabel={(option) => option.agency ?? option}
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
                  label="Contact"
                  disabled
                  type="text"
                  placeholder="Contact"
                  value={state.agencyContact}
                  onChange={handleOnChange}
                />
                <TextField
                  className="textfield"
                  id="responsibleName"
                  label="Responsible"
                  type="text"
                  placeholder="Responsible"
                  value={state.responsibleName}
                  onChange={handleOnChange}
                />
                <TextField
                  className="textfield"
                  id="responsibleEmail"
                  label="Resp. Email"
                  type="text"
                  placeholder="Resp. Email"
                  value={state.responsibleEmail}
                  onChange={handleOnChange}
                />
                <MuiTelInput
                  className="textfield"
                  id="responsiblePhone"
                  defaultCountry="US"
                  label="Resp. Phone"
                  placeholder="Resp. Phone"
                  value={state.responsiblePhone}
                  onChange={handlePhoneChange}
                  onlyCountries={["US", "CA"]}
                  inputProps={{ maxLength: 15 }}
                />
                <div
                  id="salesperson-box"
                  className="textfield"
                  style={{ display: "inline-block" }}
                >
                  <Autocomplete
                    id="salesPerson"
                    required
                    className="autocomplete"
                    value={state.salesPerson}
                    onChange={handleSalesPersonChange}
                    isOptionEqualToValue={(option, value) =>
                      option.salesPerson === value
                    }
                    options={state.employeesData.map((element) => {
                      const employee = {
                        employeeId: element.employee_id,
                        salesPerson: `${element.firstname} ${element.lastname}`,
                      };
                      return employee;
                    })}
                    sx={{ width: 200 }}
                    getOptionLabel={(option) => option.salesPerson ?? option}
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
                    format="YYYY-MM-DD"
                    id="quoteDate"
                    required
                    placeholder="Quote Date"
                    value={dayjs(state.quoteDate)}
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
                    className="autocomplete"
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
                  error={state.invalidField === "numPeople"}
                  helperText={
                    state.invalidField === "numPeople"
                      ? "Information required"
                      : ""
                  }
                  className="textfield"
                  id="numPeople"
                  required
                  label="People #"
                  type="text"
                  inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
                  placeholder="People #"
                  value={state.numPeople}
                  onChange={handleOnChange}
                />
                <FormControl className="textfield">
                  <InputLabel>Service Type</InputLabel>
                  <Select
                    id="type"
                    className="autocomplete"
                    value={state.serviceType}
                    onChange={handleServiceTypeChange}
                    label="Service Type"
                    placeholder="Service Type"
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
                    label="Pickup time"
                    className="textfield"
                    id="pickupTime"
                    value={state.pickupTime}
                    onChange={(newValue) =>
                      setState({ pickupTime: dayjs(newValue) })
                    }
                  />

                  <TimePicker
                    label="Return time"
                    className="textfield"
                    id="returnTime"
                    value={state.returnTime}
                    onChange={(newValue) =>
                      setState({ returnTime: dayjs(newValue) })
                    }
                  />
                </LocalizationProvider>
                <div
                  id="pickupAddress-box"
                  className="textfield"
                  style={{ display: "inline-block" }}
                >
                  <Autocomplete
                    id="pickupLocationName"
                    className="autocomplete"
                    value={state.pickupLocationName}
                    onChange={handlePickupChange}
                    isOptionEqualToValue={(option, value) =>
                      option.locationName === value
                    }
                    options={state.locationsData.map((element) => {
                      const location = {
                        locationId: element.location_id,
                        locationName: element.location_name,
                      };
                      return location;
                    })}
                    sx={{ width: 200 }}
                    getOptionLabel={(option) => option.locationName ?? option}
                    renderInput={(params) => (
                      <TextField {...params} label="Pickup Location" />
                    )}
                  />
                </div>
                <div
                  id="destinationAddress-box"
                  className="textfield"
                  style={{ display: "inline-block" }}
                >
                  <Autocomplete
                    id="destinationLocationName"
                    className="autocomplete"
                    value={state.destinationLocationName}
                    onChange={handleDestinationChange}
                    isOptionEqualToValue={(option, value) =>
                      option.locationName === value
                    }
                    options={state.locationsData.map((element) => {
                      const location = {
                        locationId: element.location_id,
                        locationName: element.location_name,
                      };
                      return location;
                    })}
                    sx={{ width: 200 }}
                    getOptionLabel={(option) => option.locationName ?? option}
                    renderInput={(params) => (
                      <TextField {...params} label="Destination" />
                    )}
                  />
                </div>
                {state.serviceType === "RT" && (
                  <div
                    id="returnAddress-box"
                    className="textfield"
                    style={{ display: "inline-block" }}
                  >
                    <Autocomplete
                      id="returnLocationName"
                      className="autocomplete"
                      value={state.returnLocationName}
                      onChange={handleReturnChange}
                      isOptionEqualToValue={(option, value) =>
                        option.locationName === value
                      }
                      options={state.locationsData.map((element) => {
                        const location = {
                          locationId: element.location_id,
                          locationName: element.location_name,
                        };
                        return location;
                      })}
                      sx={{ width: 200 }}
                      getOptionLabel={(option) => option.locationName ?? option}
                      renderInput={(params) => (
                        <TextField {...params} label="Return Location" />
                      )}
                    />
                  </div>
                )}
                {state.serviceType === "CH" && (
                  <TextField
                    className="textfield"
                    id="tripLength"
                    label="Trip Length (Hr #)"
                    type="text"
                    inputProps={{ inputMode: "decimal", step: "0.1" }}
                    placeholder="Trip Length (Hr #)"
                    value={state.tripLength}
                    onChange={handleOnChange}
                  />
                )}
                <FormControlLabel
                  className="textfield"
                  style={{ alignSelf: "center" }}
                  control={
                    <Checkbox
                      checked={state.addStop}
                      onChange={(e) =>
                        setState({
                          addStop: e.target.checked,
                          addStopDetail: "",
                        })
                      }
                    />
                  }
                  label="Additional Stop"
                />

                {state.addStop && (
                  <TextField
                    className="textfield"
                    id="addStopInfo"
                    label="Stop Info"
                    type="text"
                    placeholder="Stop Info"
                    value={state.addStopInfo}
                    onChange={handleOnChange}
                  />
                )}

                {state.addStop && (
                  <ToggleButtonGroup
                    className="textfield"
                    color="primary"
                    value={state.addStopDetail}
                    exclusive
                    onChange={(_, newValue) =>
                      setState({ addStopDetail: newValue })
                    }
                    aria-label="Stop detail"
                  >
                    <ToggleButton value="OutWard">OutWard</ToggleButton>
                    <ToggleButton value="Return">Return</ToggleButton>
                    <ToggleButton value="Both">Both</ToggleButton>
                  </ToggleButtonGroup>
                )}
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    error={state.invalidField === "tripStartDate"}
                    helperText={
                      state.invalidField === "tripStartDate"
                        ? "Information required"
                        : ""
                    }
                    label="Trip Start Date"
                    format="YYYY-MM-DD"
                    className="textfield"
                    id="tripStartDate"
                    required
                    placeholder="Trip Start Date"
                    value={state.tripStartDate}
                    onChange={(newValue) =>
                      setState({ tripStartDate: newValue })
                    }
                  />

                  <DatePicker
                    error={state.invalidField === "tripEndDate"}
                    helperText={
                      state.invalidField === "tripEndDate"
                        ? "Information required"
                        : ""
                    }
                    label="Trip End Date"
                    format="YYYY-MM-DD"
                    className="textfield"
                    id="tripEndDate"
                    required
                    placeholder="Trip End Date"
                    value={state.tripEndDate}
                    onChange={(newValue) => setState({ tripEndDate: newValue })}
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
                  className="textfield"
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
