import React, { useReducer, useEffect, useRef } from "react";
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
import { MuiTelInput } from "mui-tel-input";
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

import {
  UsePrivateGet,
  UsePrivatePost,
  UsePrivateDelete,
  UsePrivatePut,
} from "../hooks/useFetchServer";

import { useNavigate, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { PDFDownloadLink, pdf } from "@react-pdf/renderer";
import Invoice from "./pdfReports/invoice";
import * as FileSaver from "file-saver";

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
  responsibleName: "",
  responsibleEmail: "",
  responsiblePhone: "",
  quoteDate: null,
  bookingDate: dayjs(Date(Date.now())),
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
  bookingsData: [],
  clientsData: [],
  employeesData: [],
  salesPeople: [],
  drivers: [],
  vehiclesData: [],
  locationsData: [],
  companiesData: [],
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

    //get all data
    const getAllData = async () => {
      let response = await getServer("/getallclients", controller.signal);
      const clientsRespData = response?.data;

      response = await getServer("/getallemployees", controller.signal);
      const employeesRespData = response?.data;

      response = await getServer("/getsalespeople", controller.signal);
      const salesPeopleRespData = response?.data;

      response = await getServer("/getdrivers", controller.signal);
      const driversRespData = response?.data;

      response = await getServer("/getallvehiclenames", controller.signal);
      const vehiclesRespData = response?.data;

      response = await getServer("/getalllocationnames", controller.signal);
      const locationsRespData = response?.data;

      response = await getServer("/getallcompanynames", controller.signal);
      const companiesRespData = response?.data;

      response = await getServer("/getallquotes", controller.signal);
      let quotesRespData = response?.data;
      quotesRespData = quotesRespData?.map((item) => {
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
          responsibleName: item.responsible_name,
          responsibleEmail: item.responsible_email,
          responsiblePhone: item.responsible_phone,
          quoteDate: dayjs(item.quote_date).format("YYYY-MM-DD"),
          category: item.category,
          paxGroup: item.pax_group,
          numPeople: item.num_people,
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

      response = await getServer("/getallbookings", controller.signal);
      if (response.disconnect) {
        setAuth({});
        navigate("/login", { state: { from: location }, replace: true });
        //other errors
      } else if (response.error) {
        setState({ success: false, error: response.error, openSnakbar: true });
      }
      //no error
      else {
        let bookingsRespData = response.data;

        bookingsRespData = bookingsRespData?.map((item) => {
          const booking = {
            id: item.invoice,
            quoteid: item.quote_id,
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
            responsibleName: item.responsible_name,
            responsibleEmail: item.responsible_email,
            responsiblePhone: item.responsible_phone,
            quoteDate: item.quote_date,
            bookingDate: dayjs(item.booking_date).format("YYYY-MM-DD"),
            category: item.category,
            paxGroup: item.pax_group,
            numPeople: item.num_people,
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

        isMounted &&
          setState({
            clientsData: clientsRespData,
            employeesData: employeesRespData,
            vehiclesData: vehiclesRespData,
            locationsData: locationsRespData,
            quotesData: quotesRespData,
            bookingsData: bookingsRespData,
            salesPeople: salesPeopleRespData,
            drivers: driversRespData,
            companiesData: companiesRespData,
          });
      }
    }; //getAllData

    if (process.env.NODE_ENV === "development") {
      effectRun.current && getAllData();
    } else {
      getAllData();
    }

    return () => {
      isMounted = false;
      controller.abort();
      effectRun.current = true;
    };
  }, [state.isDataUpdated]);

  //Get all bookings data
  const getBookingsData = () => {
    return state.bookingsData;
  }; //getBookingsData

  //Get all quotes data
  const getQuotesData = () => {
    return state.quotesData;
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

    const response = await postServer("/createbooking", {
      booking: {
        clientId: state.clientId,
        employeeId: state.employeeId,
        responsibleName: state.responsibleName,
        responsibleEmail: state.responsibleEmail,
        responsiblePhone: state.responsiblePhone,
        quoteId: state.quoteId,
        quoteDate: state.quoteDate,
        bookingDate: state.bookingDate,
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
      invoice: "",
      quoteId: "",
      clientId: "",
      agencyName: null,
      agencyEmail: "",
      agencyContact: "",
      employeeId: "",
      salesPerson: null,
      responsibleName: "",
      responsibleEmail: "",
      responsiblePhone: "",
      quoteDate: "",
      bookingDate: dayjs(Date(Date.now())),
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
      responsibleName: "",
      responsibleEmail: "",
      responsiblePhone: "",
      quoteDate: "",
      bookingDate: dayjs(Date(Date.now())),
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

    const bookingToUpdate = {
      invoice: state.invoice,
      quoteId: state.quoteId,
      clientId: state.clientId,
      employeeId: state.employeeId,
      responsibleName: state.responsibleName,
      responsibleEmail: state.responsibleEmail,
      responsiblePhone: state.responsiblePhone,
      bookingDate: state.bookingDate,
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

    const response = await putServer("/updatebooking", {
      booking: bookingToUpdate,
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
    //Before deleting a booking it must delete the service and details first
    //Find the services for the bookings
    if (state.servicesData?.length > 0) {
      let serviceIdsToDelete = itemsSelected?.map((id) => {
        const services = state.servicesData?.filter(
          (service) => service.bookingId === id
        );
        return services?.map((e) => e.id);
      });

      //flatening the array
      serviceIdsToDelete = serviceIdsToDelete?.flat();

      if (state.detailsData?.length > 0) {
        //find details for the services (array of services Ids array)
        const detailsArr = state.detailsData?.flat();
        let detailIdsToDelete = serviceIdsToDelete?.map((serviceId) => {
          const details = detailsArr?.filter(
            (detail) => serviceId === detail.service_id
          );
          return details?.map((e) => e.detail_id);
        });

        //flatening the array
        detailIdsToDelete = detailIdsToDelete?.flat();

        //Delete details
        if (detailIdsToDelete.length > 0) {
          //converting it to json
          const detailsIds = JSON.stringify(detailIdsToDelete);
          const response = await deleteServer(
            `/deletesomedetails/${detailsIds}`
          );
          if (response?.error) {
            setState({
              error: response.error,
              success: false,
              openSnakbar: true,
            });
            return;
          } //response?.error
        } //detailIdsToDelete.length > 0
      } //state.detailsData?.length > 0

      //delete services
      if (serviceIdsToDelete.length > 0) {
        //converting it to json
        const serviceIds = JSON.stringify(serviceIdsToDelete);
        const response = await deleteServer(
          `/deletesomeservices/${serviceIds}`
        );
        if (response?.error) {
          setState({
            error: response.error,
            success: false,
            openSnakbar: true,
          });
          return;
        }
      } //serviceIdsToDelete.length > 0
    } //state.servicesData?.length > 0

    //delete bookings
    if (itemsSelected.length > 0) {
      //converting it to json
      const bookingIds = JSON.stringify(itemsSelected);
      const response = await deleteServer(`/deletebooking/${bookingIds}`);
      if (response?.data) {
        clearState(response.data);
      } else if (response?.disconnect) {
        setAuth({});
        navigate("/login", { state: { from: location }, replace: true });
      } else if (response?.error) {
        setState({ error: response.error, success: false, openSnakbar: true });
      }
    }
  }; //handleDelete

  //Show services information when clicking on a table row
  const handleItemClick = async (id) => {
    //load services for this booking
    const services = await getServicesData(id);

    //load service details for this booking
    const details = await getDetailsData(services);

    //load fields
    //get client id and employee id from bookings data
    const clientId = state.bookingsData?.find((e) => e.id === id)?.clientId;
    const employeeId = state.bookingsData?.find((e) => e.id === id)?.employeeId;
    const quoteId = state.bookingsData?.find((e) => e.id === id)?.quoteid;
    setState({
      onEditMode: true,
      expandPanel: true,
      invalidField: "",
      invoice: id,
      quoteId: quoteId,
      clientId: clientId,
      agencyName: state.clientsData?.find(
        (client) => client.client_id === clientId
      )?.agency,
      agencyEmail: state.clientsData?.find(
        (client) => client.client_id === clientId
      )?.email,
      agencyContact: state.clientsData?.find(
        (client) => client.client_id === clientId
      )?.contact,
      employeeId: employeeId,
      salesPerson: state.salesPeople?.find((e) => e.employee_id === employeeId)
        ?.fullname,
      responsibleName: state.bookingsData?.find((e) => e.id === id)
        ?.responsibleName,
      responsibleEmail: state.bookingsData?.find((e) => e.id === id)
        ?.responsibleEmail,
      responsiblePhone: state.bookingsData?.find((e) => e.id === id)
        ?.responsiblePhone,
      bookingDate: dayjs(
        state.bookingsData?.find((e) => e.id === id)?.bookingDate
      ),
      quoteDate:
        dayjs(state.bookingsData?.find((e) => e.id === id)?.quoteDate) ?? "",
      category: state.bookingsData?.find((e) => e.id === id)?.category,
      paxGroup: state.bookingsData?.find((e) => e.id === id)?.paxGroup,
      numPeople: state.bookingsData?.find((e) => e.id === id)?.numPeople,
      tripStartDate: dayjs(
        state.bookingsData?.find((e) => e.id === id)?.tripStartDate
      ),
      tripEndDate: dayjs(
        state.bookingsData?.find((e) => e.id === id)?.tripEndDate
      ),
      deposit: state.bookingsData?.find((e) => e.id === id)?.deposit,
      quotedCost: state.bookingsData?.find((e) => e.id === id)?.cost,
      arrivalProcMCOMCA: state.bookingsData?.find((e) => e.id === id)
        ?.arrivalProcMCOMCA,
      numHoursQuoteValid: state.bookingsData?.find((e) => e.id === id)
        ?.numHoursQuoteValid,
      clientComments: state.bookingsData?.find((e) => e.id === id)
        ?.clientComments,
      intineraryDetails: state.bookingsData?.find((e) => e.id === id)
        ?.intineraryDetails,
      internalComments: state.bookingsData?.find((e) => e.id === id)
        ?.internalComents,
      servicesData: services,
      tabService: 0,
      detailsData: details,
    });

    //scroll to the invoice field
    document.getElementById("invoice").scrollIntoView();
  }; //handleItemClick

  //get services Data
  const getServicesData = async (invoice) => {
    const response = await getServer(`/getservices/${invoice}`);

    if (response.disconnect) {
      setAuth({});
      navigate("/login", { state: { from: location }, replace: true });
      return;
      //other errors
    } else if (response.error) {
      setState({ success: false, error: response.error, openSnakbar: true });
      return;
    }
    //no error
    else {
      let servicesRespData = response.data;
      servicesRespData = servicesRespData.map((item) => {
        const service = {
          id: item.service_id,
          bookingId: item.booking_id,
          serviceName: item.service_name,
          serviceCode: item.service_code,
          serviceDate: item.service_date,
          qty: item.qty,
          charge: item.charge,
          salesTax: item.sales_tax,
        };
        return service;
      });
      return servicesRespData;
    }
  }; //getServicesData

  //fech details for the services in a booking
  const getDetailsData = async (services) => {
    let serviceIds = services.map((service) => service.id);
    serviceIds = JSON.stringify(serviceIds);
    const response = await getServer(`/getdetailsforservices/${serviceIds}`);
    if (response?.data) {
      return response.data;
    } else if (response?.disconnect) {
      setAuth({});
      navigate("/login", { state: { from: location }, replace: true });
      return;
    } else if (response?.error) {
      setState({ error: response.error, success: false, openSnakbar: true });
      return;
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
      responsibleName: state.quotesData.find((e) => e.id === id)
        .responsibleName,
      responsibleEmail: state.quotesData.find((e) => e.id === id)
        .responsibleEmail,
      responsiblePhone: state.quotesData.find((e) => e.id === id)
        .responsiblePhone,
      bookingDate: dayjs(Date(Date.now())),
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

  //handle changes on phone field
  const handlePhoneChange = (value, info) => {
    setState({ responsiblePhone: value });
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
      serviceId: detail?.service_id,
      currentDetail: detail,
      editingDetail: true,
      triggerDetailModal: state.triggerDetailModal + 1,
      detailTitle: "Edit Detail",
    });
  };

  //open the modal to create a service detail
  const handleDetailModal = (serviceId) => {
    //open the modal
    setState({
      serviceId: serviceId,
      currentDetail: [],
      editingDetail: false,
      triggerDetailModal: state.triggerDetailModal + 1,
      detailTitle: "New Service Detail",
    });
  };

  //function to generate invoice PDF
  const generatePdfDoc = async (filename) => {
    try {
      const blob = await pdf(
        <Invoice
          date={dayjs(state.tripStartDate).format("YYYY-MM-DD")}
          invoiceNum={state.invoice}
          responsible={state.responsibleName}
          destination={"Universal"}
          account={"1830"}
          address={"123 Main St"}
          city={"Orlando"}
          state={"FL"}
          phone={state.responsiblePhone}
          email={state.responsibleEmail}
          group={state.paxGroup}
          passengers={state.numPeople}
          bookingDate={dayjs(state.bookingDate).format("YYYY-MM-DD")}
          arrival={"10:30 am"}
          departure={"11:00 am"}
          reference={""}
          payment={0.0}
          charges={0.0}
          tax={0.0}
        />
      ).toBlob();
      FileSaver.saveAs(blob, filename);
      const pdfUrl = URL.createObjectURL(blob);
      window.open(pdfUrl, "_blank");
      URL.revokeObjectURL(pdfUrl);
    } catch (error) {
      console.error("Error creating pdf:", error);
    }
  };

  //Handle download pdf click
  const handleDownloadInvoice = () => {
    generatePdfDoc(`invoice${state.invoice}.pdf`);
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
                    options={state.salesPeople?.map((element) => {
                      const employee = {
                        employeeId: element.employee_id,
                        salesPerson: element.fullname,
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

                  <Button
                    style={{ marginLeft: "10px" }}
                    variant="contained"
                    onClick={handleDownloadInvoice}
                  >
                    Download Invoice
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
                      {state.servicesData?.length > 0 &&
                        state.servicesData?.map((service) => {
                          return (
                            <Tab
                              label={service?.serviceName}
                              key={service?.id}
                            ></Tab>
                          );
                        })}
                    </Tabs>
                    {state.servicesData?.length > 0 &&
                      state.servicesData?.map((service, index) => {
                        let details = state.detailsData?.map((detailsArr) =>
                          detailsArr?.filter(
                            (detail) => detail.service_id === service.id
                          )
                        );
                        return (
                          //service data info
                          <CustomTabPanel
                            value={state.tabService}
                            index={index}
                            key={service?.id}
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
                                    Sales Tax
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
                                  <TableCell>{service.salesTax}</TableCell>
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
                                        Type
                                      </TableCell>
                                    </TableRow>
                                  </TableHead>
                                  <TableBody>
                                    {details[index]?.map((detail) => {
                                      const driver = state.drivers?.find(
                                        (employee) =>
                                          employee?.employee_id ===
                                          detail?.employee_id
                                      );

                                      const vehicle = state.vehiclesData?.find(
                                        (vehicle) =>
                                          vehicle?.vehicle_id ===
                                          detail?.vehicle_id
                                      );

                                      const locationFrom =
                                        state.locationsData?.find(
                                          (location) =>
                                            location?.location_id ===
                                            detail?.from_location_id
                                        );
                                      const locationTo =
                                        state.locationsData?.find(
                                          (location) =>
                                            location?.location_id ===
                                            detail?.to_location_id
                                        );

                                      return (
                                        <TableRow
                                          hover
                                          onClick={(event) =>
                                            handleEditDetail(event, detail)
                                          }
                                          key={detail?.detail_id}
                                        >
                                          <TableCell>
                                            {!detail.use_farmout
                                              ? driver?.fullname
                                              : state.companiesData?.find(
                                                  (company) =>
                                                    company.company_id ===
                                                    detail?.company_id
                                                )?.company_name}
                                          </TableCell>
                                          <TableCell>
                                            {!detail.use_farmout
                                              ? vehicle?.vehicle_name
                                              : "Farm-out"}
                                          </TableCell>
                                          <TableCell>
                                            {locationFrom?.location_name}
                                          </TableCell>
                                          <TableCell>
                                            {locationTo?.location_name}
                                          </TableCell>
                                          <TableCell>
                                            {dayjs(detail?.spot_time).format(
                                              "HH:mm a"
                                            )}
                                          </TableCell>
                                          <TableCell>
                                            {dayjs(detail?.start_time).format(
                                              "HH:mm a"
                                            )}
                                          </TableCell>
                                          <TableCell>
                                            {dayjs(detail?.end_time).format(
                                              "HH:mm a"
                                            )}
                                          </TableCell>
                                          <TableCell>
                                            {detail?.service_type}
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
            serviceData={state.servicesData}
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
