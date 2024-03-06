import { useRef, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Button,
  Snackbar,
  Alert,
  AlertTitle,
  Avatar,
  Typography,
  TextField,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import useAuth from "../hooks/useAuth";
import axios from "../api/axios";

const Login = () => {
  const [errorMessage, setErrorMessage] = useState(null);
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  //const [cookies, setCookie, removeCookie] = useCookies(null);
  const [openSnakbar, setOpenSnakbar] = useState(false);
  const { setAuth, persist, setPersist } = useAuth();

  const navigate = useNavigate();
  const from = useLocation().state?.from?.pathname || "/";

  const userRef = useRef();
  const errRef = useRef();

  useEffect(() => {
    userRef.current.focus();
  }, []);

  useEffect(() => {
    setErrorMessage(null);
  }, [userName, password]);

  const login = async () => {
    //Hit API to pull the username to check the password
    try {
      const response = await axios.post(
        "api/login",
        JSON.stringify({ userName, password }),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      const responseData = response?.data;

      //console.log(responseData);
      const accessToken = responseData?.accessToken;
      const role = responseData?.role;

      setAuth({ userName, password, role, accessToken });
      setErrorMessage(null);
      setUserName("");
      setPassword("");
      if (role === 6935) navigate("/driverpage", { replace: true });
      else navigate(from, { replace: true });
    } catch (err) {
      console.error(err);
      if (!err?.response) {
        setErrorMessage("No Server response");
        setOpenSnakbar(true);
      }
      //No user or password
      else if (err.response?.status === 400) {
        setErrorMessage(err.response?.data.message);
        setOpenSnakbar(true);
      }

      //user not found
      else if (err?.response?.status === 401) {
        setErrorMessage(err.response?.data.message);
        setOpenSnakbar(true);
      }
      //server error
      else if (err?.response?.status === 500) {
        console.log(`Message from server: ${err.response?.data.message}`);
        setErrorMessage("Something went wrong: server error");
        setOpenSnakbar(true);
      } else {
        setErrorMessage("Login Failed");
        setOpenSnakbar(true);
      }
    }
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnakbar(false);
  };

  const keyEnterHandler = (e) => {
    if (e.key === "Enter") document.getElementById("loginButton").focus();
  };

  useEffect(() => {
    localStorage.setItem("persist", persist);
  }, [persist]);

  return (
    <div className="loginPage">
      <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
        <LockOutlinedIcon />
      </Avatar>
      <Typography component="h1" variant="h5">
        Sign in
      </Typography>
      <div className="inputs">
        <TextField
          margin="normal"
          required
          fullWidth
          id="userName"
          ref={userRef}
          label="Username"
          name="userName"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          autoComplete="off"
        />
        <TextField
          margin="normal"
          required
          fullWidth
          name="password"
          label="Password"
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          onKeyDownCapture={keyEnterHandler}
        />
        <FormControlLabel
          control={
            <Checkbox
              id="rememberme"
              checked={persist}
              onChange={(e) => setPersist((prev) => !prev)}
            />
          }
          label="Remember me (trust this device)"
        />

        <p></p>
        <div className="button">
          <Button
            id="loginButton"
            variant="contained"
            fullWidth
            onClick={login}
          >
            Sign in
          </Button>
        </div>
        <p
          ref={errRef}
          className={errorMessage ? "errmsg" : "offscreen"}
          aria-live="assertive"
        >
          {errorMessage}
        </p>
        <Typography
          variant="body2"
          color="text.secondary"
          align="center"
          sx={{ mt: 8, mb: 4 }}
        >
          Phoenix Bus Intranet
        </Typography>
        <Snackbar
          open={errorMessage && openSnakbar}
          autoHideDuration={5000}
          onClose={handleClose}
        >
          <Alert severity="error" onClose={handleClose}>
            <AlertTitle>Error</AlertTitle>
            {errorMessage}
          </Alert>
        </Snackbar>
      </div>
    </div>
  );
};

export default Login;
