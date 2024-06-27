import { useState, useRef, useEffect } from "react";
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
  Accordion,
  Autocomplete,
  AccordionSummary,
  Box,
  AccordionDetails,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import useAuth from "../../hooks/useAuth";
import { useNavigate, useLocation } from "react-router-dom";
import {
  UsePrivateGet,
  UsePrivatePost,
  UsePrivateDelete,
} from "../../hooks/useFetchServer";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import PersonAddIcon from "@mui/icons-material/PersonAdd";

const Register = () => {
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [showPassword1, setShowPassword1] = useState(false);
  const [password, setPassword] = useState("");
  const [userName, setUserName] = useState("");
  const [userType, setUserType] = useState("");
  const [showPassword2, setShowPassword2] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [users, setUsers] = useState([]);
  const [userSelected, setUserSelected] = useState(null);
  const [openSnakbar, setOpenSnakbar] = useState(false);
  const [expandNewUser, setExpandNewUser] = useState(true);
  const [expandCurUser, setExpandCurUser] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [successTitle, setSuccessTitle] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [dataUpdated, setDataUpdated] = useState(false);

  const effectRun = useRef(false);

  const { setAuth } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const postServer = UsePrivatePost();
  const getServer = UsePrivateGet();
  const deleteServer = UsePrivateDelete();

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

    if (process.env.NODE_ENV === "development") {
      effectRun.current && getUsersData();
    } else {
      getUsersData();
    }

    return () => {
      isMounted = false;
      controler.abort();
      effectRun.current = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataUpdated]);

  const signUp = async () => {
    const response = await postServer("/signup", {
      userName: userName,
      password: password,
      userType: userType,
    });

    if (response.status === 201) {
      //if no error set success to display message
      setError(null);
      setSuccessTitle("User registered");
      setSuccessMessage("User created successfully.");
      setSuccess(true);
      setOpenSnakbar(true);
      setDataUpdated(!dataUpdated);

      //Clear fields
      setUserName("");
      setUserType(null);
      setPassword("");
    } else if (response?.disconnect) {
      setAuth({});
      navigate("/login", { state: { from: location }, replace: true });
    } else if (response.error) {
      setSuccess(false);
      setError(response.error);
      setOpenSnakbar(true);
    }
  };

  const handleReset = async () => {
    const response = await postServer("/resetUserPass", {
      userName: userSelected?.username,
      newPassword: newPassword,
    });

    if (response?.data) {
      setError(null);
      setSuccessTitle("Password updated");
      setSuccessMessage("User's password was updated with success.");
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

  //opens the dialog to confirm delete process
  const handleDelete = () => {
    setOpenDialog(true);
  };

  //Delete Dialog control
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  //Delete user from the database
  const handleConfirmDelete = async () => {
    const response = await deleteServer(
      `/deleteuser/${userSelected?.username}`
    );

    if (response.data) {
      setError(null);
      setSuccessTitle("User deleted");
      setSuccessMessage(
        `The user ${userSelected?.username} was deleted with success.`
      );
      setSuccess(true);
      setOpenSnakbar(true);
      setDataUpdated(!dataUpdated);
      setUserSelected(null);
    } else if (response?.disconnect) {
      setAuth({});
      navigate("/login", { state: { from: location }, replace: true });
    } else if (response.error) {
      setSuccess(false);
      setError(response.error);
      setOpenSnakbar(true);
    }

    //close the dialog
    setOpenDialog(false);
  };

  const isDisabled1 = !userName || !password || !userType;
  const isDisabled2 =
    userSelected === "" || userSelected === undefined || newPassword === "";

  return (
    <div className="auth-container">
      <div className="auth-container-box">
        <Accordion
          expanded={expandNewUser}
          onChange={() => setExpandNewUser(!expandNewUser)}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Box sx={{ display: "inline-flex" }}>
              <Typography sx={{ fontWeight: "bold", color: "#1976d2" }}>
                Add a new user
              </Typography>
              <PersonAddIcon style={{ color: "#1976d2", marginLeft: "10px" }} />
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <form>
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
                type={showPassword1 ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword1((show) => !show)}
                      >
                        {showPassword1 ? <VisibilityOff /> : <Visibility />}
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
            </form>
          </AccordionDetails>
          <p></p>
          <div className="auth-options">
            <Button
              disabled={isDisabled1}
              variant="outlined"
              onClick={signUp}
              style={{
                backgroundColor: "rgb(255,255,255)",
              }}
            >
              SIGN UP
            </Button>
          </div>
          <p></p>
        </Accordion>
        <Accordion
          expanded={expandCurUser}
          onChange={() => setExpandCurUser(!expandCurUser)}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Box sx={{ display: "inline-flex" }}>
              <Typography sx={{ fontWeight: "bold", color: "#1976d2" }}>
                Update Password / Delete User
              </Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <form>
              <div className="textfield" style={{ display: "inline-block" }}>
                <Autocomplete
                  id="users-options"
                  className="autocomplete"
                  value={userSelected}
                  onChange={(e, newValue) => setUserSelected(newValue)}
                  options={users.sort((a, b) =>
                    a.username.localeCompare(b.username)
                  )}
                  getOptionLabel={(option) => option.username}
                  renderInput={(params) => (
                    <TextField {...params} label="Users" />
                  )}
                />
              </div>
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
                      <IconButton
                        onClick={() => setShowPassword2((show) => !show)}
                      >
                        {showPassword2 ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </form>
            <p></p>
            <div className="auth-options">
              <Button
                disabled={isDisabled2}
                variant="outlined"
                onClick={handleReset}
                style={{
                  backgroundColor: "rgb(255,255,255)",
                }}
              >
                Update Password
              </Button>
              <Button
                disabled={!userSelected}
                variant="contained"
                color="secondary"
                style={{ marginLeft: "1em" }}
                onClick={handleDelete}
              >
                Delete
              </Button>
            </div>
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
            <AlertTitle>{successTitle}</AlertTitle>
            {successMessage}
          </Alert>
        </Snackbar>

        <Dialog
          open={openDialog}
          onClose={handleCloseDialog}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {`Confirm deleting ${userSelected?.username}?`}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Are you sure you want to delete?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleConfirmDelete}>Yes</Button>
            <Button onClick={handleCloseDialog} autoFocus>
              No
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
};

export default Register;
