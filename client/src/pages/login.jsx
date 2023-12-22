import { useReducer, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Snackbar,
  Alert,
  AlertTitle,
  Avatar,
  Typography,
  TextField,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { useCookies } from "react-cookie";

const Login = () => {
  const [formData, setFormData] = useReducer(
    (formData, newItem) => {
      return { ...formData, ...newItem };
    },
    { userName: "", password: "" }
  );

  const [errorMessage, setErrorMessage] = useState(null);
  const [cookies, setCookie, removeCookie] = useCookies(null);
  const [openSnakbar, setOpenSnakbar] = useState(false);

  const navigate = useNavigate();

  const doLogin = () => {
    try {
      login(formData.userName, formData.password);
    } catch (error) {
      setErrorMessage("Incorrect password");
    }
  };

  const login = async (userName, password) => {
    //Hit API to pull the username to check the password
    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVERURL}/api/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userName, password }),
        }
      );

      if (!response.ok) {
        setErrorMessage(`Status: ${response.status}: ${response.statusText}`);
        setOpenSnakbar(true);
        return;
      }
      const data = await response.json();
      console.log(data);
      //if an error happens when signing up set the error
      if (data.detail) {
        setErrorMessage(data.detail);
        setOpenSnakbar(true);
      } else {
        //if no error set cookies
        setErrorMessage(null);

        //set a time to expire the cookies
        const date = Date.now();
        const expireDate = new Date(date + 60 * 60 * 1000);

        //set the cookies
        setCookie("Username", data.username, {
          expires: expireDate,
        });
        console.log(date);
        setCookie("AuthToken", data.token, { expires: expireDate });
        navigate("/home");
        //set props
        //props.user({ name: data.username, type: data.usertype, isAuth: true });
        //reload the page
        //window.location.reload();
      }
    } catch (err) {
      setErrorMessage(err.message);
      setOpenSnakbar(true);
      console.error(err.message);
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

  return (
    <div
      className="page"
      style={{ alignItems: "center", display: "flex", flexDirection: "column" }}
    >
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
          label="Username"
          name="userName"
          value={formData.userName}
          onChange={(e) => setFormData({ userName: e.target.value })}
          autoComplete="username"
          autoFocus
        />
        <TextField
          margin="normal"
          required
          fullWidth
          name="password"
          label="Password"
          type="password"
          id="password"
          value={formData.password}
          onChange={(e) => setFormData({ password: e.target.value })}
          autoComplete="current-password"
          onKeyDownCapture={keyEnterHandler}
        />
        <p></p>
        <div className="button">
          <Button
            id="loginButton"
            variant="contained"
            fullWidth
            onClick={doLogin}
          >
            Sign in
          </Button>
        </div>
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
