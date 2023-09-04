import { useEffect, useState } from "react";
import {
  Autocomplete,
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

const ResetUserPassword = () => {
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [openSnakbar, setOpenSnakbar] = useState(false);
  const [users, setUsers] = useState([]);
  const [userSelected, setUserSelected] = useState(null);

  useEffect(() => {
    getUsersData();
  }, []);

  const getUsersData = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVERURL}/getusernames`
      );
      const json = await response.json();
      //map the array to eliminate the object
      setUsers(json);
    } catch (err) {
      console.error(err);
    }
  };

  const handleReset = async () => {
    console.log(userSelected);
    const response = await fetch(
      `${process.env.REACT_APP_SERVERURL}/resetUserPass`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userName: userSelected.username,
          newPassword: newPassword,
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
      setError(null);
      setSuccess(true);
      setOpenSnakbar(true);

      //Clear fields
      setNewPassword("");
      setUserSelected(null);
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

  const isDisabled =
    userSelected === "" || userSelected === undefined || newPassword === "";

  return (
    <div className="auth-container">
      <div className="auth-container-box">
        <form>
          <h2>Select the user to reset password</h2>
          <Autocomplete
            id="users-options"
            value={userSelected}
            onChange={(e, newValue) => setUserSelected(newValue)}
            options={users.sort((a, b) => a.username.localeCompare(b.username))}
            getOptionLabel={(option) => option.username}
            sx={{ width: 300 }}
            renderInput={(params) => <TextField {...params} label="Users" />}
          />
          <p></p>
          <TextField
            id="newPassword"
            required
            label="New Password"
            type={showPassword2 ? "text" : "password"}
            placeholder="Enter the new user's password"
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
              User&apos;s password was updated with success.
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

export default ResetUserPassword;
