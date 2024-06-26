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
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Tabs,
  Tab,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Tooltip,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Menu,
  Checkbox,
  Badge,
  Backdrop,
  CircularProgress,
} from "@mui/material";
import { MuiTelInput } from "mui-tel-input";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import EditIcon from "@mui/icons-material/Edit";
import RequestQuoteIcon from "@mui/icons-material/RequestQuote";
import ReceiptIcon from "@mui/icons-material/Receipt";
import GavelIcon from "@mui/icons-material/Gavel";
import ManageSearchIcon from "@mui/icons-material/ManageSearch";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import "dayjs/locale/en";

import EnhancedTable from "../utils/table_generic";
import { QuotesView } from "./subcomponents/quotesView";
import { ServiceModal } from "./subcomponents/serviceModal";
import { CustomTabPanel } from "./subcomponents/customTabPanel";
import { DetailModal } from "./subcomponents/detailModal";
import CustomDialog from "../utils/customDialog";
import SendIcon from "@mui/icons-material/Send";

import {
  UsePrivateGet,
  UsePrivatePost,
  UsePrivateDelete,
  UsePrivatePut,
} from "../hooks/useFetchServer";

import { useNavigate, useLocation, useParams } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { pdf } from "@react-pdf/renderer";
import Invoice from "./pdfReports/invoice";
import Contract from "./pdfReports/contract";
import * as FileSaver from "file-saver";
import QuoteReport from "./pdfReports/quote";
import { Calendar } from "react-multi-date-picker";
import { axiosPdfService } from "../api/axios";

import { validateEmail } from "../utils/validators";

dayjs.extend(utc);
dayjs.extend(timezone);

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
  "Particular",
  "Others",
];

const initialState = {
  isQuote: false,
  invoice: "",
  clientId: "",
  agencyName: null,
  agencyEmail: "",
  agencyContact: "",
  curClient: {},
  curBooking: {},
  curQuote: {},
  employeeId: "",
  salesPerson: null,
  responsibleName: "",
  responsibleEmail: "",
  responsiblePhone: "",
  quoteDate: dayjs(new Date()),
  bookingDate: dayjs(new Date()),
  category: null,
  numPeople: 0,
  tripStartDate: dayjs(new Date()),
  tripEndDate: dayjs(new Date()),
  deposit: 0.0,
  quotedCost: 0.0,
  numHoursQuoteValid: 0,
  clientComments: "",
  intineraryDetails: "",
  internalComments: "",
  status: "new",
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
  showAccordion: false,
  accordionTitle: "",
  openInvoiceDialog: false,
  openHistoryDialog: false,
  openCalendarDialog: false,
  openCancelDialog: false,
  dates: [],
  historyDetailData: [],
  transactionsData: [],
  anchorSave: null,
  hasBooking: null,
  openSendEmailDialog: false,
  manualInvoiceError: false,
  isLoading: false,
  openCategoryDialog: false,
};

export const Bookings = () => {
  const { id } = useParams();
  const [state, setState] = useReducer(reducer, initialState);

  const effectRun = useRef(false);

  const { setAuth, auth } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const getServer = UsePrivateGet();
  const postServer = UsePrivatePost();
  const putServer = UsePrivatePut();
  const deleteServer = UsePrivateDelete();

  const openSave = Boolean(state.anchorSave);

  const currencyFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  });

  useEffect(() => {
    if(id) handleItemClick(id);
  }, [id]);

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

      response = await getServer("/getlocations", controller.signal);
      const locationsRespData = response?.data;

      response = await getServer("/getallcompanynames", controller.signal);
      const companiesRespData = response?.data;

      response = await getServer("/getamountduebyinvoice", controller.signal);
      const transactionsRespData = response?.data;

      response = await getServer("/getEmailsSent", controller.signal);
      const emailsRespData = response?.data;

      response = await getServer("/getallquotes", controller.signal);
      let quotesRespData = response?.data;
      quotesRespData = quotesRespData?.map((item) => {
        const emailInfo = emailsRespData?.find(
          (e) => e.email_id === item.invoice
        );
        const clientInfo = clientsRespData.find(
          (client) => client.client_id === item.client_id
        );
        const employeeInfo = employeesRespData.find(
          (employee) => employee.employee_id === item.employee_id
        );
        const quote = {
          id: item.invoice,
          isQuote: item.is_quote,
          clientId: item.client_id,
          agencyName: clientInfo?.agency,
          agencyContact: clientInfo?.contact,
          agencyEmail: clientInfo?.email,
          employeeId: item.employee_id,
          salesPerson: `${employeeInfo?.firstname} ${employeeInfo?.lastname}`,
          responsibleName: item.responsible_name,
          responsibleEmail: item.responsible_email,
          responsiblePhone: item.responsible_phone,
          quoteDate: dayjs(item.quote_date).format("YYYY-MM-DD"), //Important: Format required for sorting
          bookingDate: dayjs(item.booking_date).format("YYYY-MM-DD"), //Important: Format required for sorting
          category: item.category,
          numPeople: item.num_people,
          tripStartDate: dayjs(item.trip_start_date).format("YYYY-MM-DD"), //Important: Format required for sorting
          tripEndDate: dayjs(item.trip_end_date).format("YYYY-MM-DD"), //Important: Format required for sorting
          deposit: item.deposit,
          cost: item.cost,
          numHoursQuoteValid: item.hours_quote_valid,
          clientComments: item.client_comments,
          intineraryDetails: item.intinerary_details,
          internalComents: item.internal_coments,
          status: item.status,
          costQuote: currencyFormatter.format(item.cost),
          hasBooking: item.has_booking,
          hasBookingCheck: <Checkbox checked={item.has_booking} size="small" />,
          emailSentDate: dayjs(emailInfo?.time_stamp)
            .utc(true)
            .local()
            .format("LLL"),
          emailUser: emailInfo?.who_sent,
          emailSentQty: emailInfo?.num_times_sent,
          emailOpenedQty: emailInfo?.num_times_opened,
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
          const amountDue = transactionsRespData?.find(
            (e) => e.invoice === item.invoice
          )?.amount_due;

          const booking = {
            id: item.invoice,
            isQuote: item.is_quote,
            clientId: item.client_id,
            agencyName: clientsRespData?.find(
              (client) => client.client_id === item.client_id
            )?.agency,
            agencyContact: clientsRespData?.find(
              (client) => client.client_id === item.client_id
            )?.contact,
            agencyEmail: clientsRespData?.find(
              (client) => client.client_id === item.client_id
            )?.email,
            employeeId: item.employee_id,
            salesPerson: `${
              employeesRespData?.find(
                (employee) => employee.employee_id === item.employee_id
              )?.firstname
            } ${
              employeesRespData?.find(
                (employee) => employee.employee_id === item.employee_id
              )?.lastname
            }`,
            responsibleName: item.responsible_name,
            responsibleEmail: item.responsible_email,
            responsiblePhone: item.responsible_phone,
            quoteDate: dayjs(item.quote_date).format("YYYY-MM-DD"), //Important: Format required for sorting
            bookingDate: dayjs(item.booking_date).format("YYYY-MM-DD"), //Important: Format required for sorting
            category: item.category,
            numPeople: item.num_people,
            tripStartDate: dayjs(item.trip_start_date).format("YYYY-MM-DD"), //Important: Format required for sorting
            tripEndDate: dayjs(item.trip_end_date).format("YYYY-MM-DD"), //Important: Format required for sorting
            deposit: item.deposit,
            cost: item.cost,
            numHoursQuoteValid: item.hours_quote_valid,
            clientComments: item.client_comments,
            intineraryDetails: item.intinerary_details,
            internalComents: item.internal_coments,
            status: item.status,
            amountDue: amountDue ? currencyFormatter.format(amountDue) : "",
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
            curBooking: state.invoice
              ? bookingsRespData?.find((e) => e.id === state.invoice)
              : {},
            curQuote: state.invoice
              ? quotesRespData?.find((e) => e.id === state.invoice)
              : {},
            salesPeople: salesPeopleRespData,
            drivers: driversRespData,
            companiesData: companiesRespData,
            transactionsData: transactionsRespData,
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

    if (!state.bookingDate && !state.isQuote) {
      setState({ invalidField: "bookingDate" });
      return;
    }

    if (!state.quoteDate && state.isQuote) {
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

    if (!dayjs(state.tripStartDate).isValid()) {
      setState({ invalidField: "tripStartDate" });
      return;
    }

    if (!dayjs(state.tripEndDate).isValid()) {
      setState({ invalidField: "tripEndDate" });
      return;
    }

    if (!state.quotedCost && state.isQuote) {
      setState({ invalidField: "quotedCost" });
      return;
    }

    if (state.responsibleEmail && !validateEmail(state.responsibleEmail)) {
      setState({ invalidField: "responsibleEmail" });
      return;
    }

    setState({ invalidField: "" });
    return true;
  }; //isFormValid

  //handle form submit
  const handleSubmit = async (id, isAQuote) => {
    //validate form
    if (!isFormValid()) {
      return;
    }

    //check if there is an id (booking being created from a quote)
    let invoice = "";
    let bookingDate = "";
    if (id) {
      invoice = id;
      bookingDate = dayjs(new Date());
    } else {
      invoice = state.invoice;
      bookingDate = state.bookingDate;
    }

    const response = await postServer("/createbooking", {
      booking: {
        invoice: invoice,
        clientId: state.clientId,
        employeeId: state.employeeId,
        responsibleName: state.responsibleName,
        responsibleEmail: state.responsibleEmail,
        responsiblePhone: state.responsiblePhone,
        isQuote: isAQuote,
        quoteDate: state.quoteDate,
        bookingDate: bookingDate,
        category: state.category,
        numPeople: state.numPeople,
        tripStartDate: state.tripStartDate,
        tripEndDate: state.tripEndDate,
        deposit: state.deposit,
        quotedCost: state.quotedCost,
        numHoursQuoteValid: state.numHoursQuoteValid,
        clientComments: state.clientComments,
        intineraryDetails: state.intineraryDetails,
        internalComments: state.internalComments,
        changeUser: auth.userName,
        status: state.status,
      },
    });

    if (response?.data) {
      clearState(`Booking/Quote ${response.data} created`);
    } else if (response?.disconnect) {
      setAuth({});
      navigate("/login", { state: { from: location }, replace: true });
    } else if (response?.error) {
      setState({
        error: response.error,
        success: false,
        openSnakbar: true,
        anchorSave: null,
      });
    }
  }; //handleSubmit

  //show msg and reload data
  const reloadData = (msg) => {
    setState({
      msg: msg,
      error: null,
      success: true,
      openSnakbar: true,
      isDataUpdated: !state.isDataUpdated,
    });
  };

  //clear state fields utility
  const clearState = (msg) => {
    setState({
      msg: msg,
      error: null,
      success: true,
      openSnakbar: true,
      invoice: "",
      isQuote: false,
      clientId: "",
      curClient: {},
      curBooking: {},
      curQuote: {},
      agencyName: null,
      agencyEmail: "",
      agencyContact: "",
      employeeId: "",
      salesPerson: null,
      responsibleName: "",
      responsibleEmail: "",
      responsiblePhone: "",
      quoteDate: dayjs(new Date()),
      bookingDate: dayjs(new Date()),
      category: null,
      numPeople: 0,
      tripStartDate: dayjs(new Date()),
      tripEndDate: dayjs(new Date()),
      deposit: 0.0,
      quotedCost: 0.0,
      numHoursQuoteValid: 0,
      clientComments: "",
      intineraryDetails: "",
      internalComments: "",
      status: "new",
      expandPanel: false,
      expandBookings: false,
      onEditMode: false,
      isDataUpdated: !state.isDataUpdated,
      showAccordion: false,
      accordionTitle: "",
      dates: [],
      openCalendarDialog: false,
      anchorSave: null,
      hasBooking: null,
      manualInvoiceError: false,
    });
  }; //clearState

  //Cancel editing
  const cancelEditing = () => {
    setState({
      expandPanel: false,
      onEditMode: false,
      invalidField: "",
      invoice: "",
      isQuote: false,
      clientId: "",
      curClient: {},
      curBooking: {},
      curQuote: {},
      agencyName: null,
      agencyEmail: "",
      agencyContact: "",
      employeeId: "",
      salesPerson: null,
      responsibleName: "",
      responsibleEmail: "",
      responsiblePhone: "",
      quoteDate: dayjs(Date(Date.now())),
      bookingDate: dayjs(Date(Date.now())),
      category: null,
      numPeople: 0,
      tripStartDate: dayjs(Date(Date.now())),
      tripEndDate: dayjs(Date(Date.now())),
      deposit: 0.0,
      quotedCost: 0.0,
      numHoursQuoteValid: 0,
      clientComments: "",
      intineraryDetails: "",
      internalComments: "",
      status: "new",
      showAccordion: false,
      accordionTitle: "",
      dates: [],
      hasBooking: null,
      manualInvoiceError: false,
    });
  }; //cancelEditing

  //closes the snakbar
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setState({ openSnakbar: false });
  };

  //close save menu
  const handleCloseSaveMenu = () => {
    setState({ anchorSave: null });
  };

  //save data being edited
  const handleSaveChanges = async (isQuote) => {
    if (!isFormValid()) {
      return;
    }

    const bookingToUpdate = {
      invoice: state.invoice,
      isQuote: isQuote,
      clientId: state.clientId,
      employeeId: state.employeeId,
      responsibleName: state.responsibleName,
      responsibleEmail: state.responsibleEmail,
      responsiblePhone: state.responsiblePhone,
      bookingDate: state.bookingDate,
      quoteDate: state.quoteDate,
      category: state.category,
      numPeople: state.numPeople,
      tripStartDate: state.tripStartDate,
      tripEndDate: state.tripEndDate,
      deposit: state.deposit,
      quotedCost: state.quotedCost,
      numHoursQuoteValid: state.numHoursQuoteValid,
      clientComments: state.clientComments,
      intineraryDetails: state.intineraryDetails,
      internalComments: state.internalComments,
      changeUser: auth.userName,
      status: state.status,
    };

    const response = await putServer("/updatebooking", {
      booking: bookingToUpdate,
    });

    if (response?.data) {
      reloadData(response.data);
    } else if (response?.disconnect) {
      setAuth({});
      navigate("/login", { state: { from: location }, replace: true });
    } else if (response?.error) {
      setState({ error: response.error, success: false, openSnakbar: true });
    }
  }; //handleSaveChanges

  //Delete one or more records from the database
  const handleDelete = async (itemsSelected) => {
    //Do nothing *** Removed option to delete - Changing to canceled status

    //Before deleting a booking it must delete the service and details first
    //Find the services for the bookings
    if (state.servicesData?.length > 0) {
      let serviceIdsToDelete = itemsSelected?.map((id) => {
        const services = state.servicesData?.filter(
          (service) => service.booking_id === id
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
            `/deletesomedetails/${detailsIds}/${auth.userName}`
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
          `/deletesomeservices/${serviceIds}/${auth.userName}`
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
      const response = await deleteServer(
        `/deletebooking/${bookingIds}/${auth.userName}`
      );
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

  //Calculate total cost of a booking based on the services
  const calcTotCost = (services) => {
    //Total invoice
    let totalInvoice = services?.reduce((sum, current) => {
      return sum + Number(current.gratuity) + current.charge * current.qty;
    }, 0);

    //Total tax
    let totalTax = services
      ?.map((service) => {
        return {
          tax: service.sales_tax,
          charge: service.charge,
          qty: service.qty,
        };
      })
      ?.reduce((sum, service) => {
        return sum + Number(service.tax * service.charge * service.qty) / 100;
      }, 0);

    //Total amount: total charges + tax
    let totalAmount = totalInvoice + totalTax;

    return totalAmount;
  };

  //Show services information when clicking on a table row
  const handleItemClick = async (id, tab = 0) => {
    //load services for this booking
    const services = await getServicesData(id);

    //load service details for this booking
    const details = await getDetailsData(services);

    //load fields
    //get client id and employee id from bookings data
    const clientId = state.bookingsData?.find((e) => e.id === id)?.clientId;
    const employeeId = state.bookingsData?.find((e) => e.id === id)?.employeeId;
    const curClient = state.clientsData?.find((e) => e.client_id === clientId);

    //find current booking
    const curBooking = state.bookingsData?.find((e) => e.id === id);

    let isQuote = state.bookingsData?.find((e) => e.id === id)?.isQuote;

    //calculate total cost for the booking
    let totalCost = calcTotCost(services);

    setState({
      onEditMode: true,
      expandPanel: true,
      invalidField: "",
      showAccordion: true,
      accordionTitle: "Booking",
      invoice: id,
      isQuote: isQuote,
      clientId: clientId,
      curClient: curClient,
      agencyName: curClient?.agency,
      agencyEmail: curClient?.email,
      agencyContact: curClient?.contact,
      employeeId: employeeId,
      salesPerson: state.salesPeople?.find((e) => e.employee_id === employeeId)
        ?.fullname,
      responsibleName: curBooking?.responsibleName,
      responsibleEmail: curBooking?.responsibleEmail,
      responsiblePhone: curBooking?.responsiblePhone,
      bookingDate: dayjs(curBooking?.bookingDate),
      quoteDate: dayjs(curBooking?.quoteDate) ?? null,
      category: curBooking?.category,
      numPeople: curBooking?.numPeople,
      tripStartDate: dayjs(curBooking?.tripStartDate),
      tripEndDate: dayjs(curBooking?.tripEndDate),
      deposit: curBooking?.deposit,
      quotedCost: totalCost,
      numHoursQuoteValid: curBooking?.numHoursQuoteValid,
      clientComments: curBooking?.clientComments,
      intineraryDetails: curBooking?.intineraryDetails,
      internalComments: curBooking?.internalComents,
      status: curBooking?.status,
      servicesData: services,
      tabService: tab,
      detailsData: details,
      curBooking: curBooking,
    });

    //scroll to the invoice field
    //document.getElementById("createQuoteButton")?.scrollIntoView();
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
      return servicesRespData;
    }
  }; //getServicesData

  //fech details for the services in a booking
  const getDetailsData = async (services) => {
    let serviceIds = services?.map((service) => service.service_id);
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
  const handleQuoteClick = async (id, tab = 0) => {
    const services = await getServicesData(id);

    //load service details for this booking
    const details = await getDetailsData(services);

    //load fields
    //find current quote
    const curQuote = state.quotesData?.find((e) => e.id === id);

    //get client id and employee id from bookings data
    const clientId = curQuote?.clientId;
    const employeeId = curQuote?.employeeId;
    const employeeObject = state.employeesData.find(
      (employee) => employee.employee_id === employeeId
    );
    const curClient = state.clientsData?.find((e) => e.client_id === clientId);

    setState({
      onEditMode: true,
      expandPanel: true,
      invalidField: "",
      showAccordion: true,
      accordionTitle: "Quote",
      invoice: id,
      isQuote: curQuote?.isQuote,
      clientId: clientId,
      curClient: curClient,
      agencyName: curClient?.agency,
      agencyEmail: curClient?.email,
      agencyContact: curClient?.contact,
      employeeId: employeeId,
      salesPerson: `${employeeObject?.firstname} ${employeeObject?.lastname}`,
      responsibleName: curQuote?.responsibleName,
      responsibleEmail: curQuote?.responsibleEmail,
      responsiblePhone: curQuote?.responsiblePhone,
      bookingDate: null,
      quoteDate: dayjs(curQuote?.quoteDate),
      category: curQuote?.category,
      numPeople: curQuote?.numPeople,
      tripStartDate: dayjs(curQuote?.tripStartDate),
      tripEndDate: dayjs(curQuote?.tripEndDate),
      deposit: curQuote?.deposit,
      quotedCost: curQuote?.cost,
      numHoursQuoteValid: curQuote?.numHoursQuoteValid,
      clientComments: curQuote?.clientComments,
      intineraryDetails: curQuote?.intineraryDetails,
      internalComments: curQuote?.internalComents,
      status: curQuote?.status,
      servicesData: services,
      tabService: tab,
      detailsData: details,
      hasBooking: curQuote?.hasBooking,
      curQuote: curQuote,
    });
  }; //handleQuoteClick

  //cancel editing when a checkbox is selected
  const handleBoxChecked = (isItemChecked) => {
    if (isItemChecked) cancelEditing();
  };

  //table headings
  const headings = [
    {
      id: "id",
      isNumeric: false,
      isPaddingDisabled: false,
      label: "Invoice",
    },
    {
      id: "status",
      isNumeric: false,
      isPaddingDisabled: false,
      label: "Status",
    },
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
    {
      id: "amountDue",
      isNumeric: true,
      isPaddingDisabled: false,
      label: "Amount Due",
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

  //display success from Service modal child
  const handleOnSuccess = (msg) => {
    setState({
      success: true,
      error: null,
      openSnakbar: true,
      msg: msg,
      isDataUpdated: !state.isDataUpdated,
    });
  };

  //update booking after creating, updating or deleting a service
  const updateBooking = async (msg) => {
    //load services for this booking
    const services = await getServicesData(state.invoice);

    //calculate total cost for the booking
    let totalCost = calcTotCost(services);

    //find current booking
    const curBooking =
      state.bookingsData?.find((e) => e.id === state.invoice) ||
      state.quotesData?.find((e) => e.id === state.invoice);

    const bookingToUpdate = {
      invoice: state.invoice,
      isQuote: curBooking?.isQuote,
      clientId: curBooking?.clientId,
      employeeId: curBooking?.employeeId,
      responsibleName: curBooking?.responsibleName,
      responsibleEmail: curBooking?.responsibleEmail,
      responsiblePhone: curBooking?.responsiblePhone,
      bookingDate: curBooking?.bookingDate
        ? dayjs(curBooking?.bookingDate)
        : null,
      quoteDate: curBooking?.quoteDate ? dayjs(curBooking?.quoteDate) : null,
      category: curBooking?.category,
      numPeople: curBooking?.numPeople,
      tripStartDate: dayjs(curBooking?.tripStartDate),
      tripEndDate: dayjs(curBooking?.tripEndDate),
      deposit: curBooking?.deposit,
      quotedCost: curBooking?.isQuote ? curBooking.cost : totalCost,
      numHoursQuoteValid: curBooking?.numHoursQuoteValid,
      clientComments: curBooking?.clientComments,
      intineraryDetails: curBooking?.intineraryDetails,
      internalComments: curBooking?.internalComments,
      changeUser: auth.userName,
      status: curBooking?.status,
    };

    const response = await putServer("/updatebooking", {
      booking: bookingToUpdate,
    });

    if (response?.data) {
      setState({
        success: true,
        error: null,
        openSnakbar: true,
        msg: msg,
        isDataUpdated: !state.isDataUpdated,
      });
    } else if (response?.disconnect) {
      setAuth({});
      navigate("/login", { state: { from: location }, replace: true });
    } else if (response?.error) {
      setState({ error: response.error, success: false, openSnakbar: true });
    }
  };

  //display error from Service modal child
  const handleQuoteDeleteSuccess = (msg) => {
    setState({
      success: true,
      error: null,
      openSnakbar: true,
      msg: msg,
      isDataUpdated: !state.isDataUpdated,
    });
  };

  //when a service row is clicked to edit a service
  const handleEditService = (event, serviceId) => {
    //if booking is canceled do not open modal
    if (state.curBooking?.status === "canceled") return;

    //find the service
    const service = state.servicesData?.find(
      (item) => item.service_id === serviceId
    );

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
    if (
      event.target.localName === "path" ||
      event.target.localName === "svg" ||
      event.target.localName === "button"
    )
      return;

    //if booking is canceled do not open modal
    if (state.curBooking?.status === "canceled") return;

    //find the service
    const service = state.servicesData?.find(
      (item) => item.service_id === detail?.service_id
    );

    //set the state variables to open the service modal
    setState({
      serviceId: detail.service_id,
      currentService: service,
      currentDetail: detail,
      editingDetail: true,
      triggerDetailModal: state.triggerDetailModal + 1,
      detailTitle: "Edit Detail",
    });
  };

  //open the modal to create a service detail
  const handleDetailModal = (serviceId, srvData = null) => {
    let service = srvData;
    if (!service)
      service = state.servicesData?.find(
        (item) => item.service_id === serviceId
      );

    //open the modal
    setState({
      serviceId: serviceId,
      currentService: service,
      currentDetail: [],
      editingDetail: false,
      triggerDetailModal: state.triggerDetailModal + 1,
      detailTitle: "New Service Detail",
    });
  };

  //function to create a blob
  const createBlob = async (reactPdfComponent) => {
    try {
      return await pdf(reactPdfComponent).toBlob();
    } catch (error) {
      console.error("Error creating blob:", error);
    }
  };

  //create pdf string
  const createPdfString = async (reactPdfComponent) => {
    try {
      const buffer = await pdf(reactPdfComponent).toString();
      console.log(buffer);
      return buffer;
    } catch (error) {
      console.error("Error creating string pdf:", error);
    }
  };

  //create a pdf, open in a new window and call save as
  const openPdfToSave = (blob, filename) => {
    try {
      FileSaver.saveAs(blob, filename);
      const pdfUrl = URL.createObjectURL(blob);
      window.open(pdfUrl, "_blank");
      URL.revokeObjectURL(pdfUrl);
    } catch (error) {
      console.error("Error creating pdf:", error);
    }
  };

  //Handle download pdf click
  const handleDownloadInvoice = async () => {
    const blob = await createBlob(
      <Invoice
        date={dayjs(state.tripStartDate).format("MM/DD/YYYY")}
        invoiceNum={state.invoice}
        client={state.curClient}
        passengers={state.numPeople}
        bookingDate={dayjs(state.bookingDate).format("MM/DD/YYYY")}
        arrival={dayjs(state.tripEndDate).format("MM/DD/YYYY")}
        departure={dayjs(state.tripStartDate).format("MM/DD/YYYY")}
        services={state.servicesData}
        deposit={state.deposit}
        transactions={state.transactionsData}
        poRef={state.clientComments}
        responsible={state.responsibleName}
        responsibleEmail={state.responsibleEmail}
      />
    );

    openPdfToSave(blob, `invoice${state.invoice}.pdf`);
  };

  const handleDowloadContract = async () => {
    const blob = await createBlob(
      <Contract
        date={new Date().toString().substring(0, 24)}
        invoiceNum={state.invoice}
        client={state.curClient}
        category={state.category}
        passengers={state.numPeople}
        services={state.servicesData}
        details={state.detailsData}
        locations={state.locationsData}
        deposit={state.deposit}
        transactions={state.transactionsData}
        poRef={state.clientComments}
        responsible={state.responsibleName}
        responsibleEmail={state.responsibleEmail}
      />
    );

    openPdfToSave(blob, `confirmation${state.invoice}.pdf`);
  };

  function quoteReport() {
    return (
      <QuoteReport
        date={dayjs(state.quoteDate).format("dddd, MMMM D, YYYY")}
        invoiceNum={state.invoice}
        quotedCost={state.quotedCost}
        salesPerson={state.salesPerson}
        client={state.curClient}
        passengers={state.numPeople}
        deposit={state.deposit}
        tripStart={dayjs(state.tripStartDate).format("dddd, MMMM D, YYYY")}
        tripEnd={dayjs(state.tripEndDate).format("dddd, MMMM D, YYYY")}
        quoteExp={state.numHoursQuoteValid}
        services={state.servicesData}
        details={state.detailsData}
        locations={state.locationsData}
        quoteDetails={state.intineraryDetails}
      />
    );
  }

  const handleDownloadQuote = async () => {
    const blob = await createBlob(quoteReport());

    openPdfToSave(blob, `quote${state.invoice}.pdf`);
  };

  //fetch quote pdf
  const handleGetQuotePdf = async () => {
    try {
      const response = await axiosPdfService.post("/quote/stream", {
        data: {
          quoteDate: state.quoteDate,
          invoice: state.invoice,
          quotedCost: state.quotedCost,
          salesPerson: state.salesPerson,
          client: state.curClient,
          passengers: state.numPeople,
          deposit: state.deposit,
          tripStart: state.tripStartDate,
          tripEnd: state.tripEndDate,
          quoteExp: state.numHoursQuoteValid,
          services: state.servicesData,
          details: state.detailsData,
          locations: state.locationsData,
          quoteDetails: state.intineraryDetails,
        },
      });
      if (response.data) {
        var file = new Blob([response.data], { type: "application/pdf" });
        var fileURL = URL.createObjectURL(file);
        window.open(fileURL, "_blank");
      }
    } catch (err) {
      console.error(err);
      setState({ error: err.message, success: false, openSnakbar: true });
    }
  };

  //

  //When the create quote button is clicked
  const handleNewQuote = () => {
    cancelEditing();
    setState({
      showAccordion: true,
      accordionTitle: "Quote",
      expandPanel: true,
      isQuote: true,
      bookingDate: null,
    });
  };

  const handleNewBooking = () => {
    cancelEditing();
    setState({
      showAccordion: true,
      accordionTitle: "Booking",
      expandPanel: true,
      isQuote: false,
      quoteDate: null,
    });
  };

  const handleSaveAsBooking = () => {
    handleSubmit(state.invoice?.replace("Q", ""), false);
  };

  const handleSaveAndCreateService = async () => {
    //validate form
    if (!isFormValid()) {
      return;
    }

    const response = await postServer("/createbooking", {
      booking: {
        invoice: state.invoice,
        clientId: state.clientId,
        employeeId: state.employeeId,
        responsibleName: state.responsibleName,
        responsibleEmail: state.responsibleEmail,
        responsiblePhone: state.responsiblePhone,
        isQuote: state.isQuote,
        quoteDate: state.quoteDate,
        bookingDate: state.bookingDate,
        category: state.category,
        numPeople: state.numPeople,
        tripStartDate: state.tripStartDate,
        tripEndDate: state.tripEndDate,
        deposit: state.deposit,
        quotedCost: state.quotedCost,
        numHoursQuoteValid: state.numHoursQuoteValid,
        clientComments: state.clientComments,
        intineraryDetails: state.intineraryDetails,
        internalComments: state.internalComments,
        changeUser: auth.userName,
        status: state.status,
      },
    });

    if (response?.data) {
      //Set invoice state and reload data
      setState({ invoice: response.data, isDataUpdated: !state.isDataUpdated });

      //Open service modal
      handleServiceModal();
    } else if (response?.disconnect) {
      setAuth({});
      navigate("/login", { state: { from: location }, replace: true });
    } else if (response?.error) {
      setState({
        error: response.error,
        success: false,
        openSnakbar: true,
        anchorSave: null,
      });
    }
  };

  const handleInvoiceClick = () => {
    if (state.onEditMode || state.isQuote) return;

    //open dialog to enter the invoice
    setState({ openInvoiceDialog: true });
  };

  const handleCloseInvoice = () => {
    setState({
      openInvoiceDialog: false,
      invoice: "",
      manualInvoiceError: false,
    });
  };

  const handleCloseCalendar = () => {
    setState({ openCalendarDialog: false, dates: [] });
  };

  const handleCloseCancelDiag = () => {
    setState({ openCancelDialog: false });
  };

  const handleCloseEmailDiag = () => {
    setState({ openSendEmailDialog: false });
  };

  const handleCloseCategoryDiag = () => {
    setState({ openCategoryDialog: false });
  };

  //open dialog to show calendar to select dates of services
  const handleDuplicateDialog = (serviceId) => {
    //open dialog
    setState({ openCalendarDialog: true, serviceId: serviceId });
  };

  const handleDuplicateService = async () => {
    //convert dates to utc (iso)
    let isoDates = state.dates?.map((e) => {
      let date = dayjs(e).set("hour", 0).set("minute", 0).set("second", 0);
      return date.toISOString();
    });
    isoDates = JSON.stringify(isoDates);

    const controller = new AbortController();

    let response = await postServer(
      `/duplicateservice`,
      {
        serviceId: state.serviceId,
        dates: isoDates,
        changeUser: auth.userName,
      },
      controller.signal
    );

    if (response.disconnect) {
      setAuth({});
      navigate("/login", { state: { from: location }, replace: true });
      //other errors
    } else if (response.error) {
      setState({
        success: false,
        error: response.error,
        openSnakbar: true,
        openCalendarDialog: false,
      });
    } else {
      clearState(response.data);
    }
  }; //handleDuplicateService

  const handleDuplicateDetail = async (detailId, serviceId) => {
    const controller = new AbortController();

    let response = await postServer(
      `/duplicatedetail`,
      {
        detailId: detailId,
        changeUser: auth.userName,
      },
      controller.signal
    );

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
    } else {
      setState({
        msg: response.data,
        error: null,
        success: true,
        openSnakbar: true,
      });

      //Reload the data
      state.isQuote
        ? handleQuoteClick(state.invoice, state.tabService)
        : handleItemClick(state.invoice, state.tabService);
    }
  }; //handleDuplicateDetail

  const handleOpenHistoryDialog = async (detailId) => {
    const controller = new AbortController();

    let response = await getServer(
      `/getlogdetail/${detailId}`,
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

      responseData = responseData?.map((e) => {
        const log = {
          detailId: e.detail_id,
          operation: e.operation === "U" ? "Update" : "Create",
          stamp: e.stamp,
          user: e.userid,
          field: e.field_updated,
          from: e.field_updated?.includes("time")
            ? dayjs(e.from_value).format("HH:mm")
            : e.from_value,
          to: e.field_updated?.includes("time")
            ? dayjs(e.to_value).format("HH:mm")
            : e.to_value,
        };
        return log;
      });
      setState({ openHistoryDialog: true, historyDetailData: responseData });
    }
  };

  const handleStatusChange = (e) => {
    const value = e.target.value;

    //if value is canceled display dialog
    if (value === "canceled") setState({ openCancelDialog: true });
    else setState({ status: value });
  };

  const getServiceName = (type) => {
    const services = [
      { code: "OW", name: "ONE-WAY" },
      { code: "RT", name: "ROUND-TRIP" },
      { code: "CH", name: "CHARTER" },
      { code: "DH", name: "DEAD-HEAD" },
      { code: "SH", name: "SHUTTLE" },
    ];

    const isCodeFound = services.find((e) => e.code === type);
    if (isCodeFound) return services.find((e) => e.code === type)?.name;
    else return type;
  };

  //Send quote to client
  const handleSendQuote = async () => {
    //Show circular progress for loading info
    setState({ isLoading: true });

    let attachmentJson = {
      date: dayjs(state.quoteDate).format("dddd, MMMM D, YYYY"),
      invoiceNum: state.invoice,
      quotedCost: state.quotedCost,
      salesPerson: state.salesPerson,
      client: state.curClient,
      passengers: state.numPeople,
      deposit: state.deposit,
      tripStart: dayjs(state.tripStartDate).format("dddd, MMMM D, YYYY"),
      tripEnd: dayjs(state.tripEndDate).format("dddd, MMMM D, YYYY"),
      quoteExp: state.numHoursQuoteValid,
      services: state.servicesData,
      details: state.detailsData,
      locations: state.locationsData,
      quoteDetails: state.intineraryDetails,
    };

    attachmentJson = JSON.stringify(attachmentJson);

    //validate email
    if (state.curQuote?.responsibleEmail || state.curQuote?.responsibleName) {
      const response = await postServer("/sendQuoteEmail", {
        data: {
          email: state.responsibleEmail,
          clientName: state.responsibleName,
          quoteId: state.invoice,
          quoteDate: dayjs(state.quoteDate).format("LL"),
          passengers: state.numPeople,
          tripStart: dayjs(state.tripStartDate).format("dddd, MMMM D, YYYY"),
          tripEnd: dayjs(state.tripEndDate).format("dddd, MMMM D, YYYY"),
          quotedCost: state.quotedCost,
          deposit: state.deposit,
          quoteExp: dayjs(
            dayjs(new Date()).add(state.numHoursQuoteValid, "hour")
          ).format("LL"),
          attachmentData: attachmentJson,
          timestamp: new Date().toISOString(),
          user: auth.userName,
        },
      });
      if (response?.status === 202) {
        setState({
          success: true,
          openSnakbar: true,
          msg: response.data,
          openSendEmailDialog: false,
          isDataUpdated: !state.isDataUpdated,
          isLoading: false,
        });
      } else if (response?.disconnect) {
        setAuth({});
        navigate("/login", { state: { from: location }, replace: true });
      } else if (response?.error) {
        setState({
          error: response.error,
          success: false,
          openSnakbar: true,
          openSendEmailDialog: false,
          isLoading: false,
        });
      }
    } else {
      window.alert("Responsible name or email is not valid.");
    }
  };

  const emailDialogDescription = state.curQuote?.emailUser
    ? `Email was sent on ${state.curQuote?.emailSentDate} by ${state.curQuote?.emailUser}. Do you want to send it again?`
    : !state.curQuote?.responsibleEmail
    ? "Responsible email is missing. Please go back and save a responsible email."
    : `Confirm emailing this quote to ${state.curQuote?.responsibleEmail}?`;

  //validates manual invoice entry
  const handleValidateManualInvoice = () => {
    if (state.invoice.includes("/") || state.invoice.includes("\\")) {
      setState({ manualInvoiceError: true, invoice: "" });
    } else {
      setState({ openInvoiceDialog: false });
    }
  };

  return (
    <div className="bookings-container">
      <div className="bookings-container-box">
        {/* <Routes>
          <Route
            path="/:invoice"
            action={({ params, request }) => handleItemClick(params.invoice)}
          />
        </Routes> */}
        <form>
          <Stack
            direction="row"
            spacing={2}
            marginBottom={2}
            justifyContent="center"
          >
            <Button
              id="createQuoteButton"
              variant="contained"
              onClick={handleNewQuote}
              color="success"
            >
              Create Quote
            </Button>
            <Button variant="contained" onClick={handleNewBooking}>
              Create Booking
            </Button>
          </Stack>
          {state.showAccordion && (
            <Accordion
              expanded={state.expandPanel}
              onChange={() => setState({ expandPanel: !state.expandPanel })}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                {state.onEditMode ? (
                  <Box sx={{ display: "inline-flex" }}>
                    <Typography
                      sx={{
                        fontWeight: "bold",
                        color: state.isQuote ? "success.main" : "#1976d2",
                      }}
                    >
                      Editing {state.accordionTitle}
                    </Typography>
                    <EditIcon
                      style={{
                        color: state.isQuote ? "green" : "#1976d2",
                        marginLeft: "10px",
                      }}
                    />
                  </Box>
                ) : (
                  <Box sx={{ display: "inline-flex" }}>
                    <Typography
                      sx={{
                        fontWeight: "bold",
                        color: state.isQuote ? "success.main" : "primary.main",
                      }}
                    >
                      New {state.accordionTitle}
                    </Typography>
                    <RequestQuoteIcon
                      style={{
                        color: state.isQuote ? "green" : "#1976d2",
                        marginLeft: "10px",
                      }}
                    />
                  </Box>
                )}
              </AccordionSummary>
              <AccordionDetails>
                {!state.isQuote && state.onEditMode && (
                  <FormControl size="small">
                    <InputLabel
                      id="status-label"
                      color={state.status === "canceled" ? "error" : "success"}
                    >
                      Status
                    </InputLabel>
                    <Select
                      id="status-select"
                      value={state.status}
                      onChange={handleStatusChange}
                      label="Status"
                      color={state.status === "canceled" ? "error" : "success"}
                      style={{
                        width: "130px",
                        color: state.status === "canceled" ? "red" : "green",
                      }}
                    >
                      <MenuItem value="new">New</MenuItem>
                      <MenuItem value="confirmed">Confirmed</MenuItem>
                      <MenuItem value="canceled" style={{ color: "red" }}>
                        Canceled
                      </MenuItem>
                    </Select>
                  </FormControl>
                )}

                <Box className="fieldsbox1">
                  <TextField
                    className="textfield"
                    id="invoice"
                    label={state.isQuote ? "Quote ID" : "Invoice #"}
                    type="text"
                    disabled
                    value={state.invoice}
                    onChange={handleOnChange}
                    InputLabelProps={{
                      onClick: handleInvoiceClick,
                      shrink: true,
                    }}
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
                      options={state.clientsData?.map((element) => {
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
                    type="email"
                    placeholder="Resp. Email"
                    value={state.responsibleEmail}
                    onChange={handleOnChange}
                    error={state.invalidField === "responsibleEmail"}
                    helperText={
                      state.invalidField === "responsibleEmail"
                        ? "Information required"
                        : ""
                    }
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

                  <LocalizationProvider
                    dateAdapter={AdapterDayjs}
                    adapterLocale="en"
                  >
                    <DatePicker
                      slotProps={{
                        textField: {
                          error: state.invalidField === "quoteDate",
                          helperText:
                            state.invalidField === "quoteDate"
                              ? "Information required"
                              : "",
                          required: state.isQuote,
                        },
                      }}
                      label="Quote Date"
                      className="textfield"
                      timezone="America/New_York"
                      id="quoteDate"
                      disabled={!state.isQuote}
                      required={state.isQuote}
                      value={dayjs(state.quoteDate)}
                      onChange={(newValue) => setState({ quoteDate: newValue })}
                    />

                    <DatePicker
                      slotProps={{
                        textField: {
                          error: state.invalidField === "tripStartDate",
                          helperText:
                            state.invalidField === "tripStartDate"
                              ? "Information required"
                              : "",
                          required: true,
                        },
                      }}
                      label="Trip Start Date"
                      className="textfieldSmall"
                      id="tripStartDate"
                      timezone="America/New_York"
                      placeholder="Trip Start Date"
                      value={state.tripStartDate}
                      onChange={(newValue) =>
                        setState({ tripStartDate: dayjs(newValue) })
                      }
                    />
                  </LocalizationProvider>

                  <div
                    id="category-box"
                    className="textfieldSmall"
                    style={{ display: "inline-block" }}
                  >
                    <Autocomplete
                      id="category"
                      className="autocomplete"
                      required
                      value={state.category}
                      onChange={(_, newValue) => {
                        newValue !== "Particular"
                          ? setState({ category: newValue })
                          : setState({
                              category: newValue,
                              openCategoryDialog: true,
                            });
                      }}
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
                    error={state.invalidField === "numPeople"}
                    helperText={
                      state.invalidField === "numPeople"
                        ? "Information required"
                        : ""
                    }
                    className="textfieldSmall"
                    id="numPeople"
                    required
                    label="People #"
                    type="text"
                    inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
                    placeholder="People #"
                    value={state.numPeople}
                    onChange={handleOnChange}
                  />

                  <LocalizationProvider
                    dateAdapter={AdapterDayjs}
                    adapterLocale="en"
                  >
                    <DatePicker
                      slotProps={{
                        textField: {
                          error: state.invalidField === "bookingDate",
                          helperText:
                            state.invalidField === "bookingDate"
                              ? "Information required"
                              : "",
                          required: !state.isQuote,
                        },
                      }}
                      label="Booking Date"
                      className="textfieldSmall"
                      id="bookingDate"
                      timezone="America/New_York"
                      disabled={state.isQuote}
                      placeholder="Booking Date"
                      value={dayjs(state.bookingDate)}
                      onChange={(newValue) =>
                        setState({ bookingDate: newValue })
                      }
                    />

                    <DatePicker
                      slotProps={{
                        textField: {
                          error: state.invalidField === "tripEndDate",
                          helperText:
                            state.invalidField === "tripEndDate"
                              ? "Information required"
                              : "",
                          required: true,
                        },
                      }}
                      label="Trip End Date"
                      className="textfieldSmall"
                      id="tripEndDate"
                      timezone="America/New_York"
                      placeholder="Trip End Date"
                      value={state.tripEndDate}
                      onChange={(newValue) =>
                        setState({ tripEndDate: dayjs(newValue) })
                      }
                    />
                  </LocalizationProvider>

                  <TextField
                    className="textfieldSmall"
                    id="deposit"
                    label="Deposit %"
                    type="text"
                    inputProps={{ inputMode: "decimal", step: "0.01" }}
                    placeholder="Deposit %"
                    value={state.deposit}
                    onChange={handleOnChange}
                  />

                  <TextField
                    className="textfieldSmall"
                    required
                    id="quotedCost"
                    disabled={!state.isQuote}
                    label={state.isQuote ? "Quoted Cost $" : "Total Cost"}
                    type="text"
                    inputProps={{ inputMode: "decimal", step: "0.01" }}
                    placeholder={state.isQuote ? "Quoted Cost $" : "Total Cost"}
                    value={state.quotedCost}
                    onChange={handleOnChange}
                    error={state.invalidField === "quotedCost"}
                    helperText={
                      state.invalidField === "quotedCost"
                        ? "Information required"
                        : ""
                    }
                  />

                  <TextField
                    className="textfieldSmall"
                    id="numHoursQuoteValid"
                    label="Quote valid for (Hr #)"
                    type="text"
                    disabled={!state.isQuote}
                    inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
                    placeholder="Quote valid for (Hr #)"
                    value={state.numHoursQuoteValid}
                    onChange={handleOnChange}
                  />

                  <TextField
                    className="textfield"
                    id="clientComments"
                    label="PO/REF #"
                    type="text"
                    placeholder="PO/REF #"
                    value={state.clientComments}
                    onChange={handleOnChange}
                  />

                  <TextField
                    className="textfield"
                    id="intineraryDetails"
                    label={
                      state.isQuote ? "Quote Details" : "Itinerary Details"
                    }
                    type="text"
                    multiline
                    rows={4}
                    placeholder={
                      state.isQuote ? "Quote Details" : "Itinerary Details"
                    }
                    value={state.intineraryDetails}
                    onChange={handleOnChange}
                  />

                  {state.isQuote === false && (
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
                  )}
                </Box>
                {state.onEditMode ? (
                  <Box>
                    <Button
                      variant="contained"
                      onClick={() => handleSaveChanges(state.isQuote)}
                      size="small"
                      color={state.isQuote ? "success" : "primary"}
                      disabled={state.curBooking?.status === "canceled"}
                    >
                      Save Changes
                    </Button>
                    <Button
                      variant="contained"
                      color="secondary"
                      style={{ marginLeft: "10px" }}
                      onClick={cancelEditing}
                      size="small"
                    >
                      Cancel
                    </Button>

                    {state.isQuote && (
                      <Box sx={{ display: "inline-flex" }}>
                        <Button
                          style={{ marginLeft: "10px" }}
                          variant="contained"
                          onClick={handleSaveAsBooking}
                          color="primary"
                          size="small"
                          disabled={state.hasBooking}
                        >
                          Create Booking from this Quote
                        </Button>
                        <Button
                          style={{ marginLeft: "10px" }}
                          variant="contained"
                          onClick={handleGetQuotePdf}
                          size="small"
                        >
                          <ReceiptIcon />
                          Quote
                        </Button>

                        <Tooltip
                          title={
                            state.curQuote?.emailUser
                              ? `Sent on ${state.curQuote?.emailSentDate} by ${state.curQuote?.emailUser}`
                              : ""
                          }
                          arrow
                        >
                          <Badge
                            color="secondary"
                            badgeContent={
                              state.curQuote?.emailUser
                                ? state.curQuote?.emailSentQty
                                : 0
                            }
                          >
                            <Button
                              style={{ marginLeft: "10px" }}
                              variant="contained"
                              onClick={() => {
                                setState({ openSendEmailDialog: true });
                              }}
                              size="small"
                            >
                              <SendIcon /> Email Quote
                            </Button>
                          </Badge>
                        </Tooltip>
                      </Box>
                    )}

                    {!state.isQuote && (
                      <Button
                        style={{ marginLeft: "10px" }}
                        variant="contained"
                        onClick={handleDownloadInvoice}
                        size="small"
                        disabled={state.curBooking?.status === "canceled"}
                      >
                        <ReceiptIcon />
                        Invoice
                      </Button>
                    )}

                    {!state.isQuote && (
                      <Button
                        style={{ marginLeft: "10px" }}
                        variant="contained"
                        onClick={handleDowloadContract}
                        size="small"
                        disabled={state.curBooking?.status === "canceled"}
                      >
                        <GavelIcon />
                        Contract
                      </Button>
                    )}

                    <p></p>

                    <Button
                      variant="contained"
                      onClick={handleServiceModal}
                      size="small"
                      disabled={state.curBooking?.status === "canceled"}
                    >
                      Create new Service
                    </Button>
                    <p></p>
                    {state.servicesData?.length > 0 && (
                      <Box>
                        <Divider />
                        <Typography variant="h5" color="primary">
                          Services
                        </Typography>
                        <Divider />
                      </Box>
                    )}
                    <Box>
                      <Tabs
                        value={state.tabService}
                        onChange={handleServiceClick}
                        variant="scrollable"
                        scrollButtons="auto"
                      >
                        {state.servicesData?.length > 0 &&
                          state.servicesData?.map((service) => {
                            return (
                              <Tab
                                label={service.service_name}
                                key={`tab${service.service_id}`}
                              ></Tab>
                            );
                          })}
                      </Tabs>
                      {state.servicesData?.length > 0 &&
                        state.servicesData?.map((service, index) => {
                          let details = state.detailsData?.map((detailsArr) =>
                            detailsArr.filter(
                              (detail) =>
                                detail.service_id === service.service_id
                            )
                          );
                          return (
                            //service data info
                            <CustomTabPanel
                              value={state.tabService}
                              index={index}
                              key={service.service_id}
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
                                    <TableCell
                                      style={{ fontWeight: "bold" }}
                                      align="center"
                                    >
                                      Qty
                                    </TableCell>
                                    <TableCell
                                      style={{ fontWeight: "bold" }}
                                      align="right"
                                    >
                                      Charge
                                    </TableCell>
                                    <TableCell
                                      style={{ fontWeight: "bold" }}
                                      align="right"
                                    >
                                      Gratuity
                                    </TableCell>
                                    <TableCell
                                      style={{ fontWeight: "bold" }}
                                      align="right"
                                    >
                                      Sales Tax
                                    </TableCell>
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  <TableRow
                                    hover
                                    onClick={(event) =>
                                      handleEditService(
                                        event,
                                        service.service_id
                                      )
                                    }
                                  >
                                    <TableCell>
                                      {getServiceName(service.service_code)}
                                    </TableCell>
                                    <TableCell>
                                      {dayjs(service.service_date).format(
                                        "MM/DD/YYYY"
                                      )}
                                    </TableCell>
                                    <TableCell align="center">
                                      {service.qty}
                                    </TableCell>
                                    <TableCell align="right">
                                      ${service.charge}
                                    </TableCell>
                                    <TableCell align="right">
                                      ${service.gratuity}
                                    </TableCell>
                                    <TableCell align="right">
                                      {service.sales_tax}%
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
                                        <TableCell
                                          style={{ fontWeight: "bold" }}
                                        >
                                          Driver
                                        </TableCell>
                                        <TableCell
                                          style={{ fontWeight: "bold" }}
                                        >
                                          Vehicle
                                        </TableCell>
                                        <TableCell
                                          style={{ fontWeight: "bold" }}
                                        >
                                          From
                                        </TableCell>
                                        <TableCell
                                          style={{ fontWeight: "bold" }}
                                        >
                                          To
                                        </TableCell>
                                        <TableCell
                                          style={{ fontWeight: "bold" }}
                                        >
                                          Yard Time
                                        </TableCell>
                                        <TableCell
                                          style={{ fontWeight: "bold" }}
                                        >
                                          Start Time
                                        </TableCell>
                                        <TableCell
                                          style={{ fontWeight: "bold" }}
                                          colSpan={3}
                                        >
                                          End Time
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

                                        const vehicle =
                                          state.vehiclesData?.find(
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
                                              {detail?.spot_time
                                                ? dayjs(
                                                    detail?.spot_time
                                                  ).format("HH:mm")
                                                : ""}
                                            </TableCell>
                                            <TableCell>
                                              {detail?.start_time
                                                ? dayjs(
                                                    detail?.start_time
                                                  ).format("HH:mm")
                                                : ""}
                                            </TableCell>
                                            <TableCell>
                                              {detail?.end_time
                                                ? dayjs(
                                                    detail?.end_time
                                                  ).format("HH:mm")
                                                : ""}
                                            </TableCell>
                                            <TableCell>
                                              <Tooltip title="View History">
                                                <IconButton
                                                  onClick={() =>
                                                    handleOpenHistoryDialog(
                                                      detail?.detail_id
                                                    )
                                                  }
                                                >
                                                  <ManageSearchIcon color="primary" />
                                                </IconButton>
                                              </Tooltip>
                                            </TableCell>
                                            <TableCell>
                                              <Tooltip title="Duplicate Detail">
                                                <IconButton
                                                  disabled={
                                                    state.curBooking?.status ===
                                                    "canceled"
                                                  }
                                                  onClick={() =>
                                                    handleDuplicateDetail(
                                                      detail?.detail_id,
                                                      service.service_id
                                                    )
                                                  }
                                                >
                                                  <ContentCopyIcon
                                                    color={
                                                      state.curBooking
                                                        ?.status === "canceled"
                                                        ? "disabled"
                                                        : "primary"
                                                    }
                                                  />
                                                </IconButton>
                                              </Tooltip>
                                            </TableCell>
                                          </TableRow>
                                        );
                                      })}
                                    </TableBody>
                                  </Table>
                                </Box>
                              )}
                              <p></p>
                              <Stack direction="row" justifyContent="center">
                                <Button
                                  variant="outlined"
                                  onClick={() =>
                                    handleDetailModal(service.service_id)
                                  }
                                  disabled={
                                    state.curBooking?.status === "canceled"
                                  }
                                >
                                  Add details
                                </Button>
                                <Button
                                  variant="outlined"
                                  style={{ marginLeft: "1em" }}
                                  onClick={() =>
                                    handleDuplicateDialog(service.service_id)
                                  }
                                  disabled={
                                    state.curBooking?.status === "canceled"
                                  }
                                >
                                  Duplicate Service
                                </Button>
                              </Stack>
                            </CustomTabPanel>
                          );
                        })}
                    </Box>
                  </Box>
                ) : (
                  <Box>
                    <Button
                      id="saveBtn"
                      variant="contained"
                      onClick={(e) => setState({ anchorSave: e.currentTarget })}
                      color={state.isQuote ? "success" : "primary"}
                      endIcon={<KeyboardArrowDownIcon />}
                      aria-controls={openSave ? "save-options" : undefined}
                      aria-haspopup="true"
                      aria-expanded={openSave ? "save-options" : undefined}
                    >
                      Save New {state.accordionTitle}
                    </Button>
                    <Menu
                      id="save-options"
                      anchorEl={state.anchorSave}
                      open={openSave}
                      onClose={handleCloseSaveMenu}
                      MenuListProps={{ "aria-labelledby": "saveBtn" }}
                    >
                      <MenuItem onClick={() => handleSubmit("", state.isQuote)}>
                        Save
                      </MenuItem>
                      <MenuItem onClick={handleSaveAndCreateService}>
                        Save & Add Service
                      </MenuItem>
                    </Menu>
                    <Button
                      variant="contained"
                      color="secondary"
                      style={{ marginLeft: "10px" }}
                      onClick={cancelEditing}
                    >
                      Cancel
                    </Button>
                  </Box>
                )}
                <p></p>
              </AccordionDetails>
            </Accordion>
          )}

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
                editData={(id) => {
                  handleItemClick(id);
                  document
                    .getElementById("createQuoteButton")
                    ?.scrollIntoView();
                }}
                boxChecked={handleBoxChecked}
                disableDelete={true}
                filterOptions={[
                  { id: "agencyName", name: "Agency" },
                  { id: "id", name: "Invoice" },
                ]}
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
            handleRowClick={(id) => {
              handleQuoteClick(id);
              document.getElementById("createQuoteButton")?.scrollIntoView();
            }}
            onError={handleOnError}
            onSuccess={handleQuoteDeleteSuccess}
            cancelEditing={cancelEditing}
          />
          <ServiceModal
            modalTitle={state.serviceTitle}
            onError={handleOnError}
            onSuccess={updateBooking}
            open={state.triggerModal}
            invoice={state.invoice}
            tabService={state.tabService}
            data={state.currentService}
            onEditMode={state.editingService}
            onSave={state.isQuote ? handleQuoteClick : handleItemClick}
            addDetails={handleDetailModal}
          />
          <DetailModal
            modalTitle={state.detailTitle}
            onError={handleOnError}
            onSuccess={handleOnSuccess}
            open={state.triggerDetailModal}
            serviceId={state.serviceId}
            serviceData={state.currentService}
            invoice={state.invoice}
            tabService={state.tabService}
            data={state.currentDetail}
            onEditMode={state.editingDetail}
            onSave={state.isQuote ? handleQuoteClick : handleItemClick}
          />

          <Dialog open={state.openInvoiceDialog} onClose={handleCloseInvoice}>
            <DialogTitle>
              Manual {state.isQuote ? "Quote ID" : "Invoice #"}
            </DialogTitle>
            <DialogContent>
              <DialogContentText>
                Enter the {state.isQuote ? "Quote ID" : "Invoice #"}.
              </DialogContentText>
              <TextField
                error={state.manualInvoiceError}
                autofocus
                margin="dense"
                id="manualInvoice"
                name="manualInvoice"
                label={state.isQuote ? "Quote ID" : "Invoice #"}
                fullWidth
                variant="standard"
                onChange={(e) => setState({ invoice: e.target.value })}
                helperText="Characters '/' '\' are not alowed"
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseInvoice}>Cancel</Button>
              <Button onClick={handleValidateManualInvoice}>OK</Button>
            </DialogActions>
          </Dialog>

          <Dialog
            open={state.openHistoryDialog}
            onClose={() => setState({ openHistoryDialog: false })}
            fullWidth
            maxWidth="md"
          >
            <DialogTitle>Transactions History</DialogTitle>
            <DialogContent>
              {state.historyDetailData.length > 0 ? (
                <Table>
                  <TableHead>
                    <TableCell>Operation</TableCell>
                    <TableCell>User</TableCell>
                    <TableCell>Time Stamp</TableCell>
                    <TableCell>Field Updated</TableCell>
                    <TableCell>From</TableCell>
                    <TableCell>To</TableCell>
                  </TableHead>
                  <TableBody>
                    {state.historyDetailData?.map((item, index) => {
                      return (
                        <TableRow key={index}>
                          <TableCell>{item.operation}</TableCell>
                          <TableCell>{item.user}</TableCell>
                          <TableCell>{item.stamp}</TableCell>
                          <TableCell>{item.field}</TableCell>
                          <TableCell>{item.from}</TableCell>
                          <TableCell>{item.to}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              ) : (
                <DialogContentText>No log history found.</DialogContentText>
              )}
            </DialogContent>
          </Dialog>

          <Dialog open={state.openCalendarDialog} onClose={handleCloseCalendar}>
            <DialogTitle>Duplicate Service</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Please select the dates for the services you want to create
              </DialogContentText>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: "1em",
                }}
              >
                <Calendar
                  multiple
                  value={state.dates}
                  onChange={(dateArray) => setState({ dates: dateArray })}
                  format="YYYY-MM-DDTHH:mm:ss"
                />
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseCalendar}>Cancel</Button>
              <Button onClick={handleDuplicateService}>OK</Button>
            </DialogActions>
          </Dialog>

          <Dialog open={state.openCancelDialog} onClose={handleCloseCancelDiag}>
            <DialogTitle>Cancel Booking?</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Do you want to cancel this booking? It won't be possible to
                revert the action after you save.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseCancelDiag}>Go Back</Button>
              <Button
                onClick={() =>
                  setState({ status: "canceled", openCancelDialog: false })
                }
              >
                Proceed
              </Button>
            </DialogActions>
          </Dialog>

          <CustomDialog
            openDialog={state.openSendEmailDialog}
            onConfirm={handleSendQuote}
            onCancel={handleCloseEmailDiag}
            title="Emailing Quote to client"
            description={emailDialogDescription}
          />

          <CustomDialog
            openDialog={state.openCategoryDialog}
            onConfirm={handleCloseCategoryDiag}
            useOK={true}
            title="Particular Category Selected"
            description="Note: For particular bookings the client must pay in advance."
          />

          <Backdrop open={state.isLoading} sx={{ zIndex: 4 }}>
            <CircularProgress color="primary" />
          </Backdrop>
        </div>
      </div>
    </div>
  );
}; //Bookings
