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
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Checkbox,
  Tabs,
  Tab,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import EditIcon from "@mui/icons-material/Edit";
import RequestQuoteIcon from "@mui/icons-material/RequestQuote";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

import EnhancedTable from "../utils/table_generic";
import { QuotesView } from "./subcomponents/quotesView";
import { ServiceModal } from "./subcomponents/serviceModal";
import { CustomTabPanel } from "./subcomponents/customTabPanel";
import { DetailModal } from "./subcomponents/detailModal";

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
  invoice: "",
  clientId: "",
  agencyName: null,
  agencyEmail: "",
  agencyContact: "",
  employeeId: "",
  salesPerson: null,
  quoteDate: null,
  bookingDate: dayjs(Date(Date.now())),
  category: null,
  paxGroup: "",
  numAdults: 0,
  numChild: 0,
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
  bookingsData: [],
  clientsData: [],
  employeesData: [],
  vehiclesData: [],
  locationsData: [],
  onEditMode: false,
  expandPanel: false,
  expandBookings: false,
  isDataUpdated: false,
  invalidField: "",
  tabService: 0,
  servicesData: [],
  triggerModal: 0,
  editingService: false,
  currentService: [],
  serviceId: 0,
  serviceTitle: "New Service",
  editingDetail: false,
  triggerDetailModal: 0,
  detailTitle: "New Service Detail",
  detailsData: [],
  currentDetail: [],
};

export const Bookings = () => {
  const [state, setState] = useReducer(reducer, initialState);

  //get client an employees data
  const getCEData = async () => {
    try {
      let response = await fetch(
        `${process.env.REACT_APP_SERVERURL}/getallclients`
      );
      const clientsRespData = await response.json();

      response = await fetch(
        `${process.env.REACT_APP_SERVERURL}/getallemployees`
      );
      const employeesRespData = await response.json();

      response = await fetch(
        `${process.env.REACT_APP_SERVERURL}/getallvehiclenames`
      );
      const vehiclesRespData = await response.json();

      response = await fetch(
        `${process.env.REACT_APP_SERVERURL}/getalllocationnames`
      );
      const locationsRespData = await response.json();

      setState({
        clientsData: clientsRespData,
        employeesData: employeesRespData,
        vehiclesData: vehiclesRespData,
        locationsData: locationsRespData,
      });

      return [clientsRespData, employeesRespData];
    } catch (err) {
      console.error(err);
    }
  };
  //Get all booking, client and employees data
  const getBookingsData = async () => {
    try {
      let cliData = state.clientsData;
      let empData = state.employeesData;

      //get client and employees data
      if (cliData.length === 0 || empData === 0) {
        [cliData, empData] = await getCEData();
      }
      //get bookings data
      let response = await fetch(
        `${process.env.REACT_APP_SERVERURL}/getallbookings`
      );
      let bookingsRespData = await response.json();
      bookingsRespData = bookingsRespData.map((item) => {
        const booking = {
          id: item.invoice,
          quoteid: item.quote_id,
          clientId: item.client_id,
          agencyName: cliData.find(
            (client) => client.client_id === item.client_id
          ).agency,
          agencyContact: cliData.find(
            (client) => client.client_id === item.client_id
          ).contact,
          agencyEmail: cliData.find(
            (client) => client.client_id === item.client_id
          ).email,
          employeeId: item.employee_id,
          salesPerson: `${
            empData.find(
              (employee) => employee.employee_id === item.employee_id
            ).firstname
          } ${
            empData.find(
              (employee) => employee.employee_id === item.employee_id
            ).lastname
          }`,
          quoteDate: item.quote_date,
          bookingDate: dayjs(item.booking_date).format("YYYY-MM-DD"),
          category: item.category,
          paxGroup: item.pax_group,
          numAdults: item.num_adults,
          numChild: item.num_child,
          tripStartDate: dayjs(item.trip_start_date).format("YYYY-MM-DD"),
          tripEndDate: dayjs(item.trip_end_date).format("YYYY-MM-DD"),
          deposit: item.deposit,
          cost: item.cost,
          arrivalProcMCOMCA: item.mco_mca,
          numHoursQuoteValid: item.hours_quote_valid,
          clientComments: item.client_comments,
          intineraryDetails: item.intinerary_details,
          internalComents: item.internal_coments,
        };
        return booking;
      });

      setState({
        bookingsData: bookingsRespData,
      });
      return bookingsRespData;
    } catch (err) {
      console.error(err);
    }
  }; //getBookingsData

  const getQuotesData = async () => {
    try {
      let cliData = state.clientsData;
      let empData = state.employeesData;
      //get client and employees data
      if (cliData.length === 0 || empData === 0) {
        [cliData, empData] = await getCEData();
      }

      //get quotes data
      let response = await fetch(
        `${process.env.REACT_APP_SERVERURL}/getallquotes`
      );
      let quotesRespData = await response.json();
      quotesRespData = quotesRespData.map((item) => {
        const quote = {
          id: item.quote_id,
          clientId: item.client_id,
          agencyName: cliData.find(
            (client) => client.client_id === item.client_id
          ).agency,
          agencyContact: cliData.find(
            (client) => client.client_id === item.client_id
          ).contact,
          agencyEmail: cliData.find(
            (client) => client.client_id === item.client_id
          ).email,
          employeeId: item.employee_id,
          salesPerson: `${
            empData.find(
              (employee) => employee.employee_id === item.employee_id
            ).firstname
          } ${
            empData.find(
              (employee) => employee.employee_id === item.employee_id
            ).lastname
          }`,
          quoteDate: dayjs(item.quote_date).format("YYYY-MM-DD"),
          category: item.category,
          paxGroup: item.pax_group,
          numAdults: item.num_adults,
          numChild: item.num_child,
          tripStartDate: item.trip_start_date,
          tripEndDate: item.trip_end_date,
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

      setState({
        quotesData: quotesRespData,
      });
      return quotesRespData;
    } catch (err) {
      console.error(err);
    }
  }; //getQuotesData

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

    if (!state.bookingDate) {
      setState({ invalidField: "bookingDate" });
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
        `${process.env.REACT_APP_SERVERURL}/createbooking`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            booking: {
              clientId: state.clientId,
              employeeId: state.employeeId,
              quoteId: state.quoteId,
              quoteDate: state.quoteDate,
              bookingDate: state.bookingDate,
              category: state.category,
              paxGroup: state.paxGroup,
              numAdults: state.numAdults,
              numChild: state.numChild,
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
      invoice: "",
      quoteId: "",
      clientId: "",
      agencyName: null,
      agencyEmail: "",
      agencyContact: "",
      employeeId: "",
      salesPerson: null,
      quoteDate: "",
      bookingDate: dayjs(Date(Date.now())),
      category: null,
      paxGroup: "",
      numAdults: 0,
      numChild: 0,
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
      expandBookings: false,
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
      invoice: "",
      quoteId: "",
      clientId: "",
      agencyName: null,
      agencyEmail: "",
      agencyContact: "",
      employeeId: "",
      salesPerson: null,
      quoteDate: "",
      bookingDate: dayjs(Date(Date.now())),
      category: null,
      paxGroup: "",
      numAdults: 0,
      numChild: 0,
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
      const bookingToUpdate = {
        invoice: state.invoice,
        quoteId: state.quoteId,
        clientId: state.clientId,
        employeeId: state.employeeId,
        bookingDate: state.bookingDate,
        quoteDate: state.quoteDate,
        category: state.category,
        paxGroup: state.paxGroup,
        numAdults: state.numAdults,
        numChild: state.numChild,
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

      console.log(bookingToUpdate);
      const response = await fetch(
        `${process.env.REACT_APP_SERVERURL}/updatebooking`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ booking: bookingToUpdate }),
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
        `${process.env.REACT_APP_SERVERURL}/deletebooking`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ bookingIds: itemsSelected }),
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

  //Show services information when clicking on a table row
  const handleItemClick = async (id) => {
    //load services for this booking
    const services = await getServicesData(id);

    //load service details for this booking
    const details = await getDetailsData(services);

    //testing
    services.map((service) => {
      let allDetails = details.map((detailsArr) =>
        detailsArr.filter((detail) => detail.service_id === service.id)
      );
      return allDetails;
    });

    //load fields
    console.log(state.bookingsData.filter((e) => e.id === id));
    //get client id and employee id from bookings data
    const clientId = state.bookingsData.filter((e) => e.id === id)[0].clientId;
    const employeeId = state.bookingsData.filter((e) => e.id === id)[0]
      .employeeId;
    const employeeObject = state.employeesData.filter(
      (employee) => employee.employee_id === employeeId
    )[0];
    const quoteId = state.bookingsData.filter((e) => e.id === id)[0].quoteid;
    setState({
      onEditMode: true,
      expandPanel: true,
      invalidField: "",
      invoice: id,
      quoteId: quoteId,
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
      employeeId: employeeId,
      salesPerson: `${employeeObject.firstname} ${employeeObject.lastname}`,
      bookingDate: dayjs(
        state.bookingsData.filter((e) => e.id === id)[0].bookingDate
      ),
      quoteDate:
        dayjs(state.bookingsData.filter((e) => e.id === id)[0].quoteDate) ?? "",
      category: state.bookingsData.filter((e) => e.id === id)[0].category,
      paxGroup: state.bookingsData.filter((e) => e.id === id)[0].paxGroup,
      numAdults: state.bookingsData.filter((e) => e.id === id)[0].numAdults,
      numChild: state.bookingsData.filter((e) => e.id === id)[0].numChild,
      tripStartDate: dayjs(
        state.bookingsData.filter((e) => e.id === id)[0].tripStartDate
      ),
      tripEndDate: dayjs(
        state.bookingsData.filter((e) => e.id === id)[0].tripEndDate
      ),
      deposit: state.bookingsData.filter((e) => e.id === id)[0].deposit,
      quotedCost: state.bookingsData.filter((e) => e.id === id)[0].cost,
      arrivalProcMCOMCA: state.bookingsData.filter((e) => e.id === id)[0]
        .arrivalProcMCOMCA,
      numHoursQuoteValid: state.bookingsData.filter((e) => e.id === id)[0]
        .numHoursQuoteValid,
      clientComments: state.bookingsData.filter((e) => e.id === id)[0]
        .clientComments,
      intineraryDetails: state.bookingsData.filter((e) => e.id === id)[0]
        .intineraryDetails,
      internalComments: state.bookingsData.filter((e) => e.id === id)[0]
        .internalComents,
      servicesData: services,
      tabService: 0,
      detailsData: details,
    });

    //scroll to the invoice field
    document.getElementById("invoice").scrollIntoView();
  }; //handleItemClick

  //get services Data
  const getServicesData = async (invoice) => {
    try {
      let response = await fetch(
        `${process.env.REACT_APP_SERVERURL}/getservices/${invoice}`
      );
      let servicesRespData = await response.json();
      servicesRespData = servicesRespData.map((item) => {
        const service = {
          id: item.service_id,
          bookingId: item.booking_id,
          serviceName: item.service_name,
          serviceCode: item.service_code,
          serviceDate: item.service_date,
          qty: item.qty,
          charge: item.charge,
          tips: item.tips,
          salesTax: item.sales_tax,
          optional: item.optional,
        };
        return service;
      });

      return servicesRespData;
    } catch (err) {
      console.error(err);
    }
  }; //getServicesData

  //fech details for the services in a booking
  const getDetailsData = async (services) => {
    try {
      //loop through services to load the details
      let details = services.map(async (service) => {
        let response = await fetch(
          `${process.env.REACT_APP_SERVERURL}/getdetails/${service.id}`
        );
        let responseData = await response.json();
        return responseData;
      });
      const detailsPromise = await Promise.all(details);
      return detailsPromise;
    } catch (err) {
      console.error(err);
    }
  }; //getDetailsData

  //Show information when clicking on quotes table row
  const handleQuoteClick = (id) => {
    //load fields
    console.log(state.quotesData.filter((e) => e.id === id));
    //get client id and employee id from bookings data
    const clientId = state.quotesData.filter((e) => e.id === id)[0].clientId;
    const employeeId = state.quotesData.filter((e) => e.id === id)[0]
      .employeeId;
    const employeeObject = state.employeesData.filter(
      (employee) => employee.employee_id === employeeId
    )[0];

    setState({
      onEditMode: false,
      expandPanel: true,
      invalidField: "",
      invoice: "",
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
      employeeId: employeeId,
      salesPerson: `${employeeObject.firstname} ${employeeObject.lastname}`,
      bookingDate: dayjs(Date(Date.now())),
      quoteDate: dayjs(
        state.quotesData.filter((e) => e.id === id)[0].quoteDate
      ),
      category: state.quotesData.filter((e) => e.id === id)[0].category,
      paxGroup: state.quotesData.filter((e) => e.id === id)[0].paxGroup,
      numAdults: state.quotesData.filter((e) => e.id === id)[0].numAdults,
      numChild: state.quotesData.filter((e) => e.id === id)[0].numChild,
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
  }; //handleQuoteClick

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
      id: "bookingDate",
      isNumeric: false,
      isPaddingDisabled: false,
      label: "Booking Date",
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

  //called when a Service tab is clicked
  const handleServiceClick = (_, newValue) => {
    setState({ tabService: newValue });
  };

  //open the modal to create or edit a Service
  const handleServiceModal = () => {
    //open the modal
    setState({
      editingService: false,
      triggerModal: state.triggerModal + 1,
      serviceTitle: "New Service",
    });
  };

  //display error from Service modal child
  const handleOnError = (msg) => {
    setState({ success: false, error: msg, openSnakbar: true });
  };

  //display error from Service modal child
  const handleOnSuccess = (msg) => {
    setState({ success: true, error: null, openSnakbar: true, msg: msg });
  };

  //when a service row is clicked to edit a service
  const handleEditService = (event, serviceId) => {
    //find the service
    const service = state.servicesData.filter((item) => item.id === serviceId);

    //set the state variables to open the service modal
    setState({
      currentService: service,
      editingService: true,
      triggerModal: state.triggerModal + 1,
      serviceTitle: "Edit Service",
    });
  };

  //when a service row is clicked to edit a detail
  const handleEditDetail = (event, detail) => {
    //find the service

    //set the state variables to open the service modal
    setState({
      currentDetail: detail,
      editingDetail: true,
      triggerDetailModal: state.triggerDetailModal + 1,
      detailTitle: "Edit Detail",
    });
  };

  //open the modal to create or edit a service detail
  const handleDetailModal = (serviceId) => {
    //open the modal
    setState({
      serviceId: serviceId,
      editingDetail: false,
      triggerDetailModal: state.triggerDetailModal + 1,
      detailTitle: "New Service Detail",
    });
  };

  return (
    <div className="bookings-container">
      <div className="bookings-container-box">
        <form>
          <Accordion
            expanded={state.expandPanel}
            onChange={() => setState({ expandPanel: !state.expandPanel })}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              {state.onEditMode ? (
                <Box sx={{ display: "inline-flex" }}>
                  <Typography sx={{ fontWeight: "bold", color: "#1976d2" }}>
                    EDITING BOOKING
                  </Typography>
                  <EditIcon style={{ color: "#1976d2", marginLeft: "10px" }} />
                </Box>
              ) : (
                <Box sx={{ display: "inline-flex" }}>
                  <Typography sx={{ fontWeight: "bold", color: "#1976d2" }}>
                    NEW BOOKING
                  </Typography>
                  <RequestQuoteIcon
                    style={{ color: "#1976d2", marginLeft: "10px" }}
                  />
                </Box>
              )}
            </AccordionSummary>
            <AccordionDetails>
              <Box className="fieldsbox1">
                <TextField
                  className="textfield"
                  id="invoice"
                  label="Invoice #"
                  type="text"
                  disabled
                  value={state.invoice}
                  onChange={handleOnChange}
                />

                <TextField
                  className="textfield"
                  id="quoteId"
                  label="Quote #"
                  type="text"
                  disabled
                  value={state.quoteId}
                  onChange={handleOnChange}
                />

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
                    label="Quote Date"
                    className="textfield"
                    format="YYYY-MM-DD"
                    id="quoteDate"
                    disabled
                    value={state.quoteDate}
                    onChange={(newValue) => setState({ quoteDate: newValue })}
                  />

                  <DatePicker
                    error={state.invalidField === "bookingDate"}
                    helperText={
                      state.invalidField === "bookingDate"
                        ? "Information required"
                        : ""
                    }
                    label="Booking Date"
                    className="textfield"
                    id="bookingDate"
                    format="YYYY-MM-DD"
                    required
                    placeholder="Booking Date"
                    value={dayjs(state.bookingDate)}
                    onChange={(newValue) => setState({ bookingDate: newValue })}
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
                  <DatePicker
                    error={state.invalidField === "tripStartDate"}
                    helperText={
                      state.invalidField === "tripStartDate"
                        ? "Information required"
                        : ""
                    }
                    label="Trip Start Date"
                    className="textfield"
                    id="tripStartDate"
                    format="YYYY-MM-DD"
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
                    className="textfield"
                    id="tripEndDate"
                    format="YYYY-MM-DD"
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
                  disabled
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
                  <Button
                    style={{ marginLeft: "10px" }}
                    variant="contained"
                    onClick={handleServiceModal}
                  >
                    New Service Order
                  </Button>
                  <p></p>
                  <Divider />
                  <Typography variant="h5" color="primary">
                    Services
                  </Typography>
                  <Divider />
                  <Box>
                    <Tabs
                      value={state.tabService}
                      onChange={handleServiceClick}
                    >
                      {state.servicesData.length > 0 &&
                        state.servicesData.map((service) => {
                          return (
                            <Tab
                              label={service.serviceName}
                              key={service.id}
                            ></Tab>
                          );
                        })}
                    </Tabs>
                    {state.servicesData.length > 0 &&
                      state.servicesData.map((service, index) => {
                        let details = state.detailsData.map((detailsArr) =>
                          detailsArr.filter(
                            (detail) => detail.service_id === service.id
                          )
                        );
                        return (
                          //service data info
                          <CustomTabPanel
                            value={state.tabService}
                            index={index}
                            key={service.id}
                          >
                            <Table size="small">
                              <TableHead>
                                <TableRow>
                                  <TableCell style={{ fontWeight: "bold" }}>
                                    SVC
                                  </TableCell>
                                  <TableCell style={{ fontWeight: "bold" }}>
                                    Date
                                  </TableCell>
                                  <TableCell style={{ fontWeight: "bold" }}>
                                    Qty
                                  </TableCell>
                                  <TableCell style={{ fontWeight: "bold" }}>
                                    Charge
                                  </TableCell>
                                  <TableCell style={{ fontWeight: "bold" }}>
                                    Tips
                                  </TableCell>
                                  <TableCell style={{ fontWeight: "bold" }}>
                                    Sales Tax
                                  </TableCell>
                                  <TableCell style={{ fontWeight: "bold" }}>
                                    Optional
                                  </TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                <TableRow
                                  hover
                                  onClick={(event) =>
                                    handleEditService(event, service.id)
                                  }
                                >
                                  <TableCell>{service.serviceCode}</TableCell>
                                  <TableCell>
                                    {dayjs(service.serviceDate).format(
                                      "YYYY-MM-DD"
                                    )}
                                  </TableCell>
                                  <TableCell>{service.qty}</TableCell>
                                  <TableCell>{service.charge}</TableCell>
                                  <TableCell>{service.tips}</TableCell>
                                  <TableCell>{service.salesTax}</TableCell>
                                  <TableCell>
                                    <Checkbox
                                      checked={service.optional}
                                      disabled
                                    />
                                  </TableCell>
                                </TableRow>
                              </TableBody>
                            </Table>
                            <p></p>
                            {details[index].length > 0 && (
                              <Box>
                                <Typography variant="h6" color="secondary">
                                  Details
                                </Typography>
                                <p></p>
                                <Table size="small">
                                  <TableHead>
                                    <TableRow>
                                      <TableCell style={{ fontWeight: "bold" }}>
                                        Driver
                                      </TableCell>
                                      <TableCell style={{ fontWeight: "bold" }}>
                                        Vehicle
                                      </TableCell>
                                      <TableCell style={{ fontWeight: "bold" }}>
                                        From
                                      </TableCell>
                                      <TableCell style={{ fontWeight: "bold" }}>
                                        To
                                      </TableCell>
                                      <TableCell style={{ fontWeight: "bold" }}>
                                        Spot Time
                                      </TableCell>
                                      <TableCell style={{ fontWeight: "bold" }}>
                                        Start Time
                                      </TableCell>
                                      <TableCell style={{ fontWeight: "bold" }}>
                                        End Time
                                      </TableCell>
                                      <TableCell style={{ fontWeight: "bold" }}>
                                        Base Time
                                      </TableCell>
                                      <TableCell style={{ fontWeight: "bold" }}>
                                        Type
                                      </TableCell>
                                    </TableRow>
                                  </TableHead>
                                  <TableBody>
                                    {details[index].map((detail) => {
                                      const driver = state.employeesData.find(
                                        (employee) =>
                                          employee.employee_id ===
                                          detail.employee_id
                                      );

                                      const vehicle = state.vehiclesData.find(
                                        (vehicle) =>
                                          vehicle.vehicle_id ===
                                          detail.vehicle_id
                                      );

                                      const locationFrom =
                                        state.locationsData.find(
                                          (location) =>
                                            location.location_id ===
                                            detail.from_location_id
                                        );
                                      const locationTo =
                                        state.locationsData.find(
                                          (location) =>
                                            location.location_id ===
                                            detail.to_location_id
                                        );

                                      return (
                                        <TableRow
                                          hover
                                          onClick={(event) =>
                                            handleEditDetail(event, detail)
                                          }
                                          key={detail.detail_id}
                                        >
                                          <TableCell>
                                            {`${driver.firstname} ${driver.lastname}`}
                                          </TableCell>
                                          <TableCell>
                                            {vehicle.vehicle_name}
                                          </TableCell>
                                          <TableCell>
                                            {locationFrom.location_name}
                                          </TableCell>
                                          <TableCell>
                                            {locationTo.location_name}
                                          </TableCell>
                                          <TableCell>
                                            {dayjs(detail.spot_time).format(
                                              "HH:MM a"
                                            )}
                                          </TableCell>
                                          <TableCell>
                                            {dayjs(detail.start_time).format(
                                              "HH:MM a"
                                            )}
                                          </TableCell>
                                          <TableCell>
                                            {dayjs(detail.end_time).format(
                                              "HH:MM a"
                                            )}
                                          </TableCell>
                                          <TableCell>
                                            {dayjs(detail.base_time).format(
                                              "HH:MM a"
                                            )}
                                          </TableCell>
                                          <TableCell>
                                            {detail.service_type}
                                          </TableCell>
                                        </TableRow>
                                      );
                                    })}
                                  </TableBody>
                                </Table>
                              </Box>
                            )}
                            <p></p>
                            <Button
                              variant="outlined"
                              onClick={() => handleDetailModal(service.id)}
                            >
                              Add details
                            </Button>
                          </CustomTabPanel>
                        );
                      })}
                  </Box>
                </Box>
              ) : (
                <Button variant="contained" onClick={handleSubmit}>
                  Save New Booking
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
              <AlertTitle>Bookings Updated</AlertTitle>
              {state.msg}
            </Alert>
          </Snackbar>
        </form>
        <p></p>
        <div id="table-container">
          <Divider />
          <p></p>
          <Accordion
            expanded={state.expandBookings}
            onChange={() => setState({ expandBookings: !state.expandBookings })}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography sx={{ fontWeight: "bold", color: "#1976d2" }}>
                VIEW BOOKINGS
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <EnhancedTable
                headings={headings}
                loadData={getBookingsData}
                dataUpdated={state.isDataUpdated}
                editData={handleItemClick}
                boxChecked={handleBoxChecked}
                onDelete={handleDelete}
                filterOption="agencyName"
              />
            </AccordionDetails>
          </Accordion>
        </div>
        <p></p>
        <div id="quotes-container">
          <Divider />
          <p></p>
          <QuotesView
            getQuotesData={getQuotesData}
            handleRowClick={handleQuoteClick}
          />
          <ServiceModal
            modalTitle={state.serviceTitle}
            onError={handleOnError}
            onSuccess={handleOnSuccess}
            open={state.triggerModal}
            invoice={state.invoice}
            data={state.currentService}
            onEditMode={state.editingService}
            onSave={handleItemClick}
          />
          <DetailModal
            modalTitle={state.detailTitle}
            onError={handleOnError}
            onSuccess={handleOnSuccess}
            open={state.triggerDetailModal}
            serviceId={state.serviceId}
            invoice={state.invoice}
            data={state.currentDetail}
            onEditMode={state.editingDetail}
            onSave={handleItemClick}
          />
        </div>
      </div>
    </div>
  );
}; //Quotes
