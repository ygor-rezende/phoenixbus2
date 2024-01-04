import { useState, useRef, useEffect } from "react";
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
} from "@mui/material";
import { MuiColorInput } from "mui-color-input";
import EnhancedTable from "../utils/table_generic";
import {
  UsePrivateGet,
  UsePrivatePost,
  UsePrivateDelete,
  UsePrivatePut,
} from "../hooks/useFetchServer";

import { useNavigate, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { BusIcon } from "../utils/busIcon";

const AddVehicle = () => {
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [msg, setMsg] = useState("");
  const [vehicleId, setVehicleId] = useState("");
  const [vehicleColor, setVehicleColor] = useState("#ffffff");
  const [vehicleModel, setVehicleModel] = useState("");
  const [vehicleName, setVehicleName] = useState("");
  const [vehicleYear, setVehicleYear] = useState(null);
  const [openSnakbar, setOpenSnakbar] = useState(false);
  const [isDataUpdated, setIsdataUpdated] = useState(false);
  const [vehiclesData, setVehiclesData] = useState([]);
  const [onEditMode, setOnEditMode] = useState(false);
  const [status, setStatus] = useState("New Vehicle");

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

    const getVehiclesData = async () => {
      const response = await getServer("/getallvehicles", controller.signal);
      if (response.disconnect) {
        setAuth({});
        navigate("/login", { state: { from: location }, replace: true });
        //other errors
      } else if (response.error) {
        setSuccess(false);
        setError(response.error);
        setOpenSnakbar(true);
      }
      //no error
      else {
        let responseData = await response?.data;
        responseData = responseData.map((item) => {
          const vehicles = {
            id: item.vehicle_id,
            name: item.vehicle_name,
            model: item.vehicle_model,
            year: item.vehicle_year,
            color: item.vehicle_color,
            icon: <BusIcon color={item.vehicle_color} />,
          };
          return vehicles;
        });
        isMounted && setVehiclesData(responseData);
      }
    };

    effectRun.current && getVehiclesData();

    return () => {
      isMounted = false;
      controller.abort();
      effectRun.current = true;
    };
  }, [isDataUpdated]);

  const getData = () => {
    return vehiclesData;
  };

  const yearList = () => {
    let max = new Date().getFullYear();
    let min = 1950;
    let years = [];
    for (let i = max; i >= min; i--) years.push(i);
    return years;
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnakbar(false);
  };

  //save new or update vehicle
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (vehicleYear === null) {
      return;
    }

    //create new vehicle
    if (!onEditMode) {
      const response = await postServer("/createvehicle", {
        vehicleName: vehicleName,
        vehicleModel: vehicleModel,
        vehicleYear: vehicleYear,
        vehicleColor: vehicleColor,
      });

      if (response?.data) {
        clearState(response.data);
      } else if (response?.disconnect) {
        setAuth({});
        navigate("/login", { state: { from: location }, replace: true });
      } else if (response?.error) {
        setSuccess(false);
        setError(response.error);
        setOpenSnakbar(true);
      }
    }
    //editing data
    else {
      const response = await putServer("/updatevehicle", {
        vehicle: {
          id: vehicleId,
          name: vehicleName,
          model: vehicleModel,
          year: vehicleYear,
          color: vehicleColor,
        },
      });

      if (response?.data) {
        clearState(response.data);
      } else if (response?.disconnect) {
        setAuth({});
        navigate("/login", { state: { from: location }, replace: true });
      } else if (response?.error) {
        setSuccess(false);
        setError(response.error);
        setOpenSnakbar(true);
      }
    }
  };

  const clearState = (msg) => {
    setMsg(msg);
    setError(null);
    setSuccess(true);
    setOpenSnakbar(true);
    setVehicleId("");
    setVehicleColor("#ffffff");
    setVehicleModel("");
    setVehicleName("");
    setVehicleYear(null);
    setOnEditMode(false);
    setStatus("New Vehicle");
    setIsdataUpdated(!isDataUpdated);
  };

  const cancelEditing = () => {
    setVehicleId("");
    setVehicleColor("#ffffff");
    setVehicleModel("");
    setVehicleName("");
    setStatus("New Vehicle");
    setVehicleYear(null);
    setOnEditMode(false);
  };

  //Delete one or more records from the database
  const handleDelete = async (itemsSelected) => {
    const vehicleIds = JSON.stringify(itemsSelected);
    const response = await deleteServer(`/deletevehicle/${vehicleIds}`);

    if (response?.data) {
      clearState(response.data);
    } else if (response?.disconnect) {
      setAuth({});
      navigate("/login", { state: { from: location }, replace: true });
    } else if (response?.error) {
      setSuccess(false);
      setError(response.error);
      setOpenSnakbar(true);
    }
  }; //handleDelete

  //Show information when clicking on a table row
  const handleItemClick = (id) => {
    setStatus("Editing Vehicle");
    setOnEditMode(true);
    setVehicleId(id);
    setVehicleColor(vehiclesData?.find((e) => e.id === id)?.color);
    setVehicleModel(vehiclesData?.find((e) => e.id === id)?.model);
    setVehicleName(vehiclesData?.find((e) => e.id === id)?.name);
    setVehicleYear(vehiclesData?.find((e) => e.id === id)?.year);
  };

  //cancel editing when a checkbox is selected
  const handleBoxChecked = (isItemChecked) => {
    if (isItemChecked) cancelEditing();
  };

  const headings = [
    {
      id: "name",
      isNumeric: false,
      isPaddingDisabled: false,
      label: "Vehicle Name",
    },
    {
      id: "model",
      isNumeric: false,
      isPaddingDisabled: false,
      label: "Model",
    },
    { id: "year", isNumeric: false, isPaddingDisabled: false, label: "Year" },
    { id: "icon", isNumeric: false, isPaddingDisabled: false, label: "Color" },
  ];

  return (
    <div className="vehicle-container">
      <div className="vehicle-container-box">
        <Typography variant="h5" component="h2" gutterBottom>
          {status}
        </Typography>
        <form onSubmit={handleSubmit}>
          <Box className="fieldsbox1">
            <TextField
              id="vehicleName"
              className="textfield"
              required
              label="Vehicle Name"
              type="text"
              placeholder="Vehicle Name"
              value={vehicleName}
              onChange={(e) => setVehicleName(e.target.value)}
            />
            <TextField
              id="vehicleModel"
              className="textfield"
              required
              label="Model"
              type="text"
              placeholder="Model"
              value={vehicleModel}
              onChange={(e) => setVehicleModel(e.target.value)}
            />
            <div
              id="vehicle-year-box"
              className="textfield"
              style={{ display: "inline-block" }}
            >
              <Autocomplete
                id="year-options"
                className="autocomplete"
                required
                value={vehicleYear}
                onChange={(e, newValue) => setVehicleYear(newValue)}
                options={yearList()}
                sx={{ width: 200 }}
                getOptionLabel={(option) => option.toString()}
                renderInput={(params) => (
                  <TextField required {...params} label="Year" />
                )}
              />
            </div>
            <MuiColorInput
              id="vehicleColor"
              className="textfield"
              format="hex"
              label="Color"
              value={vehicleColor}
              onChange={(color) => setVehicleColor(color)}
              isAlphaHidden
            />
            <p></p>
            <Button variant="contained" type="submit">
              Save
            </Button>
            <Button
              variant="contained"
              color="secondary"
              disabled={!onEditMode}
              style={{ marginLeft: "10px" }}
              onClick={cancelEditing}
            >
              Cancel
            </Button>
          </Box>
          <p></p>
          <Snackbar
            open={error && openSnakbar}
            autoHideDuration={5000}
            onClose={handleClose}
          >
            <Alert severity="error" onClose={handleClose}>
              <AlertTitle>Error</AlertTitle>
              {error}
            </Alert>
          </Snackbar>

          <Snackbar
            open={success && openSnakbar}
            autoHideDuration={5000}
            onClose={handleClose}
          >
            <Alert severity="success" onClose={handleClose}>
              <AlertTitle>Vehicles Updated</AlertTitle>
              {msg}
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
            dataUpdated={isDataUpdated}
            editData={handleItemClick}
            boxChecked={handleBoxChecked}
            onDelete={handleDelete}
            filterOption="name"
          />
        </div>
      </div>
    </div>
  );
};

export default AddVehicle;
