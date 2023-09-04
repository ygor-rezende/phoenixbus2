import { useReducer, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Snackbar, Alert, AlertTitle } from "@mui/material";
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
    const response = await fetch(
      `${process.env.REACT_APP_SERVERURL}/api/login`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userName, password }),
      }
    );

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
    <div className="page">
      <h2>Phoenix Bus - Login</h2>
      <div className="inputs">
        <div className="input">
          <input
            id="userName"
            type="text"
            value={formData.userName}
            onChange={(e) => setFormData({ userName: e.target.value })}
          />
        </div>
        <div className="input">
          <input
            id="password"
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ password: e.target.value })}
            onKeyDownCapture={keyEnterHandler}
          />
        </div>
        <p></p>
        <div className="button">
          <Button id="loginButton" variant="outlined" onClick={doLogin}>
            Log in
          </Button>
        </div>
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
