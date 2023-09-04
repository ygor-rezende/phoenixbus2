import { useState } from "react";
import {
  Radio,
  RadioGroup,
  FormControlLabel,
  FormLabel,
  FormControl,
  Alert,
  AlertTitle,
  TextField,
  InputAdornment,
  IconButton,
  Button,
  Snackbar,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

const Auth = () => {
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [userName, setUserName] = useState("");
  const [userType, setUserType] = useState("");
  const [openSnakbar, setOpenSnakbar] = useState(false);

  //console.log(cookies);

  const signUp = async () => {
    const response = await fetch(`${process.env.REACT_APP_SERVERURL}/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userName: userName,
        password: password,
        userType: userType,
      }),
    });

    const data = await response.json();
    console.log(userType);
    //if an error happens when signing up set the error
    if (data.detail) {
      setSuccess(false);
      setError(data.detail);
      setOpenSnakbar(true);
    } else {
      //if no error set success to display message
      setError(null);
      setSuccess(true);
      setOpenSnakbar(true);

      //Clear fields
      setUserName("");
      setUserType(null);
      setPassword("");
      //reload the page
      //window.location.reload();
    }
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnakbar(false);
  };

  const isDisabled = !userName || !password || !userType;

  return (
    <div className="auth-container">
      <div className="auth-container-box">
        <form>
          <h2>Please fill in the user&apos;s information</h2>
          <TextField
            id="username"
            required
            label="Username"
            type="text"
            placeholder="Username"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />
          <p></p>
          <TextField
            id="password"
            required
            label="Password"
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword((show) => !show)}>
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <p></p>
          <FormControl>
            <FormLabel>User Type</FormLabel>
            <RadioGroup
              row
              aria-required
              name="user-type-radio-group"
              value={userType}
              onChange={(e) => setUserType(e.target.value)}
            >
              <FormControlLabel
                value="dispatch"
                control={<Radio />}
                label="Dispatch"
              />
              <FormControlLabel
                value="driver"
                control={<Radio />}
                label="Driver"
              />
              <FormControlLabel
                value="financial"
                control={<Radio />}
                label="Financial"
              />
              <FormControlLabel
                value="sales"
                control={<Radio />}
                label="Sales"
              />
              <FormControlLabel
                value="admin"
                control={<Radio />}
                label="Admin"
              />
            </RadioGroup>
          </FormControl>
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
              <AlertTitle>User registered</AlertTitle>
              User created successfully.
            </Alert>
          </Snackbar>
        </form>
        <p></p>
        <div className="auth-options">
          <Button
            disabled={isDisabled}
            variant="outlined"
            onClick={signUp}
            style={{
              backgroundColor: "rgb(255,255,255)",
            }}
          >
            SIGN UP
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
