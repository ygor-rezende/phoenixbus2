import { useState } from "react";
import {
  Alert,
  AlertTitle,
  TextField,
  Autocomplete,
  Button,
  Snackbar,
  Divider,
} from "@mui/material";
import { MuiColorInput } from "mui-color-input";
import EnhancedTable from "../utils/generictable";

const AddVehicle = () => {
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [msg, setMsg] = useState("");
  const [vehicleColor, setVehicleColor] = useState("#ffffff");
  const [vehicleModel, setVehicleModel] = useState("");
  const [vehicleName, setVehicleName] = useState("");
  const [vehicleYear, setVehicleYear] = useState(null);
  const [openSnakbar, setOpenSnakbar] = useState(false);

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

  const handleSubmit = async (event) => {
    //event.preventDefault();
    const response = await fetch(
      `${process.env.REACT_APP_SERVERURL}/createvehicle`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          vehicleName: vehicleName,
          vehicleModel: vehicleModel,
          vehicleYear: vehicleYear,
          vehicleColor: vehicleColor,
        }),
      }
    );

    const data = await response.json();
    //if an error happens when signing up set the error
    if (data.detail) {
      setSuccess(false);
      setError(data.detail);
      setOpenSnakbar(true);
    } else {
      //if no error set success to display message
      setMsg(data);
      setError(null);
      setSuccess(true);
      setOpenSnakbar(true);
    }
  };

  const headings = ["Vehicle Name", "Model", "Year", "Color"];

  return (
    <div className="vehicle-container">
      <div className="vehicle-container-box">
        <form onSubmit={handleSubmit}>
          <TextField
            id="vehicleName"
            required
            label="Vehicle Name"
            type="text"
            placeholder="Vehicle Name"
            value={vehicleName}
            onChange={(e) => setVehicleName(e.target.value)}
          />
          <p></p>
          <TextField
            id="vehicleModel"
            required
            label="Model"
            type="text"
            placeholder="Model"
            value={vehicleModel}
            onChange={(e) => setVehicleModel(e.target.value)}
          />
          <p></p>
          <div
            id="vehicle-year-box"
            style={{ justifyContent: "center", display: "flex" }}
          >
            <Autocomplete
              id="year-options"
              value={vehicleYear}
              onChange={(e, newValue) => setVehicleYear(newValue)}
              options={yearList()}
              sx={{ width: 200 }}
              getOptionLabel={(option) => option.toString()}
              renderInput={(params) => <TextField {...params} label="Year" />}
            />
          </div>
          <p></p>
          <MuiColorInput
            id="vehicleColor"
            label="Color"
            value={vehicleColor}
            onChange={(color) => setVehicleColor(color)}
            isAlphaHidden
          />
          <p></p>
          <Button
            variant="outlined"
            type="submit"
            style={{
              backgroundColor: "rgb(255,255,255)",
            }}
          >
            Save
          </Button>
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
              <AlertTitle>Vehicle Saved</AlertTitle>
              Vehicle created!
            </Alert>
          </Snackbar>
        </form>
        <p></p>
        <div id="table-container">
          <Divider />
          <p></p>
          <EnhancedTable headings={headings} />
        </div>
      </div>
    </div>
  );
};

export default AddVehicle;
