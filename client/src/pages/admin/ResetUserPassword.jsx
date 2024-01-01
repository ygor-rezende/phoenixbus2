import { useEffect, useState, useRef } from "react";
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
import { useNavigate, useLocation } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { UsePrivateGet, UsePrivatePost } from "../../hooks/useFetchServer";

const ResetUserPassword = () => {
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [openSnakbar, setOpenSnakbar] = useState(false);
  const [users, setUsers] = useState([]);
  const [userSelected, setUserSelected] = useState(null);

  const effectRun = useRef(false);

  const { setAuth } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const getServer = UsePrivateGet();
  const postServer = UsePrivatePost();

  useEffect(() => {
    let isMounted = true;
    const controler = new AbortController();

    const getUsersData = async () => {
      const response = await getServer("/getusernames", controler.signal);
      //when server answer with 401
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
        isMounted && setUsers(response.data);
      }
    };

    effectRun.current && getUsersData();

    return () => {
      isMounted = false;
      controler.abort();
      effectRun.current = true;
    };
  }, []);

  const handleReset = async () => {
    const response = await postServer("/resetUserPass", {
      userName: userSelected?.username,
      newPassword: newPassword,
    });

    if (response?.data) {
      setError(null);
      setSuccess(true);
      setOpenSnakbar(true);

      //Clear fields
      setNewPassword("");
      setUserSelected(null);
    } else if (response?.disconnect) {
      setAuth({});
      navigate("/login", { state: { from: location }, replace: true });
    } else if (response.error) {
      setSuccess(false);
      setError(response.error);
      setOpenSnakbar(true);
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
            className="autocomplete"
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
