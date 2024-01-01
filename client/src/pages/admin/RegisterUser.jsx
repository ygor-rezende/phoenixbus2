import { useState, useContext } from "react";
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
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import AuthContext from "../../Authentication/context/AuthProvider";
import { useNavigate, useLocation } from "react-router-dom";
import { UsePrivatePost } from "../../hooks/useFetchServer";

const Register = () => {
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [userName, setUserName] = useState("");
  const [userType, setUserType] = useState("");
  const [openSnakbar, setOpenSnakbar] = useState(false);
  const axiosPrivate = useAxiosPrivate();
  const { setAuth } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const postServer = UsePrivatePost();

  const signUp = async () => {
    const response = await postServer("/signup", {
      userName: userName,
      password: password,
      userType: userType,
    });

    if (response.status === 201) {
      //if no error set success to display message
      setError(null);
      setSuccess(true);
      setOpenSnakbar(true);

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

export default Register;
