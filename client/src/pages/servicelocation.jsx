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
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import { MuiTelInput } from "mui-tel-input";
import EnhancedTable from "../utils/table_generic";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import EditLocationAltIcon from "@mui/icons-material/EditLocationAlt";
import AddLocationAltIcon from "@mui/icons-material/AddLocationAlt";

import {
  UsePrivateGet,
  UsePrivatePost,
  UsePrivateDelete,
  UsePrivatePut,
} from "../hooks/useFetchServer";

import { useNavigate, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const states = [
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

export const ServiceLocation = () => {
  const [locationId, setLocationId] = useState("");
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState(null);
  const [zip, setZip] = useState("");
  const [phone, setPhone] = useState("");
  const [fax, setFax] = useState("");
  const [locations, setLocations] = useState([]);
  const [invalidField, setInvalidField] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [openSnakbar, setOpenSnakbar] = useState(false);
  const [msg, setMsg] = useState("");
  const [expandPanel, setExpandPanel] = useState(false);
  const [isDataUpdated, setIsDataUpdated] = useState(false);
  const [onEditMode, setOnEditMode] = useState(false);

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

    //Get all locations data
    const getLocations = async () => {
      const response = await getServer("/getlocations", controller.signal);
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
        let responseData = await response.data;
        responseData = responseData.map((item) => {
          const location = {
            id: item.location_id,
            name: item.location_name,
            address: item.address,
            city: item.city,
            state: item.location_state,
            zip: item.zip,
            phone: item.phone,
            fax: item.fax,
          };
          return location;
        });
        isMounted && setLocations(responseData);
      }
    }; //getLocations

    effectRun.current && getLocations();

    return () => {
      isMounted = false;
      controller.abort();
      effectRun.current = true;
    };
  }, [isDataUpdated]);

  //Get all locations data
  const getData = () => {
    return locations;
  }; //getLocations

  //handle changes on phone field
  const handlePhoneChange = (value, info) => {
    setPhone(value);
  };

  //handle changes on fax field
  const handleFaxChange = (value, info) => {
    setFax(value);
  };

  const isFormValid = () => {
    if (!name) {
      setInvalidField("name");
      return;
    }

    if (!address) {
      setInvalidField("address");
      return;
    }

    if (!city) {
      setInvalidField("city");
      return;
    }

    if (!state) {
      setInvalidField("state");
      return;
    }

    if (!zip) {
      setInvalidField("zip");
      return;
    }

    if (!phone) {
      setInvalidField("phone");
      return;
    }

    setInvalidField("");
    return true;
  }; //isFormValid

  //handle form submit
  const handleSubmit = async () => {
    //validate form
    if (!isFormValid()) {
      return;
    }

    const response = await postServer("/createlocation", {
      location: {
        name: name,
        address: address,
        city: city,
        state: state,
        zip: zip,
        phone: phone,
        fax: fax,
      },
    });

    if (response?.data) {
      setMsg(response.data);
      setError(null);
      setSuccess(true);
      setOpenSnakbar(true);

      //clear fields
      clearFields();

      setExpandPanel(false);
      setIsDataUpdated(!isDataUpdated);
    } else if (response?.disconnect) {
      setAuth({});
      navigate("/login", { state: { from: location }, replace: true });
    } else if (response?.error) {
      setSuccess(false);
      setError(response.error);
      setOpenSnakbar(true);
    }
  }; //handleSubmit

  //clear fields utility
  const clearFields = () => {
    setLocationId("");
    setName("");
    setAddress("");
    setCity("");
    setState(null);
    setZip("");
    setPhone("");
    setFax("");
  }; //clearFields

  //Cancel editing
  const cancelEditing = () => {
    setExpandPanel(false);
    setOnEditMode(false);
    setInvalidField("");
    clearFields();
  }; //cancelEditing

  //close snackbar
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnakbar(false);
  };

  //save locations being edited
  const handleSaveChanges = async () => {
    if (!isFormValid()) {
      return;
    }

    const locationToUpdate = {
      id: locationId,
      name: name,
      address: address,
      city: city,
      state: state,
      zip: zip,
      phone: phone,
      fax: fax,
    };

    const response = await putServer("/updatelocation", {
      location: locationToUpdate,
    });

    if (response?.data) {
      setMsg(response.data);
      setError(null);
      setSuccess(true);
      setOpenSnakbar(true);

      //clear fields
      clearFields();

      setExpandPanel(false);
      setIsDataUpdated(!isDataUpdated);
    } else if (response?.disconnect) {
      setAuth({});
      navigate("/login", { state: { from: location }, replace: true });
    } else if (response?.error) {
      setSuccess(false);
      setError(response.error);
      setOpenSnakbar(true);
    }
  }; //handleSaveChanges

  //Delete one or more locations from the database
  const handleDelete = async (itemsSelected) => {
    const locationIds = JSON.stringify(itemsSelected);
    const response = await deleteServer(`/deletelocation/${locationIds}`);

    if (response?.data) {
      setMsg(response.data);
      setError(null);
      setSuccess(true);
      setOpenSnakbar(true);

      //clear fields
      clearFields();

      setExpandPanel(false);
      setIsDataUpdated(!isDataUpdated);
      setOnEditMode(false);
    } else if (response?.disconnect) {
      setAuth({});
      navigate("/login", { state: { from: location }, replace: true });
    } else if (response?.error) {
      setSuccess(false);
      setError(response.error);
      setOpenSnakbar(true);
    }

    // try {
    //   const response = await fetch(
    //     `${process.env.REACT_APP_SERVERURL}/deletelocation`,
    //     {
    //       method: "DELETE",
    //       headers: { "Content-Type": "application/json" },
    //       body: JSON.stringify({ locationIds: itemsSelected }),
    //     }
    //   );
    //   if (!response.ok) {
    //     throw new Error(response.status);
    //   }
    //   const responseMsg = await response.json();
    //   console.log(responseMsg);
    //   if (responseMsg.failed) {
    //     console.log(responseMsg.failed);
    //     setError(responseMsg.failed);
    //     setSuccess(false);
    //     setOpenSnakbar(true);
    //   } else {
    //     //update state and reload the data
    //     setMsg(responseMsg);
    //     setError(null);
    //     setSuccess(true);
    //     setOpenSnakbar(true);

    //     //clear fields
    //     clearFields();

    //     setExpandPanel(false);
    //     setIsDataUpdated(!isDataUpdated);
    //     setOnEditMode(false);
    //   }
    // } catch (err) {
    //   console.error(err);
    // }
  }; //handleDelete

  //Show location information when clicking on a table row
  const handleItemClick = (id) => {
    //load fields
    console.log(locations.filter((e) => e.id === id));
    setOnEditMode(true);
    setExpandPanel(true);
    setLocationId(id);
    setInvalidField("");
    setName(locations.filter((e) => e.id === id)[0].name);
    setAddress(locations.filter((e) => e.id === id)[0].address);
    setCity(locations.filter((e) => e.id === id)[0].city);
    setState(locations.filter((e) => e.id === id)[0].state);
    setZip(locations.filter((e) => e.id === id)[0].zip);
    setPhone(locations.filter((e) => e.id === id)[0].phone);
    setFax(locations.filter((e) => e.id === id)[0].fax);
  }; //handleItemClick

  //cancel editing if a checkbox is selected
  const handleBoxChecked = (isItemChecked) => {
    if (isItemChecked) cancelEditing();
  };

  const headings = [
    {
      id: "name",
      isNumeric: false,
      isPaddingDisabled: false,
      label: "Name",
    },
    {
      id: "phone",
      isNumeric: false,
      isPaddingDisabled: false,
      label: "Phone",
    },
    {
      id: "address",
      isNumeric: false,
      isPaddingDisabled: false,
      label: "Address",
    },
    { id: "fax", isNumeric: false, isPaddingDisabled: false, label: "Fax" },
  ];

  return (
    <div className="location-container">
      <div className="location-container-box">
        <form>
          <Accordion
            expanded={expandPanel}
            onChange={() => setExpandPanel(!expandPanel)}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              {onEditMode ? (
                <Box sx={{ display: "inline-flex" }}>
                  <Typography sx={{ fontWeight: "bold", color: "#1976d2" }}>
                    EDITING LOCATION
                  </Typography>
                  <EditLocationAltIcon
                    style={{ color: "#1976d2", marginLeft: "10px" }}
                  />
                </Box>
              ) : (
                <Box sx={{ display: "inline-flex" }}>
                  <Typography sx={{ fontWeight: "bold", color: "#1976d2" }}>
                    NEW SERVICE LOCATION
                  </Typography>
                  <AddLocationAltIcon
                    style={{ color: "#1976d2", marginLeft: "10px" }}
                  />
                </Box>
              )}
            </AccordionSummary>
            <AccordionDetails>
              <Box className="fieldsbox1">
                <TextField
                  error={invalidField === "name"}
                  helperText={
                    invalidField === "name" ? "Information required" : ""
                  }
                  className="textfield"
                  id="name"
                  required
                  label="Name"
                  type="text"
                  placeholder="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />

                <TextField
                  error={invalidField === "address"}
                  helperText={
                    invalidField === "address" ? "Information required" : ""
                  }
                  className="textfield"
                  id="address"
                  required
                  label="Address"
                  type="text"
                  placeholder="Address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />

                <TextField
                  error={invalidField === "city"}
                  helperText={
                    invalidField === "city" ? "Information required" : ""
                  }
                  className="textfield"
                  id="city"
                  required
                  label="City"
                  type="text"
                  placeholder="City"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
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
                    value={state}
                    onChange={(e, newValue) => setState(newValue)}
                    options={states}
                    sx={{ width: 200 }}
                    getOptionLabel={(option) => option.toString()}
                    renderInput={(params) => (
                      <TextField
                        required
                        {...params}
                        label="State"
                        error={invalidField === "state"}
                        helperText={
                          invalidField === "state" ? "Information required" : ""
                        }
                      />
                    )}
                  />
                </div>
                <TextField
                  error={invalidField === "zip"}
                  helperText={
                    invalidField === "zip" ? "Information required" : ""
                  }
                  className="textfield"
                  id="zip"
                  required
                  label="Zipcode"
                  type="text"
                  placeholder="Zipcode"
                  value={zip}
                  inputProps={{ maxLength: 6 }}
                  onChange={(e) => setZip(e.target.value)}
                />

                <MuiTelInput
                  error={invalidField === "phone"}
                  helperText={
                    invalidField === "phone" ? "Information required" : ""
                  }
                  className="textfield"
                  id="phone"
                  defaultCountry="US"
                  required
                  label="Phone"
                  placeholder="Phone"
                  value={phone}
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
                  value={fax}
                  onChange={handleFaxChange}
                />
                <p></p>
              </Box>

              {onEditMode ? (
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
                  Save New Location
                </Button>
              )}
              <p></p>
            </AccordionDetails>
          </Accordion>

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
              <AlertTitle>Locations Updated</AlertTitle>
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
}; //ServiceLocation
