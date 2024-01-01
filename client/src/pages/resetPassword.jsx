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
import useAuth from "../hooks/useAuth";
import { useNavigate, useLocation } from "react-router-dom";
import { UsePrivatePost } from "../hooks/useFetchServer";

const ResetPassword = () => {
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [openSnakbar, setOpenSnakbar] = useState(false);

  const { auth, setAuth } = useAuth();
  const userName = auth.userName;
  const navigate = useNavigate();
  const location = useLocation();
  const postServer = UsePrivatePost();

  const handleReset = async () => {
    const response = await postServer("/reset", {
      userName: userName,
      currentPassword: currentPassword,
      newPassword: newPassword,
    });

    //when server answer with 401
    if (response.disconnect) {
      setAuth({});
      navigate("/login", { state: { from: location }, replace: true });
      //other errors
    } else if (response.error) {
      setSuccess(false);
      setError(response.error);
      setOpenSnakbar(true);
    } else if (response.data) {
      //if no error set success to display message
      setError(null);
      setSuccess(true);
      setOpenSnakbar(true);

      //Clear fields
      setCurrentPassword("");
      setNewPassword("");
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
