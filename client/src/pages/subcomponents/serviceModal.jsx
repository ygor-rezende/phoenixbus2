import {
  Box,
  IconButton,
  Modal,
  TextField,
  Tooltip,
  Typography,
  Select,
  MenuItem,
  Button,
  FormControl,
  FormHelperText,
  InputLabel,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import "dayjs/locale/en";

import { useEffect, useState } from "react";
import CustomDialog from "../../utils/customDialog";

import {
  UsePrivateGet,
  UsePrivatePost,
  UsePrivateDelete,
  UsePrivatePut,
} from "../../hooks/useFetchServer";

import { useNavigate, useLocation } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

dayjs.extend(utc);
dayjs.extend(timezone);

export const ServiceModal = (props) => {
  const {
    modalTitle,
    onError,
    onSuccess,
    open,
    invoice,
    data,
    onEditMode,
    onSave,
  } = props;
  const [serviceId, setServiceId] = useState(0);
  const [serviceName, setServiceName] = useState("");
  const [serviceCode, setServiceCode] = useState("");
  const [serviceDate, setServiceDate] = useState(null);
  const [qty, setQty] = useState(0);
  const [charge, setCharge] = useState(0.0);
  const [salesTax, setSalesTax] = useState(0.0);
  const [gratuity, setGratuity] = useState(0.0);
  const [openModal, setOpenModal] = useState(false);
  const [invalidField, setInvalidField] = useState("");
  const [openDialog, setOpenDialog] = useState(false);

  const { setAuth, auth } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const getServer = UsePrivateGet();
  const postServer = UsePrivatePost();
  const putServer = UsePrivatePut();
  const deleteServer = UsePrivateDelete();

  useEffect(() => {
    if (open > 0) {
      clearState();
      //if on edit mode set the fields values
      if (onEditMode) {
        setServiceId(data?.service_id);
        setServiceName(data?.service_name);
        setServiceCode(data?.service_code);
        setServiceDate(dayjs(data?.service_date));
        setQty(data?.qty);
        setCharge(data?.charge);
        setSalesTax(data?.sales_tax);
        setGratuity(data?.gratuity);
      }
      setOpenModal(true);
    }
  }, [open]);

  const modalStile = {
    position: "absolute",
    borderRadius: "10px",
    display: "flex",
    flexDirection: "column",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 600,
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
  };

  //service codes
  const codes = [
    "OW",
    "RT",
    "CH",
    "N/A",
    "FEE",
    "EAT",
    "TIP",
    "OVT",
    "N/S",
    "ADA",
    "OTR",
    "DIS",
  ];

  //handle form submit
  const handleSaveNewService = async () => {
    //validate form
    if (!isFormValid()) {
      return;
    }

    if (!onEditMode) {
      //New service api call

      const response = await postServer("/createservice", {
        service: {
          bookingId: invoice,
          serviceName: serviceName,
          serviceCode: serviceCode,
          serviceDate: serviceDate,
          qty: qty,
          charge: charge,
          salesTax: salesTax,
          gratuity: gratuity,
        },
      });

      if (response?.data) {
        onSuccess(response.data);
        clearState();
      } else if (response?.disconnect) {
        setAuth({});
        navigate("/login", { state: { from: location }, replace: true });
      } else if (response?.error) {
        onError(response.error);
      }
    } //if !onEditMode
    else {
      //update call
      const response = await putServer("/updateservice", {
        service: {
          serviceId: serviceId,
          bookingId: invoice,
          serviceName: serviceName,
          serviceCode: serviceCode,
          serviceDate: serviceDate,
          qty: qty,
          charge: charge,
          salesTax: salesTax,
          gratuity: gratuity,
        },
      });

      if (response?.data) {
        onSuccess(response.data);
        clearState();
      } else if (response?.disconnect) {
        setAuth({});
        navigate("/login", { state: { from: location }, replace: true });
      } else if (response?.error) {
        onError(response.error);
      }
    } //else

    //call onSave to re-render the services table in the bookings component
    onSave(invoice);
  }; //handleSaveNewService

  const handleDeleteService = async () => {
    //Before deleting a service it must delete the details first
    //Get the details for the current service
    const details = await getServer(`/getdetails/${serviceId}`);
    const detailsData = await details?.data;

    //Get the ids
    const detailIdsToDelete = detailsData?.map((detail) => {
      return detail?.detail_id;
    });

    //delete details
    if (detailIdsToDelete.length > 0) {
      const detailsIds = JSON.stringify(detailIdsToDelete);
      const response = await deleteServer(
        `/deletesomedetails/${detailsIds}/${auth.userName}`
      );

      if (response?.disconnect) {
        setAuth({});
        navigate("/login", { state: { from: location }, replace: true });
        return;
      } else if (response?.error) {
        onError(response.error);
        return;
      }
    }

    //delete the service
    const response = await deleteServer(`/deleteservice/${serviceId}`);
    if (response?.disconnect) {
      setAuth({});
      navigate("/login", { state: { from: location }, replace: true });
      return;
    } else if (response?.error) {
      onError(response.error);
      return;
    } else if (response?.data) {
      onSuccess(response.data);
    }

    clearState();
    onSave(invoice);
  };

  //clear state fields utility
  const clearState = () => {
    setServiceName("");
    setServiceCode("");
    setServiceDate(null);
    setQty(0);
    setCharge(0.0);
    setSalesTax(0.0);
    setGratuity(0.0);
    setOpenModal(false);
    setOpenDialog(false);
    setInvalidField("");
  };

  //validate the form fields
  const isFormValid = () => {
    if (!serviceName) {
      setInvalidField("serviceName");
      return;
    }

    if (!serviceCode) {
      setInvalidField("serviceCode");
      return;
    }

    if (!serviceDate) {
      setInvalidField("serviceDate");
      return;
    }

    if (qty < 1) {
      setInvalidField("qty");
      return;
    }

    setInvalidField("");
    return true;
  }; //isFormValid

  const handleCloseModal = () => {
    setInvalidField("");
    setOpenModal(false);
  };

  return (
    <Modal
      open={openModal}
      onClose={handleCloseModal}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <Box sx={modalStile}>
        <Tooltip title="Close" style={{ alignSelf: "flex-end" }}>
          <IconButton onClick={handleCloseModal}>
            <CloseIcon />
          </IconButton>
        </Tooltip>

        <Typography
          id="modal-title"
          variant="h6"
          component="h2"
          style={{ alignSelf: "center" }}
        >
          {modalTitle}
        </Typography>
        <Box sx={{ display: "flex" }}>
          <Box className="modal2Columns">
            <TextField
              id="serviceName"
              className="modalField"
              value={serviceName}
              label="Service"
              type="text"
              onChange={(e) => setServiceName(e.target.value)}
              error={invalidField === "serviceName"}
              helperText={
                invalidField === "serviceName" ? "Information required" : ""
              }
            />
            <FormControl
              error={invalidField === "serviceCode"}
              className="modalField"
            >
              <InputLabel>Pick a SVC</InputLabel>
              <Select
                id="serviceCode"
                value={serviceCode}
                onChange={(e) => setServiceCode(e.target.value)}
                label="Pick a SVC"
                placeholder="Pick a SVC"
              >
                {codes.map((code) => {
                  return (
                    <MenuItem key={code} value={code}>
                      {code}
                    </MenuItem>
                  );
                })}
              </Select>
              <FormHelperText>
                {invalidField === "serviceCode" ? "Information required" : ""}
              </FormHelperText>
            </FormControl>
            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="en">
              <FormControl
                error={invalidField === "serviceDate"}
                className="modalField"
              >
                <DatePicker
                  label="Service Date"
                  id="serviceDate"
                  timezone="America/New_York"
                  value={serviceDate}
                  onChange={(newValue) => setServiceDate(dayjs(newValue))}
                />

                <FormHelperText>
                  {invalidField === "serviceDate" ? "Information required" : ""}
                </FormHelperText>
              </FormControl>
            </LocalizationProvider>
          </Box>
          <Box className="modal2Columns">
            <TextField
              id="qty"
              label="Qty"
              className="modalField"
              type="text"
              inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
              placeholder="Qty"
              value={qty}
              onChange={(e) => setQty(e.target.value)}
              error={invalidField === "qty"}
              helperText={invalidField === "qty" ? "Information required" : ""}
            />

            <TextField
              id="charge"
              className="modalField"
              label="Charge $"
              type="text"
              inputProps={{ inputMode: "decimal", step: "0.01" }}
              placeholder="Charge $"
              value={charge}
              onChange={(e) => setCharge(e.target.value)}
            />

            <TextField
              id="gratuity"
              className="modalField"
              label="Gratuity $"
              type="text"
              inputProps={{ inputMode: "decimal", step: "0.01" }}
              placeholder="Gratuity $"
              value={gratuity}
              onChange={(e) => setGratuity(e.target.value)}
            />

            <TextField
              id="salesTax"
              className="modalField"
              label="Sales Tax %"
              type="text"
              inputProps={{ inputMode: "decimal", step: "0.01" }}
              placeholder="Sales Tax %"
              value={salesTax}
              onChange={(e) => setSalesTax(e.target.value)}
            />
          </Box>
        </Box>
        <Box sx={{ marginLeft: "auto", marginRight: "auto" }}>
          <Button variant="contained" onClick={handleSaveNewService}>
            Save
          </Button>
          {onEditMode && (
            <Button
              variant="contained"
              color="secondary"
              style={{ marginLeft: "10px" }}
              onClick={() => setOpenDialog(true)}
            >
              Delete
            </Button>
          )}
        </Box>
        <CustomDialog
          openDialog={openDialog}
          onCancel={() => setOpenDialog(false)}
          onConfirm={handleDeleteService}
          title={"Confirm deleting service?"}
          description={
            "Are you sure you want to delete this service and all details associated with it?"
          }
        />
      </Box>
    </Modal>
  );
};
