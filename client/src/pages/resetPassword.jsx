import { useState } from "react";
import {
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
import { useCookies } from "react-cookie";

const ResetPassword = () => {
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [cookies, setCookie, removeCookie] = useCookies(null);
  const [openSnakbar, setOpenSnakbar] = useState(false);

  const userName = cookies.Username;

  //console.log(cookies);

  const handleReset = async () => {
    const response = await fetch(`${process.env.REACT_APP_SERVERURL}/reset`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userName: userName,
        currentPassword: currentPassword,
        newPassword: newPassword,
      }),
    });

    const data = await response.json();
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
      setCurrentPassword("");
      setNewPassword("");
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

  const isDisabled = !userName || !currentPassword || !newPassword;

  return (
    <div className="auth-container">
      <div className="auth-container-box">
        <form>
          <h2>Please enter your current and new password</h2>
          <TextField
            id="currentPassword"
            required
            label="Current Password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter your current password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
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
          <TextField
            id="newPassword"
            required
            label="New Password"
            type={showPassword2 ? "text" : "password"}
            placeholder="Enter your new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword2((show) => !show)}>
                    {showPassword2 ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
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
              <AlertTitle>Password updated</AlertTitle>
              Your password was updated with success.
            </Alert>
          </Snackbar>
        </form>
        <p></p>
        <div className="auth-options">
          <Button
            disabled={isDisabled}
            variant="outlined"
            onClick={handleReset}
            style={{
              backgroundColor: "rgb(255,255,255)",
            }}
          >
            Submit
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
